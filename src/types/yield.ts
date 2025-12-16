// All supported protocols
export type Protocol =
  | 'suilend'
  | 'navi'
  | 'scallop'
  | 'cetus'
  | 'turbos'
  | 'bluefin'
  | 'flowx'
  | 'kriya'
  | 'aftermath'
  | 'haedal'
  | 'springsui'
  | 'volo'
  | 'bucket'
  | 'kai'
  | 'deepbook'
  | 'momentum'
  | 'fullsail'
  | 'other';

export type AssetType = 'lending' | 'lp' | 'lst' | 'staking' | 'vault' | 'farm';

export interface YieldOpportunity {
  id: string;
  protocol: Protocol;
  protocolName: string;
  protocolLogo?: string;
  asset: string;
  assetSymbol: string;
  assetLogo?: string;
  type: AssetType;
  apy: number; // Total APY as percentage (e.g., 5.5 for 5.5%)
  apyBase?: number; // Base APY from protocol
  apyReward?: number; // Reward APY from incentives
  tvl?: number; // Total Value Locked in USD
  tvlFormatted?: string; // Formatted TVL string
  chain: 'sui';
  poolAddress?: string;
  poolId?: string; // DefiLlama pool ID
  underlyingTokens?: string[];
  rewardTokens?: string[];
  isStablecoin?: boolean;
  ilRisk?: 'yes' | 'no'; // Impermanent loss risk for LPs
  lastUpdated: Date;
  url?: string; // Link to the pool
}

export interface UserHolding {
  asset: string;
  symbol: string;
  balance: string;
  decimals: number;
  coinType: string;
  usdValue?: number;
}

export interface PersonalizedYield extends YieldOpportunity {
  userBalance: string;
  potentialEarningsDaily?: number;
  potentialEarningsYearly?: number;
}

export interface YieldFilters {
  protocols?: Protocol[];
  assetTypes?: AssetType[];
  minApy?: number;
  minTvl?: number;
  searchQuery?: string;
  stablecoinsOnly?: boolean;
}

// Error tracking for fetch failures
export interface FetchError {
  protocol: string;
  source: string;
  message: string;
  timestamp: Date;
}

export interface FetchResult {
  yields: YieldOpportunity[];
  errors: FetchError[];
  lastUpdated: Date;
}

export interface ProtocolConfig {
  name: string;
  id: Protocol;
  logo: string;
  color: string;
  website: string;
  defillamaSlug?: string; // Slug used in DefiLlama API
}

export const PROTOCOL_CONFIGS: Record<Protocol, ProtocolConfig> = {
  suilend: {
    name: 'Suilend',
    id: 'suilend',
    logo: '/protocols/suilend.svg',
    color: '#6366f1',
    website: 'https://suilend.fi',
    defillamaSlug: 'suilend',
  },
  navi: {
    name: 'NAVI Protocol',
    id: 'navi',
    logo: '/protocols/navi.svg',
    color: '#3b82f6',
    website: 'https://naviprotocol.io',
    defillamaSlug: 'navi-lending',
  },
  scallop: {
    name: 'Scallop',
    id: 'scallop',
    logo: '/protocols/scallop.svg',
    color: '#10b981',
    website: 'https://scallop.io',
    defillamaSlug: 'scallop-lend',
  },
  cetus: {
    name: 'Cetus',
    id: 'cetus',
    logo: '/protocols/cetus.svg',
    color: '#06b6d4',
    website: 'https://cetus.zone',
    defillamaSlug: 'cetus-clmm',
  },
  turbos: {
    name: 'Turbos',
    id: 'turbos',
    logo: '/protocols/turbos.svg',
    color: '#8b5cf6',
    website: 'https://turbos.finance',
    defillamaSlug: 'turbos',
  },
  bluefin: {
    name: 'Bluefin',
    id: 'bluefin',
    logo: '/protocols/bluefin.svg',
    color: '#2563eb',
    website: 'https://bluefin.io',
    defillamaSlug: 'bluefin-spot',
  },
  flowx: {
    name: 'FlowX',
    id: 'flowx',
    logo: '/protocols/flowx.svg',
    color: '#f59e0b',
    website: 'https://flowx.finance',
    defillamaSlug: 'flowx-v3',
  },
  kriya: {
    name: 'Kriya',
    id: 'kriya',
    logo: '/protocols/kriya.svg',
    color: '#ec4899',
    website: 'https://kriya.finance',
    defillamaSlug: 'kriya-dex',
  },
  aftermath: {
    name: 'Aftermath',
    id: 'aftermath',
    logo: '/protocols/aftermath.svg',
    color: '#ec4899',
    website: 'https://aftermath.finance',
    defillamaSlug: 'aftermath-finance',
  },
  haedal: {
    name: 'Haedal',
    id: 'haedal',
    logo: '/protocols/haedal.svg',
    color: '#f59e0b',
    website: 'https://haedal.xyz',
    defillamaSlug: 'haedal-protocol',
  },
  springsui: {
    name: 'SpringSui',
    id: 'springsui',
    logo: '/protocols/springsui.svg',
    color: '#22c55e',
    website: 'https://springsui.com',
    defillamaSlug: 'springsui',
  },
  volo: {
    name: 'Volo',
    id: 'volo',
    logo: '/protocols/volo.svg',
    color: '#14b8a6',
    website: 'https://volo.fi',
    defillamaSlug: 'volo',
  },
  bucket: {
    name: 'Bucket Protocol',
    id: 'bucket',
    logo: '/protocols/bucket.svg',
    color: '#f97316',
    website: 'https://bucketprotocol.io',
    defillamaSlug: 'bucket-farm',
  },
  kai: {
    name: 'Kai Finance',
    id: 'kai',
    logo: '/protocols/kai.svg',
    color: '#a855f7',
    website: 'https://kai.finance',
    defillamaSlug: 'kai-finance',
  },
  deepbook: {
    name: 'DeepBook',
    id: 'deepbook',
    logo: '/protocols/deepbook.svg',
    color: '#8b5cf6',
    website: 'https://deepbook.tech',
  },
  momentum: {
    name: 'Momentum',
    id: 'momentum',
    logo: '/protocols/momentum.svg',
    color: '#FF6B35',
    website: 'https://app.mmt.finance',
    defillamaSlug: 'momentum',
  },
  fullsail: {
    name: 'Full Sail',
    id: 'fullsail',
    logo: '/protocols/fullsail.svg',
    color: '#00D4AA',
    website: 'https://fullsail.finance',
    defillamaSlug: 'full-sail',
  },
  other: {
    name: 'Other',
    id: 'other',
    logo: '/protocols/other.svg',
    color: '#6b7280',
    website: '',
  },
};

// Map DefiLlama project names to our Protocol type
export const DEFILLAMA_PROJECT_MAP: Record<string, Protocol> = {
  // Lending protocols
  'navi-lending': 'navi',
  'scallop-lend': 'scallop',
  'suilend': 'suilend',
  // DEXes / CLMMs
  'cetus-clmm': 'cetus',
  'turbos': 'turbos',
  'bluefin-spot': 'bluefin',
  'flowx-v2': 'flowx',
  'flowx-v3': 'flowx',
  'kriya-dex': 'kriya',
  'kriya-clmm': 'kriya',
  'momentum': 'momentum',
  'full-sail': 'fullsail',
  // Yield / Farm protocols
  'kai-finance': 'kai',
  'bucket-farm': 'bucket',
  // Liquid staking
  'aftermath-finance': 'aftermath',
  'aftermath-afsui': 'aftermath',
  'haedal-protocol': 'haedal',
  'springsui': 'springsui',
  'volo': 'volo',
  // DeepBook
  'deepbook': 'deepbook',
};

// Helper to check if symbol contains a user's asset (for LP matching)
export function symbolContainsAsset(yieldSymbol: string, userAsset: string): boolean {
  const normalizedYield = yieldSymbol.toUpperCase();
  const normalizedAsset = userAsset.toUpperCase();

  // Direct match
  if (normalizedYield === normalizedAsset) {
    return true;
  }

  // Check if LP token contains the asset (e.g., "SUI-USDC" contains "SUI")
  // Split by common LP separators
  const parts = normalizedYield.split(/[-\/]/);
  return parts.some(part => part.trim() === normalizedAsset);
}
