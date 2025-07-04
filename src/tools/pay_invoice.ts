import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

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
      const credentials = btoa(`:${config.httpPassword}`);
      const paramsObj: Record<string, string> = {
        invoice,
      };

      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/payinvoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const payInvoiceData = await data.json();

      if (payInvoiceData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Payment failed',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payInvoiceData, null, 2),
          },
        ],
      };
    },
  );
}
