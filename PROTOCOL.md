# Defrag Dungeon Communication Protocol

Defrag Dungeon isolates every minigame inside a sandboxed `<iframe>`. The overworld host communicates with each room using standard browser `postMessage`.

---

## 1. Lifecycle Overview

```text
[OVERWORLD HOST]                                            [ROOM IFRAME]
       |                                                          |
       | ------------ 1. Host loads iframe (preview mode) ------> |
       |                 (opacity: 0.2, unclickable)              |
       |                                                          |
       | (Player clicks "Start" button in host header)            |
       | ------------ 2. Host sends defrag:start ---------------> |
       |                 (iframe becomes full opacity & active)   |
       |                                                          |
       |                 (100-second timer begins)                |
       |                                                  (Player plays)
       |                                                          |
       | <----------- 3. Finish before 100s (defrag:complete) --- |
       |                                                          |
       | --- OR ---                                               |
       |                                                          |
       | (100s timer expires)                                     |
       | ------------ 4. defrag:timeout ------------------------> |
       |                  [5-second grace period starts]          |
       |                                                          |
       | <----------- 5. Final result (defrag:complete) --------- |
       |                                                          |
       | (If 5s elapses without response -> Host forces FAIL)     |
```

1. **Host Loads Iframe**: The room loads in a preview state (dimmed at ~0.2 opacity and unclickable).
2. **Start Signal**: When the player clicks the **Start** button in the host header, the host sends `{ type: 'defrag:start' }` to the room and unlocks interaction.
3. **Game Starts**: The room listens for `{ type: 'defrag:start' }` and begins its game logic and player input.
4. **Time Limit**: The room has **100 seconds** to complete.
5. **Completion**: When finished (won or lost), the room sends `{ type: 'defrag:complete', success: boolean, result: string }`.
6. **Timeout Warning**: If 100 seconds elapse without completion, the host sends `{ type: 'defrag:timeout', gracePeriodMs: 5000 }`.
7. **5-Second Grace Period**: The room has 5 seconds to reply before the host forcibly marks it as failed.

---

## 2. Message Specifications

### A. Host -> Room: Start (`defrag:start`)

Sent by the host when the player clicks the Start button.

```javascript
{
  type: 'defrag:start'
}
```

#### How Rooms Must Handle It:
Listen for `message` and do not allow gameplay or start countdowns until this message arrives:

```javascript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'defrag:start') {
    startGame();
  }
});
```

---

### B. Room -> Host: Completion (`defrag:complete`)

Send this message when the game finishes (win or loss):

```javascript
window.parent.postMessage({
  type: 'defrag:complete',
  success: true, // boolean: true for win/clear, false for loss/fail
  result: 'You restored 12/12 corrupted clusters in 45 seconds!' // human-readable string
}, '*');
```

---

### C. Host -> Room: Timeout (`defrag:timeout`)

Sent by the host if 100.0 seconds have elapsed and no completion message was received:

```javascript
{
  type: 'defrag:timeout',
  gracePeriodMs: 5000
}
```

The room has **5 seconds** to stop and respond with its final `defrag:complete` payload.

---

## 3. Ready-To-Use Room Boilerplate Snippet

```javascript
let gameStarted = false;

// 1. Wait for Start Signal from Host
window.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'defrag:start') {
    gameStarted = true;
    startMyGame();
  }

  if (event.data.type === 'defrag:timeout') {
    // 5-second grace period: finalize score immediately
    reportResult(false, 'Time expired!');
  }
});

// 2. Report Result to Host
function reportResult(success, resultText) {
  window.parent.postMessage({
    type: 'defrag:complete',
    success: Boolean(success),
    result: String(resultText)
  }, '*');
}
```
