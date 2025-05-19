import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PhoenixdMcpConfig } from '../types';

export function registerGetNodeInfoTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-node-info',
    'Get the node info',
    async () => {
      const credentials = btoa(`:${config.httpPassword}`);
      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/getinfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const nodeInfoData = await data.json();

      if (nodeInfoData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Node info not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(nodeInfoData, null, 2),
          },
        ],
      };
    },
  );
}
