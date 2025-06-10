import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

export function registerDecodeInvoiceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'decode-invoice',
    'Decode an bolt11 invoice, the output amount is in milisatoshis',
    {
      invoice: z.string().describe('The bolt11 invoice to decode'),
    },
    async ({ invoice }) => {
      validateEnv(config);
      const credentials = btoa(`:${config.httpPassword}`);
      const params = new URLSearchParams({
        invoice,
      });

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/decodeinvoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const decodedInvoiceData = await data.json();

      if (decodedInvoiceData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Invoice not decoded',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(decodedInvoiceData, null, 2),
          },
        ],
      };
    },
  );
}
