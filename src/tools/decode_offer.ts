import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

export function registerDecodeOfferTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'decode-offer',
    'Decode an bolt12 offer the output amount is in milisatoshis',
    {
      offer: z.string().describe('The bolt12 offer to decode'),
    },
    async ({ offer }) => {
      validateEnv(config);
      const credentials = btoa(`:${config.httpPassword}`);
      const params = new URLSearchParams({
        offer,
      });

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/decodeoffer`, {
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
              text: 'Offer not decoded',
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
