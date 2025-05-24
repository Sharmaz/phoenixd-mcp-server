import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

export function registerPayOnChainTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'pay-on-chain',
    'Pay an on-chain address with a specified amount and fee rate',
    {
      amountSat: z.number().describe('The amount in satoshi'),
      address: z.string().describe('The Bitcoin on chain address to send the funds to'),
      feerateSatByte: z.number().describe('The fee rate in satoshis per byte'),
    },
    async ({ amountSat, address, feerateSatByte }) => {
      validateEnv(config);
      const credentials = btoa(`:${config.httpPassword}`);
      const params = new URLSearchParams({
        amountSat: amountSat.toString(),
        address,
        feerateSatByte: feerateSatByte.toString(),
      });

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/sendtoaddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const payOnChainData = await data.text();

      if (payOnChainData.length === 0) {
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
            text: payOnChainData,
          },
        ],
      };
    },
  );
}
