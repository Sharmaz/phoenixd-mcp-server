import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerGetOutgoingPaymentTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-outgoing-payment',
    'Get the outgoing payment by payment id',
    {
      paymentId: z.string().describe('payment hash of the outgoing payment'),
    },
    async ({ paymentId }) => {
      const credentials = btoa(`:${config.httpPassword}`);

      const data = await fetch(`${config.httpHost}:${config.httpPort}/payments/outgoing/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const getOutgoingPaymentData = await data.json();

      if (getOutgoingPaymentData.length === 0) {
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
            text: JSON.stringify(getOutgoingPaymentData, null, 2),
          },
        ],
      };
    },
  );
}
