import { ConnectModal } from '@mysten/dapp-kit';
import { useState } from 'react';
import { useYieldData, calculatePotentialEarnings } from '../hooks/useYieldData';
import { useUserHoldings } from '../hooks/useUserHoldings';
import type { PersonalizedYield } from '../types/yield';
import BigNumber from 'bignumber.js';

export function MyYields() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { yields, isLoading: yieldsLoading } = useYieldData();
  const { holdings, isLoading: holdingsLoading, isConnected } = useUserHoldings();

  // Match user holdings with yield opportunities
  const personalizedYields: PersonalizedYield[] = [];

  if (holdings.length > 0 && yields.length > 0) {
    for (const holding of holdings) {
      // Find yield opportunities for this asset
      const matchingYields = yields.filter(
        (y) =>
          y.assetSymbol.toUpperCase() === holding.symbol.toUpperCase()
      );

      for (const yield_ of matchingYields) {
        const balance = parseFloat(holding.balance);
        const earnings = calculatePotentialEarnings(balance, yield_.apy);

        personalizedYields.push({
          ...yield_,
          userBalance: holding.balance,
          potentialEarningsDaily: earnings.daily,
          potentialEarningsYearly: earnings.yearly,
        });
      }
    }
  }

  // Sort by potential yearly earnings
  personalizedYields.sort(
    (a, b) => (b.potentialEarningsYearly || 0) - (a.potentialEarningsYearly || 0)
  );

  // Not connected state
  if (!isConnected) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-terminal-green font-mono text-3xl font-bold tracking-tight mb-2">
            &gt; MY_YIELDS<span className="animate-blink">_</span>
          </h1>
          <p className="text-terminal-green-dim font-mono text-sm">
            Personalized yield opportunities based on your holdings
          </p>
        </div>

        <div className="card-brutal text-center py-16">
          <div className="text-6xl mb-4">
            <span className="text-terminal-green">$</span>
          </div>
          <div className="text-terminal-amber font-mono text-xl mb-2">
            &gt; WALLET_NOT_CONNECTED
          </div>
          <p className="text-terminal-white/60 font-mono text-sm mb-6 max-w-md mx-auto">
            Connect your wallet to scan your holdings and discover personalized yield opportunities.
          </p>
          <ConnectModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            trigger={
              <button className="btn-brutal">
                <span className="flex items-center gap-2">
                  <span className="text-terminal-amber">&gt;</span>
                  CONNECT_WALLET
                </span>
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const isLoading = yieldsLoading || holdingsLoading;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-terminal-green font-mono text-3xl font-bold tracking-tight mb-2">
          &gt; MY_YIELDS<span className="animate-blink">_</span>
        </h1>
        <p className="text-terminal-green-dim font-mono text-sm">
          Yield opportunities for your current holdings
        </p>
      </div>

      {/* Holdings Summary */}
      <div className="card-brutal mb-6">
        <div className="text-terminal-green-dim text-xs font-mono uppercase mb-3">
          &gt; YOUR HOLDINGS
        </div>
        {holdingsLoading ? (
          <div className="text-terminal-green font-mono animate-pulse">
            Scanning wallet...
          </div>
        ) : holdings.length === 0 ? (
          <div className="text-terminal-amber font-mono">
            No tokens found in wallet
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {holdings.slice(0, 10).map((holding) => (
              <div
                key={holding.coinType}
                className="px-3 py-2 border-2 border-terminal-green/50 bg-terminal-black"
              >
                <div className="text-terminal-green font-mono font-bold">
                  {holding.symbol}
                </div>
                <div className="text-terminal-white/60 font-mono text-xs">
                  {new BigNumber(holding.balance).toFormat(4)}
                </div>
              </div>
            ))}
            {holdings.length > 10 && (
              <div className="px-3 py-2 border-2 border-terminal-green/30 text-terminal-green-dim font-mono text-sm flex items-center">
                +{holdings.length - 10} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card-brutal text-center py-12">
          <div className="text-terminal-green font-mono text-xl animate-pulse">
            &gt; ANALYZING YIELDS<span className="animate-blink">...</span>
          </div>
          <div className="text-terminal-green-dim font-mono text-sm mt-2">
            Matching your holdings with yield opportunities
          </div>
        </div>
      )}

      {/* No Opportunities State */}
      {!isLoading && personalizedYields.length === 0 && holdings.length > 0 && (
        <div className="card-brutal text-center py-12">
          <div className="text-terminal-amber font-mono text-xl">
            &gt; NO_OPPORTUNITIES_FOUND
          </div>
          <div className="text-terminal-amber/70 font-mono text-sm mt-2">
            No yield opportunities match your current holdings.
          </div>
          <div className="text-terminal-white/40 font-mono text-xs mt-4">
            Consider acquiring SUI, USDC, or other supported assets.
          </div>
        </div>
      )}

      {/* Personalized Yields */}
      {!isLoading && personalizedYields.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-brutal">
              <div className="text-terminal-green-dim text-xs font-mono uppercase mb-1">
                OPPORTUNITIES
              </div>
              <div className="text-terminal-green font-mono text-2xl font-bold">
                {personalizedYields.length}
              </div>
            </div>
            <div className="card-brutal">
              <div className="text-terminal-green-dim text-xs font-mono uppercase mb-1">
                BEST APY
              </div>
              <div className="text-terminal-green font-mono text-2xl font-bold text-glow">
                {personalizedYields[0]?.apy.toFixed(2)}%
              </div>
            </div>
            <div className="card-brutal-amber">
              <div className="text-terminal-amber/60 text-xs font-mono uppercase mb-1">
                EST. YEARLY EARNINGS
              </div>
              <div className="text-terminal-amber font-mono text-2xl font-bold">
                {personalizedYields
                  .reduce((sum, y) => sum + (y.potentialEarningsYearly || 0), 0)
                  .toFixed(2)}{' '}
                <span className="text-sm">tokens</span>
              </div>
            </div>
          </div>

          {/* Yield List */}
          <div className="space-y-4">
            {personalizedYields.map((yield_, index) => (
              <PersonalizedYieldCard key={yield_.id} yield_={yield_} rank={index + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Specialized card for personalized yields
function PersonalizedYieldCard({
  yield_,
  rank,
}: {
  yield_: PersonalizedYield;
  rank: number;
}) {
  return (
    <div className="card-brutal flex flex-col md:flex-row md:items-center gap-4">
      {/* Rank */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 flex items-center justify-center border-2 border-terminal-green bg-terminal-black font-mono font-bold text-terminal-green">
          {rank}
        </div>
      </div>

      {/* Asset Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-terminal-green font-bold uppercase tracking-wider">
            {yield_.assetSymbol}
          </span>
          <span className="text-terminal-green-dim text-xs">
            via {yield_.protocolName}
          </span>
        </div>
        <div className="text-terminal-white/60 font-mono text-sm">
          Your Balance: {new BigNumber(yield_.userBalance).toFormat(4)} {yield_.assetSymbol}
        </div>
      </div>

      {/* APY */}
      <div className="flex-shrink-0 text-right">
        <div className="text-terminal-green-dim text-xs font-mono uppercase">APY</div>
        <div className="text-terminal-green font-mono text-2xl font-bold">
          {yield_.apy.toFixed(2)}%
        </div>
      </div>

      {/* Potential Earnings */}
      <div className="flex-shrink-0 text-right border-l border-terminal-green/30 pl-4">
        <div className="text-terminal-amber/60 text-xs font-mono uppercase">
          EST. DAILY
        </div>
        <div className="text-terminal-amber font-mono text-lg font-bold">
          +{yield_.potentialEarningsDaily?.toFixed(4)}
        </div>
        <div className="text-terminal-white/40 font-mono text-xs">
          ~{yield_.potentialEarningsYearly?.toFixed(2)}/yr
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        <a
          href={`https://${yield_.protocol}.fi`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutal text-xs whitespace-nowrap"
        >
          DEPOSIT →
        </a>
      </div>
    </div>
  );
}
