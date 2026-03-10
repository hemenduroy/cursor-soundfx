# Cursor SoundFX MCP

A minimal MCP server that plays sound effects in Cursor when development events occur (command failures, build errors). **Zero dependencies**; uses OS built-in players (afplay / PowerShell / aplay).

- **One-click install**: click the link below → Cursor prompts → click Install → done
- **Lightweight**: no npm dependencies, Node built-ins only
- **Offline**: runs locally, no network

## Install

**One-click (recommended)** – click this link. Cursor will prompt to add the server; click **Install**, then restart Cursor:

**[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=cursor-soundfx&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImN1cnNvci1zb3VuZGZ4Il19)**

*(Only works after you [publish the package to npm](https://docs.npmjs.com/cli/v8/commands/npm-publish); until then the link will add the server but it may 404 when Cursor runs it.)*

**Or from the terminal:**

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

## Cursor rule example

In your project or user rules:

- When a terminal command exits with a non-zero code → `play_sound({ "type": "error" })`
- When a build succeeds → `play_sound({ "type": "success" })`

## Project layout

```
cursor-soundfx/
├── package.json
├── server.js
├── install.js
├── sounds/          # Example sounds: error.wav, success.wav
└── README.md
```

## License

MIT
