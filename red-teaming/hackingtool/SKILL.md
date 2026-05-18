---
name: hackingtool
description: "All-in-one hacking toolkit by Z4nzu — 185+ tools across 20 categories (recon, web, SQLi, XSS, phishing, wireless, post-exploit, forensics, AD, cloud, mobile). Use when pentesting, bug bounty hunting, or security research."
triggers:
  - hackingtool
  - pentest toolkit
  - security tools
  - all-in-one hacking
---

# HackingTool v2.0.0 — by Z4nzu

Repo: https://github.com/Z4nzu/hackingtool
185+ tools | 20 categories | Linux/Kali/Parrot/macOS

---

## Installation

```bash
# One-liner (recommended)
curl -sSL https://raw.githubusercontent.com/Z4nzu/hackingtool/master/install.sh | sudo bash

# Manual
git clone https://github.com/Z4nzu/hackingtool.git
cd hackingtool
sudo python3 install.py
# Run: hackingtool

# Docker
docker build -t hackingtool .
docker run -it --rm hackingtool
```

## Quick Commands
- `/query` → search tools by keyword
- `t` → filter by tags (osint, web, c2, cloud, mobile)
- `r` → "I want to scan a network" → suggest tools
- `97` → install all tools in category
- `99` → back
- `q` → quit

---

## 🛡 Anonymously Hiding
- [Anonsurf](https://github.com/Und3rf10w/kali-anonsurf)
- [Multitor](https://github.com/trimstray/multitor)

## 🔍 Information Gathering (26 tools)
- [Nmap](https://github.com/nmap/nmap) — network scanner
- [Amass](https://github.com/owasp-amass/amass) — subdomain enum
- [Masscan](https://github.com/robertdavidgraham/masscan) — fast port scan
- [RustScan](https://github.com/RustScan/RustScan) — fast port scan
- [theHarvester](https://github.com/laramies/theHarvester) — email/subdomain/IP
- [Subfinder](https://github.com/projectdiscovery/subfinder) — subdomain discovery
- [httpx](https://github.com/projectdiscovery/httpx) — HTTP probe
- [Maigret](https://github.com/soxoj/maigret) — username OSINT
- [Holehe](https://github.com/megadose/holehe) — email OSINT
- [SpiderFoot](https://github.com/smicallef/spiderfoot) — OSINT automation
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) — secret scanner
- [Gitleaks](https://github.com/gitleaks/gitleaks) — git secret scanner
- [SecretFinder](https://github.com/m4ll0k/SecretFinder) — JS secret finder
- [RED HAWK](https://github.com/Tuhinshubhra/RED_HAWK) — info gathering
- [ReconSpider](https://github.com/bhavsec/reconspider) — OSINT
- [ReconDog](https://github.com/s0md3v/ReconDog) — recon
- [Striker](https://github.com/s0md3v/Striker) — recon
- [Infoga](https://github.com/m4ll0k/Infoga) — email OSINT
- [Shodanfy](https://github.com/m4ll0k/Shodanfy.py) — Shodan
- [rang3r](https://github.com/floriankunushevci/rang3r) — port scanner
- [Breacher](https://github.com/s0md3v/Breacher) — admin panel finder
- [Xerosploit](https://github.com/LionSec/xerosploit) — MITM
- Dracnmap — Nmap automation

## 📶 Wireless Attack (13 tools)
- [Bettercap](https://github.com/bettercap/bettercap) — MITM, WiFi, BLE
- [Airgeddon](https://github.com/v1s1t0r1sh3r3/airgeddon) — WiFi audit
- [Wifite](https://github.com/derv82/wifite2) — auto WiFi attack
- [Fluxion](https://github.com/FluxionNetwork/fluxion) — WPA social engineering
- [Wifiphisher](https://github.com/wifiphisher/wifiphisher) — rogue AP
- [WiFi-Pumpkin](https://github.com/P0cL4bs/wifipumpkin3) — rogue AP
- [pixiewps](https://github.com/wiire/pixiewps) — WPS pixie dust
- [hcxdumptool](https://github.com/ZerBea/hcxdumptool) — PMKID capture
- [hcxtools](https://github.com/ZerBea/hcxtools) — WiFi hash convert
- EvilTwin, Fastssh, bluepot, Howmanypeople

## 🧩 SQL Injection (7 tools)
- [Sqlmap](https://github.com/sqlmapproject/sqlmap) — auto SQLi
- [NoSqlMap](https://github.com/codingo/NoSQLMap) — NoSQL injection
- [DSSS](https://github.com/stamparm/DSSS) — tiny SQLi scanner
- [Explo](https://github.com/dtag-dev-sec/explo) — SQLi
- [Blisqy](https://github.com/JohnTroony/Blisqy) — time-based SQLi
- [Leviathan](https://github.com/leviathan-framework/leviathan) — mass audit
- [SQLScan](https://github.com/Cvar1984/sqlscan) — SQLi scanner

## 🎣 Phishing Attack (17 tools)
- [PyPhisher](https://github.com/KasRoudra/PyPhisher) — phishing
- [Evilginx3](https://github.com/kgretzky/evilginx2) — advanced phishing
- [Setoolkit](https://github.com/trustedsec/social-engineer-toolkit) — SE toolkit
- [ShellPhish](https://github.com/An0nUD4Y/shellphish) — phishing
- [HiddenEye](https://github.com/Morsmalleo/HiddenEye) — phishing
- [AdvPhishing](https://github.com/Ignitetch/AdvPhishing) — advanced phishing
- [SocialFish](https://github.com/UndeadSec/SocialFish) — phishing
- [QRLJacking](https://github.com/OWASP/QRLJacking) — QR code attack
- [Maskphish](https://github.com/jaykali/maskphish) — masked URL phishing
- [BlackPhish](https://github.com/iinc0gnit0/BlackPhish) — phishing
- [dnstwist](https://github.com/elceef/dnstwist) — domain squatting
- Autophisher, I-See-You, SayCheese, QR Code Jacking, BlackEye, Thanos

## 🌐 Web Attack (20 tools)
- [Nuclei](https://github.com/projectdiscovery/nuclei) — vuln scanner
- [ffuf](https://github.com/ffuf/ffuf) — fuzzer
- [Feroxbuster](https://github.com/epi052/feroxbuster) — dir brute
- [Nikto](https://github.com/sullo/nikto) — web scanner
- [Gobuster](https://github.com/OJ/gobuster) — dir/DNS brute
- [Dirsearch](https://github.com/maurosoria/dirsearch) — dir brute
- [OWASP ZAP](https://github.com/zaproxy/zaproxy) — web app scanner
- [Katana](https://github.com/projectdiscovery/katana) — web crawler
- [Arjun](https://github.com/s0md3v/Arjun) — hidden params
- [Caido](https://github.com/caido/caido) — web security tool
- [mitmproxy](https://github.com/mitmproxy/mitmproxy) — MITM proxy
- [wafw00f](https://github.com/EnableSecurity/wafw00f) — WAF detect
- [Sublist3r](https://github.com/aboul3la/Sublist3r) — subdomain enum
- [testssl.sh](https://github.com/drwetter/testssl.sh) — SSL/TLS test
- Sub-Domain TakeOver, Dirb, Skipfish, Web2Attack, CheckURL

## 🔧 Post Exploitation (10 tools)
- [Sliver](https://github.com/BishopFox/sliver) — C2 framework
- [Havoc](https://github.com/HavocFramework/Havoc) — C2 framework
- [Mythic](https://github.com/its-a-feature/Mythic) — C2 framework
- [PEASS-ng](https://github.com/peass-ng/PEASS-ng) — privesc (LinPEAS/WinPEAS)
- [Ligolo-ng](https://github.com/nicocha30/ligolo-ng) — tunneling
- [Chisel](https://github.com/jpillora/chisel) — tunneling
- [Evil-WinRM](https://github.com/Hackplayers/evil-winrm) — WinRM shell
- [pwncat-cs](https://github.com/calebstewart/pwncat) — post-exploit
- Vegile, Chrome Keylogger

## 🕵 Forensics (8 tools)
- [Volatility 3](https://github.com/volatilityfoundation/volatility3) — memory forensics
- [Binwalk](https://github.com/ReFirmLabs/binwalk) — firmware analysis
- [pspy](https://github.com/DominicBreuker/pspy) — process monitor
- Autopsy, Wireshark, Bulk extractor, Guymager, Toolsley

## 📦 Payload Creation (8 tools)
- [TheFatRat](https://github.com/Screetsec/TheFatRat) — payload generator
- [MSFvenom Payload Creator](https://github.com/g0tmi1k/msfpc) — MSF payloads
- [Venom](https://github.com/r00t-3xp10it/venom) — payload generator
- [Enigma](https://github.com/UndeadSec/Enigma) — payload obfuscation
- Brutal, Stitch, Spycam, Mob-Droid

## 🧰 Exploit Framework (4 tools)
- [RouterSploit](https://github.com/threat9/routersploit) — router exploit
- [Commix](https://github.com/commixproject/commix) — command injection
- WebSploit, Web2Attack

## 🔁 Reverse Engineering (5 tools)
- [Ghidra](https://github.com/NationalSecurityAgency/ghidra) — RE framework
- [Radare2](https://github.com/radareorg/radare2) — RE framework
- [Androguard](https://github.com/androguard/androguard) — Android RE
- [JadX](https://github.com/skylot/jadx) — Android decompiler
- Apk2Gold

## ⚡ DDOS Attack (5 tools)
- [SlowLoris](https://github.com/gkbrk/slowloris) — slow HTTP
- [GoldenEye](https://github.com/jseidl/GoldenEye) — HTTP DoS
- DDoS Script, Asyncrone, UFOnet

## 🖥 RAT (1 tool)
- Pyshell

## 🏢 Active Directory (6 tools)
- [BloodHound](https://github.com/BloodHoundAD/BloodHound) — AD mapping
- [Impacket](https://github.com/fortra/impacket) — AD protocols
- [Responder](https://github.com/lgandx/Responder) — LLMNR/NBT-NS
- [Certipy](https://github.com/ly4k/Certipy) — ADCS abuse
- [Kerbrute](https://github.com/ropnop/kerbrute) — Kerberos enum

## ☁ Cloud Security (4 tools)
- [Prowler](https://github.com/prowler-cloud/prowler) — AWS/Azure/GCP audit
- [ScoutSuite](https://github.com/nccgroup/ScoutSuite) — multi-cloud audit
- [Pacu](https://github.com/RhinoSecurityLabs/pacu) — AWS exploit
- [Trivy](https://github.com/aquasecurity/trivy) — container scanner

## 📱 Mobile Security (3 tools)
- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) — mobile scanner
- [Frida](https://github.com/frida/frida) — dynamic instrumentation
- [Objection](https://github.com/sensepost/objection) — runtime exploration

## ✨ Other Tools (24)
- [Sherlock](https://github.com/sherlock-project/sherlock) — username OSINT
- [SocialScan](https://github.com/iojw/socialscan) — username/email check
- [GoSpider](https://github.com/jaeles-project/gospider) — web spider
- [Hash Buster](https://github.com/s0md3v/Hash-Buster) — hash cracker
- [EvilURL](https://github.com/UndeadSec/EvilURL) — IDN homograph
- Debinject, Pixload — payload injection
- Keydroid, Lockphish, EvilApp, WishFish — Android tools
- Brute_Force — social media brute force

---

## Common Workflows

### Bug Bounty Recon
```
1. Subfinder + Amass → subdomain discovery
2. httpx → probe live hosts
3. Nuclei → vuln scan
4. ffuf → dir brute
5. Arjun → hidden params
6. Sqlmap → SQLi test
```

### WiFi Pentest
```
1. hcxdumptool → capture PMKID
2. hashcat → crack handshake
3. Bettercap → MITM
4. Wifite → auto attack
```

### Web App Pentest
```
1. Nmap → port scan
2. Nikto → web scan
3. OWASP ZAP → active scan
4. ffuf → fuzzing
5. Commix → cmd injection
6. Sqlmap → SQLi
```
