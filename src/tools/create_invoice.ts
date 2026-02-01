import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerCreateInvoiceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'create-invoice',
    'Create a bolt11 invoice with a specified amount and description',
    {
      description: z.string().describe('The description of the invoice (max. 128 characters).'),
      amountSat: z.number().optional()
        .describe('The amount requested by the invoice, in satoshi. If not set, the invoice can be paid by any amount.'),
      expirySeconds: z.number().optional().describe('The invoice expiry in seconds, by default 3600 (1 hour).'),
      externalId: z.string().optional().describe('A custom identifier. Use that to link the invoice to an external system.'),
      webhookUrl: z.string().optional().describe('A webhook url that will be notified when this specific payment has been received. '),
    },
    async ({ description, amountSat, expirySeconds, externalId, webhookUrl }) => {
      validateEnv(config);

      const paramsObj: Record<string, string> = { description };
      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();
      if (expirySeconds !== undefined) paramsObj.expirySeconds = expirySeconds.toString();
      if (externalId !== undefined) paramsObj.externalId = externalId;
      if (webhookUrl !== undefined) paramsObj.webhookUrl = webhookUrl;

      const result = await fetchPhoenixd(config, '/createinvoice', {
        method: 'POST',
        body: new URLSearchParams(paramsObj),
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
