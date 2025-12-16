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
      <div className="mb-6 md:mb-8">
        <h1
          className="font-bold text-2xl md:text-4xl tracking-tight mb-2 uppercase"
          style={{ color: 'var(--foreground)' }}
        >
          Yield Leaderboard
        </h1>
        <p className="text-neutral text-sm md:text-lg font-medium">
          Real-time yields from DefiLlama - NAVI, Scallop, Cetus, Turbos, Bluefin & more
        </p>
      </div>

      {/* Stats Bar */}
      <div
        className="card-neo p-3 md:p-4 mb-4 md:mb-6"
        style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <span
              className="px-2 md:px-3 py-1 bg-neo-yellow font-bold text-xs md:text-sm uppercase text-black"
              style={{ border: '2px solid var(--border-color)' }}
            >
              Pools
            </span>
            <span className="font-bold text-lg md:text-xl" style={{ color: 'var(--foreground)' }}>
              {yields.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 md:px-3 py-1 bg-neo-teal font-bold text-xs md:text-sm uppercase text-black"
              style={{ border: '2px solid var(--border-color)' }}
            >
              Protocols
            </span>
            <span className="font-bold text-lg md:text-xl" style={{ color: 'var(--foreground)' }}>
              {uniqueProtocols}
            </span>
          </div>
          {lastUpdated && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-neutral font-medium text-sm">Updated:</span>
              <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
                {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Error/Warning indicator */}
          {(hasWarnings || hasCriticalErrors) && (
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {hasCriticalErrors && (
                <span
                  className="px-2 py-1 bg-neo-red font-bold text-xs uppercase text-black"
                  style={{ border: '2px solid var(--border-color)' }}
                >
                  Errors
                </span>
              )}
              <WarningBadge count={fetchErrors.length} />
            </button>
          )}

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="ml-auto px-3 md:px-4 py-2 bg-neo-red text-black font-bold text-xs md:text-sm uppercase hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0"
            style={{
              border: '3px solid var(--border-color)',
              boxShadow: '2px 2px 0px 0px var(--shadow-color)',
            }}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {showErrors && fetchErrors.length > 0 && (
        <div className="mb-4 md:mb-6">
          <ErrorDisplay errors={fetchErrors} />
        </div>
      )}

      {/* Filters */}
      <YieldFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Loading State */}
      {isLoading && yields.length === 0 && (
        <div
          className="card-neo text-center py-8 md:py-12"
          style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
        >
          <div
            className="font-bold text-xl md:text-2xl mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Scanning Protocols...
          </div>
          <div className="text-neutral font-medium text-sm md:text-base">
            Fetching yield data from DefiLlama + on-chain sources
          </div>
          <div className="mt-4 flex justify-center">
            <div
              className="w-8 h-8 border-t-neo-red animate-spin"
              style={{ border: '3px solid var(--border-color)', borderTopColor: '#FF6B6B' }}
            ></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div
          className="bg-neo-red p-6 md:p-8 text-center"
          style={{
            border: '3px solid var(--border-color)',
            boxShadow: '4px 4px 0px 0px var(--shadow-color)',
          }}
        >
          <div className="text-black font-bold text-xl md:text-2xl mb-2">
            Error: Fetch Failed
          </div>
          <div className="text-black/70 font-medium mb-4">
            Could not retrieve yield data. Please try again.
          </div>
          <button onClick={() => refetch()} className="btn-neo">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && yields.length === 0 && (
        <div
          className="bg-neo-yellow p-6 md:p-8 text-center"
          style={{
            border: '3px solid var(--border-color)',
            boxShadow: '4px 4px 0px 0px var(--shadow-color)',
          }}
        >
          <div className="text-black font-bold text-xl md:text-2xl mb-2">
            No Results
          </div>
          <div className="text-black/70 font-medium">
            No yields match your current filters. Try adjusting your criteria.
          </div>
        </div>
      )}

      {/* Yield Grid */}
      {!isError && yields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {yields.map((yield_, index) => (
            <YieldCard key={yield_.id} yield_={yield_} rank={index + 1} />
          ))}
        </div>
      )}

      {/* Data Source Attribution */}
      <div
        className="mt-6 md:mt-8 pt-4 md:pt-6"
        style={{ borderTop: '3px solid var(--border-color)' }}
      >
        <div
          className="card-neo p-3 md:p-4 text-center"
          style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
        >
          <p className="text-neutral font-medium text-xs md:text-sm">
            Data sourced from{' '}
            <a
              href="https://defillama.com/yields"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline decoration-2 md:decoration-3 decoration-neo-red hover:bg-neo-red hover:no-underline hover:text-black px-1 transition-all"
              style={{ color: 'var(--foreground)' }}
            >
              DefiLlama Yields API
            </a>
            {' '} - Updated hourly - Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
}
