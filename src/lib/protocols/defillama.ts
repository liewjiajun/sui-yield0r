/**
 * DefiLlama Yields API Integration
 * Fetches real-time yield data for all Sui protocols from DefiLlama
 */

import type { YieldOpportunity, Protocol, FetchError, AssetType } from '../../types/yield';
import { DEFILLAMA_PROJECT_MAP, PROTOCOL_CONFIGS } from '../../types/yield';
import { formatTvl } from '../constants';

const DEFILLAMA_YIELDS_API = 'https://yields.llama.fi/pools';

/**
 * Build direct URL to protocol pool/market
 * These URLs take users directly to where they can deposit/provide liquidity
 * URLs verified as of Dec 2024
 */
function buildProtocolUrl(protocol: Protocol): string {
  const urlMap: Record<Protocol, string> = {
    // Lending Protocols - verified working URLs
    navi: 'https://app.naviprotocol.io/',
    scallop: 'https://app.scallop.io/',
    suilend: 'https://suilend.fi/dashboard',

    // DEXes / CLMMs - verified working URLs
    cetus: 'https://app.cetus.zone/pool/list',
    turbos: 'https://app.turbos.finance/#/pools',
    bluefin: 'https://trade.bluefin.io/swap',
    flowx: 'https://flowx.finance/swap',
    kriya: 'https://kriya.finance/pools',
    momentum: 'https://www.mmt.finance/',
    fullsail: 'https://fullsail.finance/',

    // Yield / Vault protocols
    kai: 'https://kai.finance/',
    bucket: 'https://app.bucketprotocol.io/',

    // Liquid Staking
    aftermath: 'https://aftermath.finance/',
    haedal: 'https://haedal.xyz/',
    springsui: 'https://www.springsui.com/',
    volo: 'https://www.volo.fi/',

    // Other
    deepbook: 'https://deepbook.tech/',
    other: '',
  };

  return urlMap[protocol] || PROTOCOL_CONFIGS[protocol]?.website || '';
}

// DefiLlama pool structure
interface DefiLlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  rewardTokens: string[] | null;
  underlyingTokens: string[] | null;
  poolMeta: string | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  url?: string;
}

interface DefiLlamaResponse {
  status: string;
  data: DefiLlamaPool[];
}

/**
 * Determine asset type from pool characteristics
 */
function determineAssetType(pool: DefiLlamaPool, project: string): AssetType {
  const symbol = pool.symbol.toUpperCase();

  // Liquid staking tokens
  if (symbol.includes('SSUI') || symbol.includes('AFSUI') || symbol.includes('HASUI') || symbol.includes('VSUI')) {
    return 'lst';
  }

  // LP pairs (contain - or /)
  if (symbol.includes('-') || symbol.includes('/')) {
    return 'lp';
  }

  // Lending protocols
  if (project.includes('lend') || project.includes('navi')) {
    return 'lending';
  }

  // DEX/CLMM protocols
  if (project.includes('clmm') || project.includes('spot') || project.includes('dex')) {
    return 'lp';
  }

  // Farm protocols
  if (project.includes('farm')) {
    return 'farm';
  }

  // Vault protocols
  if (project.includes('finance') || project.includes('kai')) {
    return 'vault';
  }

  return 'lending';
}

/**
 * Map DefiLlama project to our Protocol type
 */
function mapProject(project: string): Protocol {
  return DEFILLAMA_PROJECT_MAP[project] || 'other';
}

/**
 * Get protocol display name
 */
function getProtocolName(protocol: Protocol): string {
  return PROTOCOL_CONFIGS[protocol]?.name || protocol;
}

/**
 * Fetch all Sui yields from DefiLlama
 */
export async function fetchDefiLlamaYields(): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  const errors: FetchError[] = [];

  console.log('[DefiLlama] Fetching yields from API...');

  try {
    const response = await fetch(DEFILLAMA_YIELDS_API, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: DefiLlamaResponse = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response structure from DefiLlama API');
    }

    // Filter for Sui chain only
    const suiPools = data.data.filter(
      (pool) => pool.chain === 'Sui' && pool.tvlUsd > 0
    );

    console.log(`[DefiLlama] Found ${suiPools.length} Sui pools`);

    // Transform to our YieldOpportunity format
    const yields: YieldOpportunity[] = suiPools
      .filter((pool) => pool.apy !== null && pool.apy >= 0)
      .map((pool): YieldOpportunity => {
        const protocol = mapProject(pool.project);
        const assetType = determineAssetType(pool, pool.project);
        // Build direct URL - prefer our constructed URL over DefiLlama's (often empty)
        const directUrl = buildProtocolUrl(protocol);

        return {
          id: `defillama-${pool.pool}`,
          protocol,
          protocolName: getProtocolName(protocol),
          asset: pool.underlyingTokens?.[0] || pool.symbol,
          assetSymbol: pool.symbol,
          type: assetType,
          apy: pool.apy || 0,
          apyBase: pool.apyBase || undefined,
          apyReward: pool.apyReward || undefined,
          tvl: pool.tvlUsd,
          tvlFormatted: formatTvl(pool.tvlUsd),
          chain: 'sui',
          poolId: pool.pool,
          underlyingTokens: pool.underlyingTokens || undefined,
          rewardTokens: pool.rewardTokens || undefined,
          isStablecoin: pool.stablecoin,
          ilRisk: pool.ilRisk === 'yes' ? 'yes' : 'no',
          lastUpdated: new Date(),
          url: directUrl || pool.url || '',
        };
      });

    // Log protocol breakdown
    const protocolCounts = yields.reduce((acc, y) => {
      acc[y.protocol] = (acc[y.protocol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('[DefiLlama] Protocol breakdown:', protocolCounts);

    return { yields, errors };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[DefiLlama] Fetch failed:', errorMessage);

    errors.push({
      protocol: 'DefiLlama',
      source: 'yields.llama.fi',
      message: `Failed to fetch yields: ${errorMessage}`,
      timestamp: new Date(),
    });

    return { yields: [], errors };
  }
}

/**
 * Fetch protocol TVL data from DefiLlama
 */
export async function fetchProtocolTvl(slug: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.llama.fi/protocol/${slug}`);
    if (!response.ok) return null;

    const data = await response.json();
    return data.tvl || null;
  } catch {
    return null;
  }
}
