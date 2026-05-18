# Python-Based Web Application Reconnaissance

When `dig`, `nslookup`, `nmap` are not available. All techniques use Python stdlib + `requests` + `dnspython`.

## Setup
```bash
pip3 install dnspython requests
```

## 1. DNS Enumeration
```python
import dns.resolver

domain = 'target.com'
for rtype in ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA']:
    try:
        answers = dns.resolver.resolve(domain, rtype)
        print(f"\n=== {rtype} ===")
        for r in answers:
            print(f"  {r}")
    except:
        pass

# DMARC
try:
    answers = dns.resolver.resolve(f'_dmarc.{domain}', 'TXT')
    for r in answers:
        print(f"DMARC: {r}")
except:
    print("No DMARC")
```

## 2. Subdomain Enumeration
### Method A: crt.sh (Certificate Transparency)
```python
import requests
r = requests.get(f'https://crt.sh/?q=%.{domain}&output=json', timeout=15)
if r.status_code == 200:
    subs = set()
    for entry in r.json():
        for n in entry.get('name_value', '').split('\n'):
            n = n.strip().lstrip('*.')
            if n.endswith(domain):
                subs.add(n)
    for s in sorted(subs):
        print(s)
```

### Method B: HackerTarget (Reverse IP)
```python
r = requests.get(f'https://api.hackertarget.com/reverseiplookup/?q={ip}')
for line in r.text.strip().split('\n'):
    if '.' in line and not line.startswith('error'):
        print(line)
```

### Method C: DNS Brute Force
```python
import socket
common = ['www', 'mail', 'ftp', 'api', 'admin', 'portal', 'app', 'dev',
          'staging', 'test', 'webmail', 'cpanel', 'whm', 'sso', 'login',
          'myxl', 'care', 'corporate', 'enterprise', 'partner', 'store',
          'rewards', 'forum', 'img', 'video', 'm', 'mobile', 'dashboard',
          'auth', 'crm', 'erp', 'jenkins', 'gitlab', 'grafana', 'monitoring']
for sub in common:
    try:
        ip = socket.gethostbyname(f'{sub}.{domain}')
        print(f"✅ {sub}.{domain} -> {ip}")
    except:
        pass
```

## 3. Security Headers Analysis
```python
required_headers = {
    'Content-Security-Policy': 'Prevents XSS/injection',
    'X-Content-Type-Options': 'Prevents MIME sniffing',
    'X-Frame-Options': 'Prevents clickjacking',
    'Strict-Transport-Security': 'Forces HTTPS',
    'Referrer-Policy': 'Controls referrer leakage',
    'Permissions-Policy': 'Controls browser features',
    'X-XSS-Protection': 'XSS filter (legacy)',
    'Cross-Origin-Embedder-Policy': 'COEP',
    'Cross-Origin-Opener-Policy': 'COOP',
    'Cross-Origin-Resource-Policy': 'CORP',
    'Cache-Control': 'Prevents caching sensitive data',
}
r = requests.get(f'https://{domain}/', headers={'User-Agent': 'Mozilla/5.0'})
for hdr, desc in required_headers.items():
    val = r.headers.get(hdr, 'MISSING')
    if val == 'MISSING':
        print(f"🔴 MISSING {hdr} - {desc}")
    elif hdr == 'Content-Security-Policy' and val == "frame-ancestors 'none'":
        print(f"⚠️ PARTIAL {hdr}: only frame-ancestors, no script-src!")
    else:
        print(f"✅ {hdr}: {val}")

# Tech disclosure
for h in ['server', 'x-powered-by', 'x-aspnet-version', 'x-aspnetmvc-version']:
    val = r.headers.get(h, 'MISSING')
    if val != 'MISSING':
        print(f"⚠️ DISCLOSED {h}: {val}")
```

## 4. Cookie Security Analysis
```python
for cookie in s.cookies:
    print(f"Cookie: {cookie.name}")
    print(f"  Domain: {cookie.domain}")
    print(f"  Secure: {cookie.secure}")
    print(f"  Path: {cookie.path}")
    # Check for missing Secure flag on HTTPS sites
    if not cookie.secure:
        print(f"  🔴 Missing Secure flag!")
```

## 5. CORS Misconfiguration Testing
```python
origins = [
    'https://evil.com',
    'https://target.com.evil.com',
    'null',
    'https://target.com',  # legitimate (baseline)
]
for origin in origins:
    r = requests.get(f'https://{domain}/', headers={'Origin': origin})
    acao = r.headers.get('access-control-allow-origin', 'MISSING')
    acac = r.headers.get('access-control-allow-credentials', 'MISSING')
    if acao != 'MISSING':
        vuln = "🔴 CORS BYPASS!" if 'evil' in acao or acao == '*' else ""
        print(f"Origin: {origin} -> ACAO: {acao} | ACAC: {acac} {vuln}")
```

## 6. Cache Poisoning / Header Injection
```python
baseline = requests.get(f'https://{domain}/')
test_headers = {
    'X-Forwarded-Host': 'evil.com',
    'X-Host': 'evil.com',
    'X-Original-URL': '/admin',
    'X-Rewrite-URL': '/admin',
    'X-Custom-IP-Authorization': '127.0.0.1',
    'X-Real-IP': '127.0.0.1',
    'X-Forwarded-For': '127.0.0.1',
    'Forwarded': 'host=evil.com',
}
for hdr, val in test_headers.items():
    r = requests.get(f'https://{domain}/', headers={hdr: val})
    if r.status_code == 200 and len(r.text) != len(baseline.text):
        print(f"⚠️ {hdr}: {val} -> Different response ({len(r.text)} vs {len(baseline.text)})")
    if 'evil.com' in r.text:
        print(f"🔴 {hdr}: {val} -> evil.com reflected!")
```

## 7. Subresource Integrity (SRI) Check
```python
import re
r = requests.get(f'https://{domain}/')
scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', r.text)
sri = re.findall(r'<script[^>]*integrity=["\']', r.text)
print(f"External scripts: {len(scripts)}")
print(f"With SRI: {len(sri)}")
if len(scripts) > 0 and len(sri) == 0:
    print("🔴 No scripts have SRI!")
```

## 8. Sensitive Data in Source Code
```python
patterns = [
    (r'api[_-]?key["\s:=]+["\']?([a-zA-Z0-9_\-]{20,})', 'API Key'),
    (r'token["\s:=]+["\']?([a-zA-Z0-9_\-]{20,})', 'Token'),
    (r'secret["\s:=]+["\']?([a-zA-Z0-9_\-]{20,})', 'Secret'),
    (r'AIza[0-9A-Za-z_\-]{35}', 'Google API Key'),
    (r'sk_live_[0-9a-zA-Z]{24,}', 'Stripe Secret Key'),
    (r'pk_live_[0-9a-zA-Z]{24,}', 'Stripe Public Key'),
    (r'firebase[a-zA-Z]*["\s:=]+["\']?([a-zA-Z0-9_\-]{20,})', 'Firebase'),
]
for pattern, name in patterns:
    matches = re.findall(pattern, r.text, re.IGNORECASE)
    for m in matches[:3]:
        print(f"🔴 {name}: {str(m)[:40]}...")
```

## 9. IP-Based Recon (Shodan InternetDB)
Free, no API key needed:
```python
r = requests.get(f'https://internetdb.shodan.io/{ip}')
if r.status_code == 200:
    data = r.json()
    print(f"Hostnames: {data.get('hostnames', [])}")
    print(f"Ports: {data.get('ports', [])}")
    print(f"CPES: {data.get('cpes', [])}")
    print(f"Vulns: {data.get('vulns', [])}")
    print(f"Tags: {data.get('tags', [])}")
```

## 10. Open Redirect Testing
```python
redirect_params = ['redirect', 'url', 'next', 'return', 'returnTo', 'continue',
                   'destination', 'redir', 'callback', 'goto', 'link', 'target',
                   'ref', 'from', 'go', 'out']
for param in redirect_params:
    r = requests.get(f'https://{domain}/?{param}=https://evil.com', allow_redirects=False)
    loc = r.headers.get('Location', '')
    if r.status_code in [301, 302, 303, 307, 308] and 'evil.com' in loc:
        print(f"🔴 OPEN REDIRECT: ?{param}=https://evil.com -> {loc}")
```

## Pitfalls
- `dnspython` may not be in execute_code sandbox — install via `terminal` first
- crt.sh often times out — use HackerTarget as fallback
- Shodan InternetDB is free but rate-limited
- Cloudflare returns 403 for most direct IP access — need Host header
- `socket.gethostbyname()` doesn't support custom DNS servers
- Always set User-Agent header — some sites block default python-requests UA
