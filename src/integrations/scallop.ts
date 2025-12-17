/**
 * Scallop Protocol Integration
 * Native SDK integration for Scallop lending markets
 */

import type { YieldOpportunity, FetchError } from '../types/yield';
import { formatTokenSymbol } from './tokenUtils';
import { generateDeepLink } from './deepLinks';
import { createError, formatTvl } from './types';

const STABLECOINS = ['USDC', 'USDT', 'USDY', 'AUSD', 'BUCK'];

/**
 * Fetch Scallop lending markets
 */
export async function fetchScallopYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    // Try Scallop's API endpoint
    const apiYields = await fetchFromScallopApi();
    if (apiYields.length > 0) {
      yields.push(...apiYields);
      console.log(`[Scallop] Fetched ${apiYields.length} markets from API`);
      return { yields, errors };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('Scallop', 'native', `Failed to fetch: ${errorMessage}`));
    console.warn('[Scallop] API fetch failed:', errorMessage);
  }

  return { yields, errors };
}

/**
 * Fetch from Scallop's API
 */
async function fetchFromScallopApi(): Promise<YieldOpportunity[]> {
  const endpoints = [
    'https://api.scallop.io/api/market',
    'https://app.scallop.io/api/markets',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (Array.isArray(data) || data.markets || data.pools)) {
          const markets = Array.isArray(data) ? data : (data.markets || data.pools);
          return transformScallopData(markets);
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return [];
}

/**
 * Transform Scallop API data to YieldOpportunity
 */
function transformScallopData(markets: unknown[]): YieldOpportunity[] {
  return markets
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((market) => {
      const symbol = formatTokenSymbol(String(market.symbol || market.coin || market.asset || 'Unknown'));
      const supplyApy = Number(market.supplyApy || market.depositApy || market.apy || 0);
      const rewardApy = Number(market.rewardApy || market.scaRewardApy || 0);
      const tvl = Number(market.totalSupply || market.tvl || market.supplied || 0);

      return {
        id: `scallop-${symbol.toLowerCase()}`,
        protocol: 'scallop' as const,
        protocolName: 'Scallop',
        asset: String(market.coinType || symbol),
        assetSymbol: symbol,
        type: 'lending' as const,
        apy: supplyApy + rewardApy,
        apyBase: supplyApy,
        apyReward: rewardApy > 0 ? rewardApy : undefined,
        tvl,
        tvlFormatted: formatTvl(tvl),
        chain: 'sui' as const,
        poolAddress: String(market.marketId || market.address || ''),
        rewardTokens: rewardApy > 0 ? ['SCA'] : undefined,
        isStablecoin: STABLECOINS.includes(symbol),
        ilRisk: 'no' as const,
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'scallop',
          symbol,
          assetType: 'lending',
        }),
      };
    });
}

/**
 * Check if Scallop integration is available
 */
export async function isScallopAvailable(): Promise<boolean> {
  try {
    const response = await fetch('https://app.scallop.io/', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
