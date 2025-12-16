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
  // Additional tokens
  SSUI: '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI',
  CETUS: '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
  DEEP: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP',
  NS: '0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS',
  NAVX: '0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX',
  BUCK: '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK',
  FUD: '0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD',
  BLUB: '0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB',
  TURBOS: '0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS',
} as const;

// Map coin type addresses to their symbols for easy lookup
export const COIN_TYPE_TO_SYMBOL: Record<string, string> = {
  '0x2::sui::SUI': 'SUI',
  '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN': 'USDC',
  '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN': 'USDT',
  '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN': 'WETH',
  '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN': 'WBTC',
  '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI': 'AFSUI',
  '0xbde4ba4c2e274a60ce15c1cfff9e5c42e136a8bc::hasui::HASUI': 'HASUI',
  '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT': 'VSUI',
  '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI': 'SSUI',
  '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS': 'CETUS',
  '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP': 'DEEP',
  '0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS': 'NS',
  '0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX': 'NAVX',
  '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK': 'BUCK',
  '0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD': 'FUD',
  '0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB': 'BLUB',
  '0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS': 'TURBOS',
};

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
  SSUI: 9,
  CETUS: 9,
  DEEP: 6,
  NS: 6,
  NAVX: 9,
  BUCK: 9,
  FUD: 5,
  BLUB: 2,
  TURBOS: 9,
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

// Common reward token mappings (from DefiLlama format)
export const REWARD_TOKEN_SYMBOLS: Record<string, string> = {
  // Direct symbol mappings
  'BLUE': 'BLUE',
  'stSUI': 'stSUI',
  'SCA': 'SCA',
  'MMT': 'MMT',
  'SAIL': 'SAIL',
  'oSAIL': 'oSAIL',
  // Coin type to symbol mappings
  '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT': 'vSUI',
  '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS': 'CETUS',
  '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP': 'DEEP',
  '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL': 'WAL',
  '0xaafc4f740de0dd0dde642a31148fb94517087052f19afb0f7bed1dc41a50c77b::scallop_sui::SCALLOP_SUI': 'sSUI',
  '0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::SCALLOP_SCA': 'SCA',
  '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI': 'SUI',
};

// Parse reward token to readable symbol
export function getRewardTokenSymbol(token: string | null | undefined): string | null {
  if (!token) return null;

  // Check direct mapping first
  if (REWARD_TOKEN_SYMBOLS[token]) {
    return REWARD_TOKEN_SYMBOLS[token];
  }

  // If it's a short symbol (no ::), return as-is
  if (!token.includes('::')) {
    return token;
  }

  // Try to extract from coin type
  return getCoinSymbol(token);
}

// Parse coin type to get symbol
export function getCoinSymbol(coinType: string): string {
  // First check exact match in lookup table
  if (COIN_TYPE_TO_SYMBOL[coinType]) {
    return COIN_TYPE_TO_SYMBOL[coinType];
  }

  // Check for known prefixes (handle both with and without 0x prefix)
  const normalizedType = coinType.toLowerCase();
  for (const [type, symbol] of Object.entries(COIN_TYPE_TO_SYMBOL)) {
    if (normalizedType === type.toLowerCase()) {
      return symbol;
    }
  }

  // Extract the symbol from coin type
  const parts = coinType.split('::');
  if (parts.length >= 3) {
    const lastPart = parts[2].toUpperCase();
    // If the last part is generic like COIN, try to identify from known patterns
    if (lastPart === 'COIN') {
      // Check if address matches any known coin
      const address = parts[0];
      for (const [type, symbol] of Object.entries(COIN_TYPE_TO_SYMBOL)) {
        if (type.toLowerCase().startsWith(address.toLowerCase())) {
          return symbol;
        }
      }
    }
    return lastPart;
  }
  return coinType.slice(0, 8);
}
