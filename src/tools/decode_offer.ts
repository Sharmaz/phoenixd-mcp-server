import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerDecodeOfferTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'decode-offer',
    'Decode an bolt12 offer the output amount is in milisatoshis',
    {
      offer: z.string().describe('The bolt12 offer to decode'),
    },
    async ({ offer }) => {
      validateEnv(config);

      const params = new URLSearchParams({ offer });

      const result = await fetchPhoenixd(config, '/decodeoffer', {
        method: 'POST',
        body: params,
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
