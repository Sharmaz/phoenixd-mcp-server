import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "phoenixd-mcp-server",
  version: "1.0.0",
});

if (!process.env.HTTP_PASSWORD || !process.env.HTTP_PORT || !process.env.HTTP_HOST) {
  console.error('HTTP_PASSWORD, HTTP_PORT, and HTTP_HOST are required but not set in the environment variables.');
  process.exit(1);
}

const config = {
  httpPassword: process.env.HTTP_PASSWORD,
  httpPort: process.env.HTTP_PORT,
  httpHost: process.env.HTTP_HOST,
};

server.tool(
  'get-balance',
  'Get the balance of the wallet using phoenixd API',
  {
    balance: z.string().describe("Get phoenixd balance"),
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
            type: "text",
            text: `Balance not found`
          }
        ]
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(balanceData, null, 2)
        }
      ]
    }
  }
);


const transport = new StdioServerTransport();
await server.connect(transport);
