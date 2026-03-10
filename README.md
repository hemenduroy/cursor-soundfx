<p align="center">
  <img src="assets/logo.svg" width="64" height="64" alt="Cursor SoundFX"/>
</p>

# Cursor SoundFX

<p align="center">
  <strong>Sound effects in Cursor when the agent's commands fail or succeed.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/release-1.0.0-blue?style=flat-square" alt="Release"/>
  <img src="https://img.shields.io/badge/release%20date-2025--03--10-blue?style=flat-square" alt="Release date"/>
  <img src="https://img.shields.io/badge/author-Hemendu%20Roy-blue?style=flat-square" alt="Author"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/github/stars/hemenduroy/cursor-soundfx?style=flat-square" alt="Stars"/>
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="Node"/>
</p>

---

## ✨ What it does

When the Cursor agent runs a terminal command in chat, you get **audio feedback**:

| Event   | Sound   |
|--------|---------|
| Success (exit 0) | success |
| Failure (non-zero) | error  |

The plugin includes an MCP server and a rule so the agent calls `play_sound` automatically—no extra setup.

---

## 🚀 Install

**Cursor Plugin (recommended)**  
In Cursor: **Settings → Plugins / Marketplace** → search **cursor-soundfx** → Install.  
*(Once the plugin is listed on the Marketplace.)*

**MCP only (terminal)**  
```bash
npx -y cursor-soundfx install
```  
Then restart Cursor. Add the rule yourself from `rules/play-sound-on-failure.mdc` if you want automatic sounds.

**Add to Cursor (link)**  
[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=cursor-soundfx&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImN1cnNvci1zb3VuZGZ4Il19) — then restart. MCP only; add the rule from the repo if needed.

---

## 🎵 Custom sounds

Create `~/.cursor-soundfx.json`:

```json
{
  "error": "your-error.wav",
  "success": "your-success.wav"
}
```

Paths can be relative to the package `sounds/` folder or absolute.  
**Linux:** needs `aplay` (e.g. `alsa-utils`).

---

## 📄 License

**Open Source** — [MIT License](LICENSE). You can use, modify, and distribute this software freely. © **Hemendu Roy**
