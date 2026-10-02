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

`room/dist/room.json` must be valid JSON and contain at least `title` and `author`:

```json
{
  "title": "Cosmic Wire Defuser",
  "author": "Jane Doe",
  "description": "Cut the correct wires in binary sequence before time runs out!"
}
```

- `title` *(string, required)*: The minigame display title.
- `author` *(string, required)*: The participant's name or handle.
- `description` *(string, optional)*: A short 1-sentence synopsis.

---

## ⚡ COMMUNICATION CONTRACT (postMessage)

The host loads your minigame inside an `<iframe>`. You must conform to this lightweight contract:

### 1. Auto-Start
- The room starts automatically as soon as `room/dist/index.html` loads.
- There is **no start message** sent from the host.

### 2. Time Limit
- The room has a hard limit of **60 seconds**.
- The game should be designed to be beatable or cleanly resolved within 10–45 seconds.

### 3. Reporting Completion (Win or Loss)
When the game ends (player wins, loses, completes all rounds, or gives up), send a `postMessage` to `window.parent`:

```javascript
window.parent.postMessage({
  type: 'defrag:complete',
  success: true, // true if won/cleared, false if failed
  result: 'You restored 12 corrupted sectors!' // Human-readable outcome summary
}, '*');
```

### 4. Handling 60-Second Timeout
If 60 seconds expire without a completion message, the host sends your room:
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

*(If the grace period expires without a response, the host forcibly terminates the iframe and marks the room as failed).*

---

## 🎨 CREATIVE FREEDOM

Inside `room/dist/`, you have total creative freedom!
- Plain HTML5 canvas, SVG, CSS animations, or modern DOM.
- 3D with Three.js / WebGL (bundled or inlined).
- Audio via Web Audio API synthesis or royalty-free sounds.
- Game genres: reflex games, ciphers, rhythm matching, trivia, memory matrix, physics toys, mazes, boss fights, or absurd comedic experiences.
- Keep the gameplay punchy, accessible, and delightful.

---

## ✅ VERIFICATION CHECKLIST

Before telling the user you are done:
1. [ ] Is `room/dist/index.html` playable when opened in the browser?
2. [ ] Does `room/dist/room.json` exist with valid `title` and `author`?
3. [ ] Does the game start immediately without waiting for a signal?
4. [ ] Does it send `{ type: 'defrag:complete', success: ..., result: '...' }` to `window.parent` upon winning or losing?
5. [ ] Does it handle `defrag:timeout` cleanly within the 5-second grace window?
6. [ ] Are all asset paths relative (`./`), with no references to local filesystem paths or external dev servers?
7. [ ] Have you verified that NO files outside `room/` were created or altered?
