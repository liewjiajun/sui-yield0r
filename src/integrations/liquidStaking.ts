/**
 * Liquid Staking Protocols Integration
 * Haedal (haSUI), SpringSui (sSUI), Volo (vSUI)
 */

import type { YieldOpportunity, FetchError } from '../types/yield';
import { generateDeepLink } from './deepLinks';
import { createError, formatTvl } from './types';

// Default staking APY estimate for Sui network
const DEFAULT_STAKING_APY = 3.5;

interface LSTConfig {
  protocol: 'haedal' | 'springsui' | 'volo';
  name: string;
  symbol: string;
  website: string;
  apiEndpoint?: string;
}

const LST_CONFIGS: LSTConfig[] = [
  {
    protocol: 'haedal',
    name: 'Haedal',
    symbol: 'haSUI',
    website: 'https://haedal.xyz',
    apiEndpoint: 'https://api.haedal.xyz/api/stats',
  },
  {
    protocol: 'springsui',
    name: 'SpringSui',
    symbol: 'sSUI',
    website: 'https://www.springsui.com',
  },
  {
    protocol: 'volo',
    name: 'Volo',
    symbol: 'vSUI',
    website: 'https://volo.fi',
    apiEndpoint: 'https://api.volo.fi/stats',
  },
];

/**
 * Fetch all liquid staking yields
 */
export async function fetchLiquidStakingYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  for (const config of LST_CONFIGS) {
    try {
      const lstYield = await fetchLSTYield(config);
      if (lstYield) {
        yields.push(lstYield);
        console.log(`[${config.name}] Fetched: ${lstYield.apy.toFixed(2)}% APY`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(createError(config.name, 'native', errorMessage));
    }
  }

  return { yields, errors };
}

/**
 * Fetch individual LST yield
 */
async function fetchLSTYield(config: LSTConfig): Promise<YieldOpportunity | null> {
  let apy = DEFAULT_STAKING_APY;
  let tvl = 0;

  // Try to fetch from API if available
  if (config.apiEndpoint) {
    try {
      const response = await fetch(config.apiEndpoint, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        apy = Number(data.apy || data.apr || data.stakingApy || DEFAULT_STAKING_APY);
        if (apy < 1) apy *= 100; // Convert from decimal if needed
        tvl = Number(data.tvl || data.totalStaked || 0);
      }
    } catch {
      // Use default APY
    }
  }

  return {
    id: `${config.protocol}-${config.symbol.toLowerCase()}`,
    protocol: config.protocol,
    protocolName: config.name,
    asset: config.symbol,
    assetSymbol: config.symbol,
    type: 'lst',
    apy,
    apyBase: apy,
    tvl,
    tvlFormatted: tvl > 0 ? formatTvl(tvl) : 'N/A',
    chain: 'sui',
    isStablecoin: false,
    ilRisk: 'no',
    lastUpdated: new Date(),
    url: generateDeepLink({
      protocol: config.protocol,
      symbol: config.symbol,
      assetType: 'lst',
    }),
  };
}

/**
 * Fetch Haedal specific yields
 */
export async function fetchHaedalYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const config = LST_CONFIGS.find(c => c.protocol === 'haedal')!;
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    const lstYield = await fetchLSTYield(config);
    if (lstYield) {
      yields.push(lstYield);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('Haedal', 'native', errorMessage));
  }

  return { yields, errors };
}

/**
 * Fetch SpringSui specific yields
 */
export async function fetchSpringSuiYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const config = LST_CONFIGS.find(c => c.protocol === 'springsui')!;
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    const lstYield = await fetchLSTYield(config);
    if (lstYield) {
      yields.push(lstYield);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('SpringSui', 'native', errorMessage));
  }

  return { yields, errors };
}

/**
 * Fetch Volo specific yields
 */
export async function fetchVoloYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const config = LST_CONFIGS.find(c => c.protocol === 'volo')!;
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  try {
    const lstYield = await fetchLSTYield(config);
    if (lstYield) {
      yields.push(lstYield);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(createError('Volo', 'native', errorMessage));
  }

  return { yields, errors };
}
