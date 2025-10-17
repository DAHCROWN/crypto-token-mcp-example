import { getTokenInfo, UITokenInfoRes } from "./token.js";

async function mainTest(_address: string) {
	const res = makeDexScreenerRequest(_address);
}

async function makeDexScreenerRequest(
	tokenAddress: string
): Promise<UITokenInfoRes | null> {
	const USER_AGENT = "crypto-server-app/1.0";
	const headers = {
		"User-Agent": USER_AGENT,
		Accept: "application/geo+json",
	};
	try {
		const response = await getTokenInfo(tokenAddress);
		console.log(response);
		return response;
	} catch (error) {
		console.error("Error making Dexsceener request:", error);
		return null;
	}
}
//sample token
mainTest("7H6JKC6KwLBhCHLSKVn5DAhUj7nDQLJKgqCPkkzDpLa4").catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
