import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerPayOfferTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'pay-offer',
    'Pay a bolt12 offer',
    {
      amountSat: z.number().optional().describe('The amount in satoshi. If unset, will pay the amount requested in the offer.'),
      offer: z.string().describe('The bolt12 offer to pay.'),
      message: z.string().optional().describe('A message for the recipient.'),
    },
    async ({ amountSat, offer, message }) => {
      const credentials = btoa(`:${config.httpPassword}`);
      const paramsObj: Record<string, string> = {
        offer,
      };

      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();
      if (message !== undefined) paramsObj.message = message;

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpHost}:${config.httpPort}/payoffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const payOfferData = await data.json();

      if (payOfferData.length === 0) {
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
            text: JSON.stringify(payOfferData, null, 2),
          },
        ],
      };
    },
  );
}
