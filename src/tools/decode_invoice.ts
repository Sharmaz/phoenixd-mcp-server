import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerDecodeInvoiceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'decode-invoice',
    'Decode an bolt11 invoice, the output amount is in milisatoshis',
    {
      invoice: z.string().describe('The bolt11 invoice to decode'),
    },
    async ({ invoice }) => {
      validateEnv(config);

      const params = new URLSearchParams({ invoice });

      const result = await fetchPhoenixd(config, '/decodeinvoice', {
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
