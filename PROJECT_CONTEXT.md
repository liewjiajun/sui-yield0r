# sui yield0r - Project Context

> Real-time yield discovery engine for the Sui blockchain.
> **Read-only intelligence tool** - NOT a staking platform.

## Current Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2 + Vite 7.3 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3.4 (Neobrutalist/Retro-Terminal theme) |
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
└── index.css               # Tailwind + custom styles
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
- [x] Tailwind CSS with Neobrutalist/Retro-Terminal theme
  - Terminal green (#00ff41) on black (#0a0a0a)
  - Brutal shadows and hard borders
  - CRT scanline effects
  - Custom scrollbar styling
  - JetBrains Mono font
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
- **Critical Errors**: Failed API calls, network issues
- **Warnings**: Unavailable APY data, estimated values

Users can click the warning badge to see detailed error messages.

## Known Limitations

1. **Suilend**: No public API for APY data. TVL available via DefiLlama.
2. **Liquid Staking**: APY is estimated (~2.5%) based on average Sui staking rates.
3. **DefiLlama**: Data updated hourly, may not reflect real-time changes.

## Design Philosophy

**"Anti-Dashboard"** - Neobrutalist/Retro-Terminal aesthetic:
- High contrast terminal green (#00ff41) on black (#0a0a0a)
- Hard shadows, raw borders (border-3)
- Monospace fonts (JetBrains Mono)
- CRT effects (scanlines, subtle flicker)
- Data-dense, hacker-tool feel
- No rounded corners, no gradients, no soft shadows

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
*Last updated: Dec 15, 2025 - Full real data integration via DefiLlama + on-chain*
