# textsharenow-mcp

MCP server for [TextShareNow Pro](https://www.textsharenow.com/pricing) — lets AI agents share text as short links and receive text from them. Works with Claude Code, Claude Desktop, opencode, Cursor, and any MCP client.

A TextShareNow Pro license key ($5/month or $50/year) is required. The key is sent as `Authorization: Bearer <key>` to the same API the website uses, so Pro limits, expiry, passwords, and auto-deletion all apply.

## Quick start

```bash
TEXTSHARENOW_LICENSE_KEY=YOUR-LICENSE-KEY npx -y textsharenow-mcp@latest
```

Normally you configure this in your MCP client instead of running it by hand.

- Node.js 18 or newer
- Get a key at https://www.textsharenow.com/pricing (shown on the Gumroad receipt and emailed to you)

## Tools

| Tool | What it does |
| --- | --- |
| `share_text` | Creates a share and returns a code + URL. Supports expiry, read limits, passwords, and custom codes. |
| `peek_share` | Checks expiry, remaining reads, and password status without consuming a read or returning content. |
| `receive_text` | Fetches the text. Consumes one read; single-use shares are deleted. Passwords are supported. |
| `delete_share` | Deletes a share created with the same license key. |

### Example prompts

- "Share this JSON as a link that expires in 10 minutes, then give me the URL."
- "Peek at code K7Q2P — has it been read yet?"
- "Receive code K7Q2P. The password is hunter2."
- "Delete the share you just created."

## Configure your client

### opencode

Add to `~/.config/opencode/opencode.json` (or a project `opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "textsharenow": {
      "type": "local",
      "command": ["npx", "-y", "textsharenow-mcp@latest"],
      "enabled": true,
      "environment": {
        "TEXTSHARENOW_LICENSE_KEY": "YOUR-LICENSE-KEY"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add textsharenow \
  --env TEXTSHARENOW_LICENSE_KEY=YOUR-LICENSE-KEY \
  -- npx -y textsharenow-mcp@latest
```

### Claude Desktop

Edit `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "textsharenow": {
      "command": "npx",
      "args": ["-y", "textsharenow-mcp@latest"],
      "env": {
        "TEXTSHARENOW_LICENSE_KEY": "YOUR-LICENSE-KEY"
      }
    }
  }
}
```

### Cursor

Add `.cursor/mcp.json` to your project (same shape as Claude Desktop):

```json
{
  "mcpServers": {
    "textsharenow": {
      "command": "npx",
      "args": ["-y", "textsharenow-mcp@latest"],
      "env": {
        "TEXTSHARENOW_LICENSE_KEY": "YOUR-LICENSE-KEY"
      }
    }
  }
}
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `TEXTSHARENOW_LICENSE_KEY` | Yes | Pro license key used as the Bearer token. |
| `TEXTSHARENOW_API_BASE` | No | API origin. Defaults to `https://www.textsharenow.com`. |

## Limits

The MCP server inherits the Pro plan: up to 100,000 characters per share, expiry from 10 minutes to never, read limits of 1/5/10/unlimited, passwords, and custom codes. API/MCP are text-only for now — file transfers use the website.

Requests are rate-limited per IP and per license (see the [developer guide](https://www.textsharenow.com/developers)).

## Troubleshooting

- **`TEXTSHARENOW_LICENSE_KEY is required`** — set the env var in your client config, not just your shell.
- **`Pro is required` / `403`** — the key is invalid, expired, or cancelled. Re-check it on your Gumroad receipt.
- **`Code not found or has expired`** — single-use shares are deleted after reading; expired shares cannot be recovered.
- **Old version after an update** — the recommended command ends in `@latest`; without it `npx` may reuse a cached version.

## Security

The key is sent only to the TextShareNow API over HTTPS. Treat it like a password: keep it out of source control and shared configs. Delete only works for shares created with the same key, and the server never logs raw license keys (it caches a SHA-256 hash for 24 hours).

## License

Proprietary (`UNLICENSED`). Published for use with the TextShareNow service; all rights reserved.
