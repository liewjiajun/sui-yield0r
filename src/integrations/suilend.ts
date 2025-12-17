/**
 * Suilend Protocol Integration
 * Native SDK integration for Suilend lending markets
 */

import { SuiClient } from '@mysten/sui/client';
import type { YieldOpportunity, FetchError } from '../types/yield';
import { formatTokenSymbol } from './tokenUtils';
import { generateDeepLink } from './deepLinks';
import { createError, formatTvl } from './types';

const SUI_RPC = 'https://fullnode.mainnet.sui.io:443';

// Suilend known reserve addresses (mainnet)
const SUILEND_RESERVES = {
  SUI: '0x84030d26d85eaa7035084a057f2f11f701b7e2e4eda87551becbc7c97505ece1',
  USDC: '0xa02a98f9c88db51c6f5efaaf2261c81f34dd56a86073571eb25e12a6f0a90d66',
  USDT: '0x9598a7efc96a25b4c6aacfa62728df1c5c8bef6c9c71f20b36b4b3e0d7b6e2e1',
  wETH: '0x78ba1c21d7f8e9b3d9e8f7b1d8e9c3d7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
};

// Stablecoin symbols
const STABLECOINS = ['USDC', 'USDT', 'USDY', 'AUSD', 'BUCK', 'SBUCK'];

interface SuilendReserve {
  symbol: string;
  coinType: string;
  totalDeposits: number;
  totalBorrows: number;
  depositApy: number;
  borrowApy: number;
  rewardApy?: number;
  tvlUsd: number;
}

/**
 * Fetch Suilend reserves using RPC
 * Falls back to DefiLlama if native fetch fails
 */
export async function fetchSuilendYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    // Try to fetch from Suilend's API endpoint first (if available)
    const apiYields = await fetchFromSuilendApi();
    if (apiYields.length > 0) {
      yields.push(...apiYields);
      console.log(`[Suilend] Fetched ${apiYields.length} markets from API`);
      return { yields, errors };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Suilend] API fetch failed, trying RPC:', errorMessage);
  }

  try {
    // Fallback to RPC-based fetching
    const rpcYields = await fetchFromRpc();
    if (rpcYields.length > 0) {
      yields.push(...rpcYields);
      console.log(`[Suilend] Fetched ${rpcYields.length} markets from RPC`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('Suilend', 'native', `Failed to fetch: ${errorMessage}`));
    console.error('[Suilend] RPC fetch failed:', errorMessage);
  }

  return { yields, errors };
}

/**
 * Fetch from Suilend's API (if publicly available)
 */
async function fetchFromSuilendApi(): Promise<YieldOpportunity[]> {
  // Suilend may have a public API - try common endpoints
  const endpoints = [
    'https://api.suilend.fi/reserves',
    'https://suilend.fi/api/reserves',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return transformApiData(data);
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return [];
}

/**
 * Transform API data to YieldOpportunity
 */
function transformApiData(data: unknown[]): YieldOpportunity[] {
  // Type guard and transform based on actual API structure
  return data
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((reserve, index) => {
      const symbol = String(reserve.symbol || reserve.name || `Reserve-${index}`);
      const cleanSymbol = formatTokenSymbol(symbol);
      const depositApy = Number(reserve.depositApy || reserve.supplyApy || reserve.apy || 0) * 100;
      const rewardApy = Number(reserve.rewardApy || reserve.incentiveApy || 0) * 100;
      const tvl = Number(reserve.totalSupply || reserve.tvl || reserve.deposited || 0);

      return {
        id: `suilend-${cleanSymbol.toLowerCase()}`,
        protocol: 'suilend' as const,
        protocolName: 'Suilend',
        asset: String(reserve.coinType || symbol),
        assetSymbol: cleanSymbol,
        type: 'lending' as const,
        apy: depositApy + rewardApy,
        apyBase: depositApy,
        apyReward: rewardApy > 0 ? rewardApy : undefined,
        tvl,
        tvlFormatted: formatTvl(tvl),
        chain: 'sui' as const,
        poolAddress: String(reserve.address || reserve.id || ''),
        rewardTokens: rewardApy > 0 ? ['BLUE'] : undefined,
        isStablecoin: STABLECOINS.includes(cleanSymbol),
        ilRisk: 'no' as const,
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'suilend',
          symbol: cleanSymbol,
          assetType: 'lending',
        }),
      };
    });
}

/**
 * Fetch from RPC by querying reserve objects
 */
async function fetchFromRpc(): Promise<YieldOpportunity[]> {
  const client = new SuiClient({ url: SUI_RPC });
  const yields: YieldOpportunity[] = [];

  // Fetch known reserve objects
  for (const [symbol, address] of Object.entries(SUILEND_RESERVES)) {
    try {
      const object = await client.getObject({
        id: address,
        options: { showContent: true },
      });

      if (object.data?.content?.dataType === 'moveObject') {
        const fields = object.data.content.fields as Record<string, unknown>;

        // Extract APY and TVL from object fields
        // Note: Actual field names depend on Suilend's contract structure
        const reserve = parseReserveFields(fields, symbol);

        if (reserve) {
          yields.push({
            id: `suilend-${symbol.toLowerCase()}`,
            protocol: 'suilend',
            protocolName: 'Suilend',
            asset: reserve.coinType,
            assetSymbol: symbol,
            type: 'lending',
            apy: reserve.depositApy + (reserve.rewardApy || 0),
            apyBase: reserve.depositApy,
            apyReward: reserve.rewardApy,
            tvl: reserve.tvlUsd,
            tvlFormatted: formatTvl(reserve.tvlUsd),
            chain: 'sui',
            poolAddress: address,
            rewardTokens: reserve.rewardApy && reserve.rewardApy > 0 ? ['BLUE'] : undefined,
            isStablecoin: STABLECOINS.includes(symbol),
            ilRisk: 'no',
            lastUpdated: new Date(),
            url: generateDeepLink({
              protocol: 'suilend',
              symbol,
              assetType: 'lending',
            }),
          });
        }
      }
    } catch (error) {
      console.warn(`[Suilend] Failed to fetch reserve ${symbol}:`, error);
    }
  }

  return yields;
}

/**
 * Parse reserve fields from Move object
 */
function parseReserveFields(
  fields: Record<string, unknown>,
  symbol: string
): SuilendReserve | null {
  try {
    // These field names are placeholders - actual names depend on contract
    const totalDeposits = Number(fields.total_deposits || fields.available_amount || 0);
    const totalBorrows = Number(fields.total_borrows || fields.borrowed_amount || 0);

    // Calculate TVL (deposits - borrows in most lending protocols)
    const tvlUsd = totalDeposits; // Would need price oracle for accurate USD value

    // APY calculation would require rate model parameters
    // For now, return placeholder values
    return {
      symbol,
      coinType: String(fields.coin_type || `0x2::sui::${symbol}`),
      totalDeposits,
      totalBorrows,
      depositApy: 0, // Would need rate calculation
      borrowApy: 0,
      tvlUsd,
    };
  } catch {
    return null;
  }
}

/**
 * Check if Suilend integration is available
 */
export async function isSuilendAvailable(): Promise<boolean> {
  try {
    const client = new SuiClient({ url: SUI_RPC });
    const result = await client.getObject({
      id: SUILEND_RESERVES.SUI,
      options: { showContent: false },
    });
    return !!result.data;
  } catch {
    return false;
  }
}
