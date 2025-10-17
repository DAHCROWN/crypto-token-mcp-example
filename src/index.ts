import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getTokenInfo, UITokenInfoRes } from "./token.js";

const USER_AGENT = "token-search-app/1.0";

// Create server instance
const server = new McpServer({
	name: "token-search",
	version: "1.0.0",
	capabilities: {
		resources: {},
		tools: {},
	},
});

// Helper function for making NWS API requests
async function makeDexScreenerRequest(
	tokenAddress: string
): Promise<UITokenInfoRes | null> {
	const headers = {
		"User-Agent": USER_AGENT,
		Accept: "application/geo+json",
	};
	try {
		const response = await getTokenInfo(tokenAddress);
		return response;
	} catch (error) {
		console.error("Error making Dexsceener request:", error);
		return null;
	}
}

// Format token data
function formatAlert(feature: UITokenInfoRes): string {
	const props = feature;
	return [
		`Name: ${props.name || "Unknown"}`,
		`Address: ${props.address || "Unknown"}`,
		`Symbol: ${props.symbol || "Unknown"}`,
		`Price: ${props.price || "Unknown"}`,
		`MarketCap: ${props.marketcap || "No headline"}`,
		"---",
	].join("\n");
}

// Register Token data tool
server.tool(
	"get_token_details",
	"Get current token's price, name, symbol, price, marketcap, and price changes",
	{
		address: z.string().describe("Token Contract Address"),
	},
	async ({ address }) => {
		const tokenData = await makeDexScreenerRequest(address);
		if (!tokenData) {
			return {
				content: [
					{
						type: "text",
						text: "Failed to retrieve token information",
					},
				],
			};
		}

		const features = tokenData;
		const formattedAlerts = formatAlert(features);
		const alertsText = `Token Information for ${address}:\n\n${formattedAlerts}`;

		return {
			content: [
				{
					type: "text",
					text: alertsText,
				},
			],
		};
	}
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Crypto MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
