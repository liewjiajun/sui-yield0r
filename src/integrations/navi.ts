/**
 * NAVI Protocol Integration
 * Native SDK integration for NAVI lending markets
 */

import type { YieldOpportunity, FetchError } from '../types/yield';
import { formatTokenSymbol } from './tokenUtils';
import { generateDeepLink } from './deepLinks';
import { createError, formatTvl } from './types';

const STABLECOINS = ['USDC', 'USDT', 'USDY', 'AUSD', 'BUCK'];

/**
 * Fetch NAVI lending markets
 */
export async function fetchNaviYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    // Try NAVI's API endpoint
    const apiYields = await fetchFromNaviApi();
    if (apiYields.length > 0) {
      yields.push(...apiYields);
      console.log(`[NAVI] Fetched ${apiYields.length} markets from API`);
      return { yields, errors };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('NAVI', 'native', `Failed to fetch: ${errorMessage}`));
    console.warn('[NAVI] API fetch failed:', errorMessage);
  }

  return { yields, errors };
}

/**
 * Fetch from NAVI's API
 */
async function fetchFromNaviApi(): Promise<YieldOpportunity[]> {
  const endpoints = [
    'https://api.naviprotocol.io/api/reserves',
    'https://app.naviprotocol.io/api/reserves',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (Array.isArray(data) || data.reserves)) {
          const reserves = Array.isArray(data) ? data : data.reserves;
          return transformNaviData(reserves);
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return [];
}

/**
 * Transform NAVI API data to YieldOpportunity
 */
function transformNaviData(reserves: unknown[]): YieldOpportunity[] {
  return reserves
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((reserve) => {
      const symbol = formatTokenSymbol(String(reserve.symbol || reserve.asset || 'Unknown'));
      const supplyApy = Number(reserve.supplyApy || reserve.depositApy || reserve.apy || 0);
      const rewardApy = Number(reserve.rewardApy || reserve.incentiveApy || 0);
      const tvl = Number(reserve.totalSupply || reserve.tvl || reserve.totalDeposits || 0);

      return {
        id: `navi-${symbol.toLowerCase()}`,
        protocol: 'navi' as const,
        protocolName: 'NAVI Protocol',
        asset: String(reserve.coinType || symbol),
        assetSymbol: symbol,
        type: 'lending' as const,
        apy: supplyApy + rewardApy,
        apyBase: supplyApy,
        apyReward: rewardApy > 0 ? rewardApy : undefined,
        tvl,
        tvlFormatted: formatTvl(tvl),
        chain: 'sui' as const,
        poolAddress: String(reserve.address || reserve.id || ''),
        rewardTokens: rewardApy > 0 ? ['NAVX'] : undefined,
        isStablecoin: STABLECOINS.includes(symbol),
        ilRisk: 'no' as const,
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'navi',
          symbol,
          assetType: 'lending',
        }),
      };
    });
}

/**
 * Check if NAVI integration is available
 */
export async function isNaviAvailable(): Promise<boolean> {
  try {
    const response = await fetch('https://app.naviprotocol.io/', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
