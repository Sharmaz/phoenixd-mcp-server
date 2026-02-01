import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

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

      const params = new URLSearchParams({
        feerateSatByte: feerateSatByte.toString(),
      });

      const result = await fetchPhoenixd(config, '/bumpfee', {
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
