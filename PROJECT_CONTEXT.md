# sui yield0r - Project Context

> Real-time yield discovery engine for the Sui blockchain.
> **Read-only intelligence tool** - NOT a staking platform.

## Current Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2 + Vite 7.3 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4 (Pop-Art Neo-Brutalism theme, dark/light mode) |
| State | @tanstack/react-query 5.62 |
| Blockchain | @mysten/sui 1.45.2, @mysten/dapp-kit 0.19.11 |
| Router | react-router-dom 7.1 |
| Analytics | @vercel/analytics |

## Data Sources

### Hybrid Approach: Native SDKs + DefiLlama Fallback

**Phase 1: Native SDK Fetchers (Priority)**
- Direct SDK integration for accurate pool data and deep links
- Protocols with native integration: Suilend, NAVI, Scallop, Cetus, Turbos, Aftermath, Haedal, SpringSui, Volo

**Phase 2: DefiLlama Yields API (Fallback)**
- **Endpoint**: `https://yields.llama.fi/pools`
- **Coverage**: ~305 Sui pools
- **Update Frequency**: Hourly
- **Data**: APY (base + rewards), TVL, stablecoin flags, IL risk, reward tokens

### Notes
- Native SDKs are tried first for more accurate deep links
- DefiLlama supplements data for protocols without native integration
- Deep links are generated dynamically using `src/integrations/deepLinks.ts`
- Token symbols are sanitized using `src/integrations/tokenUtils.ts`

## Installed Packages

### Dependencies
- `react`, `react-dom` - UI framework
- `@mysten/sui` - Sui SDK for blockchain interaction
- `@mysten/dapp-kit` - Wallet connection & dApp utilities
- `@mysten/deepbook` - DeepBook CLOB integration (reserved)
- `@tanstack/react-query` - Data fetching & caching
- `bignumber.js` - Precise decimal math
- `react-router-dom` - Client-side routing

### Protocol SDKs
- `@suilend/sdk` - Suilend lending protocol
- `@naviprotocol/lending` - NAVI Protocol lending
- `@scallop-io/sui-scallop-sdk` - Scallop lending
- `@cetusprotocol/cetus-sui-clmm-sdk` - Cetus CLMM pools
- `turbos-clmm-sdk` - Turbos Finance pools
- `aftermath-ts-sdk` - Aftermath liquid staking
- `@flowx-finance/sdk` - FlowX DEX

### DevDependencies
- `tailwindcss`, `postcss`, `autoprefixer` - CSS tooling
- `typescript`, `typescript-eslint` - Type safety
- `vite`, `@vitejs/plugin-react` - Build tooling
- `eslint`, `eslint-plugin-react-*` - Linting

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header with wallet connect
│   ├── Layout.tsx          # Main layout wrapper
│   ├── WalletConnect.tsx   # Wallet connection button/modal
│   ├── YieldCard.tsx       # Individual yield opportunity card
│   ├── YieldFilters.tsx    # Filter controls for yields
│   ├── ErrorDisplay.tsx    # Error/warning display components
│   ├── NeoCard.tsx         # Neo-brutalist card component
│   ├── NeoButton.tsx       # Neo-brutalist button/tag/input components
│   └── index.ts
├── hooks/
│   ├── useYieldData.ts     # Main yield data fetching hook
│   ├── useUserHoldings.ts  # User wallet holdings hook
│   └── index.ts
├── integrations/           # Native protocol SDK integrations
│   ├── index.ts            # Aggregator (Native + DefiLlama hybrid)
│   ├── types.ts            # Integration types
│   ├── deepLinks.ts        # Protocol deep link generator
│   ├── tokenUtils.ts       # Token symbol sanitization
│   ├── suilend.ts          # Suilend SDK integration
│   ├── navi.ts             # NAVI Protocol integration
│   ├── scallop.ts          # Scallop integration
│   ├── cetus.ts            # Cetus CLMM integration
│   ├── turbos.ts           # Turbos integration
│   ├── aftermath.ts        # Aftermath liquid staking
│   └── liquidStaking.ts    # Haedal, SpringSui, Volo
├── lib/
│   ├── constants.ts        # Coin types, protocol addresses
│   └── protocols/
│       ├── index.ts        # Protocol fetcher (uses integrations)
│       └── defillama.ts    # DefiLlama API integration
├── providers/
│   └── SuiProvider.tsx     # Sui/Wallet provider setup
├── types/
│   └── yield.ts            # TypeScript types & protocol configs
├── views/
│   ├── Leaderboard.tsx     # Global yield leaderboard
│   └── MyYields.tsx        # Personalized yields view
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
└── index.css               # Tailwind + Neo-Brutalist styles
```

## Protocol Integration Status

| Protocol | Source | Status | Deep Links |
|----------|--------|--------|------------|
| Suilend | Native SDK | ✅ Live | `suilend.fi/dashboard?asset=X` |
| NAVI Protocol | Native + DefiLlama | ✅ Live | `app.naviprotocol.io/` |
| Scallop | Native + DefiLlama | ✅ Live | `app.scallop.io/` |
| Cetus | Native SDK | ✅ Live | `app.cetus.zone/liquidity/deposit?poolAddress=X` |
| Turbos | Native SDK | ✅ Live | `app.turbos.finance/fun/{poolId}` |
| Aftermath | Native SDK | ✅ Live | `aftermath.finance/stake` |
| Haedal | Native | ✅ Live | `haedal.xyz/stake` |
| SpringSui | Native | ✅ Live | `springsui.com/` |
| Volo | Native | ✅ Live | `stake.volo.fi/` |
| Bluefin | DefiLlama | ✅ Live | `trade.bluefin.io/swap` |
| FlowX | DefiLlama | ✅ Live | `flowx.finance/liquidity` |
| Kriya | DefiLlama | ✅ Live | `app.kriya.finance/earn` |
| Momentum | DefiLlama | ✅ Live | `app.mmt.finance/liquidity` |
| Full Sail | DefiLlama | ✅ Live | `fullsail.finance/liquidity` |
| Kai Finance | DefiLlama | ✅ Live | `kai.finance/vaults` |
| Bucket | DefiLlama | ✅ Live | `app.bucketprotocol.io/tank` |
| DeepBook | DefiLlama | ✅ Live | `deepbook.tech` |

## Implemented Features

- [x] Project scaffold (Vite + React + TypeScript)
- [x] Tailwind CSS with Pop-Art Neo-Brutalism theme
- [x] Dark/Light mode toggle (CSS variables-based theming)
- [x] Wallet connection via @mysten/dapp-kit
- [x] Yield Leaderboard (global view)
  - Filterable by protocol (18 protocols), asset type
  - Sortable by APY
  - Search functionality
  - Stablecoins filter
- [x] My Yields (personalized view)
  - Scans user wallet for holdings
  - Matches holdings with yield opportunities
  - Shows potential earnings estimates
- [x] Real-time data from DefiLlama Yields API
- [x] Error/warning display for failed fetches
- [x] Protocol-specific APY breakdowns (base + rewards)
- [x] Protocol logos (inline SVG) on yield cards
- [x] Reward token display ("Earn" section showing BLUE, SCA, CETUS, etc.)
- [x] Direct protocol URLs (Open button links directly to protocol pages)
- [x] Consistent card heights (flexbox layout with min-heights)
- [x] Vercel Analytics integration
- [x] Responsive design (mobile-friendly)

## Error Handling

The app tracks and displays errors from data fetching:
- **Critical Errors**: Failed API calls, network issues (red cards)
- **Warnings**: Unavailable APY data, estimated values (yellow cards)

Users can click the warning badge to see detailed error messages.

## Known Limitations

1. **DefiLlama Dependency**: All data sourced from DefiLlama Yields API, updated hourly.
2. **Protocol URLs**: Open buttons link to protocol main pages, not specific pools (most protocols use client-side routing).
3. **Reward Tokens**: Some reward token addresses may not resolve to symbols (shown as truncated addresses).

## Design Philosophy

**Pop-Art Neo-Brutalism** - High energy, bold, and unapologetic:

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#FFFDF5` | Cream white base |
| Foreground | `#000000` | Pure black text |
| Neo Red | `#FF6B6B` | Primary actions, buttons |
| Neo Teal | `#4ECDC4` | Secondary highlights |
| Neo Yellow | `#FFE66D` | Accents, tags, warnings |
| Neo Green | `#A3E635` | Success states, stablecoins |
| Neo Blue | `#60A5FA` | Lending type indicator |
| Neo Purple | `#A78BFA` | LP type indicator |
| Neo Orange | `#FB923C` | Vault type, warnings |
| Neo Pink | `#F472B6` | Farm type indicator |

### Visual Characteristics
- **Dual Theme**: Light mode (cream `#FFFDF5`) and Dark mode (dark `#1a1a1a`)
- **Hard Shadows**: `4px 4px 0px 0px var(--shadow-color)` - NO blur
- **Thick Borders**: 3px solid `var(--border-color)` on all containers
- **Bold Typography**: Uppercase, heavy weight, high contrast
- **Interactive Feedback**:
  - Hover: Lift up (`-2px, -2px`) with larger shadow
  - Active: Press down (`+4px, +4px`) with no shadow

### CSS Variables (Theme Support)
```css
:root {
  --background: #FFFDF5;
  --foreground: #000000;
  --border-color: #000000;
  --shadow-color: #000000;
}
.dark {
  --background: #1a1a1a;
  --foreground: #ffffff;
  --border-color: #ffffff;
  --shadow-color: #ffffff;
}
```

### Component Classes
```css
.card-neo       /* White card with black border and shadow */
.btn-neo        /* Red button with press animation */
.btn-neo-teal   /* Teal secondary button */
.btn-neo-outline /* White button, yellow on hover */
.input-neo      /* Input with focus lift effect */
.tag-neo        /* Yellow tag/badge */
.tag-neo-teal   /* Teal tag */
.tag-neo-red    /* Red tag */
.tag-neo-green  /* Green tag */
```

### Asset Type Color Coding
| Type | Color | Class |
|------|-------|-------|
| Lending | Blue | `bg-neo-blue` |
| LP | Purple | `bg-neo-purple` |
| LST | Teal | `bg-neo-teal` |
| Vault | Orange | `bg-neo-orange` |
| Farm | Pink | `bg-neo-pink` |
| Staking | Green | `bg-neo-green` |

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Reference

### DefiLlama Yields API
- **Endpoint**: `GET https://yields.llama.fi/pools`
- **Filter**: `chain === 'Sui'`
- **Fields Used**: pool, project, symbol, tvlUsd, apy, apyBase, apyReward, stablecoin, ilRisk

### DefiLlama TVL API
- **Endpoint**: `GET https://api.llama.fi/tvl/{protocol-slug}`
- **Used For**: Suilend, SpringSui, Haedal TVL

---
*Last updated: Dec 17, 2025 - Native SDK integrations, hybrid fetching, dynamic deep links, token sanitization*
