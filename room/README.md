# 🛠️ Welcome to Your Room Workspace (`room/`)

This directory is your isolated workshop! You and your AI coding assistant will build your browser minigame or puzzle here.

---

## 🎯 The Goal

Build a minigame that can be played in **under 100 seconds**.
When finished, it must be saved into **`room/dist/`**.

---

## 📁 Required Directory Layout

```text
room/
└── dist/
    ├── index.html        <-- Main entry point
    ├── room.json         <-- Metadata (title, author, color)
    ├── style.css         <-- Styles
    ├── game.js           <-- Game logic
    └── ...               <-- Any assets
```

### Required `room/dist/room.json`

```json
{
  "title": "Your Room Title",
  "author": "Your Name",
  "color": "#3b82f6",
  "description": "Short description of what the player must do."
}
```

---

## ⚡ The postMessage Contract

### 1. Wait for Start Signal
The host will load your iframe at 0.2 opacity and unclickable.
When the player clicks the Start button in the host header, your room receives:
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'defrag:start') {
    startGame();
  }
});
```

### 2. Report Win or Loss (within 100 seconds)
```javascript
window.parent.postMessage({
  type: 'defrag:complete',
  success: true, // or false
  result: 'You completed the circuit in 35 seconds!'
}, '*');
```

### 3. Handle Host Timeout (100 Seconds)
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'defrag:timeout') {
    // 5-second grace period to send final result
    window.parent.postMessage({
      type: 'defrag:complete',
      success: false,
      result: 'Ran out of time!'
    }, '*');
  }
});
```

---

## 🚀 How to Test Your Room

1. Run `npm start` from the repository root.
2. Open `http://localhost:3000`.
3. Click your room's **"Enter Room"** button, then click **"Start Room"** in the header.
