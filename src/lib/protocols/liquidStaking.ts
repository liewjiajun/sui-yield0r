/**
 * Liquid Staking Protocols Integration
 * Fetches data for SpringSui (sSUI), Haedal (haSUI), and Volo (vSUI)
 *
 * These protocols offer liquid staking tokens that represent staked SUI.
 */

import type { SuiClient } from '@mysten/sui/client';
import type { YieldOpportunity, FetchError } from '../../types/yield';
import { formatTvl } from '../constants';

// Liquid staking protocol configurations
const LIQUID_STAKING_PROTOCOLS = {
  springsui: {
    name: 'SpringSui',
    symbol: 'sSUI',
    coinType: '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI',
    website: 'https://springsui.com',
    defillamaSlug: 'springsui',
    // sSUI is part of Suilend ecosystem
    stateObject: '0x15eda7330c8f99c30e430b4d82fd7ab2af3ead4ae17046fcb224aa9bad394f6b',
  },
  haedal: {
    name: 'Haedal',
    symbol: 'haSUI',
    coinType: '0xbde4ba4c2e274a60ce15c1cfff9e5c42e136a8bc::hasui::HASUI',
    website: 'https://haedal.xyz',
    defillamaSlug: 'haedal-protocol',
    stateObject: '0x5db57c2eb74a4ab25da27e72e153e32779b7e8d7c6785f5fa98d9a04a4f86cc6',
  },
  volo: {
    name: 'Volo',
    symbol: 'vSUI',
    coinType: '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
    website: 'https://volo.fi',
    defillamaSlug: 'volo',
    stateObject: '0x7fa2faa111b8c65bea48a23049bfd81ca8f971a262d981dcd9a17c3825cb5baf',
  },
  aftermath: {
    name: 'Aftermath',
    symbol: 'afSUI',
    coinType: '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
    website: 'https://aftermath.finance',
    defillamaSlug: 'aftermath-afsui',
    stateObject: '0x2f8f6d5da7f13ea37daa397724280e0a9bd5e5ee5db9cef27a9cf5b98e2d4f7e',
  },
};

// Average Sui staking APY (approximately 2-3%)
const BASE_STAKING_APY = 2.5;

/**
 * Fetch TVL from DefiLlama for a protocol
 */
async function fetchProtocolTvl(slug: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.llama.fi/tvl/${slug}`);
    if (response.ok) {
      const tvl = await response.json();
      return typeof tvl === 'number' ? tvl : null;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Try to get exchange rate and calculate APY from on-chain data
 */
async function getExchangeRateApy(
  _client: SuiClient,
  _stateObject: string,
  protocolName: string
): Promise<number | null> {
  // Reading exchange rates requires protocol-specific logic
  // For now, return null and use base staking APY
  console.log(`[${protocolName}] Exchange rate APY calculation not implemented`);
  return null;
}

/**
 * Fetch liquid staking yields
 */
export async function fetchLiquidStakingYields(client: SuiClient): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const yields: YieldOpportunity[] = [];
  const errors: FetchError[] = [];

  console.log('[LiquidStaking] Fetching liquid staking protocol data...');

  for (const [key, protocol] of Object.entries(LIQUID_STAKING_PROTOCOLS)) {
    try {
      // Fetch TVL from DefiLlama
      const tvl = await fetchProtocolTvl(protocol.defillamaSlug);
      console.log(`[${protocol.name}] TVL: $${tvl?.toLocaleString() || 'unknown'}`);

      // Try to get APY from on-chain exchange rate
      const calculatedApy = await getExchangeRateApy(client, protocol.stateObject, protocol.name);

      // Use calculated APY or fall back to base staking APY
      const apy = calculatedApy ?? BASE_STAKING_APY;

      yields.push({
        id: `lst-${key}`,
        protocol: key as 'springsui' | 'haedal' | 'volo' | 'aftermath',
        protocolName: protocol.name,
        asset: protocol.coinType,
        assetSymbol: protocol.symbol,
        type: 'lst',
        apy,
        apyBase: apy,
        tvl: tvl || undefined,
        tvlFormatted: tvl ? formatTvl(tvl) : undefined,
        chain: 'sui',
        lastUpdated: new Date(),
        url: protocol.website,
      });

      // Add note if using estimated APY
      if (!calculatedApy) {
        errors.push({
          protocol: protocol.name,
          source: 'estimate',
          message: `APY is estimated (~${BASE_STAKING_APY}%). Actual rate depends on validator performance.`,
          timestamp: new Date(),
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[${protocol.name}] Fetch failed:`, errorMessage);

      errors.push({
        protocol: protocol.name,
        source: 'on-chain',
        message: `Failed to fetch data: ${errorMessage}`,
        timestamp: new Date(),
      });
    }
  }

  console.log(`[LiquidStaking] Fetched ${yields.length} liquid staking tokens`);

  return { yields, errors };
}
