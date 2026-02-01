import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

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

      const paramsObj: Record<string, string> = {};
      if (description !== undefined) paramsObj.description = description;
      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();

      const result = await fetchPhoenixd(config, '/createoffer', {
        method: 'POST',
        body: new URLSearchParams(paramsObj),
        responseType: 'text',
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
