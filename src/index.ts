#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerGetBalanceTool } from './tools/get_balance.js';

const config = {
  httpPassword: process.env.HTTP_PASSWORD || '',
  httpPort: process.env.HTTP_PORT || '',
  httpHost: process.env.HTTP_HOST || ''
};

if (!process.env.HTTP_PASSWORD || !process.env.HTTP_PORT || !process.env.HTTP_HOST) {
  console.error('HTTP_PASSWORD, HTTP_PORT, and HTTP_HOST are required but not set in the environment variables.');
  process.exit(1);
}

const server = new McpServer({
  name: 'phoenixd-mcp-server',
  version: '0.1.0',
});

await registerGetBalanceTool(server, config);

const transport = new StdioServerTransport();
await server.connect(transport);
