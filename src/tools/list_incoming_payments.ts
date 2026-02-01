import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types/index.js';
import { validateEnv } from '../utils/validate_env.js';
import { fetchPhoenixd, formatToolResponse, formatToolError } from '../utils/fetch_phoenixd.js';

export function registerListIncomingPaymentsTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'list-incoming-payments',
    'List the incoming payments',
    {
      from: z.string().optional().describe('start timestamp in millis from epoch, default 0'),
      to: z.string().optional().describe('end timestamp in millis from epoch, default now'),
      limit: z.number().optional().describe('number of payments in the page, default 20'),
      offset: z.number().optional().describe('page offset, default 0'),
      all: z.boolean().optional().describe('also return unpaid invoices'),
      externalId: z.string().optional().describe('external id of the bolt11 invoice'),
    },
    async ({ from, to, limit, offset, all, externalId }) => {
      validateEnv(config);

      const paramsObj: Record<string, string> = {
        from: from ?? '0',
        to: to ?? Date.now().toString(),
        limit: limit?.toString() ?? '20',
        offset: offset?.toString() ?? '0',
        all: all ? 'true' : 'false',
      };
      if (externalId !== undefined) paramsObj.externalId = externalId;

      const params = new URLSearchParams(paramsObj);

      const result = await fetchPhoenixd(config, `/payments/incoming?${params.toString()}`, {
        method: 'GET',
      });

      if (!result.ok) {
        return formatToolError(result.error);
      }

      return formatToolResponse(result.data);
    },
  );
}
