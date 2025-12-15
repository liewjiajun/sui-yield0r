import { useState } from 'react';
import { useYieldData } from '../hooks/useYieldData';
import { YieldCard } from '../components/YieldCard';
import { YieldFiltersComponent } from '../components/YieldFilters';
import { ErrorDisplay, WarningBadge } from '../components/ErrorDisplay';
import type { YieldFilters } from '../types/yield';

export function Leaderboard() {
  const [filters, setFilters] = useState<YieldFilters>({});
  const [showErrors, setShowErrors] = useState(false);
  const {
    yields,
    isLoading,
    isError,
    lastUpdated,
    refetch,
    fetchErrors,
    hasWarnings,
    hasCriticalErrors,
  } = useYieldData({ filters });

  const uniqueProtocols = new Set(yields.map((y) => y.protocol)).size;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-terminal-green font-mono text-3xl font-bold tracking-tight mb-2">
          &gt; YIELD_LEADERBOARD<span className="animate-blink">_</span>
        </h1>
        <p className="text-terminal-green-dim font-mono text-sm">
          Real-time yields from DefiLlama // NAVI, Scallop, Cetus, Turbos, Bluefin & more
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green-dim">POOLS:</span>
          <span className="text-terminal-green font-bold">{yields.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-terminal-green-dim">PROTOCOLS:</span>
          <span className="text-terminal-green font-bold">{uniqueProtocols}</span>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2">
            <span className="text-terminal-green-dim">UPDATED:</span>
            <span className="text-terminal-green">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Error/Warning indicator */}
        {(hasWarnings || hasCriticalErrors) && (
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="flex items-center gap-2"
          >
            {hasCriticalErrors && (
              <span className="text-terminal-red text-xs font-mono">[ERRORS]</span>
            )}
            <WarningBadge count={fetchErrors.length} />
          </button>
        )}

        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="text-terminal-amber text-xs font-mono uppercase hover:text-glow ml-auto disabled:opacity-50"
        >
          {isLoading ? '[LOADING...]' : '[REFRESH]'}
        </button>
      </div>

      {/* Error Display */}
      {showErrors && fetchErrors.length > 0 && (
        <div className="mb-6">
          <ErrorDisplay errors={fetchErrors} />
        </div>
      )}

      {/* Filters */}
      <YieldFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Loading State */}
      {isLoading && yields.length === 0 && (
        <div className="card-brutal text-center py-12">
          <div className="text-terminal-green font-mono text-xl animate-pulse">
            &gt; SCANNING PROTOCOLS<span className="animate-blink">...</span>
          </div>
          <div className="text-terminal-green-dim font-mono text-sm mt-2">
            Fetching yield data from DefiLlama + on-chain sources
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="card-brutal border-terminal-red shadow-brutal-red text-center py-12">
          <div className="text-terminal-red font-mono text-xl">
            &gt; ERROR: FETCH_FAILED
          </div>
          <div className="text-terminal-red/70 font-mono text-sm mt-2">
            Could not retrieve yield data. Please try again.
          </div>
          <button onClick={() => refetch()} className="btn-brutal mt-4">
            RETRY
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && yields.length === 0 && (
        <div className="card-brutal text-center py-12">
          <div className="text-terminal-amber font-mono text-xl">
            &gt; NO_RESULTS
          </div>
          <div className="text-terminal-amber/70 font-mono text-sm mt-2">
            No yields match your current filters. Try adjusting your criteria.
          </div>
        </div>
      )}

      {/* Yield Grid */}
      {!isError && yields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {yields.map((yield_, index) => (
            <YieldCard key={yield_.id} yield_={yield_} rank={index + 1} />
          ))}
        </div>
      )}

      {/* Data Source Attribution */}
      <div className="mt-8 pt-4 border-t border-terminal-green/20">
        <p className="text-terminal-green-dim font-mono text-xs text-center">
          Data sourced from{' '}
          <a
            href="https://defillama.com/yields"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-green hover:underline"
          >
            DefiLlama Yields API
          </a>
          {' '}// Updated hourly // Not financial advice
        </p>
      </div>
    </div>
  );
}
