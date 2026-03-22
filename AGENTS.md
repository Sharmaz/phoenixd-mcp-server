# AGENTS.md

This file describes the phoenixd-mcp-server project for AI agents and automated tools.

## What this project is

An MCP (Model Context Protocol) server that connects a [phoenixd](https://phoenix.acinq.co/server) Bitcoin Lightning node to LLMs and AI agents. It exposes Lightning and on-chain Bitcoin payment capabilities as MCP tools that any compatible AI agent can call.

## What AI agents can do with this server

- Create and pay BOLT11 invoices (Lightning)
- Create and pay BOLT12 offers (Lightning)
- Pay Lightning Addresses (user@domain.com)
- Send on-chain Bitcoin payments
- Query wallet balance, node info, and channel state
- List and retrieve incoming/outgoing payment history
- Decode invoices and offers

## How to run it

Requires a running phoenixd node. Then:

```bash
npx -y phoenixd-mcp-server
```

Environment variables:
- `HTTP_PASSWORD` (required) — phoenixd HTTP API password
- `HTTP_HOST` (default: `127.0.0.1`)
- `HTTP_PORT` (default: `9740`)
- `HTTP_PROTOCOL` (default: `http`)

## Tool reference

| Tool | Description | Required params |
|------|-------------|-----------------|
| `create-invoice` | Create a BOLT11 invoice | `description` |
| `create-offer` | Create a BOLT12 offer | `description` |
| `pay-invoice` | Pay a BOLT11 invoice | `invoice` |
| `pay-offer` | Pay a BOLT12 offer | `offer`, `amountMsat` |
| `pay-lightning-address` | Pay a Lightning Address | `address`, `amountSat` |
| `pay-on-chain` | Send on-chain Bitcoin | `address`, `amountSat` |
| `bump-fee` | Bump fee on pending tx | `txId`, `feerateSatByte` |
| `list-incoming-payments` | List received payments | — |
| `get-incoming-payment` | Get incoming payment by hash | `paymentHash` |
| `list-outgoing-payments` | List sent payments | — |
| `get-outgoing-payment` | Get outgoing payment by hash | `paymentHash` |
| `get-node-info` | Get node ID, alias, version | — |
| `get-balance` | Get Lightning + on-chain balance | — |
| `list-channels` | List Lightning channels | — |
| `close-channel` | Close a channel | `channelId`, `address`, `feerateSatByte` |
| `decode-invoice` | Decode a BOLT11 invoice | `invoice` |
| `decode-offer` | Decode a BOLT12 offer | `offer` |

## Project structure

```
src/
  index.ts          # MCP server init, registers all tools
  tools/            # One file per tool (18 tools total)
  types/            # TypeScript interfaces
  utils/            # Environment validation, fetch utility
```

## Tech stack

TypeScript · MCP SDK · Zod · ESM modules

## Links

- npm: https://www.npmjs.com/package/phoenixd-mcp-server
- GitHub: https://github.com/Sharmaz/phoenixd-mcp-server
- phoenixd API docs: https://phoenix.acinq.co/server/api
