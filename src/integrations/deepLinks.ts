/**
 * Deep Link Generation for Sui DeFi Protocols
 * Generates specific URLs that take users directly to the relevant pool/market
 */

import type { Protocol, AssetType } from '../types/yield';
import { formatTokenSymbol, parseLPSymbol } from './tokenUtils';

interface DeepLinkParams {
  protocol: Protocol;
  symbol: string;
  assetType: AssetType;
  poolAddress?: string;
  poolId?: string;
  underlyingTokens?: string[];
}

/**
 * Generate a specific deep link to a protocol's pool/market
 */
export function generateDeepLink(params: DeepLinkParams): string {
  const { protocol, symbol, assetType, poolAddress, poolId, underlyingTokens } = params;
  const cleanSymbol = formatTokenSymbol(symbol);
  const lpPair = parseLPSymbol(symbol);

  switch (protocol) {
    // ==================== LENDING PROTOCOLS ====================

    case 'suilend':
      // Suilend dashboard with asset parameter
      return `https://suilend.fi/dashboard?asset=${cleanSymbol}`;

    case 'navi':
      // NAVI market page - uses root path with market selection
      return `https://app.naviprotocol.io/`;

    case 'scallop':
      // Scallop lend page
      return `https://app.scallop.io/`;

    // ==================== CLMM DEXes ====================

    case 'cetus':
      // Cetus uses pool address for liquidity
      if (poolAddress) {
        return `https://app.cetus.zone/liquidity/deposit?poolAddress=${poolAddress}`;
      }
      if (lpPair) {
        return `https://app.cetus.zone/swap?from=${lpPair.token0}&to=${lpPair.token1}`;
      }
      return 'https://app.cetus.zone/liquidity';

    case 'turbos':
      // Turbos uses pool ID for fun page
      if (poolId) {
        // Extract just the pool identifier if it's a full DefiLlama ID
        const cleanPoolId = poolId.replace('defillama-', '');
        return `https://app.turbos.finance/fun/${cleanPoolId}`;
      }
      if (poolAddress) {
        return `https://app.turbos.finance/fun/${poolAddress}`;
      }
      return 'https://app.turbos.finance/#/pools';

    case 'bluefin':
      // Bluefin spot trading
      if (lpPair) {
        return `https://trade.bluefin.io/swap/${lpPair.token0}_${lpPair.token1}`;
      }
      return 'https://trade.bluefin.io/swap';

    // ==================== AMM DEXes ====================

    case 'flowx':
      // FlowX liquidity
      if (lpPair && underlyingTokens && underlyingTokens.length >= 2) {
        return `https://flowx.finance/liquidity/add?token0=${underlyingTokens[0]}&token1=${underlyingTokens[1]}`;
      }
      return 'https://flowx.finance/liquidity';

    case 'kriya':
      // Kriya earn/pools
      if (assetType === 'lp') {
        return 'https://app.kriya.finance/earn';
      }
      return 'https://app.kriya.finance/spot/swap';

    case 'momentum':
      // Momentum DEX (MMT Finance)
      return 'https://app.mmt.finance/liquidity';

    case 'fullsail':
      // Full Sail liquidity
      return 'https://fullsail.finance/liquidity';

    // ==================== LIQUID STAKING ====================

    case 'aftermath':
      // Aftermath staking
      return 'https://aftermath.finance/stake';

    case 'haedal':
      // Haedal staking
      return 'https://haedal.xyz/stake';

    case 'springsui':
      // SpringSui staking
      return 'https://www.springsui.com/';

    case 'volo':
      // Volo staking
      return 'https://stake.volo.fi/';

    // ==================== YIELD / VAULT ====================

    case 'kai':
      // Kai Finance vaults
      return 'https://kai.finance/vaults';

    case 'bucket':
      // Bucket Protocol tank (stability pool)
      return 'https://app.bucketprotocol.io/tank';

    // ==================== ORDER BOOK ====================

    case 'deepbook':
      // DeepBook doesn't have a direct UI
      return 'https://deepbook.tech';

    default:
      return '';
  }
}

/**
 * Generate URL for specific asset within a protocol
 * Returns the best possible direct link
 */
export function getAssetUrl(
  protocol: Protocol,
  symbol: string,
  poolAddress?: string,
  poolId?: string,
  underlyingTokens?: string[]
): string {
  const assetType = symbol.includes('-') || symbol.includes('/') ? 'lp' : 'lending';

  return generateDeepLink({
    protocol,
    symbol,
    assetType,
    poolAddress,
    poolId,
    underlyingTokens,
  });
}

/**
 * Check if a protocol supports deep links with specific assets
 */
export function supportsAssetDeepLink(protocol: Protocol): boolean {
  const supported: Protocol[] = ['suilend', 'cetus', 'turbos', 'flowx', 'bluefin'];
  return supported.includes(protocol);
}

/**
 * Get the base URL for a protocol (fallback)
 */
export function getProtocolBaseUrl(protocol: Protocol): string {
  const baseUrls: Record<Protocol, string> = {
    suilend: 'https://suilend.fi',
    navi: 'https://app.naviprotocol.io',
    scallop: 'https://app.scallop.io',
    cetus: 'https://app.cetus.zone',
    turbos: 'https://app.turbos.finance',
    bluefin: 'https://trade.bluefin.io',
    flowx: 'https://flowx.finance',
    kriya: 'https://app.kriya.finance',
    aftermath: 'https://aftermath.finance',
    haedal: 'https://haedal.xyz',
    springsui: 'https://www.springsui.com',
    volo: 'https://volo.fi',
    bucket: 'https://app.bucketprotocol.io',
    kai: 'https://kai.finance',
    deepbook: 'https://deepbook.tech',
    momentum: 'https://app.mmt.finance',
    fullsail: 'https://fullsail.finance',
    other: '',
  };

  return baseUrls[protocol] || '';
}
