# Case Study: app.perceptrons.xyz Recon

## Target
- `app.perceptrons.xyz` — Solana-based dashboard (Perceptron Network / BlockMesh)
- `backend.perceptrons.xyz` — API backend (Heroku)

## Infrastructure
| Layer | Technology |
|-------|-----------|
| Frontend CDN | Cloudflare |
| Frontend Framework | React 19.2.4 + Vite |
| Backend | Rust (serde JSON) on Heroku |
| Backend CDN | Cloudflare |
| Blockchain | Solana (devnet/testnet/mainnet-beta) |
| Wallet | MetaMask + Solana wallets (Phantom) |
| UI Library | HeroUI (NextUI fork) |
| Bot Protection | hCaptcha + Cloudflare Turnstile |
| Analytics | Google Analytics (G-RYHLW3MDK2) + GTM |

## Key Findings

### 0. Login Form Uses GET Method (CRITICAL — CVSS 9.1)
```html
<form action="/login_post" method="get">
  <input type="text" name="email">
  <input type="password" name="password">
</form>
```
**Impact:** Credentials sent as URL parameters: `/login_post?email=user@email.com&password=plaintext123`
- Logged in browser history, server logs (Heroku), CDN logs (Cloudflare)
- Leaked via Referer header to external sites
- Visible to network monitoring tools
- Cloudflare Turnstile sitekey: `0x4AAAAAAA1Depgrun_GLCjW`

### 1. CORS Misconfiguration (HIGH)
```http
Access-Control-Allow-Origin: https://evil.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
```
Any origin reflected + credentials allowed = cross-origin data theft.

### 2. Deprecated TLS (MEDIUM)
```
TLSv1.0: ENABLED (SWEET32 vulnerable — 3DES cipher Grade C)
TLSv1.1: ENABLED (deprecated since RFC 8996)
TLSv1.2: ENABLED (OK)
TLSv1.3: NOT DETECTED
```
SSL cert: EC 256-bit, Google Trust Services (WE1), valid 2026-03-25 → 2026-06-23.

### 3. No Rate Limiting (MEDIUM)
5 rapid requests all returned 400 — no throttling or blocking.

### 4. User Enumeration (MEDIUM)
`POST /api/dashboard` with invalid user → "User not found"
With valid user → returns full dashboard data.

### 5. Missing Security Headers (MEDIUM)
No `X-Frame-Options`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`.

### 6. Unsafe CSP (MEDIUM)
`unsafe-eval` and `unsafe-inline` allowed in script-src.

### 7. API Token in localStorage (MEDIUM)
Auth flow: email + UUID api_token → stored in localStorage key `auth_data`.

## API Endpoints Discovered
```
POST /api/dashboard              → {email, api_token: UUID} → dashboard data or "User not found"
POST /api/resend_confirmation_email → {email, api_token} → resend verification
POST /api/referral_bonus         → {email, api_token} → apply referral bonus
POST /api/connect_wallet_api     → {email, api_token, pubkey, message, signature} → connect wallet
GET  /dashboard                  → 307 → /login?next=%2Fdashboard (requires auth)
GET  /login                      → Login form (email + password, Cloudflare Turnstile)
GET  /login_post                 → Login endpoint (GET method! credentials in URL)
```

## Dashboard Data Structure
```json
{
  "points": 1234.56,
  "number_of_users_invited": 5,
  "tasks": 3,
  "connected": true,
  "uptime": 99.5,
  "download": 100.5,
  "upload": 50.2,
  "latency": 25,
  "verified_email": true,
  "daily_stats": [{"day": "2026-01", "points": 123.45}],
  "perks": [{"name": "...", "one_time_bonus": 100, "multiplier": 1.5}],
  "referral_summary": {
    "total_invites": 10,
    "total_verified_email": 8,
    "total_verified_human": 5,
    "total_eligible": 3
  },
  "invite_code": "388eed3f-85ec-495e-b009-d0fe66b33664",
  "wallet_address": "..."
}
```

## Referral Ranking System
| Rank | Invites Required |
|------|-----------------|
| Novice | 25 |
| Apprentice | 50 |
| Journeyman | 100 |
| Expert | 200 |
| Master | 500 |
| Grandmaster | 750 |
| Legend | 1000 |

## CSP Allowlist (Infrastructure Fingerprint)
- `chrome-extension://obfhoiefijlolgdmphcekifedagnkfjp` — specific Chrome extension
- `*.blockmesh.xyz` — parent project (BlockMesh)
- `r2-images.blockmesh.xyz` — Cloudflare R2 storage
- `r2-assets.blockmesh.xyz` — CSS/JS assets
- `*.hcaptcha.com` — bot protection
- `*.cloudflareinsights.com` — analytics

## Related Assets
- Chrome Extension: `chromewebstore.google.com/detail/perceptron-network/dflhdcckcmcajgofmipokpgknmfikhej`
- Intract Quest: `quest.intract.io/project/6532e81854ff44c8a3b2c1d58dd68bd3`
- Proof of Humanity: `authena.xyz/proof-of-humanity`
- Support FAQ: `github.com/block-mesh/block-mesh-support-faq`
- Twitter: @Everlyn_ai, @PerceptronNTWK
- Static assets: `perceptron-network.perceptrons.xyz/dashboard-assets/`

## PoC Created
Interactive HTML PoC file created at `~/Desktop/perceptrons_poc.html` with:
- Login GET method test
- CORS misconfiguration test
- User enumeration test
- TLS analysis display
- Security headers checklist
- Infrastructure summary

## Recon Commands Used
```bash
# DNS resolution
host app.perceptrons.xyz

# Port scan (Cloudflare — all ports show open, use specific ports)
nmap -Pn -p 80,443,8080,8443,22,21,25,53,3306,5432 target -T5 --max-retries 1

# SSL/TLS analysis via NSE
nmap -Pn --script "ssl-enum-ciphers,ssl-cert,ssl-date" target -p 443 -T5 --max-retries 1 --host-timeout 20s

# HTTP headers
curl -sI "https://target/"

# CORS test
curl -s -I "https://backend.target/api/dashboard" -X OPTIONS \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST"

# Login form method check
curl -s "https://target/login" | grep -oP 'form[^>]*method="([^"]*)"'

# API endpoint discovery from JS
curl -s "https://target/assets/*.js" | grep -oP '/api/[a-zA-Z0-9/_-]+' | sort -u

# Backend URL discovery from JS
curl -s "https://target/assets/*.js" | grep -oP 'https?://backend\.[^\s"\\]*' | sort -u

# Auth flow analysis from JS
curl -s "https://target/assets/*.js" | grep -oP '(localStorage|sessionStorage)\.[a-zA-Z]+\([^)]*\)' | sort -u

# Wallet/blockchain patterns from JS
curl -s "https://target/assets/*.js" | grep -oP '(wagmi|rainbow|metamask|walletconnect|ethers|web3|solana)[a-zA-Z0-9_./-]*' | sort -u

# Dashboard data structure from JS
curl -s "https://target/assets/*.js" | grep -oP 'dashboardData\.[a-zA-Z_]+' | sort -u

# Sensitive paths check
for path in admin dashboard api docs swagger graphql .env .git/config; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "https://target/$path")
    echo "$path → $code"
done
```
