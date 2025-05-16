import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerCloseChannelTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'close-channel',
    'Close a channel using phoenixd API',
    {
      channelId: z.string().describe('The ID of the channel to close'),
      address: z.string().describe('The address to send the funds to'),
      feerateSatByte: z.number().describe('The fee rate in satoshis per byte'),
    },
    async ({ channelId, address, feerateSatByte }) => {
      const credentials = btoa(`:${config.httpPassword}`);
      const params = new URLSearchParams({
        channelId,
        address,
        feerateSatByte: feerateSatByte.toString(),
      });

      const data = await fetch(`${config.httpHost}:${config.httpPort}/closechannel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const closeChannelData = await data.text();

      if (closeChannelData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Channel not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: closeChannelData,
          },
        ],
      };
    },
  );
}
