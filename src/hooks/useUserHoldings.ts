import { useQuery } from '@tanstack/react-query';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import BigNumber from 'bignumber.js';
import type { UserHolding } from '../types/yield';
import { COIN_DECIMALS, getCoinSymbol } from '../lib/constants';

export function useUserHoldings() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  const query = useQuery({
    queryKey: ['userHoldings', account?.address],
    queryFn: async () => {
      if (!account?.address) {
        return [];
      }

      // Fetch all coins owned by the user
      const coins = await client.getAllCoins({
        owner: account.address,
      });

      // Group coins by type and sum balances
      const holdingsMap = new Map<string, UserHolding>();

      for (const coin of coins.data) {
        const coinType = coin.coinType;
        const existing = holdingsMap.get(coinType);

        if (existing) {
          existing.balance = new BigNumber(existing.balance)
            .plus(coin.balance)
            .toString();
        } else {
          const symbol = getCoinSymbol(coinType);
          const decimals = COIN_DECIMALS[symbol] || 9;

          holdingsMap.set(coinType, {
            asset: coinType,
            symbol,
            balance: coin.balance,
            decimals,
            coinType,
          });
        }
      }

      // Convert to array and format balances
      const holdings: UserHolding[] = [];

      for (const [_, holding] of holdingsMap) {
        const formattedBalance = new BigNumber(holding.balance)
          .dividedBy(new BigNumber(10).pow(holding.decimals))
          .toString();

        holdings.push({
          ...holding,
          balance: formattedBalance,
        });
      }

      // Sort by balance (assuming higher balance = more relevant)
      return holdings.sort((a, b) => {
        const aVal = new BigNumber(a.balance);
        const bVal = new BigNumber(b.balance);
        return bVal.minus(aVal).toNumber();
      });
    },
    enabled: !!account?.address,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  return {
    holdings: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isConnected: !!account?.address,
  };
}

// Get holdings that have yield opportunities available
export function useHoldingsWithYields(yields: import('../types/yield').YieldOpportunity[]) {
  const { holdings, ...rest } = useUserHoldings();

  const holdingsWithYields = holdings.filter((holding) => {
    // Check if there's a yield opportunity for this asset
    return yields.some(
      (y) =>
        y.assetSymbol.toUpperCase() === holding.symbol.toUpperCase() ||
        y.asset === holding.coinType
    );
  });

  return {
    holdingsWithYields,
    ...rest,
  };
}
