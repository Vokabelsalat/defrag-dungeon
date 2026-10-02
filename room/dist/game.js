// Web Audio Synth for retro sound effects
class SoundEffects {
  constructor() {
    this.ctx = null;
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

  playBeep(freq = 440, duration = 0.08, type = 'sine') {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playSuccess() {
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 0.12, 'triangle'), i * 80);
    });
  }

  playError() {
    this.playBeep(160, 0.2, 'sawtooth');
  }
}

const sfx = new SoundEffects();

// Protocol communication helpers
const Defrag = {
  hasCompleted: false,

  finish(success, result) {
    if (this.hasCompleted) return;
    this.hasCompleted = true;
    console.log(`[Room] Reporting finish: success=${success}, result="${result}"`);
    window.parent.postMessage({
      type: 'defrag:complete',
      success: Boolean(success),
      result: String(result)
    }, '*');
  },

  onTimeout(callback) {
    window.addEventListener('message', (event) => {
      if (event.data && (event.data.type === 'defrag:timeout' || event.data.type === 'room:timeout')) {
        console.log('[Room] Received timeout signal from host! Entering grace period.');
        callback(event.data);
      }
    });
  }
};

// Game Logic
class MemoryMatrixGame {
  constructor() {
    this.TOTAL_TARGETS = 12;
    this.currentTarget = 1;
    this.mistakes = 0;
    this.startTime = Date.now();
    this.isDone = false;

    this.gridEl = document.getElementById('grid');
    this.nextTargetEl = document.getElementById('next-target');
    this.timerEl = document.getElementById('room-timer');
    this.mistakesEl = document.getElementById('mistakes-count');
    this.statusMsgEl = document.getElementById('status-msg');
    this.giveUpBtn = document.getElementById('give-up-btn');
    this.graceBannerEl = document.getElementById('grace-banner');

    this.init();
  }

  init() {
    this.renderGrid();
    this.updateStats();

    // Local room timer display (just to give feedback to player)
    this.timerInterval = setInterval(() => {
      if (this.isDone) return;
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      this.timerEl.textContent = `${elapsed}s`;
    }, 100);

    // Give up button handler
    this.giveUpBtn.addEventListener('click', () => {
      if (this.isDone) return;
      sfx.playError();
      this.isDone = true;
      this.statusMsgEl.textContent = 'Mission aborted by user.';
      Defrag.finish(false, `Aborted voluntarily at sector ${this.currentTarget - 1}/${this.TOTAL_TARGETS}`);
    });

    // Listen for host timeout event
    Defrag.onTimeout(() => {
      this.handleHostTimeout();
    });
  }

  renderGrid() {
    this.gridEl.innerHTML = '';
    // Generate numbers 1 to 12 and shuffle
    const numbers = Array.from({ length: this.TOTAL_TARGETS }, (_, i) => i + 1);
    numbers.sort(() => Math.random() - 0.5);

    numbers.forEach((num) => {
      const btn = document.createElement('button');
      btn.className = 'node';
      btn.textContent = num;
      btn.dataset.val = num;

      btn.addEventListener('click', () => this.handleNodeClick(btn, num));
      this.gridEl.appendChild(btn);
    });
  }

  handleNodeClick(btn, num) {
    if (this.isDone) return;
    sfx.init();

    if (num === this.currentTarget) {
      // Correct!
      const pitch = 350 + (num * 35);
      sfx.playBeep(pitch, 0.08, 'sine');
      btn.classList.add('defragged');
      this.currentTarget++;

      if (this.currentTarget > this.TOTAL_TARGETS) {
        this.handleWin();
      } else {
        this.updateStats();
      }
    } else {
      // Wrong!
      sfx.playError();
      this.mistakes++;
      this.mistakesEl.textContent = this.mistakes;
      btn.classList.add('wrong');
      setTimeout(() => btn.classList.remove('wrong'), 400);
    }
  }

  updateStats() {
    this.nextTargetEl.textContent = `#${this.currentTarget}`;
  }

  handleWin() {
    this.isDone = true;
    clearInterval(this.timerInterval);
    sfx.playSuccess();

    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    this.statusMsgEl.textContent = 'SECTOR DEFRAGMENTED!';
    this.statusMsgEl.style.color = 'var(--accent-green)';

    const resultSummary = `Restored all ${this.TOTAL_TARGETS} memory clusters in ${elapsed}s with ${this.mistakes} errors!`;
    
    // Slight delay so the player sees the last tile defrag
    setTimeout(() => {
      Defrag.finish(true, resultSummary);
    }, 600);
  }

  handleHostTimeout() {
    if (this.isDone) return;
    this.isDone = true;
    clearInterval(this.timerInterval);

    // Show grace banner
    this.graceBannerEl.classList.add('active');

    // Cleanly report within the 5-second grace window (e.g. after 2 seconds)
    setTimeout(() => {
      const progress = `${this.currentTarget - 1}/${this.TOTAL_TARGETS}`;
      Defrag.finish(false, `Time limit reached! Managed ${progress} clusters before sector lock.`);
    }, 2000);
  }
}

// Auto-start on load
window.addEventListener('DOMContentLoaded', () => {
  new MemoryMatrixGame();
});
