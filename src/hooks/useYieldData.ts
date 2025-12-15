import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';
import { fetchAllYields, getErrorSummary } from '../lib/protocols';
import type { YieldOpportunity, YieldFilters, Protocol, FetchError, FetchResult } from '../types/yield';

interface UseYieldDataOptions {
  filters?: YieldFilters;
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseYieldDataResult {
  yields: YieldOpportunity[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  fetchErrors: FetchError[];
  hasWarnings: boolean;
  hasCriticalErrors: boolean;
  refetch: () => void;
  lastUpdated: Date | null;
}

export function useYieldData(options: UseYieldDataOptions = {}): UseYieldDataResult {
  const { filters, enabled = true, refetchInterval = 60_000 } = options;
  const client = useSuiClient();

  const query = useQuery({
    queryKey: ['yields', filters],
    queryFn: async (): Promise<FetchResult> => {
      const result = await fetchAllYields(client, {
        protocols: filters?.protocols,
      });

      return {
        yields: applyFilters(result.yields, filters),
        errors: result.errors,
        lastUpdated: result.lastUpdated,
      };
    },
    enabled,
    refetchInterval,
    staleTime: 30_000, // Consider data stale after 30 seconds
  });

  const result = query.data || { yields: [], errors: [], lastUpdated: new Date() };
  const errorSummary = getErrorSummary(result.errors);

  return {
    yields: result.yields,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    fetchErrors: result.errors,
    hasWarnings: errorSummary.warnings.length > 0,
    hasCriticalErrors: errorSummary.hasErrors,
    refetch: query.refetch,
    lastUpdated: result.lastUpdated,
  };
}

function applyFilters(
  yields: YieldOpportunity[],
  filters?: YieldFilters
): YieldOpportunity[] {
  if (!filters) return yields;

  let filtered = [...yields];

  // Filter by protocols
  if (filters.protocols && filters.protocols.length > 0) {
    filtered = filtered.filter((y) => filters.protocols!.includes(y.protocol));
  }

  // Filter by asset types
  if (filters.assetTypes && filters.assetTypes.length > 0) {
    filtered = filtered.filter((y) => filters.assetTypes!.includes(y.type));
  }

  // Filter by minimum APY
  if (filters.minApy !== undefined) {
    filtered = filtered.filter((y) => y.apy >= filters.minApy!);
  }

  // Filter by minimum TVL
  if (filters.minTvl !== undefined) {
    filtered = filtered.filter((y) => (y.tvl || 0) >= filters.minTvl!);
  }

  // Filter by stablecoins only
  if (filters.stablecoinsOnly) {
    filtered = filtered.filter((y) => y.isStablecoin);
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (y) =>
        y.assetSymbol.toLowerCase().includes(query) ||
        y.protocolName.toLowerCase().includes(query) ||
        y.protocol.toLowerCase().includes(query)
    );
  }

  return filtered;
}

// Hook for getting yields grouped by protocol
export function useYieldsByProtocol(options: UseYieldDataOptions = {}) {
  const { yields, ...rest } = useYieldData(options);

  const grouped = yields.reduce<Record<Protocol, YieldOpportunity[]>>(
    (acc, yield_) => {
      if (!acc[yield_.protocol]) {
        acc[yield_.protocol] = [];
      }
      acc[yield_.protocol].push(yield_);
      return acc;
    },
    {} as Record<Protocol, YieldOpportunity[]>
  );

  return {
    yieldsByProtocol: grouped,
    ...rest,
  };
}

// Hook for getting top N yields
export function useTopYields(count: number = 10, options: UseYieldDataOptions = {}) {
  const { yields, ...rest } = useYieldData(options);

  return {
    topYields: yields.slice(0, count),
    ...rest,
  };
}

// Utility function to calculate potential earnings
export function calculatePotentialEarnings(
  balance: number,
  apy: number
): { daily: number; monthly: number; yearly: number } {
  const yearlyEarnings = balance * (apy / 100);
  return {
    daily: yearlyEarnings / 365,
    monthly: yearlyEarnings / 12,
    yearly: yearlyEarnings,
  };
}
