import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

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
      const credentials = btoa(`:${config.httpPassword}`);

      const paramsObj: Record<string, string> = {
        from: '0',
        to: Date.now().toString(),
        limit: '20',
        offset: '0',
        all: 'false',
        externalId: '',
      };

      if (from !== undefined) paramsObj.from = from.toString();
      if (to !== undefined) paramsObj.to = to.toString();
      if (limit !== undefined) paramsObj.limit = limit.toString();
      if (offset !== undefined) paramsObj.offset = offset.toString();
      if (all !== undefined) paramsObj.all = all ? 'true' : 'false';
      if (externalId !== undefined) paramsObj.externalId = externalId;

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/payments/incoming?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      const listIncomingPaymentsData = await data.json();

      if (listIncomingPaymentsData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Incoming payments not found',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(listIncomingPaymentsData, null, 2),
          },
        ],
      };
    },
  );
}
