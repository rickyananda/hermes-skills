---
name: crypto-project-analysis
description: "Analyze crypto/Web3 projects for scam indicators — domain age, team doxxing, smart contract audits, wallet drainer detection, social proof, gamification red flags."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [crypto, web3, scam-detection, security, research, nft, defi]
---

# Crypto Project Analysis — Scam Detection Workflow

Analyze any crypto/Web3/NFT project for legitimacy. Returns a structured risk assessment with red flags, green flags, and a verdict. Useful for bug bounty recon, investment due diligence, or advising others.

## When to Use

- User shares a crypto project URL and asks "is this legit?"
- User asks to analyze an NFT/DeFi/GameFi project
- User suspects a project is a scam and wants evidence
- Pre-investment due diligence on any Web3 project

## Analysis Workflow

### Phase 1: Website Technical Analysis

1. **Navigate to the site** — use `browser_navigate` then `browser_console` to extract:
   - HTML meta tags (description, og:*, twitter:*)
   - All `<a>` links and their targets
   - All `<script>` sources
   - Framework detection (React/Vue/Next.js/Vite)
   - Hidden elements, iframes
   - localStorage/cookies

2. **Source code inspection** — fetch the main JS bundle via `terminal` + `curl`:
   ```bash
   curl -s "https://site.com/assets/index-XXXXX.js" | head -100
   ```
   Look for: wallet connection code, contract addresses, API endpoints, obfuscated code

3. **API endpoint discovery** — extract routes from bundled JS:
   ```bash
   # Find all API routes in the bundle
   curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '/api/[a-zA-Z0-9/_-]+' | sort -u
   
   # Find backend references
   curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP 'https?://[^\s"\\]+' | sort -u
   
   # Find package/dependency names
   curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '@[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+' | sort -u
   ```
   Then probe discovered endpoints: `curl -s "https://site.com/api/stats"` — responses reveal user counts, activity, backend tech.

4. **Source map check** — always try to access source maps:
   ```bash
   curl -sI "https://site.com/assets/index-XXXXX.js.map"  # 200 = source code exposed!
   ```
   Source maps expose original variable names, comments, file structure.

5. **Domain intelligence**:
   ```bash
   # DNS records (use Google DNS API — always works)
   curl -s "https://dns.google/resolve?name=EXAMPLE.com&type=A"
   curl -s "https://dns.google/resolve?name=EXAMPLE.com&type=NS"
   curl -s "https://dns.google/resolve?name=EXAMPLE.com&type=TXT"
   curl -s "https://dns.google/resolve?name=EXAMPLE.com&type=MX"
   
   # IP info
   curl -s "https://ipinfo.io/IP/json"
   
   # RDAP (more reliable than whois for modern TLDs)
   curl -s "https://rdap.org/domain/EXAMPLE.com" | python3 -m json.tool
   ```
   Check: registration date, registrar, nameservers, DNSSEC, TXT records.

6. **TXT record intelligence** — TXT records reveal platform usage:
   - `replit-verify=<UUID>` → developer uses Replit (try `replit.com/@username`)
   - `google-site-verification=...` → Google Search Console linked
   - `facebook-domain-verification=...` → Facebook/Meta linked
   - `v=spf1 ...` → email sender config (may reveal hosting)

7. **Hosting identification** — response headers reveal infrastructure:
   - `server: Google Frontend` + `x-powered-by: Express` = Google Cloud Run
   - `server: Vercel` = Vercel deployment
   - `server: Netlify` = Netlify deployment
   - `server: cloudflare` + `x-powered-by: Express` = Cloudflare Workers
   - `via: 1.1 google` = Google Cloud (App Engine, Cloud Run, or GCS)

### Phase 2: Social Proof & Developer Tracking

4. **Twitter/X profile** — check the linked social accounts:
   - Account creation date (new = red flag)
   - Follower/following ratio (bought followers = suspicious)
   - Tweet count and engagement quality
   - Bio and pinned tweets
   - Extract from X page HTML: look for `__INITIAL_STATE__` JSON blob containing user data including `created_at`, `followers_count`, `statuses_count`
   - **Mass following detection**: following 10,000+ with < 100 tweets = growth hack scam
   - Check pinned tweet links — often lead to Google Forms or other data collection

5. **Shortened URL tracking** — follow redirects to find hidden forms/data collectors:
   ```bash
   # Follow tinyurl/bit.ly/t.co redirects
   curl -sIL "https://tinyurl.com/XXXXX" | grep -i "location"
   curl -sIL "https://t.co/XXXXX" | grep -i "location"
   ```
   Scammers often use URL shorteners to hide Google Forms that collect wallet addresses.

6. **Google Form analysis** — if a Google Form is found:
   - Check form title and fields — wallet address collection = 🚩
   - Try `reportabuse` URL to see form metadata
   - Form ID can sometimes reveal linked spreadsheet
   - Fields asking "Are you here for tech or gambling?" = filtering for easy marks

7. **Replit/cloud platform tracking** — TXT records may reveal developer platforms:
   - `replit-verify=<UUID>` → try common username variations on `replit.com/@username`
   - Search Replit for project name
   - Check if domain was ever hosted on Replit (historical DNS)

8. **GitHub/code presence** — search for the project name on GitHub:
   ```bash
   # Search repos
   curl -s "https://api.github.com/search/repositories?q=PROJECTNAME" | python3 -c "import sys,json;d=json.load(sys.stdin);[print(r['full_name'],r['html_url']) for r in d.get('items',[])]"
   
   # Search users
   curl -s "https://api.github.com/search/users?q=USERNAME" | python3 -c "import sys,json;d=json.load(sys.stdin);[print(u['login'],u['html_url']) for u in d.get('items',[])]"
   
   # Search code
   curl -s "https://api.github.com/search/code?q=DOMAIN.xyz" | python3 -c "import sys,json;d=json.load(sys.stdin);[print(r['repository']['full_name'],r['path']) for r in d.get('items',[])]"
   ```
   - Open source? Active commits?
   - Contract verified on Etherscan/BscScan?

### Phase 3: Red Flag Checklist

Run through this checklist systematically:

**🚩 Critical Red Flags (any 2+ = likely scam):**
- [ ] "Connect Wallet" with no clear contract address published
- [ ] Anonymous team (no LinkedIn, no doxxed identities)
- [ ] Account/domain < 30 days old
- [ ] No smart contract audit from known firm (CertiK, PeckShield, Trail of Bits, OpenZeppelin)
- [ ] Gamification system (XP, levels, vaults, mystery boxes) with no actual product
- [ ] Referral/pyramid structure for earning
- [ ] Token/NFT not yet minted but promising future value
- [ ] No contract address on Etherscan/BscScan
- [ ] Google Form collecting wallet addresses
- [ ] Mass following on Twitter (10,000+ following with < 100 tweets)
- [ ] "Are you here for tech or gambling?" type questions (filtering for easy marks)
- [ ] Promising "access passes" (Gold/Silver/Bronze) that unlock nothing specific

**⚠️ Warning Flags (individually minor, collectively concerning):**
- [ ] Paid blue check (Twitter Blue) not organizational verification
- [ ] .xyz, .site, .fun domain (cheap, anonymous)
- [ ] Heavy use of buzzwords ("fractionalized", "AI-powered", "revolutionary")
- [ ] Only 1-2 social accounts, low activity
- [ ] "Underground" or "exclusive" framing
- [ ] Reward tiers (Gold/Silver/Bronze) without explaining what they unlock
- [ ] Leaderboard/gamification designed to create FOMO
- [ ] No Discord/Telegram community (legit projects build communities)
- [ ] Express.js backend with `CORS: *` (open to any origin = careless)
- [ ] "Fractionalized NFTs" without explaining the actual token standard
- [ ] ERC-804 or other obscure standards mentioned without Etherscan link

**✅ Green Flags (individually positive):**
- [ ] Doxxed team with verifiable backgrounds
- [ ] Audited smart contract (verify on auditor's site, not just claimed)
- [ ] Open source code on GitHub
- [ ] Active community with real discussion (not just "wen moon")
- [ ] Working product/testnet available
- [ ] Clear tokenomics documentation
- [ ] Contract verified on block explorer with source code

### Phase 4: Wallet Drainer Detection

If the site has "Connect Wallet" functionality:

1. **Check what permissions it requests** — legitimate sites request minimal permissions
2. **Look for `setApprovalForAll`** calls — this grants full access to all NFTs/tokens
3. **Check for known drainer kits** in the source: search for patterns like:
   - `approve(`, `setApprovalForAll(`
   - References to known drainer services (Inferno Drainer, Pink Drainer, Angel Drainer, Monkey Drainer)
   - Obfuscated code sections
4. **Check if contract is verified** on Etherscan — unverified = suspicious

### Phase 5: Verdict

Rate the project on a scale:
- 🟢 **LOW RISK** — Multiple green flags, audited, doxxed team, working product
- 🟡 **CAUTION** — Mixed signals, proceed with research, don't connect wallet yet
- 🟠 **HIGH RISK** — Multiple red flags, likely scam or rug pull
- 🔴 **DANGER** — Wallet drainer confirmed or overwhelming scam indicators

## Output Format

```
## [Project Name] Analysis

### Overview
- URL: ...
- Type: (NFT/DeFi/GameFi/Token/Other)
- Blockchain: (Ethereum/Solana/BNB/etc)

### Findings
[Structured red/green flags]

### Verdict
[Risk level with reasoning]

### Recommendation
[What the user should do]
```

## Pitfalls

- **Don't just check the website** — social proof and contract verification are equally important
- **Twitter X `__INITIAL_STATE__`** — when curling X profiles, the initial state JSON contains user data even without JS execution. Look for `created_at`, `followers_count`, `statuses_count` fields
- **Paid verification ≠ legitimacy** — Twitter Blue (paid) is not the same as organizational verification
- **Audit claims need verification** — always check the auditor's website directly, don't trust logos on the project site
- **"Connect Wallet" ≠ scam** — legitimate dApps need wallet connection. The red flag is when the site asks for broad approvals or has no visible contract address
- **Gamification alone isn't proof** — but gamification + no product + anonymous team + new domain = classic engagement farming before rug pull
- **Whois may be blocked** — use RDAP (`https://rdap.org/domain/EXAMPLE`) instead of whois commands
- **Google search may return empty** — curl-based Google searches get blocked. Use browser tools for web research instead
- **DNS `whois` command may not be installed** — use `curl -s "https://dns.google/resolve?name=DOMAIN&type=A"` as a portable alternative
- **Source maps are a goldmine** — always check `.map` files. If exposed, you get original file paths, comments, variable names, and full source
- **API routes hide in bundled JS** — `grep -oP '/api/[a-zA-Z0-9/_-]+'` on the main bundle reveals the entire backend API surface
- **TXT records reveal platforms** — `replit-verify`, `google-site-verification`, `facebook-domain-verification` all leak developer tooling
- **Replit UUIDs are dead ends** — `replit-verify=<UUID>` confirms Replit usage but there's no public API to resolve UUID → username. Try common username variations instead
- **Replit search is blocked by Cloudflare** — even CloakBrowser gets a "Sorry, you have been blocked" page when accessing `replit.com/search`. Don't waste time trying to search Replit for project names or usernames. Use Google/DuckDuckGo with `site:replit.com` instead, or try direct `replit.com/@username` URLs
- **Google Forms collect wallet addresses** — scammers use Forms to harvest wallets, then send malicious airdrops or phishing transactions
- **"Are you here for tech or gambling?"** — this question filters victims. People who answer "gambling" are more likely to fall for get-rich-quick schemes
- **IP addresses from cloud providers are useless** — Google Cloud, AWS, Cloudflare IPs don't reveal the developer. Don't waste time on IP geolocation for cloud-hosted sites
- **Mass following is a growth hack** — accounts following 10,000+ people with few tweets are using follow-back schemes to inflate numbers

## References

- See `references/analysis-template.md` for a quick-reference checklist
