# Bug Bounty Recon Commands Reference

Quick copy-paste commands for recon phase. Replace `TARGET` and `REAL_IP` with actual values.

## DNS Enumeration

```bash
# A/AAAA records
curl -s "https://dns.google/resolve?name=TARGET&type=A"
curl -s "https://dns.google/resolve?name=TARGET&type=AAAA"

# SPF records (look for real IP!)
curl -s "https://dns.google/resolve?name=TARGET&type=TXT"

# MX records
curl -s "https://dns.google/resolve?name=TARGET&type=MX"

# NS records
curl -s "https://dns.google/resolve?name=TARGET&type=NS"
```

## Subdomain Discovery

```bash
# Common subdomains via DNS
for sub in mail webmail cpanel whm ftp api admin portal login app dev staging ns1 ns2 webdisk autoconfig autodiscover cpcalendars cpcontacts smtp imap pop; do
  result=$(curl -s "https://dns.google/resolve?name=$sub.TARGET&type=A" 2>/dev/null)
  ip=$(echo "$result" | grep -o '"data":"[0-9.]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$ip" ]; then echo "$sub.TARGET → $ip"; fi
done
```

## Port Scan (No Nmap)

```bash
# Quick TCP scan
for port in 21 22 25 53 80 110 143 443 465 587 993 995 2083 2087 2095 2096 3306 3389 5432 8080 8443 8888 27017; do
  timeout 2 bash -c "echo >/dev/tcp/REAL_IP/$port" 2>/dev/null && echo "OPEN: $port"
done
```

## Banner Grabbing

```bash
# SMTP
echo "EHLO test" | timeout 5 nc REAL_IP 587

# POP3
timeout 3 nc REAL_IP 110 <<< "QUIT"

# IMAP
echo "a001 CAPABILITY" | timeout 5 nc REAL_IP 143

# SSH
timeout 3 nc REAL_IP 22 <<< ""

# FTP
timeout 3 nc REAL_IP 21 <<< ""
```

## cPanel/WHM Detection

```bash
# Webmail
curl -sk "https://REAL_IP:2096" | grep -i "title\|cpanel\|version"

# WHM
curl -skI "https://REAL_IP:2087"

# cPanel
curl -skI "https://REAL_IP:2083"

# Decode cPanel magic revision timestamps
date -d @TIMESTAMP
```

## HTTP Headers & Tech Stack

```bash
# Full headers
curl -sI "https://TARGET" | head -20

# Check common paths
for path in /admin /login /api /wp-admin /cpanel /webmail /phpmyadmin /manager /robots.txt /sitemap.xml /.git/config /.env /server-info /server-status; do
  status=$(curl -sI "https://TARGET$path" --connect-timeout 5 | head -1)
  echo "$path → $status"
done
```

## Cloudflare Bypass Techniques

1. **SPF record** — `curl -s "https://dns.google/resolve?name=TARGET&type=TXT"` → look for `+ip4:`
2. **MX record** — mail server often not behind Cloudflare
3. **Historical DNS** — SecurityTrails, ViewDNS.info
4. **Certificate transparency** — crt.sh
5. **Wayback Machine** — web.archive.org
6. **Shodan** — search by SSL cert hash

## Service-Specific Exploits to Check

| Service | What to Look For |
|---------|-----------------|
| Exim 4.x | CVE-2019-10149 (RCE), CVE-2020-28018 |
| cPanel | Default creds, CVE-2023-29489 (XSS) |
| Dovecot | CVE-2022-30550 (priv esc) |
| MySQL 3306 | No auth, default creds (root/empty) |
| MongoDB 27017 | No auth (common misconfig) |
| PostgreSQL 5432 | Default user postgres, no password |
| FTP 21 | Anonymous login |
| RDP 3389 | NLA bypass, BlueKeep (CVE-2019-0708) |
