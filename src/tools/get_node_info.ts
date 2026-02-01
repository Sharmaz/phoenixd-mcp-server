import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerGetNodeInfoTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-node-info',
    'Get the node info',
    async () => {
      validateEnv(config);

      const result = await fetchPhoenixd(config, '/getinfo', { method: 'GET' });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
