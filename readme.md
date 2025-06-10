# Phoenixd MCP Server

Connect a phoenixd bitcoin lightning wallet to your LLM.

This MCP server uses [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and [Phoenixd API](https://phoenix.acinq.co/server/api).

## Configuration

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "phoenixd-mpc-server": {
      "command": "npx",
      "args": [
        "-y",
        "phoenixd-mcp-server"
      ],
      "env": {
        "HTTP_PROTOCOL": "<http or https>",   // If not set http is the default value.
        "HTTP_HOST": "<your_host>",           // If not set 127.0.0.1 is the default host.
        "HTTP_PORT": "<your_phoenixd_port>",  // If not set 9740 is the default port.
        "HTTP_PASSWORD": "<phoenixd_http_password>"
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
    - `description` (string): The description of the invoice (max. 128 characters).
    - `amountSat` (number, optional): The amount requested by the invoice, in satoshi. If not set, the invoice can be paid by any amount.
    - `expirySeconds` (number, optional): The invoice expiry in seconds, default 3600 (1 hour).
    - `externalId` (string, optional): A custom identifier to link the invoice to an external system.
    - `webhookUrl` (string, optional): A webhook URL to be notified when this payment is received.

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
    - `amountMsat` (number, optional): Amount to pay in millisatoshis (only for zero-amount invoices).
    - `externalId` (string, optional): A custom identifier to link the payment to an external system.

- `pay-offer`
  - Pay a bolt12 offer.
  - Inputs:
    - `offer` (string): The bolt12 offer to pay.
    - `amountMsat` (number): Amount to pay in millisatoshis.
    - `externalId` (string, optional): A custom identifier to link the payment to an external system.

- `pay-lightning-address`
  - Pay a Lightning Address.
  - Inputs:
    - `address` (string): The Lightning Address to pay (e.g., swamppawpaw18@phoenixwallet.me).
    - `amountSat` (number): Amount to pay in satoshis.
    - `comment` (string, optional): Optional comment to include with the payment.

- `pay-on-chain`
  - Send an on-chain Bitcoin payment.
  - Inputs:
    - `address` (string): The Bitcoin address to send funds to.
    - `amountSat` (number): Amount to send in satoshis.
    - `feerateSatByte` (number, optional): Fee rate in satoshis per byte.

- `bump-fee`
  - Bump the fee of an unconfirmed on-chain transaction.
  - Inputs:
    - `txId` (string): The transaction ID to bump.
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
  - Decode an bolt11 invoice, the output amount is in milisatoshis.
  - Inputs:
    - `invoice` (string): The bolt11 invoice to decode.

- `decode-offer`
  - Decode an bolt12 offer, the output amount is in milisatoshis.
  - Inputs:
    - `offer` (string): The bolt12 offer to decode.
