#!/usr/bin/env python3
"""
Quick Website Analysis Script
Usage: python3 analyze_site.py <url>

Analyzes a website for:
- Tech stack (framework, build tool, CSS framework)
- DNS records (A, NS, MX, TXT)
- IP information (hosting provider, location)
- HTTP headers (server, x-powered-by)
- API endpoints (from JS bundle)
- Social media links
- Phishing indicators
"""

import sys
import json
import re
import urllib.request
import urllib.parse

def fetch(url, timeout=10):
    """Fetch a URL and return the response."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=timeout)
        return resp.read().decode(), resp.getcode()
    except Exception as e:
        return str(e), 0

def analyze_dns(domain):
    """Analyze DNS records for a domain."""
    results = {}
    
    for record_type in ["A", "NS", "MX", "TXT"]:
        try:
            url = f"https://dns.google/resolve?name={domain}&type={record_type}"
            data, _ = fetch(url)
            parsed = json.loads(data)
            
            if "Answer" in parsed:
                results[record_type] = [a["data"] for a in parsed["Answer"]]
        except:
            pass
    
    return results

def analyze_ip(ip):
    """Analyze an IP address."""
    try:
        url = f"https://ipinfo.io/{ip}/json"
        data, _ = fetch(url)
        return json.loads(data)
    except:
        return {}

def analyze_shodan(ip):
    """Quick IP intel via Shodan InternetDB (no auth required)."""
    try:
        url = f"https://internetdb.shodan.io/{ip}"
        data, _ = fetch(url)
        return json.loads(data)
    except:
        return {}

def analyze_headers(url):
    """Analyze HTTP headers."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10)
        
        headers = {}
        for key, value in resp.headers.items():
            headers[key.lower()] = value
        
        return headers
    except:
        return {}

def analyze_js(js_url):
    """Analyze JavaScript bundle for API endpoints and other info."""
    try:
        data, _ = fetch(js_url)
        
        results = {
            "api_endpoints": sorted(set(re.findall(r'/api/[a-zA-Z0-9/_-]+', data))),
            "emails": list(set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', data))),
            "wallets": list(set(re.findall(r'0x[a-fA-F0-9]{40}', data))),
            "urls": sorted(set(re.findall(r'https?://[^\s"\'\\]+', data))),
        }
        
        return results
    except:
        return {}

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_site.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    
    # Parse domain from URL
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc or parsed.path.split("/")[0]
    
    print(f"=== Analyzing: {url} ===\n")
    
    # 1. Fetch main page
    print("[1] Fetching main page...")
    html, status = fetch(url)
    print(f"    Status: {status}")
    print(f"    Size: {len(html)} bytes")
    
    # 2. Analyze HTML
    print("\n[2] Analyzing HTML...")
    
    # Tech stack
    tech = []
    if "react" in html.lower():
        tech.append("React")
    if "__NEXT_DATA__" in html:
        tech.append("Next.js")
    if "vue" in html.lower():
        tech.append("Vue")
    if "angular" in html.lower():
        tech.append("Angular")
    if "vite" in html.lower():
        tech.append("Vite")
    
    print(f"    Tech stack: {', '.join(tech) if tech else 'Unknown'}")
    
    # Meta tags
    title_match = re.search(r'<title>([^<]+)</title>', html)
    if title_match:
        print(f"    Title: {title_match.group(1)}")
    
    desc_match = re.search(r'<meta name="description" content="([^"]+)"', html)
    if desc_match:
        print(f"    Description: {desc_match.group(1)[:100]}...")
    
    # Social links
    twitter_match = re.search(r'twitter:site" content="([^"]+)"', html)
    if twitter_match:
        print(f"    Twitter: {twitter_match.group(1)}")
    
    # 3. Analyze DNS
    print("\n[3] Analyzing DNS...")
    dns = analyze_dns(domain)
    
    for record_type, values in dns.items():
        print(f"    {record_type}: {', '.join(values[:3])}")
    
    # 4. Analyze IP
    if "A" in dns:
        ip = dns["A"][0]
        print(f"\n[4] Analyzing IP: {ip}")
        ip_info = analyze_ip(ip)
        
        if ip_info:
            print(f"    Hostname: {ip_info.get('hostname', 'N/A')}")
            print(f"    City: {ip_info.get('city', 'N/A')}")
            print(f"    Region: {ip_info.get('region', 'N/A')}")
            print(f"    Country: {ip_info.get('country', 'N/A')}")
            print(f"    Org: {ip_info.get('org', 'N/A')}")
        
        # Shodan InternetDB (no auth required)
        shodan_info = analyze_shodan(ip)
        if shodan_info:
            print(f"    Ports: {shodan_info.get('ports', [])}")
            print(f"    Tags: {shodan_info.get('tags', [])}")
            print(f"    Vulns: {shodan_info.get('vulns', [])}")
    
    # 5. Analyze headers
    print("\n[5] Analyzing HTTP headers...")
    headers = analyze_headers(url)
    
    important_headers = ["server", "x-powered-by", "via", "x-cloud-trace-context"]
    for h in important_headers:
        if h in headers:
            print(f"    {h}: {headers[h]}")
    
    # 6. Find JS bundles
    print("\n[6] Finding JS bundles...")
    js_urls = re.findall(r'src="([^"]+\.js)"', html)
    
    for js_url in js_urls[:3]:
        if not js_url.startswith("http"):
            js_url = f"https://{domain}{js_url}"
        
        print(f"    Bundle: {js_url}")
        js_info = analyze_js(js_url)
        
        if js_info.get("api_endpoints"):
            print(f"    API endpoints: {', '.join(js_info['api_endpoints'][:5])}")
        if js_info.get("emails"):
            print(f"    Emails: {', '.join(js_info['emails'][:3])}")
        if js_info.get("wallets"):
            print(f"    Wallets: {', '.join(js_info['wallets'][:3])}")
    
    # 7. Check for phishing indicators
    print("\n[7] Checking for phishing indicators...")
    
    indicators = []
    
    if "connect wallet" in html.lower():
        indicators.append("⚠️  'Connect Wallet' button found")
    
    if "google.com/forms" in html:
        indicators.append("⚠️  Google Form linked")
    
    if "tinyurl.com" in html or "bit.ly" in html or "t.co" in html:
        indicators.append("⚠️  URL shortener found")
    
    if "seed phrase" in html.lower() or "private key" in html.lower():
        indicators.append("🚨 'Seed phrase' or 'Private key' mentioned")
    
    if indicators:
        for indicator in indicators:
            print(f"    {indicator}")
    else:
        print("    ✓ No obvious phishing indicators")
    
    print("\n=== Analysis Complete ===")

if __name__ == "__main__":
    main()
