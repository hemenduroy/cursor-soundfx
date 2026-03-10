#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const os = require("os");

// If run as `cursor-soundfx install`, run installer and exit
if (process.argv[2] === "install") {
  require("./install.js").run();
  process.exit(0);
}

// If run as `cursor-soundfx play error|success`, play sound and exit (for shell hooks)
const playArg = process.argv[2];
if (playArg === "play" && (process.argv[3] === "error" || process.argv[3] === "success")) {
  const SOUNDS_DIR = path.resolve(__dirname, "sounds");
  const CONFIG_FILE = path.join(
    process.env.HOME || process.env.USERPROFILE || "",
    ".cursor-soundfx.json"
  );
  const DEFAULT_SOUND_MAP = { error: "error.wav", success: "success.wav" };
  function loadConfig() {
    let map = { ...DEFAULT_SOUND_MAP };
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        Object.assign(map, JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")));
      }
    } catch (_) {}
    return map;
  }
  const type = process.argv[3];
  const config = loadConfig();
  const filename = config[type] || config.error || "error.wav";
  const soundPath = path.isAbsolute(filename) ? filename : path.join(SOUNDS_DIR, filename);
  if (!fs.existsSync(soundPath)) process.exit(1);
  const plat = os.platform();
  const child = plat === "darwin"
    ? spawn("afplay", [soundPath], { detached: true, stdio: "ignore" })
    : plat === "win32"
    ? spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", "(New-Object Media.SoundPlayer($args[0])).Play()", soundPath], { detached: true, stdio: "ignore" })
    : spawn("aplay", ["-q", soundPath], { detached: true, stdio: "ignore" });
  child.unref();
  process.exit(0);
}

// --- MCP stdio server ---
const readline = require("readline");

const SOUNDS_DIR = path.resolve(__dirname, "sounds");
const CONFIG_FILE = path.join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".cursor-soundfx.json"
);

const DEFAULT_SOUND_MAP = {
  error: "error.wav",
  success: "success.wav",
};

function loadConfig() {
  let map = { ...DEFAULT_SOUND_MAP };
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      map = { ...map, ...data };
    }
  } catch (_) {}
  return map;
}

function getSoundPath(type) {
  const config = loadConfig();
  const filename = config[type] || config.error || "error.wav";
  return path.isAbsolute(filename) ? filename : path.join(SOUNDS_DIR, filename);
}

function playSound(type, cb) {
  const soundPath = getSoundPath(type);
  if (!fs.existsSync(soundPath)) {
    cb(new Error("Sound file not found: " + soundPath));
    return;
  }
  const plat = os.platform();
  let child;
  if (plat === "darwin") {
    child = spawn("afplay", [soundPath], { detached: true, stdio: "ignore" });
  } else if (plat === "win32") {
    child = spawn(
      "powershell",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "(New-Object Media.SoundPlayer($args[0])).Play()",
        soundPath,
      ],
      { detached: true, stdio: "ignore" }
    );
  } else {
    child = spawn("aplay", ["-q", soundPath], { detached: true, stdio: "ignore" });
  }
  child.on("error", (err) => cb(err));
  child.unref();
  cb();
}

function send(msg) {
  const out = JSON.stringify(msg) + "\n";
  process.stdout.write(out);
}

const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  let req;
  try {
    req = JSON.parse(line);
  } catch (_) {
    return;
  }
  if (!req || !req.method) return;

  const id = req.id;
  const reply = (result, error) => {
    send({
      jsonrpc: "2.0",
      id,
      result: error ? undefined : result,
      error: error
        ? { code: -32603, message: error.message || "Internal error" }
        : undefined,
    });
  };

  if (req.method === "initialize") {
    reply({
      protocolVersion: "2024-11-05",
      serverInfo: {
        name: "cursor-soundfx",
        version: "1.0.0",
      },
      capabilities: {
        tools: {},
      },
    });
    return;
  }

  if (req.method === "notified/initialized") {
    return;
  }

  if (req.method === "tools/list") {
    reply({
      tools: [
        {
          name: "play_sound",
          description:
            "Play a sound effect for a development event: error (build/command failed) or success (build/command succeeded).",
          inputSchema: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "Event type: error or success",
                enum: ["error", "success"],
              },
            },
            required: ["type"],
          },
        },
      ],
    });
    return;
  }

  if (req.method === "tools/call") {
    const params = req.params || {};
    const name = params.name;
    const args = params.arguments || {};

    if (name !== "play_sound") {
      reply(null, new Error("Unknown tool: " + name));
      return;
    }

    const type = args.type || "error";
    playSound(type, (err) => {
      if (err) {
        console.error("[cursor-soundfx]", err.message);
        reply({
          content: [
            {
              type: "text",
              text: "Sound playback failed: " + err.message,
            },
          ],
          isError: true,
        });
      } else {
        reply({
          content: [
            {
              type: "text",
              text: "Played sound: " + type,
            },
          ],
          isError: false,
        });
      }
    });
    return;
  }

  reply(null, new Error("Method not found: " + req.method));
});
