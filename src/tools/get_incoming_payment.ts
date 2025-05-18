import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerGetIncomingPaymentTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-incoming-payment',
    'Get the incoming payment by payment hash',
    {
      paymentHash: z.string().describe('payment hash of the incoming payment'),
    },
    async ({ paymentHash }) => {
      const credentials = btoa(`:${config.httpPassword}`);

      const data = await fetch(`${config.httpHost}:${config.httpPort}/payments/incoming/${paymentHash}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const getIncomingPaymentData = await data.json();

      if (getIncomingPaymentData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Incoming payment not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(getIncomingPaymentData, null, 2),
          },
        ],
      };
    },
  );
}
