import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerPayInvoiceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'pay-invoice',
    'Pay a bolt11 invoice with a specified amount and description',
    {
      amountSat: z.number().optional().describe('The amount to pay, in satoshi. If not set, will pay the amount requested in the invoice.'),
      invoice: z.string().describe('The bolt11 invoice to pay.'),
    },
    async ({ amountSat, invoice }) => {
      validateEnv(config);

      const paramsObj: Record<string, string> = { invoice };
      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();

      const result = await fetchPhoenixd(config, '/payinvoice', {
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
