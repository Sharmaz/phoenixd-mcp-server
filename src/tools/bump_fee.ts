import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

export function registerBumpFeeTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'bump-fee',
    'Makes all your unconfirmed transactions use a higher fee rate, using CPFP. Returns the ID of the child transaction',
    {
      feerateSatByte: z.number().describe('The fee rate in satoshis per byte'),
    },
    async ({ feerateSatByte }) => {
      validateEnv(config);
      const credentials = btoa(`:${config.httpPassword}`);
      const params = new URLSearchParams({
        feerateSatByte: feerateSatByte.toString(),
      });

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/bumpfee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const bumpFeeData = await data.text();

      if (bumpFeeData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Bump fee failed',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: bumpFeeData,
          },
        ],
      };
    },
  );
}
