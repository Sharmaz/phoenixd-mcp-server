import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PhoenixdMcpConfig } from '../types';

export function registerPayLightningAddressTool(
  server: McpServer,
  config: PhoenixdMcpConfig,
) {
  server.tool(
    'pay-lightning-address',
    'Pays an email-like Lightning address, either based on BIP-353 or LNURL',
    {
      amountSat: z.number().optional().describe('The amount in satoshi. If unset, will pay the amount requested in the offer.'),
      address: z.string().describe('The Lightning address to pay.'),
      message: z.string().optional().describe('A message for the recipient.'),
    },
    async ({ amountSat, address, message }) => {
      const credentials = btoa(`:${config.httpPassword}`);
      const paramsObj: Record<string, string> = {
        address,
      };

      if (amountSat !== undefined) paramsObj.amountSat = amountSat.toString();
      if (message !== undefined) paramsObj.message = message;

      const params = new URLSearchParams(paramsObj);

      const data = await fetch(`${config.httpProtocol}://${config.httpHost}:${config.httpPort}/paylnaddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
        body: params.toString(),
      });

      const payLightningAddressData = await data.json();

      if (payLightningAddressData.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Payment failed',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payLightningAddressData, null, 2),
          },
        ],
      };
    },
  );
}
