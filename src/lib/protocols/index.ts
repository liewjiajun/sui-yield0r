/**
 * Protocol Yield Fetcher Index
 *
 * Aggregates yield data from multiple sources using hybrid approach:
 * 1. Native SDK integrations - Direct protocol data with accurate deep links
 * 2. DefiLlama Yields API - Fallback for protocols without native integration
 */

import { SuiClient } from '@mysten/sui/client';
import type { FetchError, FetchResult, Protocol } from '../../types/yield';
import { fetchAllYields as fetchHybridYields } from '../../integrations';
import { fetchDefiLlamaYields } from './defillama';

export interface FetchAllYieldsOptions {
  protocols?: Protocol[];
  includeDefiLlama?: boolean;
  includeSuilend?: boolean;
  includeLiquidStaking?: boolean;
}

/**
 * Fetch all yield opportunities using hybrid native + DefiLlama approach
 */
export async function fetchAllYields(
  _client: SuiClient,
  options?: FetchAllYieldsOptions
): Promise<FetchResult> {
  console.log('[Yields] Starting hybrid fetch (Native + DefiLlama)...');

  try {
    // Use the new hybrid integration system
    const result = await fetchHybridYields();

    // Filter by requested protocols if specified
    let filteredYields = result.yields;
    if (options?.protocols && options.protocols.length > 0) {
      filteredYields = result.yields.filter((y) => options.protocols!.includes(y.protocol));
    }

    console.log(`[Yields] Fetched ${filteredYields.length} yields`);
    console.log(`[Yields] Native sources: ${result.sources.native.join(', ') || 'none'}`);
    console.log(`[Yields] DefiLlama sources: ${result.sources.defillama.join(', ') || 'none'}`);

    return {
      yields: filteredYields,
      errors: result.errors,
      lastUpdated: result.lastUpdated,
    };
  } catch (error) {
    console.error('[Yields] Hybrid fetch failed, falling back to DefiLlama only:', error);

    // Fallback to DefiLlama only
    const fallbackResult = await fetchDefiLlamaYields();

    let filteredYields = fallbackResult.yields;
    if (options?.protocols && options.protocols.length > 0) {
      filteredYields = fallbackResult.yields.filter((y) => options.protocols!.includes(y.protocol));
    }

    return {
      yields: filteredYields,
      errors: [
        ...fallbackResult.errors,
        {
          protocol: 'Native',
          source: 'integrations',
          message: `Native integrations failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };
  }
}

/**
 * Get error summary for display
 */
export function getErrorSummary(errors: FetchError[]): {
  hasErrors: boolean;
  criticalErrors: FetchError[];
  warnings: FetchError[];
} {
  const criticalErrors = errors.filter((e) =>
    e.message.toLowerCase().includes('failed') ||
    e.message.toLowerCase().includes('critical')
  );

  const warnings = errors.filter((e) =>
    e.message.toLowerCase().includes('unavailable') ||
    e.message.toLowerCase().includes('estimate')
  );

  return {
    hasErrors: criticalErrors.length > 0,
    criticalErrors,
    warnings,
  };
}

// Re-export individual fetchers for direct use
export { fetchDefiLlamaYields } from './defillama';
export { fetchSuilendYields } from './suilend';
export { fetchLiquidStakingYields } from './liquidStaking';
