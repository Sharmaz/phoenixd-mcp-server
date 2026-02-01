import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerCloseChannelTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'close-channel',
    'Close a channel by ID, sending the funds to a specified address on chain, with a specified fee rate',
    {
      channelId: z.string().describe('The ID of the channel to close'),
      address: z.string().describe('The Bitcoin on chain address to send the funds to'),
      feerateSatByte: z.number().describe('The fee rate in satoshis per byte'),
    },
    async ({ channelId, address, feerateSatByte }) => {
      validateEnv(config);

      const params = new URLSearchParams({
        channelId,
        address,
        feerateSatByte: feerateSatByte.toString(),
      });

      const result = await fetchPhoenixd(config, '/closechannel', {
        method: 'POST',
        body: params,
        responseType: 'text',
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
