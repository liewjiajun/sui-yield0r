/**
 * Protocol Integrations Aggregator
 * Combines native SDK fetchers with DefiLlama fallback
 */

import type { YieldOpportunity, FetchError, Protocol } from '../types/yield';
import { fetchDefiLlamaYields } from '../lib/protocols/defillama';
import { fetchSuilendYields } from './suilend';
import { fetchNaviYields } from './navi';
import { fetchScallopYields } from './scallop';
import { fetchCetusYields } from './cetus';
import { fetchTurbosYields } from './turbos';
import { fetchAftermathYields } from './aftermath';
import { fetchLiquidStakingYields } from './liquidStaking';
import { generateDeepLink } from './deepLinks';
import { formatTokenSymbol } from './tokenUtils';

// Re-export utilities
export { formatTokenSymbol, parseLPSymbol, isSameAsset, needsSwap } from './tokenUtils';
export { generateDeepLink, getAssetUrl, getProtocolBaseUrl } from './deepLinks';

export interface AggregatedYieldResult {
  yields: YieldOpportunity[];
  errors: FetchError[];
  sources: {
    native: Protocol[];
    defillama: Protocol[];
  };
  lastUpdated: Date;
}

/**
 * Fetch yields using hybrid approach:
 * 1. Try native SDK fetchers first (more accurate deep links)
 * 2. Supplement with DefiLlama data for protocols without native integration
 * 3. Merge and deduplicate results
 */
export async function fetchAllYields(): Promise<AggregatedYieldResult> {
  const allErrors: FetchError[] = [];
  const nativeYields: YieldOpportunity[] = [];
  const nativeProtocols: Set<Protocol> = new Set();

  console.log('[Integrations] Starting hybrid yield fetch...');

  // === PHASE 1: Native SDK Fetchers (parallel) ===
  const nativeFetchers = [
    { name: 'Suilend', fetch: fetchSuilendYields, protocol: 'suilend' as Protocol },
    { name: 'NAVI', fetch: fetchNaviYields, protocol: 'navi' as Protocol },
    { name: 'Scallop', fetch: fetchScallopYields, protocol: 'scallop' as Protocol },
    { name: 'Cetus', fetch: fetchCetusYields, protocol: 'cetus' as Protocol },
    { name: 'Turbos', fetch: fetchTurbosYields, protocol: 'turbos' as Protocol },
    { name: 'Aftermath', fetch: fetchAftermathYields, protocol: 'aftermath' as Protocol },
    { name: 'LiquidStaking', fetch: fetchLiquidStakingYields, protocol: 'haedal' as Protocol },
  ];

  // Run native fetchers in parallel with timeout
  const nativeResults = await Promise.allSettled(
    nativeFetchers.map(async (fetcher) => {
      try {
        const result = await Promise.race([
          fetcher.fetch(),
          new Promise<{ yields: YieldOpportunity[]; errors: FetchError[] }>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 15000)
          ),
        ]);
        return { ...result, protocol: fetcher.protocol, name: fetcher.name };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          yields: [],
          errors: [{ protocol: fetcher.name, source: 'native', message, timestamp: new Date() }],
          protocol: fetcher.protocol,
          name: fetcher.name,
        };
      }
    })
  );

  // Process native results
  for (const result of nativeResults) {
    if (result.status === 'fulfilled') {
      const { yields, errors, protocol, name } = result.value;
      if (yields.length > 0) {
        nativeYields.push(...yields);
        nativeProtocols.add(protocol);
        console.log(`[${name}] Native: ${yields.length} yields`);
      }
      allErrors.push(...errors);
    }
  }

  // === PHASE 2: DefiLlama Fallback ===
  console.log('[Integrations] Fetching DefiLlama data...');
  const defiLlamaResult = await fetchDefiLlamaYields();
  allErrors.push(...defiLlamaResult.errors);

  // === PHASE 3: Merge & Deduplicate ===
  const mergedYields = mergeYields(nativeYields, defiLlamaResult.yields, nativeProtocols);

  // Update deep links for all yields
  const yieldsWithDeepLinks = mergedYields.map((y) => ({
    ...y,
    url: y.url || generateDeepLink({
      protocol: y.protocol,
      symbol: y.assetSymbol,
      assetType: y.type,
      poolAddress: y.poolAddress,
      poolId: y.poolId,
      underlyingTokens: y.underlyingTokens,
    }),
  }));

  // Determine which protocols came from where
  const defillamaProtocols = new Set(
    defiLlamaResult.yields
      .filter((y) => !nativeProtocols.has(y.protocol))
      .map((y) => y.protocol)
  );

  console.log(`[Integrations] Total: ${yieldsWithDeepLinks.length} yields`);
  console.log(`[Integrations] Native protocols: ${Array.from(nativeProtocols).join(', ')}`);
  console.log(`[Integrations] DefiLlama protocols: ${Array.from(defillamaProtocols).join(', ')}`);

  return {
    yields: yieldsWithDeepLinks,
    errors: allErrors,
    sources: {
      native: Array.from(nativeProtocols),
      defillama: Array.from(defillamaProtocols),
    },
    lastUpdated: new Date(),
  };
}

/**
 * Merge native and DefiLlama yields
 * Prioritize native data for protocols that have it
 */
function mergeYields(
  nativeYields: YieldOpportunity[],
  defiLlamaYields: YieldOpportunity[],
  nativeProtocols: Set<Protocol>
): YieldOpportunity[] {
  // Create a map of native yields by a compound key
  const nativeMap = new Map<string, YieldOpportunity>();

  for (const y of nativeYields) {
    const key = createYieldKey(y);
    nativeMap.set(key, y);
  }

  // Filter DefiLlama yields
  const filteredDefiLlama = defiLlamaYields.filter((y) => {
    // Skip if we already have native data for this protocol
    if (nativeProtocols.has(y.protocol)) {
      // But include if it's a different pool we don't have
      const key = createYieldKey(y);
      return !nativeMap.has(key);
    }
    return true;
  });

  // Combine with native yields having priority
  const combined = [...nativeYields];

  for (const y of filteredDefiLlama) {
    const key = createYieldKey(y);
    if (!nativeMap.has(key)) {
      combined.push(y);
    }
  }

  // Sort by APY descending
  return combined.sort((a, b) => b.apy - a.apy);
}

/**
 * Create a unique key for a yield opportunity
 */
function createYieldKey(y: YieldOpportunity): string {
  const symbol = formatTokenSymbol(y.assetSymbol).toLowerCase();
  return `${y.protocol}-${symbol}`;
}

/**
 * Fetch yields for a specific protocol only
 */
export async function fetchProtocolYields(protocol: Protocol): Promise<{
  yields: YieldOpportunity[];
  errors: FetchError[];
}> {
  switch (protocol) {
    case 'suilend':
      return fetchSuilendYields();
    case 'navi':
      return fetchNaviYields();
    case 'scallop':
      return fetchScallopYields();
    case 'cetus':
      return fetchCetusYields();
    case 'turbos':
      return fetchTurbosYields();
    case 'aftermath':
      return fetchAftermathYields();
    case 'haedal':
    case 'springsui':
    case 'volo':
      return fetchLiquidStakingYields();
    default:
      // Fallback to DefiLlama for unsupported protocols
      const result = await fetchDefiLlamaYields();
      return {
        yields: result.yields.filter((y) => y.protocol === protocol),
        errors: result.errors,
      };
  }
}
