import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

export function registerCreateOfferTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'create-offer',
    'Create a bolt12 offer with an optional description and amount',
    {
      description: z.string().optional().describe('The description of the offer (max. 128 characters).'),
      amountSat: z.number().optional().describe('The amount requested by the offer, in satoshi. If not set, the offer can be paid by any amount'),
    },
    async ({ description, amountSat }) => {
      validateEnv(config);
      const credentials = btoa(`:${config.httpPassword}`);
      const paramsObj: Record<string, string> = {};

      if (description !== undefined) paramsObj.description = description;
      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/createoffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const createOfferData = await data.text();

      if (createOfferData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Offer not created',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: createOfferData,
          },
        ],
      };
    },
  );
}
