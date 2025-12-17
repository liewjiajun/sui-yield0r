/**
 * Cetus Protocol Integration
 * Native SDK integration for Cetus CLMM pools
 */

import { initCetusSDK } from '@cetusprotocol/cetus-sui-clmm-sdk';
import type { YieldOpportunity, FetchError } from '../types/yield';
import { formatTokenSymbol, parseLPSymbol } from './tokenUtils';
import { generateDeepLink } from './deepLinks';
import { createError, formatTvl } from './types';

const STABLECOINS = ['USDC', 'USDT', 'USDY', 'AUSD', 'BUCK'];

/**
 * Fetch Cetus CLMM pools
 */
export async function fetchCetusYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    // Initialize Cetus SDK
    const sdk = initCetusSDK({ network: 'mainnet' });

    // Try to fetch pools from SDK
    const poolsResult = await sdk.Pool.getPoolsWithPage([]);
    const pools = Array.isArray(poolsResult) ? poolsResult : (poolsResult as { data?: unknown[] })?.data;

    if (pools && Array.isArray(pools)) {
      const transformedYields = await transformCetusPools(pools);
      yields.push(...transformedYields);
      console.log(`[Cetus] Fetched ${yields.length} pools from SDK`);
      return { yields, errors };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Cetus] SDK fetch failed, trying API:', errorMessage);
  }

  // Fallback to API
  try {
    const apiYields = await fetchFromCetusApi();
    if (apiYields.length > 0) {
      yields.push(...apiYields);
      console.log(`[Cetus] Fetched ${apiYields.length} pools from API`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('Cetus', 'native', `Failed to fetch: ${errorMessage}`));
  }

  return { yields, errors };
}

/**
 * Transform Cetus SDK pool data
 */
async function transformCetusPools(pools: unknown[]): Promise<YieldOpportunity[]> {
  return pools
    .filter((pool): pool is Record<string, unknown> => typeof pool === 'object' && pool !== null)
    .slice(0, 50) // Limit to top 50 pools
    .map((pool) => {
      const coinTypeA = String(pool.coinTypeA || '');
      const coinTypeB = String(pool.coinTypeB || '');
      const symbolA = formatTokenSymbol(coinTypeA);
      const symbolB = formatTokenSymbol(coinTypeB);
      const symbol = `${symbolA}-${symbolB}`;

      const tvl = Number(pool.tvl_in_usd || pool.tvlUsd || 0);
      const apr = Number(pool.apr || pool.apy || 0);
      const poolAddress = String(pool.poolAddress || pool.pool_address || pool.id || '');

      // Check if it's a stablecoin pair
      const isStable = STABLECOINS.includes(symbolA) || STABLECOINS.includes(symbolB);

      return {
        id: `cetus-${poolAddress.slice(-8)}`,
        protocol: 'cetus' as const,
        protocolName: 'Cetus',
        asset: `${coinTypeA}/${coinTypeB}`,
        assetSymbol: symbol,
        type: 'lp' as const,
        apy: apr,
        apyBase: apr,
        tvl,
        tvlFormatted: formatTvl(tvl),
        chain: 'sui' as const,
        poolAddress,
        underlyingTokens: [coinTypeA, coinTypeB],
        rewardTokens: ['CETUS'],
        isStablecoin: isStable,
        ilRisk: isStable ? 'no' as const : 'yes' as const,
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'cetus',
          symbol,
          assetType: 'lp',
          poolAddress,
        }),
      };
    })
    .filter((y) => y.tvl > 0);
}

/**
 * Fetch from Cetus API
 */
async function fetchFromCetusApi(): Promise<YieldOpportunity[]> {
  const endpoints = [
    'https://api.cetus.zone/v2/sui/pools_info',
    'https://api-sui.cetus.zone/v2/sui/pools',
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        const pools = data.data?.lp_list || data.data?.pools || data.pools || data;

        if (Array.isArray(pools)) {
          return transformCetusApiData(pools);
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return [];
}

/**
 * Transform Cetus API data
 */
function transformCetusApiData(pools: unknown[]): YieldOpportunity[] {
  return pools
    .filter((pool): pool is Record<string, unknown> => typeof pool === 'object' && pool !== null)
    .slice(0, 50)
    .map((pool) => {
      const symbol = String(pool.symbol || pool.name || 'Unknown');
      const lpPair = parseLPSymbol(symbol);
      const symbolA = lpPair?.token0 || symbol.split('-')[0] || 'Unknown';
      const symbolB = lpPair?.token1 || symbol.split('-')[1] || 'Unknown';

      const tvl = Number(pool.tvl_in_usd || pool.tvl || 0);
      const apr = Number(pool.apr || pool.apy || 0);
      const poolAddress = String(pool.pool_address || pool.address || pool.id || '');

      const isStable = STABLECOINS.includes(symbolA) || STABLECOINS.includes(symbolB);

      return {
        id: `cetus-${poolAddress.slice(-8) || symbol}`,
        protocol: 'cetus' as const,
        protocolName: 'Cetus',
        asset: symbol,
        assetSymbol: symbol,
        type: 'lp' as const,
        apy: apr,
        apyBase: apr,
        tvl,
        tvlFormatted: formatTvl(tvl),
        chain: 'sui' as const,
        poolAddress,
        rewardTokens: ['CETUS'],
        isStablecoin: isStable,
        ilRisk: isStable ? 'no' as const : 'yes' as const,
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'cetus',
          symbol,
          assetType: 'lp',
          poolAddress,
        }),
      };
    })
    .filter((y) => y.tvl > 0);
}

/**
 * Check if Cetus integration is available
 */
export async function isCetusAvailable(): Promise<boolean> {
  try {
    const sdk = initCetusSDK({ network: 'mainnet' });
    return !!sdk;
  } catch {
    return false;
  }
}
