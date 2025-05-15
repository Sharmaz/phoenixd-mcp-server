import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerGetBalanceTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'get-balance',
    'Get the balance of the wallet using phoenixd API',
    {
      balance: z.string().describe('Get phoenixd balance'),
    },
    async () => {
      const credentials = btoa(`:${config.httpPassword}`); // 
      const data = await fetch(`${config.httpHost}:${config.httpPort}/getbalance`, {
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
