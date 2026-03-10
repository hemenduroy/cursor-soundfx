# Cursor SoundFX MCP

A minimal MCP server that plays sound effects in Cursor when development events occur (command failures, build errors). **Zero dependencies**; uses OS built-in players (afplay / PowerShell / aplay).

- **One-shot install (Plugin)**: install the Cursor plugin → MCP + rule are set up; when the agent runs a command that fails or succeeds, you hear the sound
- **Lightweight**: no npm dependencies, Node built-ins only
- **Offline**: runs locally, no network

## Install

**Option A: Cursor Plugin (one-shot, MCP + rules)**  
Install from the **Cursor Marketplace** (once the plugin is listed). That installs both the MCP server and a rule so the agent automatically calls `play_sound` when it runs a command that fails or succeeds. One click, no extra setup.

- In Cursor: open the marketplace (e.g. Settings → Plugins / Marketplace), search for **cursor-soundfx**, click Install.  
- To **publish** the plugin: push this repo to GitHub, then submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). The repo already contains `.cursor-plugin/`, `.mcp.json`, and `rules/play-sound-on-failure.mdc`.

**Option B: Add to Cursor link (MCP only)**  
Click this link. Cursor will prompt to add the server; click **Install**, then restart Cursor:

**[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=cursor-soundfx&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImN1cnNvci1zb3VuZGZ4Il19)**

*(Requires the package on npm. With Option B you get the MCP only; add the rule yourself from `rules/play-sound-on-failure.mdc` or Cursor Settings → Rules.)*

**Option C: Terminal (MCP only):**

```bash
npx -y cursor-soundfx install
```

Then **restart Cursor**. Sounds only play when the **Cursor agent** calls the `play_sound` tool (e.g. from a rule).

## How it works

When the Cursor agent runs a command (e.g. in chat) and you have a rule that says to call `play_sound` on failure or success, the agent calls the MCP tool and the sound plays. Your regular terminal and other apps are not affected.

## MCP tool: `play_sound`

| Argument | Description |
|----------|-------------|
| `type`   | `error` or `success` |

**Example** (from a Cursor rule or agent):

```json
play_sound({ "type": "error" })
```

## Sounds

The package includes two example sounds so it works right after install:

- **error** → `error.wav` (faah)
- **success** → `success.wav` (money for nothing)

They live in the package `sounds/` folder. To use your own sounds, create `~/.cursor-soundfx.json`:

```json
{
  "error": "your-error.wav",
  "success": "your-success.wav"
}
```

Paths are relative to the package `sounds/` directory, or use absolute paths.

**Linux:** requires `aplay` (install `alsa-utils` if needed). macOS and Windows use built-in players.

## Rule (included in the plugin)

If you install via **Option A (Plugin)**, the rule is already included. If you use Option B or C, add this behavior (e.g. paste into Cursor Settings → Rules or use the text in `rules/play-sound-on-failure.mdc`):

- When the agent runs a terminal command and it fails (non-zero exit) → call `play_sound({ "type": "error" })`
- When the agent runs a terminal command and it succeeds → call `play_sound({ "type": "success" })`

## Project layout

```
cursor-soundfx/
├── .cursor-plugin/
│   └── plugin.json       # Plugin manifest (for Marketplace)
├── .mcp.json             # MCP config (used by the plugin)
├── rules/
│   └── play-sound-on-failure.mdc   # Rule: call play_sound when agent runs commands
├── package.json
├── server.js
├── install.js
├── sounds/               # Example sounds: error.wav, success.wav
└── README.md
```

## Testing before publish

Because `npx cursor-soundfx` hits the npm registry, you need to point Cursor at your **local** copy until the package is published.

1. **Point Cursor at your local server**  
   Edit `~/.cursor/mcp.json` and set the cursor-soundfx entry to:

   ```json
   "cursor-soundfx": {
     "command": "node",
     "args": ["/ABSOLUTE/PATH/TO/cursor-soundfx/server.js"]
   }
   ```  
   Use your real path (e.g. `/Users/you/cursor-soundfx/server.js`).

2. **Restart Cursor** so it starts the server from that path.

3. **Test the MCP tool**  
   In a Cursor chat, ask the agent: *“Call the play_sound MCP tool with type error.”*  
   You should hear your error sound. Try *“play_sound with type success”* for the other.

4. **Test the install command** (optional)  
   From the project root run: `node server.js install`  
   That updates `~/.cursor/mcp.json` to use `npx cursor-soundfx`. After that, Cursor would 404 until you publish, so either change `mcp.json` back to the `node` + path above, or publish and then use the npx config.

5. **Test the one-click link** (optional)  
   Click the [Add to Cursor](#install) link. Cursor should prompt to add the server. After adding, Cursor will try to run it via npx and get 404 until you publish—so for local testing, keep using the `node` + path in `mcp.json` as in step 1.

## License

MIT
