// Known coin types on Sui mainnet
export const COIN_TYPES = {
  SUI: '0x2::sui::SUI',
  USDC: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  USDT: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
  WETH: '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
  WBTC: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
  // LSTs
  AFSUI: '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
  HASUI: '0xbde4ba4c2e274a60ce15c1cfff9e5c42e136a8bc::hasui::HASUI',
  VSUI: '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
} as const;

// Coin decimals
export const COIN_DECIMALS: Record<string, number> = {
  SUI: 9,
  USDC: 6,
  USDT: 6,
  WETH: 8,
  WBTC: 8,
  AFSUI: 9,
  HASUI: 9,
  VSUI: 9,
};

// Protocol object IDs (mainnet)
export const PROTOCOL_OBJECTS = {
  // Suilend
  SUILEND: {
    LENDING_MARKET: '0xa1a86f0f01be9c31ec9a10dc8d4a70d87eb3c6c61a0fb3219c56c5c23a99f25d',
  },

  // NAVI Protocol
  NAVI: {
    STORAGE: '0xbb4e2f4b6205c6e93d31d3d8b1e44a4f8e5a6e9a36e0f6ca2f5c7a1e2f3b4c5d',
    POOL_CONFIG: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },

  // Scallop
  SCALLOP: {
    MARKET: '0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9',
    VERSION: '0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7',
  },

  // Cetus
  CETUS: {
    GLOBAL_CONFIG: '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f',
  },

  // DeepBook
  DEEPBOOK: {
    PACKAGE: '0x000000000000000000000000000000000000000000000000000000000000dee9',
  },
} as const;

// Common stablecoin addresses
export const STABLECOINS = [COIN_TYPES.USDC, COIN_TYPES.USDT];

// Format large numbers for display
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

// Parse coin type to get symbol
export function getCoinSymbol(coinType: string): string {
  // Extract the symbol from coin type
  const parts = coinType.split('::');
  if (parts.length >= 3) {
    return parts[2].toUpperCase();
  }
  return coinType.slice(0, 8);
}
