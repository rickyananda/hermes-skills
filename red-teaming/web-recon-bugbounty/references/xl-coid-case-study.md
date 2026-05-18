# Case Study: www.xl.co.id Recon (May 2026)

## Target Profile
- Indonesian telecom (XL Axiata)
- Framework: Next.js (SSG)
- CDN/WAF: Cloudflare
- Domain: xl.co.id, xlaxiata.id, xlaxiata.my.id

## Subdomains Found (12)
| Subdomain | IP | Notes |
|---|---|---|
| api.xl.co.id | 112.215.105.53 | Timeout from external |
| portal.xl.co.id | 202.152.254.249 | |
| myxl.xl.co.id | 112.215.105.26 | |
| corporate.xl.co.id | 202.152.224.60 | |
| sso.xl.co.id | 202.152.254.249 | Same IP as portal! |
| webmail.xl.co.id | 140.213.205.7 | |
| store.xl.co.id | 172.64.147.24 | Cloudflare, Next.js |
| rewards.xl.co.id | 112.215.105.80 | |
| forum.xl.co.id | 112.215.105.89 | |
| img.xl.co.id | 206.183.107.44 | Apache! |
| video.xl.co.id | 65.49.33.90 | |
| m.xl.co.id | 13.251.32.184 | |

## Internal APIs Discovered (via JS source)
- `jupiter-mw-webxl.xlaxiata.my.id` — middleware API (all 401, needs Bearer token)
- `jupiter-ms-webxlstore-v2.ext.dp.xl.co.id/api` — store API (all 403)
- `bumi-fe-webxl.xlaxiata.id` — frontend server
- `pluto-fe-webxl.xlaxiata.id` — frontend server
- `tc-bumi-fe-webpreregistration2025.xlaxiata.my.id` — pre-registration
- `masaaktif.xlaxiata.co.id` — card expiry check
- `d27xr6oh14aaqn.cloudfront.net/webchat-xlcoid/` — webchat CDN

## Key Findings

### 1. CSP Weakness on registrasi.xl.co.id (HIGH)
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://web-sdk.vida.id ...
connect-src * blob: data:
img-src * data: blob:
frame-src *
```
`connect-src *` = XSS can exfiltrate to any domain. `unsafe-eval` = code injection.

### 2. Weak CSP on www.xl.co.id (MEDIUM-HIGH)
Only `frame-ancestors 'none'` — no script-src, no connect-src, no default-src.

### 3. Internal API Disclosure (MEDIUM-HIGH)
6 internal backend URLs exposed in client-side JS. Enables API enumeration, auth bypass attempts, DDoS targeting.

### 4. Missing SRI — 18 Scripts (MEDIUM)
All Next.js chunks loaded without Subresource Integrity hashes.

### 5. Cookie without Secure Flag (MEDIUM)
`stickounet` cookie on www.xl.co.id and masaaktif.xlaxiata.co.id lacks `Secure` flag.

### 6. Technology Disclosure (LOW-MEDIUM)
`X-Powered-By: Next.js` on 4 subdomains. `From: Tencent` on masaaktif.

### 7. Missing CORS Hardening (LOW-MEDIUM)
COEP, COOP, CORP headers missing across all subdomains.

## Next.js Specific Findings
- **buildId**: `oHDpXsqNazFj75lRNXcq8` (www), `XLPU4m0SOCFSRWat_hBWA` (store)
- **SSG data accessible**: `/_next/data/{buildId}/*.json` — all page props exposed
- **Auth mechanism**: Bearer token via `token` API, stored in JS headers object
- **OTP endpoints exist**: `/api/otp`, `/api/send-otp`, `/api/verify-otp` (all 401)

## Lessons Learned
1. **Hash comparison for cache poisoning**: Response hash differs even without actual vulnerability due to dynamic elements. Compare content structure, not just hash.
2. **X-Original-URL returning 403**: Server processes the header but Cloudflare blocks. Not a bypass but confirms header is handled.
3. **Most internal subdomains timeout externally**: Only store.xl.co.id and img.xl.co.id responded. Others behind VPN/firewall.
4. **crt.sh often times out**: Use HackerTarget reverse IP lookup as fallback.
5. **Next.js __NEXT_DATA__ with empty pageProps**: Data loaded client-side via API, not via SSR.
