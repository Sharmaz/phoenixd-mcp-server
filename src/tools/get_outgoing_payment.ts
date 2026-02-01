import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerGetOutgoingPaymentTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-outgoing-payment',
    'Get the outgoing payment by payment id',
    {
      paymentId: z.string().describe('payment hash of the outgoing payment'),
    },
    async ({ paymentId }) => {
      validateEnv(config);

      const result = await fetchPhoenixd(config, `/payments/outgoing/${paymentId}`, {
        method: 'GET',
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
