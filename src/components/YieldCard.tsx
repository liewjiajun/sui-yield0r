import type { YieldOpportunity } from '../types/yield';
import { PROTOCOL_CONFIGS } from '../types/yield';

interface YieldCardProps {
  yield_: YieldOpportunity;
  rank?: number;
  showUserBalance?: boolean;
  userBalance?: string;
}

export function YieldCard({ yield_, rank, showUserBalance, userBalance }: YieldCardProps) {
  const protocol = PROTOCOL_CONFIGS[yield_.protocol];

  const getApyColor = (apy: number) => {
    if (apy >= 20) return 'text-terminal-green text-glow';
    if (apy >= 10) return 'text-terminal-green';
    if (apy >= 5) return 'text-terminal-amber';
    return 'text-terminal-white';
  };

  const formatApy = (apy: number) => {
    if (apy >= 100) return apy.toFixed(0);
    if (apy >= 10) return apy.toFixed(1);
    return apy.toFixed(2);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lending: 'LEND',
      lp: 'LP',
      lst: 'LST',
      staking: 'STAKE',
      vault: 'VAULT',
      farm: 'FARM',
    };
    return labels[type] || type.toUpperCase();
  };

  // Get link to protocol or specific pool
  const getProtocolLink = () => {
    return yield_.url || protocol?.website || '#';
  };

  return (
    <div className="card-brutal group hover:shadow-brutal-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rank && (
            <div className="w-8 h-8 flex items-center justify-center border-2 border-terminal-green bg-terminal-black font-mono font-bold text-terminal-green">
              {rank}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-green font-bold uppercase tracking-wider">
                {yield_.assetSymbol}
              </span>
              <span className="text-terminal-green-dim text-xs border border-terminal-green-dim px-1">
                {getTypeLabel(yield_.type)}
              </span>
              {yield_.isStablecoin && (
                <span className="text-terminal-amber text-xs border border-terminal-amber px-1">
                  STABLE
                </span>
              )}
            </div>
            <div className="text-terminal-white/60 text-xs font-mono mt-1">
              {protocol?.name || yield_.protocolName}
            </div>
          </div>
        </div>

        {/* IL Risk indicator for LPs */}
        {yield_.type === 'lp' && yield_.ilRisk === 'yes' && (
          <span className="text-terminal-red text-xs font-mono" title="Impermanent Loss Risk">
            [IL]
          </span>
        )}
      </div>

      {/* APY Display */}
      <div className="mb-4">
        <div className="text-terminal-green-dim text-xs font-mono uppercase mb-1">
          &gt; APY
        </div>
        <div className={`text-4xl font-mono font-bold ${getApyColor(yield_.apy)}`}>
          {yield_.apy === 0 ? (
            <span className="text-terminal-amber text-2xl">N/A</span>
          ) : (
            `${formatApy(yield_.apy)}%`
          )}
        </div>

        {/* APY Breakdown */}
        {(yield_.apyBase !== undefined || yield_.apyReward !== undefined) && yield_.apy > 0 && (
          <div className="mt-2 text-xs font-mono space-y-1">
            {yield_.apyBase !== undefined && yield_.apyBase > 0 && (
              <div className="flex justify-between text-terminal-white/60">
                <span>BASE:</span>
                <span>{yield_.apyBase.toFixed(2)}%</span>
              </div>
            )}
            {yield_.apyReward !== undefined && yield_.apyReward > 0 && (
              <div className="flex justify-between text-terminal-amber">
                <span>REWARDS:</span>
                <span>+{yield_.apyReward.toFixed(2)}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TVL */}
      {(yield_.tvl || yield_.tvlFormatted) && (
        <div className="mb-4">
          <div className="text-terminal-green-dim text-xs font-mono uppercase mb-1">
            &gt; TVL
          </div>
          <div className="text-terminal-white font-mono">
            ${yield_.tvlFormatted || (yield_.tvl ? formatTvl(yield_.tvl) : 'N/A')}
          </div>
        </div>
      )}

      {/* User Balance (if showing personalized yields) */}
      {showUserBalance && userBalance && (
        <div className="border-t-2 border-terminal-green/30 pt-3 mt-3">
          <div className="text-terminal-amber text-xs font-mono uppercase mb-1">
            &gt; YOUR BALANCE
          </div>
          <div className="text-terminal-white font-mono">
            {userBalance} {yield_.assetSymbol}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-terminal-green/20">
        <div className="text-terminal-green-dim text-xs font-mono">
          {new Date(yield_.lastUpdated).toLocaleTimeString()}
        </div>
        <a
          href={getProtocolLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-green text-xs font-mono uppercase hover:text-glow transition-all"
        >
          [OPEN]
        </a>
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
