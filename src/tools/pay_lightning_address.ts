import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerPayLightningAddressTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'pay-lightning-address',
    'Pays an email-like Lightning address, either based on BIP-353 or LNURL',
    {
      address: z.string().describe('The Lightning address to pay.'),
      amountSat: z.number().optional()
        .describe('The amount in satoshi. If unset, will pay the amount requested. Mutually exclusive with sendAll.'),
      sendAll: z.boolean().optional().describe('If true, empties the wallet. Mutually exclusive with amountSat.'),
      message: z.string().optional().describe('A message for the recipient.'),
    },
    async ({ amountSat, address, message, sendAll }) => {
      validateEnv(config);

      const paramsObj: Record<string, string> = { address };
      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();
      if (sendAll !== undefined) paramsObj.sendAll = sendAll.toString();
      if (message !== undefined) paramsObj.message = message;

      const result = await fetchPhoenixd(config, '/paylnaddress', {
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
