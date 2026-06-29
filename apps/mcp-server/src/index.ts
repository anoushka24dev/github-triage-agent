import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "github-triage-mcp-server",
  version: "0.1.0",
});

const transport = new StdioServerTransport();

await server.connect(transport);

console.error("GitHub Incident Triage MCP server is running on stdio.");
