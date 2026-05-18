---
name: scam-site-investigation
description: Investigate suspicious websites — tech stack analysis, infrastructure fingerprinting, social media OSINT, phishing form detection, developer identity tracing. Use when user asks "is this site legit?", "analyze this website", "who's behind this site?", or shares a suspicious URL.
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [osint, scam, investigation, crypto, phishing, web-analysis, infrastructure]
metadata:
  hermes:
    tags: [research, osint, security]
---

# Scam Site Investigation

Investigate suspicious websites to determine legitimacy, identify the technology stack, trace infrastructure, and attempt to identify the operators. Primarily used for crypto/NFT/Web3 scam detection but applicable to any suspicious site.

## When to Use

- User shares a suspicious URL and asks "is this legit?"
- User asks to analyze a website for scam indicators
- User wants to know who's behind a site
- User reports a potential phishing site
- User asks about a crypto/NFT project's legitimacy

## Investigation Workflow

### Phase 1: Technical Fingerprinting

1. **Fetch the site's HTML** — look for:
   - Framework (React, Vue, Next.js, etc.)
   - Build tool (Vite, Webpack, esbuild)
   - Meta tags (description, OG tags, twitter:site)
   - External resources (fonts, CDNs, analytics)
   - Comments, developer notes

2. **Analyze the JavaScript bundle** — look for:
   - API endpoints (`/api/...` patterns)
   - Wallet addresses (`0x...`)
   - Email addresses
   - Developer comments
   - Package names (`@scope/package`)
   - Source map availability (`.map` files)

3. **Check HTTP headers** — look for:
   - `server` (nginx, Apache, cloud provider)
   - `x-powered-by` (Express, PHP, etc.)
   - `x-cloud-trace-context` (Google Cloud)
   - `via` (CDN/proxy info)
   - CORS policy (`access-control-allow-origin`)

4. **Identify hosting provider** from:
   - IP address → `ipinfo.io/{ip}/json`
   - Server headers
   - DNS records (NS, MX, TXT)
   - PTR records

### Phase 1b: Backend Discovery

4b. **Find the actual backend** — many sites hide behind Cloudflare:
   - Search JS bundle for backend URLs: `grep -oP 'https?://backend\.[^\s"\\]+' js_file`
   - Check for API base URLs: `grep -oP '`[^`]*api[^`]*`' js_file`
   - Look for `x-powered-by`, `via` headers on the backend domain separately
   - **Rust/serde fingerprint**: error like "Failed to deserialize the JSON body into the target type" → Rust backend with serde JSON
   - **Heroku fingerprint**: `via: 2.0 heroku-router` header → hosted on Heroku

4c. **Extract API routes from JS bundle**:
```bash
curl -s "https://site/assets/*.js" | grep -oP '/api/[a-zA-Z0-9/_-]+' | sort -u
```
Common patterns: `/api/dashboard`, `/api/users`, `/api/auth`, `/api/wallet`

### Phase 2: Domain & Infrastructure

5. **DNS records** — use `dns.google/resolve`:
   - A record → IP address
   - NS records → nameserver provider (Name.com, Cloudflare, etc.)
   - MX records → email provider
   - TXT records → verification tokens (Replit, Google, SPF, DKIM)
   - **Replit verify pattern**: `replit-verify=UUID` in TXT record means the domain was verified through Replit. The UUID is tied to a Replit account but NOT searchable publicly. Still useful to know the developer uses Replit.
   - **Google verify pattern**: `google-site-verification=TOKEN` → can sometimes reveal Google account info

6. **Domain registration** — check:
   - RDAP (`rdap.org/domain/{domain}`)
   - WHOIS (if RDAP unavailable)
   - Registration date (very new = suspicious)
   - Registrar (Name.com, GoDaddy, etc.)
   - Privacy protection status

7. **Certificate Transparency** — `crt.sh/?q={domain}&output=json`:
   - Other domains on same cert
   - Subdomain discovery
   - Certificate issuer

8. **Reverse IP lookup** — `api.hackertarget.com/reverseiplookup/?q={ip}`:
   - Other sites on same server
   - Shared hosting patterns

9. **Subdomain enumeration** — check common subdomains:
   - `api.`, `www.`, `admin.`, `mail.`, `dev.`, `staging.`
   - Use DNS lookup for each

### Phase 3: Social Media & Identity

10. **Find linked social accounts** from:
    - HTML meta tags (`twitter:site`, `og:see_also`)
    - Footer/header links
    - JavaScript references
    - Domain TXT records

11. **Analyze social accounts** — look for:
    - Account age (very new = suspicious)
    - Follower/following ratio (mass-following = growth hack)
    - Tweet count (very few = suspicious)
    - Blue check (paid vs earned verification)
    - Bio content and links
    - Pinned tweets
    - Engagement patterns

12. **Cross-platform username search** — check:
    - GitHub, GitLab (code repos)
    - Replit, CodeSandbox (deployment)
    - Reddit, Discord, Telegram (communities)
    - LinkedIn (professional identity)

### Phase 4: Content & Form Analysis

13. **Check for phishing indicators**:
    - "Connect Wallet" buttons (potential wallet drainer)
    - Forms collecting wallet addresses
    - Forms collecting email/passwords
    - Google Forms linked from social media
    - URL shorteners hiding destinations

13b. **Follow shortened URLs** to find hidden destinations:
```bash
# Follow tinyurl/bit.ly redirects
curl -sIL "https://tinyurl.com/xxx" 2>&1 | grep -i "location"
# Chain: often tinyurl → viglink/redirect → final destination
# Google Forms pattern: docs.google.com/forms/d/e/{FORM_ID}/viewform
```

13c. **Google Form analysis** when found:
    - Check form title and fields collected
    - Fields like "Wallet Address" + "X Username" = phishing combo
    - "Are you here for Tech or gambling?" = filtering gullible targets
    - Check `/viewanalytics` for response count
    - Check `/reportabuse` for form metadata
    - Owner email is NOT exposed in public form page
    - Response spreadsheet ID is different from form ID

14. **Analyze Google Forms** if found:
    - Form title and description
    - Fields collected (wallet, email, social media)
    - Response spreadsheet accessibility
    - Owner information (if exposed)

15. **Check for gamification/engagement farming**:
    - XP/points systems
    - Leaderboards
    - Referral programs
    - "Mystery vault" / lootbox mechanics
    - Daily missions/tasks

### Phase 5: Scoring & Verdict

16. **Score the site** based on red flags:
    - Domain age < 30 days → +2 suspicious
    - Anonymous team → +2 suspicious
    - No audit/contract address → +2 suspicious
    - "Connect Wallet" without clear contract → +3 suspicious
    - Forms collecting wallet addresses → +3 suspicious
    - Mass-following on social media → +2 suspicious
    - Gamification without real product → +2 suspicious
    - No Discord/Telegram community → +1 suspicious
    - Paid blue check (not earned) → +1 suspicious

17. **Verdict categories**:
    - **0-3**: Probably safe (but still verify)
    - **4-7**: Suspicious — proceed with caution
    - **8-12**: Likely scam — do not interact
    - **13+**: Confirmed scam — report immediately

## Key Tools

```bash
# DNS lookup
curl -s "https://dns.google/resolve?name={domain}&type=A"
curl -s "https://dns.google/resolve?name={domain}&type=NS"
curl -s "https://dns.google/resolve?name={domain}&type=TXT"

# IP info
curl -s "https://ipinfo.io/{ip}/json"

# Shodan InternetDB (NO AUTH REQUIRED — fast IP intel)
curl -s "https://internetdb.shodan.io/{ip}"
# Returns: ports, hostnames, tags, CPEs, vulns — instant, no API key
```
# Certificate transparency
curl -s "https://crt.sh/?q={domain}&output=json"

# Reverse IP lookup
curl -s "https://api.hackertarget.com/reverseiplookup/?q={ip}"

# Domain RDAP
curl -s "https://rdap.org/domain/{domain}"

# GitHub search
curl -s "https://api.github.com/search/users?q={username}"
curl -s "https://api.github.com/search/repositories?q={term}"
```

## Pitfalls

- **Google Cloud IPs are shared** — reverse IP returns thousands of unrelated domains. Don't assume they're all from the same operator.
- **Replit verification TXT records** don't reveal the username. The UUID is tied to an internal Replit account ID.
- **Google Form owner emails** are not exposed in the public form page. You need a legal request to get the owner's Google account.
- **WHOIS privacy** is standard on most registrars. Absence of WHOIS data doesn't mean suspicious — presence of data is the anomaly.
- **Mass-following on Twitter** is a common growth hack. 20,000+ following with <1,000 followers is a strong scam signal.
- **Don't assume the IP is the developer's IP** — cloud hosting (Google Cloud, AWS, Vercel) hides the customer's real IP behind infrastructure IPs.
- **Source maps** (.map files) are often not published in production. If available, they reveal the original source code.
- **`x-powered-by: Express`** is often disabled in production. Its presence suggests a less security-conscious developer.
- **CloakBrowser needed** for sites with Cloudflare Turnstile. Standard browser tools get blocked.

## What You CAN'T Trace (Without Legal Authority)

- Google account behind a Google Form
- Replit account from a verification UUID
- Real IP behind Google Cloud/AWS/Vercel
- Domain registrant behind WHOIS privacy
- Email address behind a social media account

For these, the user needs to:
1. Report to the platform (Twitter, Google, Name.com)
2. File a police report (cybercrime unit)
3. Platforms can then reveal data with court order

## References

See `references/crypto-scam-patterns.md` for common scam patterns in crypto/NFT/Web3 projects.
See `references/osint-techniques.md` for detailed OSINT tool usage and techniques.
