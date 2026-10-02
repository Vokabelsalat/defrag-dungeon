# Defrag Dungeon Communication Protocol

Defrag Dungeon isolates every minigame inside a sandboxed `<iframe>`. The overworld host communicates with each room using standard browser `postMessage`.

---

## 1. Lifecycle Overview

```text
[OVERWORLD HOST]                                            [ROOM IFRAME]
       |                                                          |
       | ------------ 1. Iframe loaded & auto-starts -----------> |
       |                                                          |
       |                                                  (Player plays)
       |                                                          |
       | <----------- 2. Finish before 60s (defrag:complete) ---- |
       |                                                          |
       | --- OR ---                                               |
       |                                                          |
       | (60s timer expires)                                      |
       | ------------ 3. defrag:timeout ------------------------> |
       |                  [5-second grace period starts]          |
       |                                                          |
       | <----------- 4. Final result (defrag:complete) --------- |
       |                                                          |
       | (If 5s elapses without response -> Host forces FAIL)     |
```

1. **Auto-Start**: The room begins immediately upon `window.onload`. The host sends **no start signal**.
2. **Normal Completion**: The minigame can finish at any time prior to 60 seconds by sending a `defrag:complete` message.
3. **Timeout Warning**: If 60 seconds elapse without a completion response, the host sends `defrag:timeout` to the iframe.
4. **Grace Period**: The room has **5 seconds** after receiving `defrag:timeout` to submit its final `defrag:complete` response.
5. **Hard Fallback**: If the room fails to respond within the 5-second grace window, the host terminates the room and records it as failed.

---

## 2. Message Specifications

### A. Room -> Host: Completion (`defrag:complete`)

Send this message when the player wins, loses, finishes a task, or when handling the timeout signal.

```javascript
window.parent.postMessage({
  type: 'defrag:complete',
  success: true, // boolean: true for win/clear, false for loss/fail
  result: 'You restored 12/12 corrupted clusters in 34 seconds!' // string
}, '*');
```

#### Payload Fields:
- `type` *(string, required)*: Must be `'defrag:complete'` (or `'room:complete'`).
- `success` *(boolean, required)*: `true` if the room was cleared/passed; `false` if failed.
- `result` *(string, required)*: Human-readable summary of the player's outcome shown on the overworld map (e.g. `"Defeated the boss with 3 HP remaining"`, `"Score: 4,500 pts"`, `"Found 8 out of 10 birds"`).

---

### B. Host -> Room: Timeout (`defrag:timeout`)

Sent by the host if 60.0 seconds have elapsed and no completion message was received.

```javascript
{
  type: 'defrag:timeout',
  gracePeriodMs: 5000
}
```

#### How Rooms Must Handle It:
Listen for `message` events:

```javascript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'defrag:timeout') {
    // Stop game loops/audio immediately
    // Submit final result within the 5-second grace period!
    window.parent.postMessage({
      type: 'defrag:complete',
      success: false,
      result: 'Time expired before defragmentation finished!'
    }, '*');
  }
});
```

---

## 3. Ready-To-Use Room Helper Snippet

You can copy-paste this helper directly into your room's JavaScript:

```javascript
// Simple Defrag Dungeon Client Helper
const Defrag = {
  finish(success, result) {
    if (this._finished) return;
    this._finished = true;
    window.parent.postMessage({
      type: 'defrag:complete',
      success: Boolean(success),
      result: String(result)
    }, '*');
  },

  onTimeout(callback) {
    window.addEventListener('message', (e) => {
      if (e.data && (e.data.type === 'defrag:timeout' || e.data.type === 'room:timeout')) {
        callback();
      }
    });
  }
};

// Example Usage:
// When player wins:
// Defrag.finish(true, 'Puzzle solved in 22 seconds!');

// When time runs out:
Defrag.onTimeout(() => {
  Defrag.finish(false, 'Sector purge: time expired!');
});
```
