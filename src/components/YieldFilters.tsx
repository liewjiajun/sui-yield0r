import { useState } from 'react';
import type { YieldFilters, Protocol, AssetType } from '../types/yield';
import { PROTOCOL_CONFIGS } from '../types/yield';

interface YieldFiltersProps {
  filters: YieldFilters;
  onFiltersChange: (filters: YieldFilters) => void;
}

// Protocols available for filtering (excluding 'other')
const AVAILABLE_PROTOCOLS: Protocol[] = [
  'navi',
  'scallop',
  'cetus',
  'turbos',
  'bluefin',
  'flowx',
  'kai',
  'suilend',
  'springsui',
  'haedal',
  'aftermath',
  'bucket',
];

const ASSET_TYPES: AssetType[] = ['lending', 'lp', 'lst', 'vault', 'farm'];

export function YieldFiltersComponent({ filters, onFiltersChange }: YieldFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleProtocol = (protocol: Protocol) => {
    const current = filters.protocols || [];
    const updated = current.includes(protocol)
      ? current.filter((p) => p !== protocol)
      : [...current, protocol];
    onFiltersChange({ ...filters, protocols: updated.length ? updated : undefined });
  };

  const toggleAssetType = (type: AssetType) => {
    const current = filters.assetTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, assetTypes: updated.length ? updated : undefined });
  };

  const setMinApy = (apy: number | undefined) => {
    onFiltersChange({ ...filters, minApy: apy });
  };

  const toggleStablecoins = () => {
    onFiltersChange({ ...filters, stablecoinsOnly: !filters.stablecoinsOnly });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.protocols?.length ||
    filters.assetTypes?.length ||
    filters.minApy !== undefined ||
    filters.stablecoinsOnly ||
    filters.searchQuery;

  return (
    <div className="card-brutal mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-terminal-green font-mono text-sm uppercase tracking-wider">
            &gt; FILTERS
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-terminal-green text-terminal-black text-xs font-mono">
              ACTIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-terminal-red text-xs font-mono uppercase hover:text-glow"
            >
              [CLEAR]
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-terminal-green text-xs font-mono uppercase hover:text-glow"
          >
            [{isExpanded ? 'COLLAPSE' : 'EXPAND'}]
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder=">> search assets or protocols..."
          value={filters.searchQuery || ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value || undefined })
          }
          className="input-terminal w-full"
        />
      </div>

      {/* Expandable filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-terminal-green/30">
          {/* Protocols */}
          <div>
            <div className="text-terminal-green-dim text-xs font-mono uppercase mb-2">
              PROTOCOLS
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PROTOCOLS.map((protocol) => (
                <button
                  key={protocol}
                  onClick={() => toggleProtocol(protocol)}
                  className={`px-3 py-1 border-2 text-xs font-mono uppercase transition-all ${
                    filters.protocols?.includes(protocol)
                      ? 'bg-terminal-green text-terminal-black border-terminal-green'
                      : 'bg-transparent text-terminal-green border-terminal-green/50 hover:border-terminal-green'
                  }`}
                >
                  {PROTOCOL_CONFIGS[protocol]?.name || protocol}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Types */}
          <div>
            <div className="text-terminal-green-dim text-xs font-mono uppercase mb-2">
              ASSET TYPES
            </div>
            <div className="flex flex-wrap gap-2">
              {ASSET_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleAssetType(type)}
                  className={`px-3 py-1 border-2 text-xs font-mono uppercase transition-all ${
                    filters.assetTypes?.includes(type)
                      ? 'bg-terminal-amber text-terminal-black border-terminal-amber'
                      : 'bg-transparent text-terminal-amber border-terminal-amber/50 hover:border-terminal-amber'
                  }`}
                >
                  {type === 'lst' ? 'LIQUID STAKE' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <div className="text-terminal-green-dim text-xs font-mono uppercase mb-2">
              QUICK FILTERS
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleStablecoins}
                className={`px-3 py-1 border-2 text-xs font-mono uppercase transition-all ${
                  filters.stablecoinsOnly
                    ? 'bg-brutal-pink text-terminal-black border-brutal-pink'
                    : 'bg-transparent text-brutal-pink border-brutal-pink/50 hover:border-brutal-pink'
                }`}
              >
                STABLECOINS ONLY
              </button>
            </div>
          </div>

          {/* Min APY */}
          <div>
            <div className="text-terminal-green-dim text-xs font-mono uppercase mb-2">
              MIN APY: {filters.minApy !== undefined ? `${filters.minApy}%` : 'ANY'}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.minApy || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setMinApy(val > 0 ? val : undefined);
              }}
              className="w-full accent-terminal-green"
            />
            <div className="flex justify-between text-terminal-green-dim text-xs font-mono mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
