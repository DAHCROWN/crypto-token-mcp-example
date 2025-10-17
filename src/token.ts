import axios, { AxiosResponse } from "axios";
import { formatNumber } from "./utils.js";

export async function getTokenInfo(
	address: string
): Promise<UITokenInfoRes | null> {
	try {
		const res = await queryDexScreener(address);
		// console.log("Query Res:", res);
		if (!res.data) {
			// console.log("No data");
			return null;
		}
		// Fix: res.data is a Pair, not an array. Use res.data directly.
		const dexRes = res.data[0];
		// console.log("desx", dexRes);
		const tokenInfo: UITokenInfoRes = {
			address: dexRes.baseToken.address,
			name: dexRes.baseToken.name,
			symbol: dexRes.baseToken.symbol,
			price: dexRes.priceUsd as string,
			m5: dexRes.priceChange.m5,
			h1: dexRes.priceChange.h1,
			h6: dexRes.priceChange.h6,
			h24: dexRes.priceChange.h24,
			marketcap: formatNumber(dexRes.marketCap as number),
			priceInCurrency: dexRes.priceNative,
			marketcapRaw: dexRes.fdv as number,
		};
		return tokenInfo;
	} catch (error) {
		console.error("Error getting token info:", error);
		return null;
	}
}

export async function queryDexScreener(
	tokenAddress: string
): Promise<QueryDexScreenerRes> {
	try {
		const res: AxiosResponse<Pair[]> = await axios.get(
			`https://api.dexscreener.io/tokens/v1/solana/${tokenAddress}`
		);
		const tokenMetaData = res.data;
		// console.log("data: ", tokenMetaData);
		if (tokenMetaData) {
			return {
				isToken: true,
				data: [tokenMetaData[0] as unknown as Pair],
				address: tokenAddress,
			};
		} else {
			return {
				isToken: false,
				data: null,
				address: tokenAddress,
			};
		}
	} catch (error) {
		console.error("Error querying DexScreener:", error);
		return {
			isToken: false,
			data: null,
			address: tokenAddress,
		};
	}
}

export interface UITokenInfoRes {
	address: string;
	symbol: string;
	name: string;
	price: string;
	m5: number;
	h1: number;
	h6: number;
	h24: number;
	marketcap: string;
	priceInCurrency: string;
	marketcapRaw: number;
}

export interface Pair {
	chainId: string;
	dexId: string;
	url: string;
	pairAddress: string;
	baseToken: {
		address: string;
		name: string;
		symbol: string;
	};
	quoteToken: {
		symbol: string;
	};
	priceNative: string;
	priceUsd?: string;
	txns: {
		m5: {
			buys: number;
			sells: number;
		};
		h1: {
			buys: number;
			sells: number;
		};
		h6: {
			buys: number;
			sells: number;
		};
		h24: {
			buys: number;
			sells: number;
		};
	};
	volume: {
		m5: number;
		h1: number;
		h6: number;
		h24: number;
	};
	priceChange: {
		m5: number;
		h1: number;
		h6: number;
		h24: number;
	};
	liquidity?: {
		usd?: number;
		base: number;
		quote: number;
	};
	fdv?: number;
	marketCap: number | null;
	pairCreatedAt?: number;
}
export interface DSTokensResponse {
	schemaVersion: string;
	pairs: Pair[] | null;
}
export interface QueryDexScreenerRes {
	isToken: boolean;
	data: Pair[] | null;
	address: string;
}
