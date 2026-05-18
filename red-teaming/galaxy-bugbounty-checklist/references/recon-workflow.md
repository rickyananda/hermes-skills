# Bug Bounty Recon Workflow

## Phase 1: DNS Enumeration (No tools needed)

Use Google DNS API via curl — works everywhere:

```bash
# A records
curl -s "https://dns.google/resolve?name=TARGET&type=A"

# Mail servers
curl -s "https://dns.google/resolve?name=TARGET&type=MX"

# TXT records (SPF leaks real IP!)
curl -s "https://dns.google/resolve?name=TARGET&type=TXT"

# Nameservers
curl -s "https://dns.google/resolve?name=TARGET&type=NS"

# Subdomain enumeration
for sub in www mail ftp api admin portal app dev staging webmail cpanel whm smtp imap pop ns1 ns2 login sso auth dashboard cdn static assets img media beta test qa uat preprod; do
  result=$(curl -s "https://dns.google/resolve?name=$sub.TARGET&type=A" 2>/dev/null)
  ip=$(echo "$result" | grep -o '"data":"[0-9.]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$ip" ]; then echo "$sub.TARGET → $ip"; fi
done
```

## Phase 2: Origin IP Discovery

Cloudflare bypass techniques:
1. **SPF record**: `+ip4:x.x.x.x` in TXT record
2. **MX records**: Mail servers often on real IP
3. **Subdomains**: `mail.`, `host.`, `webmail.` often resolve to origin
4. **SSL certificates**: Check cert for other domains on same IP
5. **Historical DNS**: SecurityTrails, ViewDNS.info
6. **Shodan/Censys**: Search by SSL cert hash

Verify origin IP:
```bash
# Check if real IP serves web content
curl -sI --resolve "TARGET:443:REAL_IP" https://TARGET

# Check cPanel/WHM
curl -sk https://REAL_IP:2096   # Webmail
curl -sk https://REAL_IP:2083   # cPanel
curl -sk https://REAL_IP:2087   # WHM
```

## Phase 3: Port Scanning

Python (no nmap needed):
```python
import socket
target = "X.X.X.X"
ports = [21,22,25,53,80,110,143,443,465,587,993,995,
         3306,3389,5432,8080,8443,8888,9090,27017]

for port in ports:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(3)
    if s.connect_ex((target, port)) == 0:
        try:
            s.send(b'\r\n')
            banner = s.recv(1024).decode(errors='ignore').strip()
            print(f'OPEN {port}: {banner[:100]}')
        except:
            print(f'OPEN {port}: (no banner)')
    s.close()
```

## Phase 4: Service Enumeration

### SMTP (port 587/25)
```python
import socket, time
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(10)
s.connect(('IP', 587))
print(s.recv(1024).decode())  # Banner with version
s.send(b'EHLO test.com\r\n')
time.sleep(1)
print(s.recv(4096).decode())  # Capabilities

# User enumeration
for user in ['admin','root','postmaster','info','support']:
    s.send(f'VRFY {user}@domain\r\n'.encode())
    time.sleep(0.5)
    print(f'{user}: {s.recv(1024).decode().strip()}')

# Open relay test
s.send(b'MAIL FROM:<attacker@evil.com>\r\n')
s.recv(1024)
s.send(b'RCPT TO:<victim@gmail.com>\r\n')
print(f'Relay: {s.recv(1024).decode().strip()}')
# If "550 SMTP AUTH required" = not open relay
# If "250 OK" = OPEN RELAY (critical finding!)
```

### FTP (port 21)
```bash
# Anonymous login test
ftp -n IP <<EOF
user anonymous test@test.com
ls
quit
EOF
```

### cPanel/WHM
```
https://IP:2096  → Webmail login
https://IP:2083  → cPanel login
https://IP:2087  → WHM login
https://IP:2095  → Webmail (HTTP)
```

Check for CVEs:
- CVE-2023-29489: XSS in cpsrvd
- CVE-2023-39354: Arbitrary file read
- CVE-2023-39355: Arbitrary file upload
- CVE-2023-39356: RCE via email forwarders

## Phase 5: PoC Video Recording

On Kali Linux with ffmpeg:
```bash
# Start recording
ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0 \
  -c:v libx264 -preset ultrafast ~/Desktop/poc.mp4

# Stop: Ctrl+C
```

Upload to YouTube (unlisted) or Streamable.com.

## Pitfalls

- Firewall may accept TCP but not forward to service → verify with banner grab
- Real IP HTTP may timeout while mail ports work → focus on accessible services
- VRFY disabled on most servers → use RCPT TO for user enumeration
- cPanel API requires auth → can't enumerate without credentials
- `checksw.com`-style test sites may be down → can't test bypasses
- Programs open 1+ years = high chance of duplicate findings
- Signal score matters on HackerOne → submit quality reports only
