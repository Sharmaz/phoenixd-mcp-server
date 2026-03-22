import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerPayOfferTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'pay-offer',
    'Pay a bolt12 offer',
    {
      offer: z.string().describe('The bolt12 offer to pay.'),
      amountSat: z.number().optional()
        .describe('The amount in satoshi. If unset, will pay the amount requested in the offer. Mutually exclusive with sendAll.'),
      sendAll: z.boolean().optional().describe('If true, empties the wallet. Mutually exclusive with amountSat.'),
      message: z.string().optional().describe('A message for the recipient.'),
    },
    async ({ amountSat, offer, message, sendAll }) => {
      validateEnv(config);

      const paramsObj: Record<string, string> = { offer };
      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();
      if (sendAll !== undefined) paramsObj.sendAll = sendAll.toString();
      if (message !== undefined) paramsObj.message = message;

      const result = await fetchPhoenixd(config, '/payoffer', {
        method: 'POST',
        body: new URLSearchParams(paramsObj),
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
