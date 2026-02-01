import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

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

      const params = new URLSearchParams({
        amountSat: amountSat.toString(),
        address,
        feerateSatByte: feerateSatByte.toString(),
      });

      const result = await fetchPhoenixd(config, '/sendtoaddress', {
        method: 'POST',
        body: params,
        responseType: 'text',
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
