# 🛠️ Welcome to Your Room Workspace (`room/`)

This directory is your isolated workshop! You and your AI coding assistant (Claude, Cursor, ChatGPT, Copilot, etc.) will build your browser minigame or puzzle here.

---

## 🎯 The Goal

Build a minigame that can be played in **under 60 seconds**.
When finished, it must be compiled or saved into **`room/dist/`**.

At the end of the workshop, only the `room/dist/` folder from your fork will be pulled into the assembled dungeon.

---

## 📁 Required Directory Layout

Your final build must look like this:

```text
room/
└── dist/
    ├── index.html        <-- Main entry point
    ├── room.json         <-- Metadata (title, author)
    ├── style.css         <-- Your styles (or embedded in html)
    ├── game.js           <-- Your logic (or embedded in html)
    └── ...               <-- Any images, audio, or models
```

### Required `room/dist/room.json`

```json
{
  "title": "Your Room Title",
  "author": "Your Name or Handle",
  "description": "Short 1-sentence teaser of what the player has to do."
}
```

---

## ⚡ The postMessage Contract

The overworld will load your room in an `<iframe>` and wait for a response.

### 1. Auto-Start
Your game must start automatically when `dist/index.html` loads. Do not wait for a start button from the host.

### 2. Report Win or Loss
Whenever the player wins or loses:
```javascript
window.parent.postMessage({
  type: 'defrag:complete',
  success: true, // or false if player lost
  result: 'You decoded 4/5 runes in 28 seconds!'
}, '*');
```

### 3. Handle Host Timeout (60 Seconds)
If 60 seconds pass, the host sends you:
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'defrag:timeout') {
    // You have a 5-second grace period to send your final result!
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

1. Run the local dev server from the repository root:
   ```bash
   npm start
   ```
2. Open `http://localhost:3000` in your browser.
3. The overworld will load and let you play the room currently in `room/dist/`.
4. Check that:
   - The game loads and plays.
   - Winning or losing returns you to the overworld with your result message.
   - Letting the 60s timer run out tests the timeout grace period.
