# Monitoring Dashboard Pattern

Real-time dashboard for tracking multi-account grinding progress.

## Architecture

Node.js HTTP server serving:
- `/` — HTML dashboard with auto-refresh (5s polling)
- `/api/data` — JSON endpoint reading results + wallet files

## Key Implementation Details

### Server (netrun_dashboard.js)
- Reads `netrun_grind_results.json` for completed wallet data
- Reads `netrun_wallets.json` for total wallet count
- Queries Solana RPC for main wallet balance on each API call
- Port 8888 default

### Frontend Features
- Progress bar (wallets done / total)
- Total actions counter with per-type breakdown (tokens, mints, domains, NFTs, listed)
- Estimated leaderboard score (actions × 10)
- SOL usage tracking
- Per-wallet table with clickable Solana Explorer links
- Color-coded action breakdown bars
- Auto-refresh every 5 seconds

### Data Flow
```
netrun_grind_only.mjs → writes → netrun_grind_results.json
netrun_dashboard.js → reads → netrun_grind_results.json + netrun_wallets.json
browser → polls → /api/data (every 5s)
```

## Styling
- Dark theme (#0a0a0f background)
- Gradient title (green → cyan → pink)
- Monospace font (JetBrains Mono)
- Cards with subtle borders (#1a1a2e)
- Color scheme: green=tokens, cyan=mints, yellow=domains, pink=NFTs, orange=listed

## Pitfalls
- Node.js template literals with backticks need careful escaping in write_file
- `process.stdout.write()` needed for real-time output in background processes
- Dashboard server and grinder script can run simultaneously (grinder writes, dashboard reads)
