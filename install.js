#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const MCP_JSON =
  process.env.CURSOR_MCP_CONFIG ||
  path.join(os.homedir(), ".cursor", "mcp.json");
const SERVER_NAME = "cursor-soundfx";
const SERVER_ENTRY = {
  command: "npx",
  args: ["cursor-soundfx"],
};

function run() {
  const dir = path.dirname(MCP_JSON);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let config = { mcpServers: {} };
  if (fs.existsSync(MCP_JSON)) {
    try {
      config = JSON.parse(fs.readFileSync(MCP_JSON, "utf8"));
      if (!config.mcpServers) config.mcpServers = {};
    } catch (err) {
      console.error("Could not parse " + MCP_JSON + ": " + err.message);
      process.exit(1);
    }
  }
  config.mcpServers[SERVER_NAME] = SERVER_ENTRY;
  fs.writeFileSync(MCP_JSON, JSON.stringify(config, null, 2), "utf8");
  console.log("cursor-soundfx installed. Restart Cursor to enable.");
}

module.exports = { run };
