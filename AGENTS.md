# Instructions for AI Coding Agents

> **IMPORTANT NOTICE FOR AI ASSISTANTS & CODING AGENTS (Cursor, Claude, Copilot, ChatGPT, Antigravity, etc.):**
> Read this document completely before generating or modifying any code.

You are assisting a participant in **Defrag Dungeon**, a collaborative one-hour vibe-coding workshop.
Your sole job is to help the participant build **one self-contained minigame or puzzle room**.

---

## 🛑 STRICT DIRECTORY BOUNDARY (ENFORCED)

1. **YOUR WORKSPACE IS EXCLUSIVELY `room/`**:
   - You must **ONLY** create, edit, or delete files inside the `room/` directory.
   - **NEVER** edit, reformat, rename, or touch files outside `room/` (such as `index.html`, `overworld/*`, `assemble.mjs`, `server.js`, `package.json`, `rooms.json`, `forks.example.txt`, etc.).
   - **NEVER** install npm packages or create temporary files in the repository root. Any package files, python scripts, virtual environments, bundlers, or tool configs must reside strictly inside `room/`.

2. **THE FINAL ARTIFACT MUST BE IN `room/dist/`**:
   - When finished or when building, all playable assets must be compiled/copied into:
     ```text
     room/dist/
       ├── index.html        (The entry point)
       ├── room.json         (Metadata file)
       └── ...               (Any JS, CSS, audio, models, or images used)
     ```
   - **Zero external runtime dependencies**: The assembled game will copy `room/dist/` as a static folder. It will **not** run your build step, `npm install`, or python servers. Everything needed to play must be self-contained in `room/dist/` using relative asset paths (`./style.css`, `./asset.png`, etc.).

---

## 📋 REQUIRED METADATA: `room/dist/room.json`

`room/dist/room.json` must be valid JSON and contain `title`, `author`, and `color`:

```json
{
  "title": "Cosmic Wire Defuser",
  "author": "Jane Doe",
  "color": "#3b82f6",
  "description": "Cut the correct wires in binary sequence before time runs out!"
}
```

- `title` *(string, required)*: The minigame display title.
- `author` *(string, required)*: The participant's name or handle.
- `color` *(string, required)*: A hex or CSS color string (e.g. `"#ff5722"`, `"#3b82f6"`, `"coral"`). This color is displayed on the overworld room card!
- `description` *(string, optional)*: A short 1-sentence synopsis.

---

## ⚡ COMMUNICATION CONTRACT (postMessage)

The host loads your minigame inside an `<iframe>`. You must conform to this contract:

### 1. Waiting for the Host "Start" Signal
- The host loads your iframe in a dimmed preview mode (opacity: 0.2, unclickable).
- **Your game MUST wait for the `{ type: 'defrag:start' }` signal from the host before enabling gameplay or starting internal timers.**
- When `{ type: 'defrag:start' }` is received, begin gameplay immediately.

```javascript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'defrag:start') {
    // Start game logic now!
    startGame();
  }
});
```

### 2. Time Limit
- The room has a hard limit of **100 seconds**.
- The game should be designed to be beatable or cleanly resolved within 15–60 seconds.

### 3. Reporting Completion (Win or Loss)
When the game ends (player wins, loses, completes all rounds, or gives up), send a `postMessage` to `window.parent`:

```javascript
window.parent.postMessage({
  type: 'defrag:complete',
  success: true, // true if won/cleared, false if failed
  result: 'You restored 12 corrupted sectors!' // Human-readable outcome summary
}, '*');
```

### 4. Handling 100-Second Timeout
If 100 seconds expire without a completion message, the host sends your room:
```javascript
{ type: 'defrag:timeout', gracePeriodMs: 5000 }
```
You have a **5-second grace period** to cleanly stop and submit a final message:

```javascript
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'defrag:timeout') {
    // Gracefully finalize score / game state
    window.parent.postMessage({
      type: 'defrag:complete',
      success: false,
      result: 'Ran out of time before reaching the core!'
    }, '*');
  }
});
```

---

## 🎨 GRAPHIC STYLE

The overworld UI is intentionally ultra-barebones black-and-white.
Your room should have its own distinct, standalone visual style inside `room/dist/` to show that the room is a separate, independent creation. Keep it clean and accessible.

---

## ✅ VERIFICATION CHECKLIST

Before telling the user you are done:
1. [ ] Is `room/dist/index.html` playable when opened?
2. [ ] Does `room/dist/room.json` exist with valid `title`, `author`, and `color`?
3. [ ] Does the game wait for `{ type: 'defrag:start' }` before beginning gameplay?
4. [ ] Does it send `{ type: 'defrag:complete', success: ..., result: '...' }` to `window.parent` upon winning or losing?
5. [ ] Does it handle `defrag:timeout` cleanly within the 5-second grace window?
6. [ ] Are all asset paths relative (`./`)?
7. [ ] Have you verified that NO files outside `room/` were created or altered?
