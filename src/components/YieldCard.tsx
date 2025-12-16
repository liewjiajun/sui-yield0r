import type { ReactElement } from 'react';
import type { YieldOpportunity, Protocol } from '../types/yield';
import { PROTOCOL_CONFIGS } from '../types/yield';
import { getRewardTokenSymbol } from '../lib/constants';

interface YieldCardProps {
  yield_: YieldOpportunity;
  rank?: number;
  showUserBalance?: boolean;
  userBalance?: string;
}

// Protocol logo components (inline SVGs for reliability)
const ProtocolLogo = ({ protocol, size = 32 }: { protocol: Protocol; size?: number }) => {
  const config = PROTOCOL_CONFIGS[protocol];
  const color = config?.color || '#6b7280';

  // Simple geometric logos based on protocol
  const logos: Record<Protocol, ReactElement> = {
    suilend: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M10 16 L16 10 L22 16 L16 22 Z" fill="white" />
        <circle cx="16" cy="16" r="4" fill={color} />
      </svg>
    ),
    navi: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="6" fill={color} />
        <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    scallop: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M16 6 Q24 12 24 20 Q16 26 8 20 Q8 12 16 6" fill="white" />
      </svg>
    ),
    cetus: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <ellipse cx="16" cy="16" rx="10" ry="6" fill="white" />
        <circle cx="20" cy="14" r="2" fill={color} />
      </svg>
    ),
    turbos: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="4" fill={color} />
        <path d="M8 16 L14 10 L14 14 L24 14 L24 18 L14 18 L14 22 Z" fill="white" />
      </svg>
    ),
    bluefin: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M8 16 Q16 8 24 16 Q16 24 8 16" fill="white" />
        <circle cx="19" cy="15" r="2" fill={color} />
      </svg>
    ),
    flowx: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="6" fill={color} />
        <path d="M8 20 Q12 12 16 16 Q20 20 24 12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    kriya: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">K</text>
      </svg>
    ),
    aftermath: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="4" fill={color} />
        <path d="M16 6 L24 26 L16 20 L8 26 Z" fill="white" />
      </svg>
    ),
    haedal: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M10 20 L16 8 L22 20 Z" fill="white" />
        <circle cx="16" cy="18" r="3" fill={color} />
      </svg>
    ),
    springsui: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M12 22 Q16 10 20 22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="16" cy="12" r="3" fill="white" />
      </svg>
    ),
    volo: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="6" fill={color} />
        <path d="M8 10 L16 22 L24 10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bucket: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M10 12 L10 22 L22 22 L22 12 Z" fill="white" />
        <path d="M8 12 L24 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    kai: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="4" fill={color} />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">KAI</text>
      </svg>
    ),
    deepbook: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <rect x="10" y="10" width="12" height="12" rx="2" fill="white" />
        <path d="M12 14 L20 14 M12 18 L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    momentum: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <rect x="2" y="2" width="28" height="28" rx="4" fill={color} />
        <path d="M8 22 L14 10 L18 18 L24 8" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    fullsail: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M12 24 L12 10 L24 18 Z" fill="white" />
      </svg>
    ),
    other: (
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill={color} />
        <circle cx="16" cy="16" r="6" fill="white" />
      </svg>
    ),
  };

  return logos[protocol] || logos.other;
};

// Reward token badge colors
const getTokenColor = (symbol: string): string => {
  const colors: Record<string, string> = {
    'SUI': '#4DA2FF',
    'CETUS': '#06b6d4',
    'BLUE': '#2563eb',
    'DEEP': '#8b5cf6',
    'vSUI': '#14b8a6',
    'stSUI': '#22c55e',
    'SCA': '#10b981',
    'sSUI': '#10b981',
    'WAL': '#f59e0b',
    'MMT': '#FF6B35',
    'SAIL': '#00D4AA',
    'oSAIL': '#00D4AA',
  };
  return colors[symbol] || '#6b7280';
};

export function YieldCard({ yield_, rank, showUserBalance, userBalance }: YieldCardProps) {
  const protocol = PROTOCOL_CONFIGS[yield_.protocol];

  const getApyColor = (apy: number) => {
    if (apy >= 20) return '#FF6B6B';
    if (apy >= 10) return '#FB923C';
    if (apy >= 5) return '#4ECDC4';
    return 'var(--foreground)';
  };

  const formatApy = (apy: number) => {
    if (apy >= 100) return apy.toFixed(0);
    if (apy >= 10) return apy.toFixed(1);
    return apy.toFixed(2);
  };

  const getTypeTag = (type: string) => {
    const config: Record<string, { label: string; variant: string }> = {
      lending: { label: 'LEND', variant: 'bg-neo-blue' },
      lp: { label: 'LP', variant: 'bg-neo-purple' },
      lst: { label: 'LST', variant: 'bg-neo-teal' },
      staking: { label: 'STAKE', variant: 'bg-neo-green' },
      vault: { label: 'VAULT', variant: 'bg-neo-orange' },
      farm: { label: 'FARM', variant: 'bg-neo-pink' },
    };
    return config[type] || { label: type.toUpperCase(), variant: 'bg-neutral' };
  };

  const getProtocolLink = () => {
    // Priority: direct pool URL > protocol website
    if (yield_.url && yield_.url !== '') {
      return yield_.url;
    }
    return protocol?.website || '#';
  };

  // Parse reward tokens
  const rewardTokens = (yield_.rewardTokens || [])
    .map(token => getRewardTokenSymbol(token))
    .filter((t): t is string => t !== null && t !== 'None');

  const typeConfig = getTypeTag(yield_.type);
  const protocolLink = getProtocolLink();

  return (
    <div
      className="card-neo p-4 md:p-5 hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-75 group h-full w-full flex flex-col"
      style={{
        boxShadow: '4px 4px 0px 0px var(--shadow-color)',
      }}
    >
      {/* Header with Protocol Logo - Fixed Height */}
      <div className="flex items-start justify-between mb-3 md:mb-4 min-h-[56px] md:min-h-[64px]">
        <div className="flex items-center gap-2 md:gap-3">
          {rank && (
            <div
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-neo-yellow font-bold text-base md:text-lg text-black flex-shrink-0"
              style={{ border: '3px solid var(--border-color)' }}
            >
              {rank}
            </div>
          )}
          {/* Protocol Logo */}
          <div
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              border: '3px solid var(--border-color)',
              backgroundColor: 'var(--background)',
            }}
          >
            <ProtocolLogo protocol={yield_.protocol} size={28} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              <span
                className="font-bold text-sm md:text-base uppercase tracking-wide truncate max-w-[120px] md:max-w-[150px]"
                style={{ color: 'var(--foreground)' }}
                title={yield_.assetSymbol}
              >
                {yield_.assetSymbol}
              </span>
              <span
                className={`px-1.5 md:px-2 py-0.5 text-xs font-bold uppercase text-black flex-shrink-0 ${typeConfig.variant}`}
                style={{ border: '2px solid var(--border-color)' }}
              >
                {typeConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-neutral text-xs md:text-sm font-medium truncate">
                {protocol?.name || yield_.protocolName}
              </span>
              {yield_.isStablecoin && (
                <span
                  className="px-1 py-0.5 text-[10px] font-bold uppercase text-black bg-neo-green flex-shrink-0"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  $
                </span>
              )}
              {yield_.type === 'lp' && yield_.ilRisk === 'yes' && (
                <span
                  className="px-1 py-0.5 text-[10px] font-bold uppercase text-black bg-neo-red flex-shrink-0"
                  style={{ border: '1px solid var(--border-color)' }}
                  title="Impermanent Loss Risk"
                >
                  IL
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APY Display - Fixed Height */}
      <div
        className="mb-3 md:mb-4 p-3 md:p-4 min-h-[100px] md:min-h-[110px]"
        style={{
          backgroundColor: 'var(--background)',
          border: '3px solid var(--border-color)',
        }}
      >
        <div className="text-neutral text-xs font-bold uppercase mb-1 tracking-wide">
          APY
        </div>
        <div className="text-3xl md:text-4xl font-bold" style={{ color: getApyColor(yield_.apy) }}>
          {yield_.apy === 0 ? (
            <span className="text-neutral text-xl md:text-2xl">N/A</span>
          ) : (
            `${formatApy(yield_.apy)}%`
          )}
        </div>

        {/* APY Breakdown - Always show space */}
        <div
          className="mt-2 md:mt-3 pt-2 md:pt-3 min-h-[24px]"
          style={{ borderTop: '2px solid var(--border-color)' }}
        >
          {yield_.apyBase !== undefined && yield_.apyBase > 0 ? (
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-neutral font-medium">Base:</span>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>
                {yield_.apyBase.toFixed(2)}%
              </span>
            </div>
          ) : yield_.apyReward !== undefined && yield_.apyReward > 0 ? (
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-neo-teal font-medium">Rewards:</span>
              <span className="font-bold text-neo-teal">+{yield_.apyReward.toFixed(2)}%</span>
            </div>
          ) : (
            <div className="text-neutral text-xs opacity-50">—</div>
          )}
        </div>
      </div>

      {/* Middle Section - Flex Grow to fill space */}
      <div className="flex-grow flex flex-col gap-3 md:gap-4">
        {/* Reward Tokens - Fixed Height */}
        <div className="min-h-[52px]">
          <div className="text-neutral text-xs font-bold uppercase mb-2 tracking-wide">
            Earn
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[26px]">
            {rewardTokens.length > 0 ? (
              <>
                {rewardTokens.slice(0, 3).map((token, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs font-bold uppercase text-white"
                    style={{
                      backgroundColor: getTokenColor(token),
                      border: '2px solid var(--border-color)',
                    }}
                  >
                    {token}
                  </span>
                ))}
                {rewardTokens.length > 3 && (
                  <span
                    className="px-2 py-1 text-xs font-bold uppercase"
                    style={{
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '2px solid var(--border-color)',
                    }}
                  >
                    +{rewardTokens.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span
                className="px-2 py-1 text-xs font-bold uppercase"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '2px solid var(--border-color)',
                  opacity: 0.5,
                }}
              >
                Base yield
              </span>
            )}
          </div>
        </div>

        {/* TVL - Fixed Height */}
        <div className="min-h-[44px]">
          <div className="text-neutral text-xs font-bold uppercase mb-1 tracking-wide">
            TVL
          </div>
          <div className="font-bold text-base md:text-lg" style={{ color: 'var(--foreground)' }}>
            ${yield_.tvlFormatted || (yield_.tvl ? formatTvl(yield_.tvl) : '—')}
          </div>
        </div>
      </div>

      {/* User Balance (if showing personalized yields) */}
      {showUserBalance && userBalance && (
        <div
          className="pt-3 md:pt-4 mt-3 md:mt-4"
          style={{ borderTop: '3px solid var(--border-color)' }}
        >
          <div
            className="p-2 md:p-3 bg-neo-yellow"
            style={{ border: '2px solid var(--border-color)' }}
          >
            <div className="text-xs font-bold uppercase mb-1 tracking-wide text-black">
              Your Balance
            </div>
            <div className="font-bold text-black">
              {userBalance} {yield_.assetSymbol}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Always at bottom */}
      <div
        className="flex items-center justify-between mt-auto pt-3 md:pt-4"
        style={{ borderTop: '2px solid var(--border-color)' }}
      >
        <div className="text-neutral text-xs font-medium">
          {new Date(yield_.lastUpdated).toLocaleTimeString()}
        </div>
        {protocolLink !== '#' && protocolLink !== '' ? (
          <a
            href={protocolLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 md:px-4 py-1.5 md:py-2 bg-neo-teal text-black font-bold text-xs uppercase hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex items-center gap-1.5"
            style={{
              border: '2px solid var(--border-color)',
              boxShadow: '2px 2px 0px 0px var(--shadow-color)',
            }}
          >
            Open
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ) : (
          <span
            className="px-3 md:px-4 py-1.5 md:py-2 font-bold text-xs uppercase cursor-not-allowed"
            style={{
              backgroundColor: 'var(--background)',
              border: '2px solid var(--border-color)',
              color: 'var(--foreground)',
              opacity: 0.4,
            }}
          >
            No Link
          </span>
        )}
      </div>
    </div>
  );
}

// Helper to format TVL numbers
function formatTvl(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}
