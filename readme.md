# Phoenixd MCP Server
Connect a phoenixd bitcoin lightning wallet to your LLM.

## Configuration

### Usage with Claude Desktop
Add this to your `claude_desktop_config.json` file:
```json
"phoenixd-mpc-server": {
  "command": "npx",
  "args": [
    "-y",
    "phoenixd-mcp-server"
  ],
  "env": {
    "HTTP_HOST": "http://<your_host>",
    "HTTP_PORT": "<your_phoenixd_port>",
    "HTTP_PASSWORD": "<phoenixd_http_password>"
  }
}
```
