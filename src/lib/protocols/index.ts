/**
 * Protocol Yield Fetcher Index
 *
 * Aggregates yield data from multiple sources:
 * 1. DefiLlama Yields API - Primary source for most protocols
 * 2. Suilend on-chain data - Direct blockchain reads
 * 3. Liquid staking protocols - SpringSui, Haedal, Aftermath, Volo
 */

import { SuiClient } from '@mysten/sui/client';
import type { YieldOpportunity, FetchError, FetchResult, Protocol } from '../../types/yield';
import { fetchDefiLlamaYields } from './defillama';
import { fetchSuilendYields } from './suilend';
import { fetchLiquidStakingYields } from './liquidStaking';

export interface FetchAllYieldsOptions {
  protocols?: Protocol[];
  includeDefiLlama?: boolean;
  includeSuilend?: boolean;
  includeLiquidStaking?: boolean;
}

/**
 * Fetch all yield opportunities from all sources
 */
export async function fetchAllYields(
  client: SuiClient,
  options?: FetchAllYieldsOptions
): Promise<FetchResult> {
  const allYields: YieldOpportunity[] = [];
  const allErrors: FetchError[] = [];

  const {
    includeDefiLlama = true,
    includeSuilend = true,
    includeLiquidStaking = true,
  } = options || {};

  console.log('[Yields] Starting fetch from all sources...');

  // Fetch from all sources in parallel
  const fetchPromises: Promise<{ yields: YieldOpportunity[]; errors: FetchError[] }>[] = [];

  if (includeDefiLlama) {
    fetchPromises.push(
      fetchDefiLlamaYields().catch((err) => {
        console.error('[DefiLlama] Critical error:', err);
        return {
          yields: [],
          errors: [{
            protocol: 'DefiLlama',
            source: 'yields.llama.fi',
            message: `Critical fetch error: ${err.message}`,
            timestamp: new Date(),
          }],
        };
      })
    );
  }

  if (includeSuilend) {
    fetchPromises.push(
      fetchSuilendYields(client).catch((err) => {
        console.error('[Suilend] Critical error:', err);
        return {
          yields: [],
          errors: [{
            protocol: 'Suilend',
            source: 'on-chain',
            message: `Critical fetch error: ${err.message}`,
            timestamp: new Date(),
          }],
        };
      })
    );
  }

  if (includeLiquidStaking) {
    fetchPromises.push(
      fetchLiquidStakingYields(client).catch((err) => {
        console.error('[LiquidStaking] Critical error:', err);
        return {
          yields: [],
          errors: [{
            protocol: 'LiquidStaking',
            source: 'on-chain',
            message: `Critical fetch error: ${err.message}`,
            timestamp: new Date(),
          }],
        };
      })
    );
  }

  // Wait for all fetches to complete
  const results = await Promise.all(fetchPromises);

  // Aggregate results
  for (const result of results) {
    allYields.push(...result.yields);
    allErrors.push(...result.errors);
  }

  // Filter by requested protocols if specified
  let filteredYields = allYields;
  if (options?.protocols && options.protocols.length > 0) {
    filteredYields = allYields.filter((y) => options.protocols!.includes(y.protocol));
  }

  // Deduplicate yields by ID
  const uniqueYields = deduplicateYields(filteredYields);

  // Sort by APY descending
  uniqueYields.sort((a, b) => b.apy - a.apy);

  console.log(`[Yields] Fetched ${uniqueYields.length} unique yields with ${allErrors.length} errors/warnings`);

  // Log protocol breakdown
  const protocolCounts = uniqueYields.reduce((acc, y) => {
    acc[y.protocol] = (acc[y.protocol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('[Yields] Protocol breakdown:', protocolCounts);

  return {
    yields: uniqueYields,
    errors: allErrors,
    lastUpdated: new Date(),
  };
}

/**
 * Remove duplicate yields, preferring DefiLlama data over on-chain estimates
 */
function deduplicateYields(yields: YieldOpportunity[]): YieldOpportunity[] {
  const seen = new Map<string, YieldOpportunity>();

  for (const y of yields) {
    // Create a key based on protocol + symbol
    const key = `${y.protocol}-${y.assetSymbol.toLowerCase()}`;

    if (!seen.has(key)) {
      seen.set(key, y);
    } else {
      // Prefer entry with higher APY or more complete data
      const existing = seen.get(key)!;
      if (y.apy > existing.apy || (y.tvl && !existing.tvl)) {
        seen.set(key, y);
      }
    }
  }

  return Array.from(seen.values());
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
