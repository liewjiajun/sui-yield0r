import { ConnectModal } from '@mysten/dapp-kit';
import { useState } from 'react';
import { useYieldData, calculatePotentialEarnings } from '../hooks/useYieldData';
import { useUserHoldings } from '../hooks/useUserHoldings';
import type { PersonalizedYield } from '../types/yield';
import { symbolContainsAsset } from '../types/yield';
import BigNumber from 'bignumber.js';

export function MyYields() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { yields, isLoading: yieldsLoading } = useYieldData();
  const { holdings, isLoading: holdingsLoading, isConnected } = useUserHoldings();

  // Match user holdings with yield opportunities
  const personalizedYields: PersonalizedYield[] = [];

  if (holdings.length > 0 && yields.length > 0) {
    for (const holding of holdings) {
      // Find yield opportunities for this asset (including LP tokens that contain the asset)
      const matchingYields = yields.filter((y) =>
        symbolContainsAsset(y.assetSymbol, holding.symbol)
      );

      for (const yield_ of matchingYields) {
        const balance = parseFloat(holding.balance);
        // For LP tokens, estimate half the balance is used for each side
        const isLpToken = yield_.assetSymbol.includes('-') || yield_.assetSymbol.includes('/');
        const effectiveBalance = isLpToken ? balance * 0.5 : balance;
        const earnings = calculatePotentialEarnings(effectiveBalance, yield_.apy);

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
        <div className="mb-6 md:mb-8">
          <h1
            className="font-bold text-2xl md:text-4xl tracking-tight mb-2 uppercase"
            style={{ color: 'var(--foreground)' }}
          >
            My Yields
          </h1>
          <p className="text-neutral text-sm md:text-lg font-medium">
            Personalized yield opportunities based on your holdings
          </p>
        </div>

        <div
          className="card-neo text-center py-12 md:py-16"
          style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
        >
          <div
            className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-neo-yellow flex items-center justify-center"
            style={{
              border: '3px solid var(--border-color)',
              boxShadow: '4px 4px 0px 0px var(--shadow-color)',
            }}
          >
            <span className="text-black text-3xl md:text-4xl font-bold">$</span>
          </div>
          <div
            className="font-bold text-xl md:text-2xl mb-2 uppercase"
            style={{ color: 'var(--foreground)' }}
          >
            Wallet Not Connected
          </div>
          <p className="text-neutral font-medium mb-6 max-w-md mx-auto text-sm md:text-base px-4">
            Connect your wallet to scan your holdings and discover personalized yield opportunities.
          </p>
          <ConnectModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            trigger={
              <button className="btn-neo">
                Connect Wallet
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
      <div className="mb-6 md:mb-8">
        <h1
          className="font-bold text-2xl md:text-4xl tracking-tight mb-2 uppercase"
          style={{ color: 'var(--foreground)' }}
        >
          My Yields
        </h1>
        <p className="text-neutral text-sm md:text-lg font-medium">
          Yield opportunities for your current holdings
        </p>
      </div>

      {/* Holdings Summary */}
      <div
        className="card-neo p-4 md:p-6 mb-4 md:mb-6"
        style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
      >
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <span
            className="px-2 md:px-3 py-1 bg-neo-teal font-bold text-xs md:text-sm uppercase text-black"
            style={{ border: '2px solid var(--border-color)' }}
          >
            Your Holdings
          </span>
        </div>
        {holdingsLoading ? (
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 md:w-6 md:h-6 animate-spin"
              style={{ border: '3px solid var(--border-color)', borderTopColor: '#4ECDC4' }}
            ></div>
            <span className="font-medium text-sm md:text-base" style={{ color: 'var(--foreground)' }}>
              Scanning wallet...
            </span>
          </div>
        ) : holdings.length === 0 ? (
          <div
            className="px-3 md:px-4 py-2 md:py-3 bg-neo-yellow inline-block font-medium text-black text-sm md:text-base"
            style={{ border: '2px solid var(--border-color)' }}
          >
            No tokens found in wallet
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 md:gap-3">
            {holdings.slice(0, 10).map((holding) => (
              <div
                key={holding.coinType}
                className="px-3 md:px-4 py-2 md:py-3"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '3px solid var(--border-color)',
                  boxShadow: '2px 2px 0px 0px var(--shadow-color)',
                }}
              >
                <div className="font-bold uppercase text-sm md:text-base" style={{ color: 'var(--foreground)' }}>
                  {holding.symbol}
                </div>
                <div className="text-neutral font-medium text-xs md:text-sm">
                  {new BigNumber(holding.balance).toFormat(4)}
                </div>
              </div>
            ))}
            {holdings.length > 10 && (
              <div
                className="px-3 md:px-4 py-2 md:py-3 bg-neo-yellow flex items-center font-bold text-black text-sm"
                style={{ border: '3px solid var(--border-color)' }}
              >
                +{holdings.length - 10} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          className="card-neo text-center py-8 md:py-12"
          style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
        >
          <div
            className="font-bold text-xl md:text-2xl mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Analyzing Yields...
          </div>
          <div className="text-neutral font-medium text-sm md:text-base">
            Matching your holdings with yield opportunities
          </div>
          <div className="mt-4 flex justify-center">
            <div
              className="w-8 h-8 animate-spin"
              style={{ border: '3px solid var(--border-color)', borderTopColor: '#4ECDC4' }}
            ></div>
          </div>
        </div>
      )}

      {/* No Opportunities State */}
      {!isLoading && personalizedYields.length === 0 && holdings.length > 0 && (
        <div
          className="bg-neo-yellow p-6 md:p-8 text-center"
          style={{
            border: '3px solid var(--border-color)',
            boxShadow: '4px 4px 0px 0px var(--shadow-color)',
          }}
        >
          <div className="text-black font-bold text-xl md:text-2xl mb-2 uppercase">
            No Opportunities Found
          </div>
          <div className="text-black/70 font-medium mb-2 text-sm md:text-base">
            No yield opportunities match your current holdings.
          </div>
          <div className="text-black/50 font-medium text-xs md:text-sm">
            Consider acquiring SUI, USDC, or other supported assets.
          </div>
        </div>
      )}

      {/* Personalized Yields */}
      {!isLoading && personalizedYields.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <div
              className="card-neo p-4 md:p-5"
              style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
            >
              <div className="text-neutral text-xs font-bold uppercase mb-1 tracking-wide">
                Opportunities
              </div>
              <div className="font-bold text-2xl md:text-3xl" style={{ color: 'var(--foreground)' }}>
                {personalizedYields.length}
              </div>
            </div>
            <div
              className="bg-neo-green p-4 md:p-5"
              style={{
                border: '3px solid var(--border-color)',
                boxShadow: '4px 4px 0px 0px var(--shadow-color)',
              }}
            >
              <div className="text-black/60 text-xs font-bold uppercase mb-1 tracking-wide">
                Best APY
              </div>
              <div className="text-black font-bold text-2xl md:text-3xl">
                {personalizedYields[0]?.apy.toFixed(2)}%
              </div>
            </div>
            <div
              className="bg-neo-yellow p-4 md:p-5"
              style={{
                border: '3px solid var(--border-color)',
                boxShadow: '4px 4px 0px 0px var(--shadow-color)',
              }}
            >
              <div className="text-black/60 text-xs font-bold uppercase mb-1 tracking-wide">
                Est. Yearly
              </div>
              <div className="text-black font-bold text-2xl md:text-3xl">
                {personalizedYields
                  .reduce((sum, y) => sum + (y.potentialEarningsYearly || 0), 0)
                  .toFixed(2)}
                <span className="text-base md:text-lg font-medium ml-1">tokens</span>
              </div>
            </div>
          </div>

          {/* Yield List */}
          <div className="space-y-3 md:space-y-4">
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
    <div
      className="card-neo p-4 md:p-5 flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4 hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
      style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        <div
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-neo-yellow font-bold text-lg md:text-xl text-black"
          style={{ border: '3px solid var(--border-color)' }}
        >
          {rank}
        </div>
      </div>

      {/* Asset Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-bold text-base md:text-lg uppercase tracking-wide"
            style={{ color: 'var(--foreground)' }}
          >
            {yield_.assetSymbol}
          </span>
          <span className="text-neutral font-medium text-xs md:text-sm">
            via {yield_.protocolName}
          </span>
        </div>
        <div className="text-neutral font-medium text-sm">
          Your Balance:{' '}
          <span className="font-bold" style={{ color: 'var(--foreground)' }}>
            {new BigNumber(yield_.userBalance).toFormat(4)} {yield_.assetSymbol}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-2 md:gap-3 lg:flex-nowrap">
        {/* APY */}
        <div
          className="flex-shrink-0 text-center p-2 md:p-3 bg-neo-green min-w-[80px] md:min-w-[100px]"
          style={{ border: '2px solid var(--border-color)' }}
        >
          <div className="text-black/60 text-xs font-bold uppercase">APY</div>
          <div className="text-black font-bold text-lg md:text-2xl">
            {yield_.apy.toFixed(2)}%
          </div>
        </div>

        {/* Potential Earnings */}
        <div
          className="flex-shrink-0 text-center p-2 md:p-3 bg-neo-yellow min-w-[100px] md:min-w-[120px]"
          style={{ border: '2px solid var(--border-color)' }}
        >
          <div className="text-black/60 text-xs font-bold uppercase">
            Est. Daily
          </div>
          <div className="text-black font-bold text-lg md:text-xl">
            +{yield_.potentialEarningsDaily?.toFixed(4)}
          </div>
          <div className="text-black/50 font-medium text-xs">
            ~{yield_.potentialEarningsYearly?.toFixed(2)}/yr
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0 flex items-center">
          {yield_.url ? (
            <a
              href={yield_.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 md:px-6 py-2 md:py-3 bg-neo-red text-black font-bold uppercase text-sm hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all inline-flex items-center gap-2"
              style={{
                border: '3px solid var(--border-color)',
                boxShadow: '2px 2px 0px 0px var(--shadow-color)',
              }}
            >
              Deposit
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ) : (
            <span
              className="px-4 md:px-6 py-2 md:py-3 font-bold uppercase text-sm opacity-50 cursor-not-allowed"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                border: '3px solid var(--border-color)',
              }}
            >
              No Link
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
