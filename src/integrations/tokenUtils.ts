/**
 * Token Sanitization Utilities
 * Converts raw CoinType addresses to human-readable symbols
 */

// Common Sui token CoinTypes to symbols
export const COIN_TYPE_MAP: Record<string, string> = {
  // Native SUI
  '0x2::sui::SUI': 'SUI',

  // USDC variants
  '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC': 'USDC',
  '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN': 'wUSDC',

  // USDT variants
  '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN': 'wUSDT',
  '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT': 'USDT',

  // Wrapped ETH
  '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN': 'wETH',
  '0xd0e89b2af5e4910726fbcd8b8dd37bb79b29e5f83f7491bca830e94f7f226d29::eth::ETH': 'ETH',

  // Wrapped BTC
  '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN': 'wBTC',

  // Stablecoins
  '0x909cba62ce96d54de25bec9502de5ca7b4f28901747bbf96b76c2e63ec5f1cba::sbuck::SBUCK': 'SBUCK',
  '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK': 'BUCK',
  '0x960b531667636f39e85867775f52f6b1f220a058c4de786905bdf761e06a56bb::usdy::USDY': 'USDY',
  '0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX': 'NAVX',

  // Liquid Staking Tokens
  '0xbde4ba4c2e274a60ce15c1cfff9e5c42e136a8bc::certSUI::CERTSUI': 'vSUI',
  '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT': 'vSUI',
  '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI': 'sSUI',
  '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI': 'afSUI',
  '0xbde4ba4c2e274a60ce15c1cfff9e5c42e136a8bc::hasui::HASUI': 'haSUI',

  // Protocol tokens
  '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS': 'CETUS',
  '0xa198f3be41cda8c07b3bf3fee02263526e535d682499806979a111e88a5a8d0f::coin::COIN': 'BLUE',
  '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA': 'SCA',
  '0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::coin::COIN': 'TURBOS',
  '0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2::ausd::AUSD': 'AUSD',
  '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP': 'DEEP',

  // WAL token
  '0x9f992cc2430a1f442ca7a5ca7638169f5d5c00e0ebc3977a65e9ac6e497fe5ef::wal::WAL': 'WAL',

  // Meme tokens
  '0xb7844e289a8410e50fb3ca48d69eb9cf29e27d223ef90353fe1bd8e27ff8f3f8::coin::COIN': 'FUD',
  '0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD': 'FUD',
};

// Protocol reward token symbols
export const REWARD_TOKEN_MAP: Record<string, string> = {
  'BLUE': 'BLUE',
  'SCA': 'SCA',
  'CETUS': 'CETUS',
  'DEEP': 'DEEP',
  'MMT': 'MMT',
  'SAIL': 'SAIL',
  'NAVX': 'NAVX',
  'TURBOS': 'TURBOS',
  'vSUI': 'vSUI',
  'stSUI': 'stSUI',
  'afSUI': 'afSUI',
  'haSUI': 'haSUI',
  'sSUI': 'sSUI',
};

/**
 * Extract symbol from CoinType address
 * @param coinType - Full CoinType address (e.g., "0x...::usdc::USDC")
 * @returns Human-readable symbol (e.g., "USDC")
 */
export function formatTokenSymbol(coinType: string): string {
  // Check direct mapping first
  if (COIN_TYPE_MAP[coinType]) {
    return COIN_TYPE_MAP[coinType];
  }

  // Check if it's already a simple symbol
  if (!coinType.includes('::')) {
    return cleanSymbol(coinType);
  }

  // Extract from CoinType pattern: 0x...::module::SYMBOL
  const parts = coinType.split('::');
  if (parts.length >= 3) {
    return cleanSymbol(parts[parts.length - 1]);
  }

  // Fallback: return last 6 chars of address
  if (coinType.startsWith('0x') && coinType.length > 10) {
    return coinType.slice(-6).toUpperCase();
  }

  return coinType;
}

/**
 * Clean up symbol by removing common suffixes
 */
function cleanSymbol(symbol: string): string {
  return symbol
    .replace(/_LP$/i, '')
    .replace(/-TOKEN$/i, '')
    .replace(/_TOKEN$/i, '')
    .replace(/BLT$/i, '')
    .replace(/^w/, '') // Remove 'w' prefix for wrapped tokens display
    .toUpperCase();
}

/**
 * Parse LP pair symbol into individual tokens
 * @param symbol - LP symbol (e.g., "SUI-USDC" or "SUI/USDC")
 */
export function parseLPSymbol(symbol: string): { token0: string; token1: string } | null {
  const separators = ['-', '/', '_'];

  for (const sep of separators) {
    if (symbol.includes(sep)) {
      const parts = symbol.split(sep);
      if (parts.length >= 2) {
        return {
          token0: formatTokenSymbol(parts[0].trim()),
          token1: formatTokenSymbol(parts[1].trim()),
        };
      }
    }
  }

  return null;
}

/**
 * Get reward token symbol from raw token identifier
 */
export function getRewardSymbol(token: string | null | undefined): string | null {
  if (!token) return null;

  // Check reward map
  if (REWARD_TOKEN_MAP[token]) {
    return REWARD_TOKEN_MAP[token];
  }

  // Try to format as coin type
  const formatted = formatTokenSymbol(token);
  if (formatted && formatted !== token) {
    return formatted;
  }

  return null;
}

/**
 * Check if two coin types represent the same asset
 */
export function isSameAsset(coinType1: string, coinType2: string): boolean {
  const symbol1 = formatTokenSymbol(coinType1);
  const symbol2 = formatTokenSymbol(coinType2);

  // Direct match
  if (symbol1 === symbol2) return true;

  // Handle wrapped variants (e.g., wUSDC vs USDC)
  const baseSymbols1 = symbol1.replace(/^w/i, '');
  const baseSymbols2 = symbol2.replace(/^w/i, '');

  return baseSymbols1 === baseSymbols2;
}

/**
 * Determine if user needs to swap their asset to use a protocol
 */
export function needsSwap(userCoinType: string, protocolCoinType: string): boolean {
  return !isSameAsset(userCoinType, protocolCoinType);
}
