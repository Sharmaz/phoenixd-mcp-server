# Phoenixd MCP Server
Connect a phoenixd bitcoin lightning wallet to your LLM.

This MCP server uses [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and [Phoenixd API](https://phoenix.acinq.co/server/api).

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

## Tools

### Node management
- `get-node-info`
  - Get the node info.
  - Inputs: none
- `get-balance`
  - Get the balance of the node.
  - Inputs: none
- list-channels
  - List the node channels.
  - Inputs: none
- close-channel
  - Close a channel by ID, sending the funds to a specified address on chain, with a specified fee rate.
  - Inputs:
    - `channelId` (string): The ID of the channel to close.
    - `address` (string): The Bitcoin on chain address to send the funds to.
    - `feerateSatByte` (number): The fee rate in satoshis per byte.
- decode-invoice
  - Decode an bolt11 invoice, the output amount is in milisatoshis.
  - Inputs:
    - `invoice` (string): The bolt11 invoice to decode.
- decode-offer
  - Decode an bolt12 offer, the output amount is in milisatoshis.
  - Inputs:
    - `offer` (string): The bolt12 offer to decode.
