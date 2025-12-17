/**
 * Turbos Finance Integration
 * Native SDK integration for Turbos CLMM pools
 */

import { Network, TurbosSdk } from 'turbos-clmm-sdk';
import type { YieldOpportunity, FetchError } from '../types/yield';
import { parseLPSymbol } from './tokenUtils';
import { generateDeepLink } from './deepLinks';
import { createError, formatTvl } from './types';

const STABLECOINS = ['USDC', 'USDT', 'USDY', 'AUSD', 'BUCK'];

/**
 * Fetch Turbos CLMM pools
 */
export async function fetchTurbosYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    // Initialize Turbos SDK
    const sdk = new TurbosSdk(Network.mainnet);

    // Get contract config
    const config = await sdk.contract.getConfig();

    if (config) {
      console.log('[Turbos] SDK initialized successfully');
      // SDK doesn't provide direct pool listing, try API
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Turbos] SDK init failed:', errorMessage);
  }

  // Fetch from API
  try {
    const apiYields = await fetchFromTurbosApi();
    if (apiYields.length > 0) {
      yields.push(...apiYields);
      console.log(`[Turbos] Fetched ${apiYields.length} pools from API`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('Turbos', 'native', `Failed to fetch: ${errorMessage}`));
  }

  return { yields, errors };
}

/**
 * Fetch from Turbos API
 */
async function fetchFromTurbosApi(): Promise<YieldOpportunity[]> {
  const endpoints = [
    'https://api.turbos.finance/pools',
    'https://app.turbos.finance/api/pools',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        const pools = Array.isArray(data) ? data : (data.pools || data.data);

        if (Array.isArray(pools)) {
          return transformTurbosData(pools);
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return [];
}

/**
 * Transform Turbos API data
 */
function transformTurbosData(pools: unknown[]): YieldOpportunity[] {
  return pools
    .filter((pool): pool is Record<string, unknown> => typeof pool === 'object' && pool !== null)
    .slice(0, 50)
    .map((pool) => {
      const symbol = String(pool.symbol || pool.name || 'Unknown');
      const lpPair = parseLPSymbol(symbol);
      const symbolA = lpPair?.token0 || symbol.split('-')[0] || 'Unknown';
      const symbolB = lpPair?.token1 || symbol.split('-')[1] || 'Unknown';

      const tvl = Number(pool.tvl || pool.tvlUsd || 0);
      const apr = Number(pool.apr || pool.apy || 0);
      const poolId = String(pool.pool_id || pool.poolId || pool.id || '');

      const isStable = STABLECOINS.includes(symbolA) || STABLECOINS.includes(symbolB);

      return {
        id: `turbos-${poolId.slice(-8) || symbol}`,
        protocol: 'turbos' as const,
        protocolName: 'Turbos',
        asset: symbol,
        assetSymbol: symbol,
        type: 'lp' as const,
        apy: apr,
        apyBase: apr,
        tvl,
        tvlFormatted: formatTvl(tvl),
        chain: 'sui' as const,
        poolAddress: poolId,
        poolId,
        rewardTokens: ['TURBOS'],
        isStablecoin: isStable,
        ilRisk: isStable ? 'no' as const : 'yes' as const,
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'turbos',
          symbol,
          assetType: 'lp',
          poolId,
        }),
      };
    })
    .filter((y) => y.tvl > 0);
}

/**
 * Check if Turbos integration is available
 */
export async function isTurbosAvailable(): Promise<boolean> {
  try {
    const sdk = new TurbosSdk(Network.mainnet);
    return !!sdk;
  } catch {
    return false;
  }
}
