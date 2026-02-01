import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerGetBalanceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-balance',
    'Get the balance of the node',
    async () => {
      validateEnv(config);

      const result = await fetchPhoenixd(config, '/getbalance', { method: 'GET' });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
