# Case Study: cappuccinov4.xyz (May 2026)

## Overview
- **URL:** https://cappuccinov4.xyz
- **Type:** NFT / Fractionalized NFT / Gamified Access Network
- **Blockchain:** Ethereum (wallet connect requested, no contract published)
- **Verdict:** 🔴 DANGER — Classic engagement farming / wallet harvesting scam

## Technical Findings

### Infrastructure
- **Server:** Google Cloud Run (Express.js backend)
- **Headers:** `server: Google Frontend`, `x-powered-by: Express`, `via: 1.1 google`
- **IP:** 34.111.179.208 (Google LLC, Kansas City — useless for tracking)
- **Frontend:** React 19.1.0 + Vite + Tailwind CSS v4
- **Backend:** Express.js with `CORS: access-control-allow-origin: *`
- **Domain registrar:** Name.com
- **Nameservers:** ns1cny.name.com, ns2ckr.name.com, ns3jkl.name.com, ns4hny.name.com

### API Endpoints Discovered (from JS bundle)
```
GET  /api/stats          → 267 users, 577 vault opens
GET  /api/leaderboard    → Top users with XP
GET  /api/missions       → Daily missions
GET  /api/users/by-wallet/{addr} → Lookup user by wallet
POST /api/users/register → Register new user
POST /api/vaults/open    → Open vault (spend XP)
```

### TXT Records
```
replit-verify=364c9adf-c311-410c-ac7b-25cff5e84bda
```
→ Developer uses Replit. No public account found under @fraccapy, @cappuccinov4, or variations.

### Source Code
- Single JS bundle: `assets/index-BnAQQYbf.js` (500KB)
- No source maps exposed
- No developer comments, emails, or GitHub references
- Uses: React Query (TanStack), Framer Motion, Radix UI, Recharts
- Custom wallet connect implementation (no Wagmi/Rainbow/MetaMask SDK)

## Social Proof Findings

### Twitter: @Fraccapy
- **Created:** May 14, 2026 (3 days old at time of analysis)
- **Followers:** 651
- **Following:** 20,263 ← mass follow growth hack
- **Tweets:** 2
- **Verified:** Blue (paid)
- **Pinned tweet:** Promotes Google Form for "WL Application"
- **No Discord/Telegram** community

### Google Form (from pinned tweet)
- **URL:** https://docs.google.com/forms/d/e/1FAIpQLScXyofLFMqpB30CdDboCUljBHuHV2f8gmTvHkQEZpyVRxcURQ/viewform
- **Title:** "Fraccapy WL Application"
- **Fields collected:**
  1. X Username (required)
  2. Like, RT and Quote "Ready to experiment ERC-804"
  3. "Are you here for Tech or gambling?" ← victim filtering
  4. Wallet Address ← 🚩 wallet harvesting

### Red Flags Triggered
- [x] "Connect Wallet" with no contract address
- [x] Anonymous team
- [x] Domain < 30 days old
- [x] No smart contract audit
- [x] Gamification (XP, vaults, mystery boxes) with no product
- [x] Referral structure
- [x] Token/NFT not yet minted
- [x] No contract on Etherscan
- [x] Google Form collecting wallet addresses
- [x] Mass following (20,263 with 2 tweets)
- [x] "Tech or gambling" victim filtering
- [x] Vague "access passes" (Gold/Silver/Bronze)
- [x] Paid blue check
- [x] .xyz domain
- [x] No Discord/Telegram
- [x] CORS: * (careless backend)

**Score: 16/16 red flags triggered**

## Key Techniques Used
1. DNS TXT record analysis → found Replit verification UUID
2. JS bundle API route extraction → discovered backend surface
3. Shortened URL redirect following → found Google Form
4. Google Form field analysis → confirmed wallet harvesting
5. X `__INITIAL_STATE__` parsing → got account creation date, follower counts
6. Response header analysis → identified Google Cloud Run hosting
7. GitHub API search → confirmed no public code presence

## Lessons Learned
- Replit UUIDs are dead ends — no public API to resolve them
- IP geolocation is useless for cloud-hosted scam sites
- Google Forms are a common wallet harvesting vector
- "Are you here for tech or gambling?" is a victim filtering question
- Mass following (10,000+) with few tweets = growth hack scam
- Express.js + CORS: * on Google Cloud Run = careless developer
