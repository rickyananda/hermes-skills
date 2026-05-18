# Example: cappuccinov4.xyz Analysis (May 2026)

## Overview
- URL: https://cappuccinov4.xyz/
- Type: NFT (Fractionalized NFTs)
- Blockchain: Ethereum
- Twitter: @Fraccapy

## Technical Findings

### Website Stack
- React 19.1.0 + Vite + Tailwind CSS
- TanStack Router + React Query
- Framer Motion animations
- Single JS bundle: `assets/index-BnAQQYbf.js`
- Google Fonts (Inter)

### Source Code Revealed
The JS bundle contained full app logic including:
- Vault system (Surface/Deep/Abyss) with XP costs (20/50/150 XP)
- Reward tiers: GTD (Gold), PRIORITY (Silver), WL (Pass), FCFS (Bronze)
- Daily missions system with XP rewards
- Leaderboard and referral system
- Backend API calls (likely Supabase or similar BaaS)
- NO smart contract addresses anywhere in the code
- NO wallet interaction code visible (just "Connect Wallet" button)

### Domain Info
- whois unavailable (command not found)
- RDAP lookup timed out
- .xyz TLD (cheap, commonly used by scam projects)

### Twitter/X Profile (extracted from `__INITIAL_STATE__` JSON)
```
created_at: 2026-05-14T04:30:06.000Z  ← 2 DAYS OLD
followers_count: 515
friends_count: 3
statuses_count: 2
is_blue_verified: true (PAID, not organizational)
description: "Fractionalized NFTs own pieces of NFTs, earn fees..."
```

## Red Flags Found
- [x] Anonymous team (no identities)
- [x] Account < 30 days old (2 days!)
- [x] No smart contract audit
- [x] No contract address published
- [x] Gamification (XP, vaults, missions) with no product
- [x] Paid blue check (not organizational)
- [x] .xyz domain
- [x] Only 2 tweets on account
- [x] Reward tiers without explaining what they unlock
- [x] "Underground" framing

## Green Flags Found
- [ ] None significant

## Verdict: 🔴 DANGER — Likely scam/engagement farming
Multiple critical red flags. Anonymous team, 2-day-old account, gamification without product, no contract address, no audit. Classic pre-rug-pull engagement farming pattern.

## Recommendation
Do NOT connect wallet. If already connected, revoke via https://revoke.cash
