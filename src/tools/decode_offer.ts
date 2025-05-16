import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerDecodeOfferTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'decode-offer',
    'Decode an offer using phoenixd API',
    {
      offer: z.string().describe('The offer to decode'),
    },
    async ({ offer }) => {
      const credentials = btoa(`:${config.httpPassword}`);
      const params = new URLSearchParams({
        offer,
      });

      const data = await fetch(`${config.httpHost}:${config.httpPort}/decodeoffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const decodedOfferData = await data.json();

      if (decodedOfferData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Offer not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(decodedOfferData, null, 2),
          },
        ],
      };
    },
  );
}
