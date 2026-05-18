# Case Study: cappuccinov4.xyz Scam Investigation

## Target
- `cappuccinov4.xyz` — "Underground Access Network" / Fractionalized NFTs
- `@Fraccapy` on Twitter/X

## Infrastructure
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind v4 |
| Backend | Express.js on Google Cloud Run |
| Domain | Name.com (WHOIS privacy) |
| DNS | Google Cloud IP (34.111.179.208) |
| Replit | TXT record: `replit-verify=UUID` |

## Key Findings

### 1. Replit Verification UUID in DNS TXT
```
replit-verify=364c9adf-c311-410c-ac7b-25cff5e84bda
```
Proves the developer used Replit to verify the domain. UUID is NOT publicly searchable.

### 2. Google Form Phishing
Pinned tweet contained `tinyurl.com/yt7rm58a` → redirected to Google Form "Fraccapy WL Application" collecting:
- X Username
- Social media engagement (Like, RT, Quote)
- "Are you here for Tech or gambling?" (filtering gullible targets)
- **Wallet Address** (the real goal)

### 3. Mass-Following Growth Hack
- 651 followers, **20,263 following**
- Classic pattern: follow thousands → get follow-backs → appear popular

### 4. Account Age
- Twitter created: May 14, 2026 (2 days old at time of investigation)
- Only 2 tweets

### 5. Backend API Endpoints
```
GET  /api/stats          → {totalUsers: 267, totalVaultOpens: 577}
GET  /api/leaderboard    → [{rank, username, points, rewardCount}]
GET  /api/missions       → daily missions
GET  /api/users/by-wallet/{addr} → user lookup
POST /api/users/register → register
POST /api/vaults/open    → open vault
```

### 6. Gamification Red Flags
- XP points system
- 3 vault types (Surface/Deep/Abyss) with lootbox mechanics
- Daily missions
- Leaderboard
- Referral system (+10 XP per referral)
- Reward tiers: Gold Pass, Silver Pass, WL, Bronze

## Scam Score: 15/16 (Confirmed Scam)
- Domain < 30 days: +2
- Anonymous team: +2
- No audit/contract: +2
- "Connect Wallet": +3
- Forms collecting wallet: +3
- Mass-following: +2
- Gamification without product: +2
- No Discord/Telegram: +1
- Paid blue check: +1

## Investigation Techniques Used
1. DNS TXT record analysis (found Replit UUID)
2. JS bundle API route extraction
3. Shortened URL redirect following (tinyurl → viglink → Google Form)
4. Google Form field analysis
5. Twitter account forensics (age, follower ratio, tweet count)
6. Deployment fingerprinting (Google Cloud Run, Express.js)
7. Backend API enumeration
8. Cross-platform username search (GitHub, GitLab, Replit, Reddit, etc.)
