# 👾 Defrag Dungeon

A collaborative, modular browser game built for a **casual 1-hour "vibe-coding" workshop** with 5–10 people.

In Defrag Dungeon, every participant forks the repository and independently creates one browser-based minigame, puzzle, or interactive chamber. At the end of the hour, an assembler gathers all finished rooms from everyone's forks and compiles them into a single, seamless **top-down 2D overworld**.

```text
[Participant Forks]              [Assembly Tool]               [Overworld Game]
Alice's Fork: room/dist/  --->\
Bob's Fork:   room/dist/  ----->  npm run assemble  --->  rooms/ & rooms.json
Carol's Fork: room/dist/  --->/                           Sequential 2D Dungeon
```

---

## 🕹️ How It Works

- **Sequential Overworld**: The game is a top-down, single-chain track of rooms presented as bold graphic cards. The player must beat each sector in order to advance.
- **Isolated Black Boxes**: When entered, a minigame loads inside a full-screen iframe. The host treats each room as a black box.
- **60-Second Limit**: Every minigame has a maximum duration of **60 seconds** and starts automatically on load.
- **Grace Period (5s)**: If 60 seconds elapse, the host signals the room (`defrag:timeout`), giving it a 5-second grace window to report its final score before forcing a failure.
- **Clean Results**: When finished, the room returns a pass/fail status and a short human-readable summary (e.g., *"Restored 12 clusters in 14.2s with 0 errors"*).

---

## 🚀 Quick Start (For Participants)

### 1. Fork & Clone
Fork this repository to your own GitHub account and clone it locally:

```bash
git clone https://github.com/<YOUR-USERNAME>/defrag-dungeon.git
cd defrag-dungeon
```

### 2. Start the Local Dev Server
No heavy npm dependencies required! Uses standard Node.js:

```bash
npm start
```

Visit **`http://localhost:3000`** in your browser. You will see the Overworld loaded with a pre-built example room (**Sector 07: Memory Matrix**). Test it out by playing it!

---

## 🛠️ Building Your Room

Participants and their AI coding assistants work **exclusively inside the `room/` directory**.

### The Rule: Build into `room/dist/`
Whatever tech stack, libraries, or scripts you use inside `room/`, your final playable game must reside in:

```text
room/
└── dist/
    ├── index.html        <-- Main entry point
    ├── room.json         <-- Metadata file
    └── ...               <-- Any JS, CSS, images, audio, or models
```

### Required Metadata: `room/dist/room.json`
Every room must provide `room.json` with at least:

```json
{
  "title": "Cosmic Wire Defuser",
  "author": "Your Name",
  "description": "Cut the correct colored wires before time runs out!"
}
```

### The Communication Contract (postMessage)
See full details in [PROTOCOL.md](./PROTOCOL.md). In short:

1. **Auto-Start**: Start immediately when `index.html` loads.
2. **Report Outcome**: Send a message to `window.parent` when won or lost:
   ```javascript
   window.parent.postMessage({
     type: 'defrag:complete',
     success: true, // or false
     result: 'Defused the bomb with 14 seconds left!'
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
- Work **only** within `room/`.
- Never modify overworld or project files outside `room/`.
- Produce the final static build in `room/dist/`.
- Make the minigame beatable within 60 seconds.

---

## 🧙‍♂️ Workshop Facilitator: Assembling the Dungeon

At the end of the workshop (last 10–15 minutes):

1. Collect the GitHub fork URLs from participants.
2. Paste them into `forks.txt` (or see [forks.example.txt](./forks.example.txt)):
   ```text
   https://github.com/alice/defrag-dungeon
   https://github.com/bob/defrag-dungeon
   https://github.com/carol/defrag-dungeon
   ```
3. Run the assembler:
   ```bash
   npm run assemble
   ```
   *(Or pass URLs directly: `node assemble.mjs https://github.com/alice/defrag-dungeon ...`)*

The assembler will:
- Determine each participant's GitHub username as their canonical room ID.
- Retrieve each fork's `room/dist/` package.
- Validate that `index.html` and `room.json` exist with valid metadata.
- Copy each package into `rooms/<username>/`.
- Generate the sequential overworld manifest (`rooms.json`).

4. Run `npm start` and play the entire collective dungeon together on the projector or shared screen!

---

## 📂 Project Structure

```text
defrag-dungeon/
├── AGENTS.md                  # Strict instructions for AI coding assistants
├── PROTOCOL.md                # Detailed postMessage API specification
├── README.md                  # Workshop guide & instructions
├── package.json               # Scripts: npm start, npm run assemble
├── server.js                  # Zero-dependency local dev server
├── assemble.mjs               # Workshop assembly script
├── forks.example.txt          # Template list of participant forks
├── rooms.json                 # Overworld sequential map manifest
├── index.html                 # The Overworld host entry point
├── overworld/                 # Host UI & styles
│   ├── app.js                 # Overworld state machine & timer
│   ├── style.css              # Bold modern graphic theme
│   └── favicon.svg            # Favicon
├── room/                      # Participant's working sandbox
│   ├── README.md              # Instructions for the room developer
│   └── dist/                  # The portable build package
│       ├── index.html         # Playable minigame entry point
│       ├── room.json          # Room metadata
│       ├── game.js            # Example minigame logic
│       └── style.css          # Example minigame styles
└── rooms/                     # (Generated) Assembled rooms directory
```

---

## 📄 License
MIT
