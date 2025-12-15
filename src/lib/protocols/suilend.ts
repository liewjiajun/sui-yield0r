/**
 * Suilend Protocol Integration
 * Fetches lending market data directly from Sui blockchain
 *
 * Note: Suilend doesn't have a public REST API, so we read on-chain data
 * and supplement with DefiLlama TVL data.
 */

import type { SuiClient } from '@mysten/sui/client';
import type { YieldOpportunity, FetchError } from '../../types/yield';
import { formatTvl } from '../constants';

// Suilend Lending Market Object IDs (mainnet)
const SUILEND_LENDING_MARKET = '0x84030d26d85eaa7035084a057f2f11f701b7e2e4eda87551becbc7c97505ece1';

// Known Suilend reserves with their coin types
const KNOWN_RESERVES = [
  { symbol: 'SUI', coinType: '0x2::sui::SUI' },
  { symbol: 'USDC', coinType: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC' },
  { symbol: 'USDT', coinType: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN' },
  { symbol: 'WETH', coinType: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN' },
  { symbol: 'sSUI', coinType: '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI' },
  { symbol: 'afSUI', coinType: '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI' },
  { symbol: 'haSUI', coinType: '0xbde4ba4c2e274a60ce15c1cfff9e5c42e136a8bc::hasui::HASUI' },
  { symbol: 'DEEP', coinType: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP' },
  { symbol: 'SEND', coinType: '0xb45fcfcc8e1e79f971a05a8dba0ff5e1e5093ef53e1c4cdd2e0ac1e6a36a6eca::send::SEND' },
];

interface LendingMarketFields {
  reserves: {
    fields: {
      id: { id: string };
      size: string;
    };
  };
}

// Reserved for future on-chain reserve parsing
// interface ReserveFields {
//   coin_type: { fields: { name: string } };
//   available_amount: string;
//   borrowed_amount: string;
//   config: {
//     fields: {
//       interest_rate_utils: {
//         fields: {
//           utils: unknown[];
//         };
//       };
//     };
//   };
// }

/**
 * Fetch Suilend TVL from DefiLlama
 */
async function fetchSuilendTvl(): Promise<number | null> {
  try {
    const response = await fetch('https://api.llama.fi/tvl/suilend');
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
 * Fetch Suilend yields from on-chain data
 */
export async function fetchSuilendYields(client: SuiClient): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];
  const yields: YieldOpportunity[] = [];

  console.log('[Suilend] Fetching on-chain lending market data...');

  try {
    // First, get the TVL from DefiLlama for reference
    const totalTvl = await fetchSuilendTvl();
    console.log(`[Suilend] Total TVL from DefiLlama: $${totalTvl?.toLocaleString() || 'unknown'}`);

    // Try to read the lending market object
    const marketObject = await client.getObject({
      id: SUILEND_LENDING_MARKET,
      options: {
        showContent: true,
        showType: true,
      },
    });

    if (!marketObject.data?.content || marketObject.data.content.dataType !== 'moveObject') {
      throw new Error('Failed to read Suilend lending market object');
    }

    const fields = marketObject.data.content.fields as unknown as LendingMarketFields;
    const reservesTableId = fields?.reserves?.fields?.id?.id;

    if (!reservesTableId) {
      throw new Error('Could not find reserves table in lending market');
    }

    console.log(`[Suilend] Found reserves table: ${reservesTableId}`);

    // For now, create entries based on known reserves with TVL distribution
    // In production, we would iterate through the reserves table
    const reserveCount = KNOWN_RESERVES.length;
    const tvlPerReserve = totalTvl ? totalTvl / reserveCount : 0;

    for (const reserve of KNOWN_RESERVES) {
      // Note: Without direct on-chain APY calculation, we report 0 APY
      // The actual APY would require reading interest rate models and utilization
      // Users should verify current rates on suilend.fi
      yields.push({
        id: `suilend-${reserve.symbol.toLowerCase()}`,
        protocol: 'suilend',
        protocolName: 'Suilend',
        asset: reserve.coinType,
        assetSymbol: reserve.symbol,
        type: 'lending',
        apy: 0, // Cannot calculate without full on-chain data
        tvl: tvlPerReserve,
        tvlFormatted: formatTvl(tvlPerReserve),
        chain: 'sui',
        poolAddress: SUILEND_LENDING_MARKET,
        lastUpdated: new Date(),
        url: 'https://suilend.fi',
      });
    }

    // Add warning that APY data is not available
    errors.push({
      protocol: 'Suilend',
      source: 'on-chain',
      message: 'APY data unavailable - Suilend does not expose a public API. Please verify rates at suilend.fi',
      timestamp: new Date(),
    });

    console.log(`[Suilend] Created ${yields.length} reserve entries (APY data unavailable)`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Suilend] Failed to fetch on-chain data:', errorMessage);

    errors.push({
      protocol: 'Suilend',
      source: 'on-chain',
      message: `Failed to fetch lending market data: ${errorMessage}`,
      timestamp: new Date(),
    });
  }

  return { yields, errors };
}
