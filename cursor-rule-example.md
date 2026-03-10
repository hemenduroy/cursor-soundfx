# Cursor rule example: trigger sound on events

Add a rule (e.g. in your project’s `.cursor/rules/` or in Cursor Settings → Rules) so that the agent calls the SoundFX MCP tool when certain events happen.

Example rule text:

---

When a terminal command or script exits with a non-zero exit code (failure), use the MCP tool **play_sound** with `{ "type": "error" }`.

When a build or compile succeeds, use the MCP tool **play_sound** with `{ "type": "success" }`.

---

The exact wording depends on how your Cursor version interprets rules; the important part is that the agent should call the `play_sound` tool with the appropriate `type` when those events occur.
