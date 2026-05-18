# OSINT Techniques for Website Investigation

Detailed techniques and commands for investigating suspicious websites.

## DNS & Domain

### DNS Records
```bash
# A record (IP address)
curl -s "https://dns.google/resolve?name={domain}&type=A"

# NS records (nameservers)
curl -s "https://dns.google/resolve?name={domain}&type=NS"

# MX records (email)
curl -s "https://dns.google/resolve?name={domain}&type=MX"

# TXT records (verification, SPF, DKIM)
curl -s "https://dns.google/resolve?name={domain}&type=TXT"

# CNAME records
curl -s "https://dns.google/resolve?name={domain}&type=CNAME"
```

**TXT Record Patterns:**
- `replit-verify={uuid}` → Developer uses Replit
- `google-site-verify={token}` → Verified with Google Search Console
- `v=spf1 ...` → Email sender policy
- `facebook-domain-verify={token}` → Facebook business verification
- `apple-domain-verify={token}` → Apple developer

### Domain Registration
```bash
# RDAP (modern WHOIS replacement)
curl -s "https://rdap.org/domain/{domain}"

# Specific TLD RDAP servers
curl -s "https://rdap.verisign.com/com/v1/domain/{domain}"  # .com
curl -s "https://rdap.nic.xyz/domain/{domain}"  # .xyz

# WHOIS (if RDAP unavailable)
whois {domain}
```

**What to look for:**
- Registration date (very new = suspicious)
- Registrar (Name.com, GoDaddy, Namecheap, etc.)
- Registrant info (often privacy-protected)
- Name servers (match hosting provider)

## Infrastructure

### IP Information
```bash
# IP details (hosting provider, location)
curl -s "https://ipinfo.io/{ip}/json"

# Reverse DNS
dig -x {ip}

# Reverse IP lookup (other domains on same IP)
curl -s "https://api.hackertarget.com/reverseiplookup/?q={ip}"
```

**Google Cloud IP Ranges:** 34.x.x.x, 35.x.x.x, 104.x.x.x
**AWS IP Ranges:** 52.x.x.x, 54.x.x.x, 3.x.x.x
**Cloudflare IP Ranges:** 104.x.x.x, 172.x.x.x

### HTTP Headers
```bash
# Full headers
curl -sI "https://{domain}"

# Specific headers
curl -sI "https://{domain}" | grep -i "server\|x-powered-by\|via\|x-cloud"
```

**Key Headers:**
- `server: nginx` / `apache` / `Google Frontend` / `cloudflare`
- `x-powered-by: Express` / `PHP` / `ASP.NET`
- `x-cloud-trace-context` → Google Cloud
- `via: 1.1 google` → Google Cloud CDN
- `cf-ray` → Cloudflare

### Certificate Transparency
```bash
# Find all certificates issued for domain
curl -s "https://crt.sh/?q={domain}&output=json"

# Parse results
curl -s "https://crt.sh/?q={domain}&output=json" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for cert in data[:10]:
    print(f'{cert.get(\"name_value\",\"\")} - {cert.get(\"issuer_name\",\"\")}')
"
```

### Subdomain Enumeration
```bash
# Check common subdomains
for sub in api www admin mail dev staging test blog docs status app portal dashboard cdn; do
  result=$(curl -s "https://dns.google/resolve?name=${sub}.{domain}&type=A" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('Answer',[{}])[0].get('data',''))" 2>/dev/null)
  [ -n "$result" ] && echo "✓ ${sub}.{domain} → ${result}"
done
```

## JavaScript Analysis

### API Endpoint Discovery
```bash
# Find all API endpoints in JS bundle
curl -s "{js_url}" | grep -oP '/api/[a-zA-Z0-9/_-]+' | sort -u

# Find all URLs
curl -s "{js_url}" | grep -oP 'https?://[^\s"\\]+' | sort -u

# Find email addresses
curl -s "{js_url}" | grep -oP '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

# Find wallet addresses
curl -s "{js_url}" | grep -oP '0x[a-fA-F0-9]{40}'

# Find developer comments
curl -s "{js_url}" | grep -oP '//[^\n]{10,}'

# Find package names
curl -s "{js_url}" | grep -oP '@[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+'
```

### Tech Stack Identification
```bash
# Check for React
curl -s "{url}" | grep -i "react\|__NEXT_DATA__\|__NUXT__"

# Check for Vite
curl -s "{url}" | grep -i "vite\|@vite"

# Check for Next.js
curl -s "{url}" | grep -i "_next\|__NEXT"

# Check for Tailwind
curl -s "{css_url}" | grep -i "tailwind\|--tw-"
```

## Social Media

### Twitter/X Analysis
```bash
# Get user info via browser (API requires auth)
# Look for:
# - Account creation date
# - Follower/following ratio
# - Tweet count
# - Bio content
# - Pinned tweets
# - External links
```

**Scam Signals:**
- Following >> Followers (mass-following growth hack)
- Very new account (< 30 days)
- Very few tweets (< 10)
- Paid blue check (not earned verification)
- No linked website or community

### Cross-Platform Search
```bash
# GitHub
curl -s "https://api.github.com/search/users?q={username}"

# Check common platforms
for platform in github.com gitlab.com reddit.com instagram.com tiktok.com youtube.com medium.com; do
  curl -sI "https://{platform}/{username}" | head -1
done
```

## Google Forms

### Form Analysis
```bash
# Get form page
curl -s "https://docs.google.com/forms/d/{formId}/viewform"

# Look for:
# - Form title
# - Fields collected
# - Owner info (rarely exposed)
# - Linked spreadsheet
```

### Form Red Flags
- Collects wallet addresses
- Collects seed phrases or private keys
- Requires social media engagement
- Uses URL shortener to hide destination
- "WL Application" collecting personal info

## Blockchain

### Contract Verification
```bash
# Check if contract is verified on Etherscan
curl -s "https://api.etherscan.io/api?module=contract&action=getabi&address={contract}"

# Check token info
curl -s "https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress={contract}"
```

### Wallet Analysis
```bash
# Check wallet balance and transactions
curl -s "https://api.etherscan.io/api?module=account&action=balance&address={wallet}"
curl -s "https://api.etherscan.io/api?module=account&action=txlist&address={wallet}"
```

## Reporting

### Platform Reports
- **Twitter:** Report → It's suspicious or spam → Specific violation
- **Google Forms:** Report → Spam or phishing
- **Name.com:** Abuse report → Domain used for phishing
- **Google Cloud:** Report abuse → Phishing/scam site
- **Etherscan:** Report address → Scam/phishing

### Law Enforcement
- **Indonesia:** Polri Cybercrime (Bareskrim)
- **USA:** FBI IC3 (ic3.gov)
- **EU:** Europol EC3
- **International:** Interpol

Include in report:
1. URL of the scam site
2. Screenshots of the site
3. Wallet addresses involved
4. Social media accounts linked
5. Google Forms (if any)
6. Timeline of activity
7. Any funds lost
