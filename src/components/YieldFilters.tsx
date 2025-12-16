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
  'suilend',
  'cetus',
  'turbos',
  'bluefin',
  'flowx',
  'kriya',
  'momentum',
  'fullsail',
  'kai',
  'springsui',
  'haedal',
  'aftermath',
  'bucket',
  'deepbook',
];

const ASSET_TYPES: AssetType[] = ['lending', 'lp', 'lst', 'vault', 'farm'];

const ASSET_TYPE_COLORS: Record<AssetType, string> = {
  lending: 'bg-neo-blue',
  lp: 'bg-neo-purple',
  lst: 'bg-neo-teal',
  staking: 'bg-neo-green',
  vault: 'bg-neo-orange',
  farm: 'bg-neo-pink',
};

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
    <div
      className="card-neo p-4 md:p-6 mb-4 md:mb-6"
      style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <span
            className="font-bold text-base md:text-lg uppercase tracking-wide"
            style={{ color: 'var(--foreground)' }}
          >
            Filters
          </span>
          {hasActiveFilters && (
            <span
              className="px-2 md:px-3 py-1 bg-neo-red text-black text-xs font-bold uppercase"
              style={{ border: '2px solid var(--border-color)' }}
            >
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2 md:px-3 py-1 text-xs font-bold uppercase transition-colors hover:bg-neo-red hover:text-black"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                border: '2px solid var(--border-color)',
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 md:px-3 py-1 bg-neo-yellow text-black text-xs font-bold uppercase hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
            style={{ border: '2px solid var(--border-color)' }}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search assets or protocols..."
          value={filters.searchQuery || ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value || undefined })
          }
          className="w-full px-3 md:px-4 py-2 md:py-3 font-medium placeholder:text-neutral focus:outline-none focus:-translate-x-[2px] focus:-translate-y-[2px] transition-all text-sm md:text-base"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            border: '3px solid var(--border-color)',
          }}
        />
      </div>

      {/* Expandable filters */}
      {isExpanded && (
        <div
          className="space-y-4 md:space-y-6 pt-4"
          style={{ borderTop: '3px solid var(--border-color)' }}
        >
          {/* Protocols */}
          <div>
            <div className="text-neutral text-xs font-bold uppercase mb-2 md:mb-3 tracking-wide">
              Protocols
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {AVAILABLE_PROTOCOLS.map((protocol) => (
                <button
                  key={protocol}
                  onClick={() => toggleProtocol(protocol)}
                  className={`px-2 md:px-4 py-1.5 md:py-2 text-xs font-bold uppercase transition-all ${
                    filters.protocols?.includes(protocol)
                      ? 'bg-neo-teal text-black'
                      : ''
                  }`}
                  style={{
                    backgroundColor: filters.protocols?.includes(protocol)
                      ? '#4ECDC4'
                      : 'var(--background)',
                    color: filters.protocols?.includes(protocol)
                      ? '#000000'
                      : 'var(--foreground)',
                    border: '3px solid var(--border-color)',
                    boxShadow: filters.protocols?.includes(protocol)
                      ? '2px 2px 0px 0px var(--shadow-color)'
                      : 'none',
                  }}
                >
                  {PROTOCOL_CONFIGS[protocol]?.name || protocol}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Types */}
          <div>
            <div className="text-neutral text-xs font-bold uppercase mb-2 md:mb-3 tracking-wide">
              Asset Types
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {ASSET_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleAssetType(type)}
                  className={`px-2 md:px-4 py-1.5 md:py-2 text-xs font-bold uppercase transition-all ${
                    filters.assetTypes?.includes(type)
                      ? `${ASSET_TYPE_COLORS[type]} text-black`
                      : ''
                  }`}
                  style={{
                    backgroundColor: filters.assetTypes?.includes(type)
                      ? undefined
                      : 'var(--background)',
                    color: filters.assetTypes?.includes(type)
                      ? '#000000'
                      : 'var(--foreground)',
                    border: '3px solid var(--border-color)',
                    boxShadow: filters.assetTypes?.includes(type)
                      ? '2px 2px 0px 0px var(--shadow-color)'
                      : 'none',
                  }}
                >
                  {type === 'lst' ? 'Liquid Stake' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <div className="text-neutral text-xs font-bold uppercase mb-2 md:mb-3 tracking-wide">
              Quick Filters
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <button
                onClick={toggleStablecoins}
                className={`px-2 md:px-4 py-1.5 md:py-2 text-xs font-bold uppercase transition-all ${
                  filters.stablecoinsOnly ? 'bg-neo-green text-black' : ''
                }`}
                style={{
                  backgroundColor: filters.stablecoinsOnly
                    ? '#4ADE80'
                    : 'var(--background)',
                  color: filters.stablecoinsOnly
                    ? '#000000'
                    : 'var(--foreground)',
                  border: '3px solid var(--border-color)',
                  boxShadow: filters.stablecoinsOnly
                    ? '2px 2px 0px 0px var(--shadow-color)'
                    : 'none',
                }}
              >
                Stablecoins Only
              </button>
            </div>
          </div>

          {/* Min APY */}
          <div>
            <div className="text-neutral text-xs font-bold uppercase mb-2 md:mb-3 tracking-wide">
              Min APY:{' '}
              <span style={{ color: 'var(--foreground)' }}>
                {filters.minApy !== undefined ? `${filters.minApy}%` : 'Any'}
              </span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
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
                className="flex-1 accent-neo-red h-3 cursor-pointer"
              />
              <div
                className="w-14 md:w-16 px-2 md:px-3 py-1.5 md:py-2 text-center font-bold text-sm"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '3px solid var(--border-color)',
                }}
              >
                {filters.minApy || 0}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
