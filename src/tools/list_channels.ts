import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PhoenixdMcpConfig } from '../types';

export function registerListChannelsTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'list-channels',
    'List the node channels',
    async () => {
      const credentials = btoa(`:${config.httpPassword}`);
      const data = await fetch(`${config.httpHost}:${config.httpPort}/listchannels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const channelsListData = await data.json();

      if (channelsListData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Channels not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(channelsListData, null, 2),
          },
        ],
      };
    },
  );
}
