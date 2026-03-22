# Phoenixd MCP Server

Connect a phoenixd bitcoin lightning wallet to your LLM.

This MCP server uses [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and [Phoenixd API](https://phoenix.acinq.co/server/api).

## Prerequisites

You need a running [phoenixd](https://github.com/ACINQ/phoenixd) node. Phoenixd generates an HTTP password on first run and writes it to `~/.phoenix/phoenix.conf`:

```
http-password=your_generated_password
```

Use that value for `HTTP_PASSWORD` in the configuration below.

Node.js >= 18 is required.

## Configuration

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "phoenixd-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "phoenixd-mcp-server"
      ],
      "env": {
        "HTTP_PROTOCOL": "http",
        "HTTP_HOST": "127.0.0.1",
        "HTTP_PORT": "9740",
        "HTTP_PASSWORD": "<your_password_from_phoenix.conf>"
      }
    }
  }
}
```

### Remote node (VPS / HTTPS)

If phoenixd runs on a remote server behind a reverse proxy with TLS:

```json
{
  "mcpServers": {
    "phoenixd-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "phoenixd-mcp-server"
      ],
      "env": {
        "HTTP_PROTOCOL": "https",
        "HTTP_HOST": "your.server.com",
        "HTTP_PORT": "9740",
        "HTTP_PASSWORD": "<your_password_from_phoenix.conf>"
      }
    }
  }
}
```

## Tools

### Payments

- `create-invoice`
  - Create a bolt11 invoice with a specified amount and description.
  - Inputs:
    - `description` (string, optional): The description of the invoice (max. 128 characters). Either `description` or `descriptionHash` must be provided.
    - `descriptionHash` (string, optional): SHA256 hash of the description. Use instead of `description`.
    - `amountSat` (number, optional): The amount requested by the invoice, in satoshi. If not set, the invoice can be paid by any amount.
    - `expirySeconds` (number, optional): The invoice expiry in seconds, default 3600 (1 hour).
    - `externalId` (string, optional): A custom identifier to link the invoice to an external system.
    - `webhookUrl` (string, optional): A URL that phoenixd will POST to when this invoice is paid. The payload is a JSON object with the payment details as defined in the [Phoenixd API docs](https://phoenix.acinq.co/server/api).

- `create-offer`
  - Create a bolt12 offer.
  - Inputs:
    - `description` (string): The description of the offer.
    - `amountSat` (number, optional): The amount requested by the offer, in satoshi.
    - `expirySeconds` (number, optional): The offer expiry in seconds.

- `pay-invoice`
  - Pay a bolt11 invoice.
  - Inputs:
    - `invoice` (string): The bolt11 invoice to pay.
    - `amountSat` (number, optional): Amount to pay in satoshis (only for zero-amount invoices). Mutually exclusive with `sendAll`.
    - `sendAll` (boolean, optional): If true, empties the wallet. Mutually exclusive with `amountSat`.
    - `externalId` (string, optional): A custom identifier to link the payment to an external system.

- `pay-offer`
  - Pay a bolt12 offer.
  - Inputs:
    - `offer` (string): The bolt12 offer to pay.
    - `amountSat` (number, optional): Amount to pay in satoshis. Mutually exclusive with `sendAll`.
    - `sendAll` (boolean, optional): If true, empties the wallet. Mutually exclusive with `amountSat`.
    - `message` (string, optional): A message for the recipient.
    - `externalId` (string, optional): A custom identifier to link the payment to an external system.

- `pay-lightning-address`
  - Pay a Lightning Address.
  - Inputs:
    - `address` (string): The Lightning Address to pay (e.g., swamppawpaw18@phoenixwallet.me).
    - `amountSat` (number, optional): Amount to pay in satoshis. Mutually exclusive with `sendAll`.
    - `sendAll` (boolean, optional): If true, empties the wallet. Mutually exclusive with `amountSat`.
    - `message` (string, optional): Optional message to include with the payment.

- `pay-on-chain`
  - Send an on-chain Bitcoin payment.
  - Inputs:
    - `address` (string): The Bitcoin address to send funds to.
    - `amountSat` (number): Amount to send in satoshis.
    - `feerateSatByte` (number, optional): Fee rate in satoshis per byte.

- `bump-fee`
  - Bumps the fee rate of all unconfirmed on-chain transactions using CPFP. Returns the ID of the child transaction.
  - Inputs:
    - `feerateSatByte` (number): New fee rate in satoshis per byte.

- `list-incoming-payments`
  - List incoming payments (invoices).
  - Inputs:
    - `from` (string, optional): Start timestamp in millis from epoch, default 0.
    - `to` (string, optional): End timestamp in millis from epoch, default now.
    - `limit` (number, optional): Number of payments per page, default 20.
    - `offset` (number, optional): Page offset, default 0.
    - `all` (boolean, optional): Also return unpaid invoices, default false.
    - `externalId` (string, optional): External id of the bolt11 invoice.

- `get-incoming-payment`
  - Get details of a specific incoming payment (invoice).
  - Inputs:
    - `paymentHash` (string): The payment hash of the invoice.

- `list-outgoing-payments`
  - List outgoing payments.
  - Inputs:
    - `from` (string, optional): Start timestamp in millis from epoch, default 0.
    - `to` (string, optional): End timestamp in millis from epoch, default now.
    - `limit` (number, optional): Number of payments per page, default 20.
    - `offset` (number, optional): Page offset, default 0.
    - `externalId` (string, optional): External id of the payment.

- `get-outgoing-payment`
  - Get details of a specific outgoing payment.
  - Inputs:
    - `paymentHash` (string): The payment hash of the outgoing payment.

### Node management

- `get-node-info`
  - Get the node info.
  - Inputs: none

- `get-balance`
  - Get the balance of the node.
  - Inputs: none

- `list-channels`
  - List the node channels.
  - Inputs: none

- `close-channel`
  - Close a channel by ID, sending the funds to a specified address on chain, with a specified fee rate.
  - Inputs:
    - `channelId` (string): The ID of the channel to close.
    - `address` (string): The Bitcoin on chain address to send the funds to.
    - `feerateSatByte` (number): The fee rate in satoshis per byte.

- `decode-invoice`
  - Decode a bolt11 invoice, the output amount is in millisatoshis.
  - Inputs:
    - `invoice` (string): The bolt11 invoice to decode.

- `decode-offer`
  - Decode a bolt12 offer, the output amount is in millisatoshis.
  - Inputs:
    - `offer` (string): The bolt12 offer to decode.

## Troubleshooting

**`Authentication failed` / `401`** — Check that `HTTP_PASSWORD` matches the value in `~/.phoenix/phoenix.conf`.

**`Connection refused`** — Phoenixd is not running or is listening on a different host/port. Verify with `curl http://127.0.0.1:9740/getinfo -u :your_password`.

**`Node.js version error`** — This package requires Node.js >= 18. Run `node --version` to check.
