---
name: ssrf-scanner
description: "SSRF-Scanner — comprehensive SSRF vulnerability scanner with 10 attack phases, 377 payloads, and ~28,300 requests per target"
tags: [ssrf, security, hacking, web-security, vulnerability-scanner, pentesting]
---

# SSRF-Scanner 🔥

A comprehensive, high-performance SSRF (Server-Side Request Forgery) vulnerability scanner that tests web applications for potential SSRF issues through multiple attack vectors.

**Repo:** https://github.com/Dancas93/SSRF-Scanner
**License:** MIT
**Language:** Python (async/await)
**Author:** Dancas93

## Installation

```bash
git clone https://github.com/Dancas93/SSRF-Scanner.git
cd SSRF-Scanner
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

## Quick Start

```bash
# Basic scan
python3 ssrf_scanner.py -u https://example.com

# Scan multiple URLs
python3 ssrf_scanner.py -f urls.txt

# With callback URL for remote SSRF detection
python3 ssrf_scanner.py -u https://example.com -b your-callback.burpcollaborator.net
```

## CLI Options

```
-u, --url              Single URL to scan
-f, --file             File containing URLs to scan
-b, --backurl          Callback URL for remote SSRF detection
-d, --debug            Enable debug mode
-c, --cookie           Set cookies (format: 'name1=value1; name2=value2')
--concurrency N        Number of concurrent requests (default: 200)
--rate-limit N         Max requests per second (default: 100)
-q, --quiet            Only show vulnerabilities (no progress)
--proxy URL            Proxy URL (e.g., http://127.0.0.1:8080)
--proxy-auth U:P       Proxy authentication (username:password)
--output-format FMT    Output format: json, csv, html, txt, all (default: csv)
```

## 10 Attack Phases (~28,300 total requests)

### 1. Local IP Attack (~5,600 requests, 20%)
Tests internal network access using various IP formats:
- Standard localhost: 127.0.0.1, localhost, ::1
- IP encoding: decimal (2130706433), hex (0x7f000001), octal (0177.0.0.1)
- IPv6 variations: [::1], [0:0:0:0:0:ffff:127.0.0.1]
- Unicode variations: 127。0。0。1
- URL encoded formats

### 2. Cloud Metadata Attack (~3,400 requests, 12%)
Access cloud service metadata endpoints:
- AWS: 169.254.169.254/latest/meta-data/
- GCP: metadata.google.internal/computeMetadata/v1/
- Azure: 169.254.169.254/metadata/instance
- DigitalOcean, Alibaba Cloud
- IMDSv1 and IMDSv2 variations

### 3. Protocol Attack (~3,400 requests, 12%)
Tests 21 protocol handlers:
- Standard: http://, https://, ftp://, file://
- Advanced: gopher://, dict://, ldap://, jar://
- Database: mysql://, mongodb://, postgres://, redis://
- Network: ws://, wss://, smtp://

### 4. Encoded Payload Attack (~2,300 requests, 8%)
Encoding techniques to bypass filters:
- Single/double URL encoding
- Base64 encoding
- Unicode encoding (。, ／)
- Mixed encoding combinations
- Hex encoding

### 5. Parameter Attack (~2,300 requests, 8%)
SSRF through URL parameters (66 payloads):
- Common: url=, path=, redirect=, uri=, file=
- File inclusion: document=, page=, load=
- API: callback=, webhook=, api_url=
- Redirect: redirect_to=, return_url=, next=

### 6. Port Scan Attack (~2,300 requests, 8%)
Detect internal services via port scanning:
- Web: :80, :443, :8080, :8443
- Database: :3306, :5432, :6379, :27017
- Admin: :8000, :8008, :9000
- Services: :22, :21, :25, :9200

### 7. DNS Rebinding Attack (~2,300 requests, 8%)
DNS rebinding vulnerabilities:
- 127.0.0.1.nip.io, 127.0.0.1.xip.io
- localhost.localtest.me
- Custom callback domains (with -b flag)

### 8. CRLF Injection Attack (~2,800 requests, 10%)
HTTP request manipulation via newline injection:
- Header injection: %0d%0aHost:%20evil.com
- Request smuggling: %0d%0aTransfer-Encoding:%20chunked
- Response splitting: %0d%0aHTTP/1.1 200 OK
- Cache poisoning: %0d%0aX-Forwarded-Scheme:%20http
- Session fixation: %0d%0aSet-Cookie:%20admin=true
- CORS bypass: %0d%0aAccess-Control-Allow-Origin:%20*

### 9. Scheme Confusion Attack (~2,800 requests, 10%)
Alternative/rare protocols to bypass filters (90+ payloads):
- Java: jar:, netdoc:
- PHP wrappers: php://filter, expect://, phar://
- Data URIs: data://text/plain;base64,
- File transfer: tftp://, nfs://, rsync://, smb://
- Version control: git://, svn://
- Streaming: rtsp://, rtmp://
- Remote access: ssh://, telnet://, rdp://, vnc://
- Compression: compress.zlib://, compress.bzip2://

### 10. Remote Attack (~1,100 requests, 4%)
External callback validation (requires -b flag):
- Plain: your-callback.com
- HTTP/HTTPS variations
- With paths, ports
- URL encoded variations

## Verification Methods

### Smart Baseline Detection
- Creates baseline with 3 initial requests
- Tracks status codes, response sizes, content hashes
- Only flags significant deviations from baseline
- Reduces false positives

### Detection Methods
1. **Response Code Analysis** — compare against baseline status codes
2. **Content Analysis** — search for indicators: root:, admin:, AWS, metadata, credentials, BEGIN RSA, api_key, secret, token
3. **Headers Analysis** — detect x-internal, server-internal, x-backend-server, x-upstream, x-forwarded-server
4. **Timing Analysis** — response time differences, timeout-based detection

## Output Formats

```bash
# JSON report
python3 ssrf_scanner.py -u https://example.com --output-format json

# HTML report (visual, interactive, color-coded)
python3 ssrf_scanner.py -u https://example.com --output-format html

# All formats
python3 ssrf_scanner.py -u https://example.com --output-format all
```

Reports saved to `output/` directory:
- `report.json` — machine-readable
- `report.csv` — spreadsheet-compatible
- `report.html` — visual with charts
- `report.txt` — human-readable

Each finding includes: Target URL, Attack Type, Payload, Response Code, Response Size, Verification Method, Timestamp, Notes.

## Advanced Usage Examples

```bash
# High-speed scan
python3 ssrf_scanner.py -u https://example.com --concurrency 300 --rate-limit 150

# Quiet mode (only show vulnerabilities)
python3 ssrf_scanner.py -u https://example.com -q

# With proxy (e.g., Burp Suite)
python3 ssrf_scanner.py -u https://example.com --proxy http://127.0.0.1:8080

# With proxy auth
python3 ssrf_scanner.py -u https://example.com --proxy http://127.0.0.1:8080 --proxy-auth user:pass

# With cookies (authenticated scan)
python3 ssrf_scanner.py -u https://example.com -c 'session=abc123; token=xyz'

# Debug mode
python3 ssrf_scanner.py -u https://example.com -d

# With Burp Collaborator callback
python3 ssrf_scanner.py -u https://example.com -b xyz.burpcollaborator.net
```

## Payload Files

All payloads stored in `payloads/` directory — customizable:

```
payloads/
├── local_ips.txt           (35 payloads)   - Internal IP variations
├── headers.txt             (27 payloads)   - HTTP headers to test
├── cloud_metadata.txt      (39 payloads)   - Cloud metadata endpoints
├── protocols.txt           (21 payloads)   - Protocol handlers
├── encoded_payloads.txt    (10 payloads)   - Encoding variations
├── parameter_payloads.txt  (66 payloads)   - URL parameters
├── port_payloads.txt       (33 payloads)   - Port specifications
├── dns_rebinding.txt       (13 payloads)   - DNS rebinding domains
├── crlf_injection.txt      (43 payloads)   - CRLF injection patterns
└── scheme_confusion.txt    (90 payloads)   - Alternative protocols
```

**Total: 377 unique payloads**

## Performance

- Concurrent requests: up to 200 (configurable)
- Rate limiting: configurable (default 100 req/s)
- Adaptive throttling: adjusts based on errors
- Smart backoff: reduces rate on failures
- Single URL scan: ~3-5 minutes
- High concurrency: ~2-3 minutes (300 concurrent, 150 req/s)
- Memory: ~100-200 MB

## What is SSRF?

Server-Side Request Forgery allows attackers to make the server send requests to internal resources (localhost, cloud metadata, internal APIs) or external systems. Common in:
- Webhooks / callbacks
- URL fetchers / preview generators
- PDF generators with URL inputs
- API proxies
- File importers (CSV, XML with external DTDs)

## Use Cases

- **Web app pentesting** — test for SSRF vulnerabilities
- **Cloud security** — check metadata endpoint exposure
- **Internal network mapping** — discover internal services
- **Protocol smuggling** — test protocol handler abuse
- **Filter bypass testing** — encoding/obfuscation evasion
