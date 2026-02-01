#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { tools } from './tools/index.js';

const config = {
  httpPassword: process.env.HTTP_PASSWORD || '',
  httpPort: process.env.HTTP_PORT || '9740',
  httpHost: process.env.HTTP_HOST || '127.0.0.1',
  httpProtocol: process.env.HTTP_PROTOCOL || 'http',
};

const server = new McpServer({
  name: 'phoenixd-mcp-server',
  version: '1.0.2',
});

await tools.registerGetBalanceTool(server, config);
await tools.registerGetNodeInfoTool(server, config);
await tools.registerListChannelsTool(server, config);
await tools.registerCloseChannelTool(server, config);
await tools.registerDecodeInvoiceTool(server, config);
await tools.registerDecodeOfferTool(server, config);
await tools.registerCreateInvoiceTool(server, config);
await tools.registerPayInvoiceTool(server, config);
await tools.registerCreateOfferTool(server, config);
await tools.registerPayOfferTool(server, config);
await tools.registerPayLightningAddressTool(server, config);
await tools.registerPayOnChainTool(server, config);
await tools.registerBumpFeeTool(server, config);
await tools.registerListIncomingPaymentsTool(server, config);
await tools.registerGetIncomingPaymentTool(server, config);
await tools.registerListOutgoingPaymentsTool(server, config);
await tools.registerGetOutgoingPaymentTool(server, config);

const transport = new StdioServerTransport();
await server.connect(transport);
