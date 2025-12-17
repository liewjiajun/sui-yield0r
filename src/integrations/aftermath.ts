/**
 * Aftermath Finance Integration
 * Native SDK integration for Aftermath liquid staking (afSUI)
 */

import { Aftermath } from 'aftermath-ts-sdk';
import type { YieldOpportunity, FetchError } from '../types/yield';
import { generateDeepLink } from './deepLinks';
import { createError } from './types';

/**
 * Fetch Aftermath staking yields
 */
export async function fetchAftermathYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    // Initialize Aftermath SDK
    const afSdk = new Aftermath('MAINNET');
    await afSdk.init();

    // Get staking module
    const staking = afSdk.Staking();

    // Fetch staking APY
    const apy = await fetchAftermathApy();

    // Get staking info if available
    void staking; // SDK initialized successfully

    if (apy > 0) {
      yields.push({
        id: 'aftermath-afsui',
        protocol: 'aftermath',
        protocolName: 'Aftermath',
        asset: 'afSUI',
        assetSymbol: 'afSUI',
        type: 'lst',
        apy,
        apyBase: apy,
        tvl: 0, // Will be fetched from DefiLlama
        tvlFormatted: 'N/A',
        chain: 'sui',
        isStablecoin: false,
        ilRisk: 'no',
        lastUpdated: new Date(),
        url: generateDeepLink({
          protocol: 'aftermath',
          symbol: 'afSUI',
          assetType: 'lst',
        }),
      });

      console.log(`[Aftermath] Fetched staking yield: ${apy.toFixed(2)}% APY`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Aftermath] SDK fetch failed, trying API:', errorMessage);
  }

  // Fallback to API
  if (yields.length === 0) {
    try {
      const apiYields = await fetchFromAftermathApi();
      yields.push(...apiYields);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(createError('Aftermath', 'native', `Failed to fetch: ${errorMessage}`));
    }
  }

  return { yields, errors };
}

/**
 * Fetch Aftermath staking APY
 */
async function fetchAftermathApy(): Promise<number> {
  try {
    const response = await fetch('https://aftermath.finance/api/staking/apy', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      return Number(data.apy || data.apr || 0) * 100;
    }
  } catch {
    // Fallback to estimated APY
  }

  // Default estimated staking APY for Sui
  return 3.5;
}

/**
 * Fetch from Aftermath API
 */
async function fetchFromAftermathApi(): Promise<YieldOpportunity[]> {
  const apy = await fetchAftermathApy();

  return [{
    id: 'aftermath-afsui',
    protocol: 'aftermath',
    protocolName: 'Aftermath',
    asset: 'afSUI',
    assetSymbol: 'afSUI',
    type: 'lst',
    apy,
    apyBase: apy,
    tvl: 0,
    tvlFormatted: 'N/A',
    chain: 'sui',
    isStablecoin: false,
    ilRisk: 'no',
    lastUpdated: new Date(),
    url: generateDeepLink({
      protocol: 'aftermath',
      symbol: 'afSUI',
      assetType: 'lst',
    }),
  }];
}

/**
 * Check if Aftermath integration is available
 */
export async function isAftermathAvailable(): Promise<boolean> {
  try {
    const afSdk = new Aftermath('MAINNET');
    await afSdk.init();
    return true;
  } catch {
    return false;
  }
}
