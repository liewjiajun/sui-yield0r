# sui yield0r - Project Context

> Real-time yield discovery engine for the Sui blockchain.
> **Read-only intelligence tool** - NOT a staking platform.

## Current Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2 + Vite 7.3 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4 (Pop-Art Neo-Brutalism theme) |
| State | @tanstack/react-query 5.62 |
| Blockchain | @mysten/sui 1.45.2, @mysten/dapp-kit 0.19.11 |
| Router | react-router-dom 7.1 |

## Data Sources

### Primary: DefiLlama Yields API
- **Endpoint**: `https://yields.llama.fi/pools`
- **Coverage**: ~305 Sui pools
- **Protocols**: NAVI, Scallop, Cetus CLMM, Turbos, Bluefin, FlowX, Kai Finance
- **Update Frequency**: Hourly
- **Data**: APY (base + rewards), TVL, stablecoin flags, IL risk

### Secondary: On-Chain + DefiLlama TVL
- **Suilend**: TVL from DefiLlama, APY unavailable (no public API)
- **Liquid Staking**: SpringSui, Haedal, Aftermath, Volo (~2.5% estimated APY)

## Installed Packages

### Dependencies
- `react`, `react-dom` - UI framework
- `@mysten/sui` - Sui SDK for blockchain interaction
- `@mysten/dapp-kit` - Wallet connection & dApp utilities
- `@mysten/deepbook` - DeepBook CLOB integration (reserved)
- `@tanstack/react-query` - Data fetching & caching
- `bignumber.js` - Precise decimal math
- `react-router-dom` - Client-side routing

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
├── lib/
│   ├── constants.ts        # Coin types, protocol addresses
│   └── protocols/
│       ├── index.ts        # Protocol fetcher aggregator
│       ├── defillama.ts    # DefiLlama API integration
│       ├── suilend.ts      # Suilend on-chain + TVL
│       └── liquidStaking.ts # LST protocols (sSUI, haSUI, etc.)
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

| Protocol | Source | Status | Notes |
|----------|--------|--------|-------|
| NAVI Protocol | DefiLlama | ✅ Live | 30 pools, lending |
| Scallop | DefiLlama | ✅ Live | 21 pools, lending |
| Cetus CLMM | DefiLlama | ✅ Live | 116 pools, LP |
| Turbos | DefiLlama | ✅ Live | 43 pools, LP |
| Bluefin | DefiLlama | ✅ Live | 58 pools, LP |
| FlowX | DefiLlama | ✅ Live | 18 pools, LP |
| Kai Finance | DefiLlama | ✅ Live | 6 pools, vault |
| Bucket Farm | DefiLlama | ✅ Live | Farm yields |
| Suilend | On-chain + TVL | ⚠️ Partial | TVL only, no APY API |
| SpringSui | TVL + Estimate | ⚠️ Partial | ~2.5% estimated |
| Haedal | TVL + Estimate | ⚠️ Partial | ~2.5% estimated |
| Aftermath | TVL + Estimate | ⚠️ Partial | ~2.5% estimated |
| Volo | TVL + Estimate | ⚠️ Partial | ~2.5% estimated |

## Implemented Features

- [x] Project scaffold (Vite + React + TypeScript)
- [x] Tailwind CSS with Pop-Art Neo-Brutalism theme
- [x] Wallet connection via @mysten/dapp-kit
- [x] Yield Leaderboard (global view)
  - Filterable by protocol, asset type
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

## Error Handling

The app tracks and displays errors from data fetching:
- **Critical Errors**: Failed API calls, network issues (red cards)
- **Warnings**: Unavailable APY data, estimated values (yellow cards)

Users can click the warning badge to see detailed error messages.

## Known Limitations

1. **Suilend**: No public API for APY data. TVL available via DefiLlama.
2. **Liquid Staking**: APY is estimated (~2.5%) based on average Sui staking rates.
3. **DefiLlama**: Data updated hourly, may not reflect real-time changes.

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
- **Light Background**: White/cream (`#FFFDF5`) - NO dark mode
- **Hard Shadows**: `4px 4px 0px 0px #000000` - NO blur
- **Thick Borders**: 3px solid black on all containers
- **Bold Typography**: Uppercase, heavy weight, high contrast
- **Interactive Feedback**:
  - Hover: Lift up (`-2px, -2px`) with larger shadow
  - Active: Press down (`+4px, +4px`) with no shadow

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
*Last updated: Dec 16, 2025 - Pop-Art Neo-Brutalism UI overhaul*
