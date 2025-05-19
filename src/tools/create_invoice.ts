import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

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
      const credentials = btoa(`:${config.httpPassword}`);
      const paramsObj: Record<string, string> = {
        description,
      };

      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();
      if (expirySeconds !== undefined) paramsObj.expirySeconds = expirySeconds.toString();
      if (externalId !== undefined) paramsObj.externalId = externalId;
      if (webhookUrl !== undefined) paramsObj.webhookUrl = webhookUrl;

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/createinvoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const createInvoiceData = await data.json();

      if (createInvoiceData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Invoice not created',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(createInvoiceData, null, 2),
          },
        ],
      };
    },
  );
}
