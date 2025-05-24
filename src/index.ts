#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerGetBalanceTool } from './tools/get_balance.js';
import { registerGetNodeInfoTool } from './tools/get_node_info.js';
import { registerListChannelsTool } from './tools/list_channels.js';
import { registerCloseChannelTool } from './tools/close_channel.js';
import { registerDecodeInvoiceTool } from './tools/decode_invoice.js';
import { registerDecodeOfferTool } from './tools/decode_offer.js';
import { registerCreateInvoiceTool } from './tools/create_invoice.js';
import { registerPayInvoiceTool } from './tools/pay_invoice.js';
import { registerCreateOfferTool } from './tools/create_offer.js';
import { registerPayOfferTool } from './tools/pay_offer.js';
import { registerPayLightningAddressTool } from './tools/pay_lightning_address.js';
import { registerPayOnChainTool } from './tools/pay_on_chain.js';
import { registerBumpFeeTool } from './tools/bump_fee.js';
import { registerListIncomingPaymentsTool } from './tools/list_incoming_payments.js';
import { registerGetIncomingPaymentTool } from './tools/get_incoming_payment.js';
import { registerListOutgoingPaymentsTool } from './tools/list_outgoing_payments.js';
import { registerGetOutgoingPaymentTool } from './tools/get_outgoing_payment.js';

const config = {
  httpPassword: process.env.HTTP_PASSWORD || '',
  httpPort: process.env.HTTP_PORT || '9740',
  httpHost: process.env.HTTP_HOST || '',
  httpProtocol: process.env.HTTP_PROTOCOL || 'http',
};

const server = new McpServer({
  name: 'phoenixd-mcp-server',
  version: '1.0.1',
});

await registerGetBalanceTool(server, config);
await registerGetNodeInfoTool(server, config);
await registerListChannelsTool(server, config);
await registerCloseChannelTool(server, config);
await registerDecodeInvoiceTool(server, config);
await registerDecodeOfferTool(server, config);
await registerCreateInvoiceTool(server, config);
await registerPayInvoiceTool(server, config);
await registerCreateOfferTool(server, config);
await registerPayOfferTool(server, config);
await registerPayLightningAddressTool(server, config);
await registerPayOnChainTool(server, config);
await registerBumpFeeTool(server, config);
await registerListIncomingPaymentsTool(server, config);
await registerGetIncomingPaymentTool(server, config);
await registerListOutgoingPaymentsTool(server, config);
await registerGetOutgoingPaymentTool(server, config);

const transport = new StdioServerTransport();
await server.connect(transport);
