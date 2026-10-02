# 👾 Defrag Dungeon

A collaborative, modular browser game built for a **casual 1-hour "vibe-coding" workshop** with 5–10 people.

In Defrag Dungeon, every participant forks the repository and can independently create up to 5 browser-based minigames, puzzles, or interactive chambers (in `room-1/` through `room-5/`). At the end of the hour, an assembler gathers all finished rooms from everyone's forks and compiles them into a single, seamless **top-down sequential overworld**.

```text
[Participant Forks]                  [Assembly Tool]               [Overworld Game]
Alice's Fork: room-1/dist/, room-2/dist/ ->\
Bob's Fork:   room-1/dist/ -------------->  npm run assemble  --->  rooms/ & rooms.json
Carol's Fork: room-1/dist/ ------------->/                           Sequential B&W Dungeon
```

---

## 🕹️ How It Works

- **Barebones Overworld**: Simple, clean black-and-white sequential list of rooms with a distinct color box for each room (defined in each room's `room.json`).
- **Start Signal Handshake**: When a room is opened, the host loads the iframe at 0.2 opacity and unclickable. When the player clicks **"Start Room"**, the host sends `{ type: 'defrag:start' }`, brings the iframe to 100% opacity, and starts the timer.
- **100-Second Limit**: Every minigame has a maximum duration of **100 seconds**.
- **Grace Period (5s)**: If 100 seconds elapse, the host signals the room (`defrag:timeout`), giving it a 5-second grace window to report its final score before forcing a failure.
- **Clean Results**: When finished, the room returns a pass/fail status and a short human-readable summary (e.g., *"Restored 12 clusters in 42s"*).

---

## 🚀 Quick Start (For Participants)

### 1. Fork & Clone
Fork this repository to your own GitHub account and clone it locally:

```bash
git clone https://github.com/<YOUR-USERNAME>/defrag-dungeon.git
cd defrag-dungeon
```

### 2. Start the Local Dev Server
```bash
npm start
```

Visit **`http://localhost:3000`** in your browser. You will see the barebones Overworld loaded with a pre-built example room.

---

## 🛠️ Building Your Rooms

Participants and their AI coding assistants work inside the room directories (`room-1/`, `room-2/`, `room-3/`, `room-4/`, `room-5/`). You can make up to 5 rooms!

### The Rule: Build into `room-X/dist/`
Whatever tech stack, libraries, or scripts you use inside a room directory (`room-1/`, `room-2/`, etc.), your final playable game for that room must reside in:

```text
room-1/
└── dist/
    ├── index.html        <-- Main entry point
    ├── room.json         <-- Metadata file (title, author, color)
    └── ...               <-- Any JS, CSS, images, audio, or models
```

By default, `room-1/` comes pre-populated with a starter room template, while `room-2/` through `room-5/` are empty ready for additional rooms.

### Required Metadata: `room-X/dist/room.json`
Every room must provide `room.json` with at least:

```json
{
  "title": "Cosmic Wire Defuser",
  "author": "Your Name",
  "color": "#3b82f6",
  "description": "Cut the correct colored wires before time runs out!"
}
```

### The Communication Contract (postMessage)
See full details in [PROTOCOL.md](./PROTOCOL.md). In short:

1. **Wait for Start Signal**:
   ```javascript
   window.addEventListener('message', (event) => {
     if (event.data?.type === 'defrag:start') {
       // Start your game now!
       startGame();
     }
   });
   ```

2. **Report Outcome**: Send a message to `window.parent` when won or lost:
   ```javascript
   window.parent.postMessage({
     type: 'defrag:complete',
     success: true, // or false
     result: 'Defused the bomb in 32 seconds!'
   }, '*');
   ```

3. **Handle Timeout**: Listen for `defrag:timeout` and reply within 5 seconds:
   ```javascript
   window.addEventListener('message', (event) => {
     if (event.data?.type === 'defrag:timeout') {
       window.parent.postMessage({
         type: 'defrag:complete',
         success: false,
         result: 'Time expired!'
       }, '*');
     }
   });
   ```

---

## 🤖 Using AI Coding Agents

If you are using **Cursor, Claude, Copilot, ChatGPT, or Antigravity**, point your assistant to [AGENTS.md](./AGENTS.md).

It contains strict boundary rules:
- Work **only** within `room-1/`, `room-2/`, `room-3/`, `room-4/`, or `room-5/`.
- Never modify overworld or project files outside these room directories.
- Produce the final static builds in `room-X/dist/`.
- Wait for `{ type: 'defrag:start' }` before beginning gameplay.
- Make the minigame beatable within 100 seconds.

---

## 🧙‍♂️ Workshop Facilitator: Assembling the Dungeon

1. Collect the GitHub fork URLs from participants into `forks.txt`.
2. Run the assembler:
   ```bash
   npm run assemble
   ```
3. Run `npm start` and play the entire collective dungeon together!

---

## 📄 License
MIT
