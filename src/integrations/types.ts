/**
 * Integration Types
 * Common types for protocol integrations
 */

import type { Protocol, AssetType, YieldOpportunity, FetchError } from '../types/yield';

/**
 * Raw yield data from a protocol SDK
 */
export interface RawYieldData {
  id: string;
  symbol: string;
  coinType?: string;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  tvl: number;
  poolAddress?: string;
  rewardTokens?: string[];
  underlyingTokens?: string[];
  isStablecoin?: boolean;
  ilRisk?: boolean;
}

/**
 * Protocol fetch result
 */
export interface ProtocolFetchResult {
  yields: YieldOpportunity[];
  errors: FetchError[];
  source: 'native' | 'defillama' | 'hybrid';
}

/**
 * Protocol adapter interface
 */
export interface ProtocolAdapter {
  protocol: Protocol;
  name: string;
  fetch(): Promise<ProtocolFetchResult>;
  isAvailable(): Promise<boolean>;
}

/**
 * Create a YieldOpportunity from raw data
 */
export function createYieldOpportunity(
  raw: RawYieldData,
  protocol: Protocol,
  protocolName: string,
  type: AssetType,
  url: string
): YieldOpportunity {
  return {
    id: `${protocol}-${raw.id}`,
    protocol,
    protocolName,
    asset: raw.coinType || raw.symbol,
    assetSymbol: raw.symbol,
    type,
    apy: raw.apy,
    apyBase: raw.apyBase,
    apyReward: raw.apyReward,
    tvl: raw.tvl,
    tvlFormatted: formatTvl(raw.tvl),
    chain: 'sui',
    poolAddress: raw.poolAddress,
    poolId: raw.id,
    underlyingTokens: raw.underlyingTokens,
    rewardTokens: raw.rewardTokens,
    isStablecoin: raw.isStablecoin,
    ilRisk: raw.ilRisk ? 'yes' : 'no',
    lastUpdated: new Date(),
    url,
  };
}

/**
 * Format TVL for display
 */
export function formatTvl(value: number): string {
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

/**
 * Create an error object
 */
export function createError(protocol: string, source: string, message: string): FetchError {
  return {
    protocol,
    source,
    message,
    timestamp: new Date(),
  };
}
