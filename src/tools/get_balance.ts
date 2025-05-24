import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PhoenixdMcpConfig } from '../types';
import { validateEnv } from '../utils/validate_env.js';

export function registerGetBalanceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-balance',
    'Get the balance of the node',
    async () => {
      validateEnv(config);
      const credentials = btoa(`:${config.httpPassword}`);
      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/getbalance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const balanceData = await data.json();

      if (balanceData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Balance not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(balanceData, null, 2),
          },
        ],
      };
    },
  );
}
