import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerListOutgoingPaymentsTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'list-outgoing-payments',
    'List the outgoing payments',
    {
      from: z.string().optional().describe('start timestamp in millis from epoch, default 0'),
      to: z.string().optional().describe('end timestamp in millis from epoch, default now'),
      limit: z.number().optional().describe('number of payments in the page, default 20'),
      offset: z.number().optional().describe('page offset, default 0'),
      all: z.boolean().optional().describe('also return payments that have failed'),
    },
    async ({ from, to, limit, offset, all }) => {
      const credentials = btoa(`:${config.httpPassword}`);

      const paramsObj: Record<string, string> = {
        from: '0',
        to: Date.now().toString(),
        limit: '20',
        offset: '0',
        all: 'false',
      };

      if (from !== undefined) paramsObj.from = from.toString();
      if (to !== undefined) paramsObj.to = to.toString();
      if (limit !== undefined) paramsObj.limit = limit.toString();
      if (offset !== undefined) paramsObj.offset = offset.toString();
      if (all !== undefined) paramsObj.all = all ? 'true' : 'false';

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpHost}:${config.httpPort}/payments/outgoing?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const listOutgoingPaymentsData = await data.json();

      if (listOutgoingPaymentsData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Outgoing payments not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(listOutgoingPaymentsData, null, 2),
          },
        ],
      };
    },
  );
}
