// Defrag Dungeon Overworld Host Controller

class OverworldAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration = 0.1, type = 'sine', gainVal = 0.12) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio err:', e);
    }
  }

  playCleared() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.18, 'triangle', 0.15), idx * 100);
    });
  }

  playFailed() {
    [320, 240, 180].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.22, 'sawtooth', 0.12), idx * 120);
    });
  }

  playEnter() {
    this.playTone(440, 0.08, 'sine', 0.1);
    setTimeout(() => this.playTone(880, 0.12, 'sine', 0.1), 80);
  }
}

class DefragOverworld {
  constructor() {
    this.audio = new OverworldAudio();
    this.rooms = [];
    this.currentIndex = 0;
    this.currentRoom = null;
    this.roomStates = {}; // roomId -> { state: 'locked'|'ready'|'cleared'|'failed', result: '' }

    // Timing
    this.TIMER_LIMIT_MS = 60000;
    this.GRACE_LIMIT_MS = 5000;
    this.timerStartTime = 0;
    this.timerInterval = null;
    this.graceInterval = null;
    this.inGracePeriod = false;

    // DOM Elements
    this.trackContainer = document.getElementById('track-container');
    this.clearedCountEl = document.getElementById('cleared-count');
    this.failedCountEl = document.getElementById('failed-count');
    this.sectorsCountEl = document.getElementById('sectors-count');
    this.resetRunBtn = document.getElementById('reset-run-btn');
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.completeModal = document.getElementById('complete-modal');
    this.replayBtn = document.getElementById('replay-btn');

    // Overlay Elements
    this.overlay = document.getElementById('room-overlay');
    this.hudSector = document.getElementById('hud-sector-num');
    this.hudTitle = document.getElementById('hud-title');
    this.hudTimerDisplay = document.getElementById('hud-timer-display');
    this.gracePill = document.getElementById('grace-pill');
    this.btnAbandon = document.getElementById('btn-abandon');
    this.iframeWrapper = document.getElementById('iframe-wrapper');
    this.verdictOverlay = document.getElementById('hud-verdict-overlay');
    this.verdictBanner = document.getElementById('verdict-banner');
    this.verdictDesc = document.getElementById('verdict-desc');

    this.activeIframe = null;

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    // Message listener for room protocol
    window.addEventListener('message', (e) => this.handleProtocolMessage(e));

    this.resetRunBtn.addEventListener('click', () => {
      if (confirm('Reset your dungeon run back to Sector 1?')) {
        this.resetRun();
      }
    });

    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => this.resetRun());
    }

    this.audioToggleBtn.addEventListener('click', () => {
      this.audio.enabled = !this.audio.enabled;
      this.audioToggleBtn.textContent = this.audio.enabled ? '🔊 Audio ON' : '🔇 Audio OFF';
    });

    this.btnAbandon.addEventListener('click', () => {
      if (confirm('Abandon this sector? It will be marked as FAILED.')) {
        this.handleRoomFinish(false, 'Sector abandoned by player.');
      }
    });
  }

  async init() {
    await this.loadRooms();
    this.loadSavedState();
    this.renderTrack();
    this.updateStats();
  }

  async loadRooms() {
    try {
      const res = await fetch('rooms.json', { cache: 'no-cache' });
      if (res.ok) {
        this.rooms = await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch rooms.json, using fallback starter room', e);
    }

    if (!this.rooms || this.rooms.length === 0) {
      this.rooms = [
        {
          id: 'starter-room',
          title: 'Sector 07: Memory Matrix',
          author: 'Ada Lovelace',
          path: 'room/dist/index.html',
          description: 'Defragment the corrupted memory cluster by linking data blocks in correct numerical sequence!'
        }
      ];
    }

    // Try to asynchronously refresh live room.json metadata for each room
    await Promise.all(this.rooms.map(async (room) => {
      try {
        const metadataUrl = room.path.replace(/index\.html$/, 'room.json');
        const metaRes = await fetch(metadataUrl, { cache: 'no-cache' });
        if (metaRes.ok) {
          const meta = await metaRes.json();
          if (meta.title) room.title = meta.title;
          if (meta.author) room.author = meta.author;
          if (meta.description) room.description = meta.description;
        }
      } catch {
        // Fallback to room's existing title/author
      }
    }));
  }

  loadSavedState() {
    try {
      const saved = localStorage.getItem('defrag_dungeon_run');
      if (saved) {
        this.roomStates = JSON.parse(saved);
      }
    } catch {
      this.roomStates = {};
    }

    // Determine current index based on states
    let firstReady = -1;
    for (let i = 0; i < this.rooms.length; i++) {
      const rId = this.rooms[i].id;
      const state = this.roomStates[rId]?.state;
      if (!state || (state !== 'cleared' && state !== 'failed')) {
        firstReady = i;
        break;
      }
    }

    if (firstReady === -1) {
      // All rooms completed
      this.currentIndex = this.rooms.length;
    } else {
      this.currentIndex = firstReady;
    }
  }

  saveState() {
    try {
      localStorage.setItem('defrag_dungeon_run', JSON.stringify(this.roomStates));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  resetRun() {
    this.roomStates = {};
    this.currentIndex = 0;
    this.saveState();
    this.renderTrack();
    this.updateStats();
    if (this.completeModal) {
      this.completeModal.classList.remove('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStats() {
    let cleared = 0;
    let failed = 0;
    this.rooms.forEach((r) => {
      const state = this.roomStates[r.id]?.state;
      if (state === 'cleared') cleared++;
      if (state === 'failed') failed++;
    });

    this.clearedCountEl.textContent = cleared;
    this.failedCountEl.textContent = failed;
    this.sectorsCountEl.textContent = `${Math.min(this.currentIndex + 1, this.rooms.length)}/${this.rooms.length}`;
  }

  renderTrack() {
    this.trackContainer.innerHTML = '';

    // Track vertical connector line
    const busLine = document.createElement('div');
    busLine.className = 'track-bus-line';
    this.trackContainer.appendChild(busLine);

    this.rooms.forEach((room, index) => {
      const saved = this.roomStates[room.id] || {};
      let state = 'locked';

      if (saved.state === 'cleared') {
        state = 'cleared';
      } else if (saved.state === 'failed') {
        state = 'failed';
      } else if (index === this.currentIndex) {
        state = 'ready';
      }

      // Create Node wrapper
      const node = document.createElement('div');
      node.className = `room-node ${state}`;
      node.id = `room-node-${index}`;

      // Card Element
      const card = document.createElement('div');
      card.className = `room-card state-${state}`;

      // Player Token if active
      if (state === 'ready') {
        const token = document.createElement('div');
        token.className = 'player-token';
        token.title = 'Current Location';
        token.innerHTML = '👾';
        card.appendChild(token);
      }

      // Top row
      const top = document.createElement('div');
      top.className = 'card-top';

      const titleGroup = document.createElement('div');
      titleGroup.className = 'card-title-group';

      const sectorNum = String(index + 1).padStart(2, '0');
      titleGroup.innerHTML = `
        <span class="sector-tag">Sector ${sectorNum} // ID: ${room.id}</span>
        <h3 class="room-title">${this.escapeHtml(room.title)}</h3>
        <span class="author-tag">Built by <strong>${this.escapeHtml(room.author)}</strong></span>
      `;

      // Status Badge
      const badge = document.createElement('div');
      badge.className = `status-badge badge-${state}`;
      if (state === 'cleared') badge.textContent = '✓ Cleared';
      else if (state === 'failed') badge.textContent = '✕ Failed';
      else if (state === 'ready') badge.textContent = '▶ Ready';
      else badge.textContent = '🔒 Locked';

      top.appendChild(titleGroup);
      top.appendChild(badge);
      card.appendChild(top);

      // Description
      if (room.description) {
        const desc = document.createElement('p');
        desc.className = 'room-description';
        desc.textContent = room.description;
        card.appendChild(desc);
      }

      // Completed Result Summary Box
      if (state === 'cleared' || state === 'failed') {
        const resBox = document.createElement('div');
        resBox.className = `room-result-box ${state}`;
        const icon = state === 'cleared' ? '🏆' : '⚠️';
        const label = state === 'cleared' ? 'CLEAR LOG' : 'FAILURE LOG';
        const resultText = saved.result || (state === 'cleared' ? 'Sector cleared successfully.' : 'Sector failed.');

        resBox.innerHTML = `
          <div class="result-icon">${icon}</div>
          <div class="result-content">
            <span class="result-label">${label}</span>
            <span class="result-text">${this.escapeHtml(resultText)}</span>
          </div>
        `;
        card.appendChild(resBox);
      }

      // Action Button (Only for Ready room, or replay cleared room)
      if (state === 'ready' || state === 'cleared' || state === 'failed') {
        const bottom = document.createElement('div');
        bottom.className = 'card-bottom';

        const btn = document.createElement('button');
        btn.className = 'enter-btn';
        if (state === 'ready') {
          btn.innerHTML = `<span>▶</span> Enter Sector ${sectorNum}`;
        } else {
          btn.innerHTML = `<span>↻</span> Replay Sector`;
          btn.style.background = '#1c2742';
          btn.style.color = '#fff';
        }

        btn.addEventListener('click', () => {
          this.enterRoom(room, index);
        });

        bottom.appendChild(btn);
        card.appendChild(bottom);
      }

      node.appendChild(card);

      // Connector to next room
      if (index < this.rooms.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'room-connector';
        node.appendChild(connector);
      }

      this.trackContainer.appendChild(node);
    });

    // Check if entire dungeon completed
    if (this.currentIndex >= this.rooms.length && this.rooms.length > 0) {
      this.showCompleteCelebration();
    }
  }

  showCompleteCelebration() {
    if (!this.completeModal) return;
    let cleared = 0;
    let failed = 0;
    this.rooms.forEach((r) => {
      const state = this.roomStates[r.id]?.state;
      if (state === 'cleared') cleared++;
      if (state === 'failed') failed++;
    });

    const clearedEl = document.getElementById('summary-cleared-count');
    const failedEl = document.getElementById('summary-failed-count');
    if (clearedEl) clearedEl.textContent = cleared;
    if (failedEl) failedEl.textContent = failed;

    this.completeModal.classList.add('active');
    this.audio.playCleared();
    this.completeModal.scrollIntoView({ behavior: 'smooth' });
  }

  enterRoom(room, index) {
    this.currentRoom = room;
    this.currentRoomIndex = index;
    this.inGracePeriod = false;

    this.audio.playEnter();

    // Populate HUD
    this.hudSector.textContent = `SECTOR ${String(index + 1).padStart(2, '0')}`;
    this.hudTitle.textContent = `${room.title} (by ${room.author})`;
    this.hudTimerDisplay.textContent = '60.0s';
    this.hudTimerDisplay.className = 'timer-display';
    this.gracePill.classList.remove('active');
    this.verdictOverlay.classList.remove('active');

    // Create and embed iframe
    this.iframeWrapper.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'room-iframe';
    iframe.src = room.path;
    iframe.allow = 'autoplay; fullscreen; clipboard-write; gaming';
    this.activeIframe = iframe;
    this.iframeWrapper.appendChild(iframe);

    // Open overlay
    this.overlay.classList.add('active');

    // Start 60-second timer
    this.startCountdown();
  }

  startCountdown() {
    this.stopTimers();
    this.timerStartTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.timerStartTime;
      const remaining = Math.max(0, this.TIMER_LIMIT_MS - elapsed);
      const remainingSec = (remaining / 1000).toFixed(1);

      this.hudTimerDisplay.textContent = `${remainingSec}s`;

      if (remaining <= 10000) {
        this.hudTimerDisplay.className = 'timer-display danger';
      } else if (remaining <= 20000) {
        this.hudTimerDisplay.className = 'timer-display warning';
      } else {
        this.hudTimerDisplay.className = 'timer-display';
      }

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.triggerTimeoutWarning();
      }
    }, 50);
  }

  triggerTimeoutWarning() {
    this.inGracePeriod = true;
    console.log('[Host] 60s expired. Sending defrag:timeout to room with 5s grace period.');

    // 1. Send timeout message to iframe
    if (this.activeIframe && this.activeIframe.contentWindow) {
      try {
        this.activeIframe.contentWindow.postMessage({
          type: 'defrag:timeout',
          gracePeriodMs: this.GRACE_LIMIT_MS
        }, '*');
      } catch (e) {
        console.warn('Failed to postMessage to iframe', e);
      }
    }

    // 2. Start Grace Period HUD countdown
    this.gracePill.classList.add('active');
    this.hudTimerDisplay.className = 'timer-display danger';

    const graceStart = Date.now();
    this.graceInterval = setInterval(() => {
      const elapsed = Date.now() - graceStart;
      const remainingGrace = Math.max(0, this.GRACE_LIMIT_MS - elapsed);
      const graceSec = (remainingGrace / 1000).toFixed(1);

      this.hudTimerDisplay.textContent = `+${graceSec}s`;
      this.gracePill.textContent = `⚠️ GRACE: ${graceSec}s`;

      if (remainingGrace <= 0) {
        clearInterval(this.graceInterval);
        this.graceInterval = null;
        console.warn('[Host] Grace period exceeded without response. Forcing failure.');
        this.handleRoomFinish(false, 'Sector timed out. Grace period exceeded without response.');
      }
    }, 50);
  }

  handleProtocolMessage(event) {
    if (!this.activeIframe || !this.currentRoom) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'defrag:complete' || data.type === 'room:complete') {
      const success = Boolean(data.success);
      const result = typeof data.result === 'string' ? data.result : (success ? 'Sector cleared!' : 'Sector failed.');
      this.handleRoomFinish(success, result);
    }
  }

  handleRoomFinish(success, result) {
    if (!this.currentRoom) return;
    this.stopTimers();

    const room = this.currentRoom;
    const roomIndex = this.currentRoomIndex;

    // Play sound feedback
    if (success) {
      this.audio.playCleared();
    } else {
      this.audio.playFailed();
    }

    // Show verdict overlay inside modal
    this.verdictBanner.textContent = success ? '★ SECTOR CLEARED ★' : '✕ SECTOR FAILED ✕';
    this.verdictBanner.className = `verdict-banner ${success ? 'cleared' : 'failed'}`;
    this.verdictDesc.textContent = result;
    this.verdictOverlay.classList.add('active');

    // Record room state
    this.roomStates[room.id] = {
      state: success ? 'cleared' : 'failed',
      result: result
    };

    // If this was the active room, advance current index
    if (roomIndex === this.currentIndex) {
      this.currentIndex = roomIndex + 1;
    }

    this.saveState();

    // After 1.8 seconds, cleanly destroy iframe and close modal
    setTimeout(() => {
      this.closeRoomModal();
      this.renderTrack();
      this.updateStats();

      // Smooth scroll to the next room or completed modal
      const nextNode = document.getElementById(`room-node-${this.currentIndex}`);
      if (nextNode) {
        nextNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1800);
  }

  closeRoomModal() {
    this.stopTimers();
    if (this.activeIframe) {
      try {
        this.activeIframe.src = 'about:blank';
      } catch {}
      this.activeIframe.remove();
      this.activeIframe = null;
    }
    this.iframeWrapper.innerHTML = '';
    this.overlay.classList.remove('active');
    this.verdictOverlay.classList.remove('active');
    this.currentRoom = null;
  }

  stopTimers() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.graceInterval) {
      clearInterval(this.graceInterval);
      this.graceInterval = null;
    }
    this.inGracePeriod = false;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Start Overworld when DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.overworld = new DefragOverworld();
});
