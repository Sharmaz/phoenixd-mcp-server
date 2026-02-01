import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerGetIncomingPaymentTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-incoming-payment',
    'Get the incoming payment by payment hash',
    {
      paymentHash: z.string().describe('payment hash of the incoming payment'),
    },
    async ({ paymentHash }) => {
      validateEnv(config);

      const result = await fetchPhoenixd(config, `/payments/incoming/${paymentHash}`, {
        method: 'GET',
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
