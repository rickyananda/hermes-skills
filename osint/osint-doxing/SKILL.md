---
name: osint-doxing
description: OSINT & Web Forensics — doxing techniques, footprint removal, anti-forensics. Use when user asks to investigate someone, find personal info, remove their own footprint, or check their OPSEC.
triggers:
  - "find info about someone"
  - "dox"
  - "osint"
  - "look up someone"
  - "remove my info"
  - "check my footprint"
  - "reverse lookup"
  - "whois lookup"
  - "find email from"
  - "find social media"
  - "database leak"
  - "remove dox"
  - "anti-forensics"
---

# OSINT & Web Forensics Skill

> Sources: "God's Doxing & Anonymity" + "The Doxing Bible" (Dubitus & Ego, The Black Hand)

## Part 1: OSINT (Offensive — Gathering Info)

### 1.1 Starting Point: Email

Email is the #1 pivot point. From email you can find:

**Facebook (Hidden Email Resolver)**
1. Go to Facebook → "Forgot your password?"
2. Enter target's email
3. Reveals: name, picture, sometimes last 4 digits of phone
4. Alternative: `https://www.facebook.com/search.php?q=EMAIL`

**Skype**
- Search email in Skype search bar
- Use Email2Skype: `http://mostwantedhf.info/email.php`
- From Skype → resolve IP → geolocate

**Social Media / Accounts**
- `https://pipl.com/` — best accuracy
- `http://thatsthem.com/`
- `http://com.lullar.com/`
- `https://namechk.com/`
- `http://email.addresssearch.com/`

**PayPal Trick**
- Send $0.01 to target's email via Friends & Family
- Transaction shows their real name
- Wait up to 10 minutes

**Whois Email**
- `https://whoisology.com/email/archive_10/EMAIL` — finds websites associated with email

### 1.2 Starting Point: Name

**People Search Directories (US)**
- `http://10digits.us` — best results
- `http://thatsthem.com` — also good
- `http://www.whitepages.com` — average
- `http://www.ussearch.com/` — average
- `http://www.pipl.com/`
- `http://www.peekyou.com/`

**International**
- Canada: `http://www.canada411.ca/`
- UK: `http://webmii.com/`
- Sweden: `http://www.ratsit.se/BC/SearchPerson.aspx`
- Denmark: `http://www.dgs.dk`
- Germany: `https://find-person-germany.com/`, `https://www.goyellow.de/`

**Method:** Enter first name + last name + city/state → search → find address, phone, relatives

### 1.3 Starting Point: Phone Number

**Reverse Phone Lookup**
- `http://www.10digits.us` — best
- `http://www.reversemobile.com/index.php`
- `http://thatsthem.com`
- `http://www.whitepages.com`
- `http://www.pipl.com/`

**Area Code Lookup** (first 3 digits)
- `https://www.allareacodes.com/area-code-lookup/`
- `http://www.melissadata.com/lookups/zipcityphone.asp`
- Gives: state, major city, timezone

**Facebook Recovery Trick**
- Enter phone number in Facebook "Forgot Password" → reveals associated account

### 1.4 Starting Point: Address

**Address Lookup** — find residents
- `http://www.whitepages.com/` (Address tab)
- `http://10digits.us/` (Address tab)
- Reveals: residents, parents, phone numbers

**House Information**
- `https://maps.google.com/` — satellite view, house picture
- `http://www.zillow.com/` — beds, baths, sqft, year built, estimated value
- `http://www.realtor.com/` — additional details

**Zip Code Lookup**
- `https://tools.usps.com/go/ZipLookupAction!input.action`
- `http://www.unitedstateszipcodes.org/`

### 1.5 Starting Point: Skype

**Skype → IP**
- `http://mostwantedhf.info/index.php`
- `http://resolvethem.com/index.php`
- `http://skypegrab.net/resolver.php`
- `http://skype-resolver.org`
- `https://www.hanzresolver.com/dashboard`

**Skype → Email**
- `http://skypegrab.net/skype2email.php`

**IP → Skype**
- `http://www.skresolver.com/ip-to-skype.php`
- `http://skype2ip.ninja/ip2skype.php`
- `https://www.hanzresolver.com/ip2skype`

**Facebook Import Trick**
1. Create new Facebook → Find Friends → Skype icon → login
2. Go to `fb.com/invite_history.php`
3. Search target's display name → get email

### 1.6 Starting Point: IP Address

**Geolocation**
- `http://www.ipaddress.com/IP.ipaddress.com` (append .ipaddress.com to IP)
- `http://www.iplocationtools.com/IP.html`
- Gives: city, state, zip, timezone, ISP, hostname

**ISP Doxing (Social Engineering)**
- Call ISP support, pretend to be employee
- Use internal system names (G2, ACSR, Polaris, etc.)
- Can pull: name, DOB, SSN, phone, address, credit card on file
- Requires: good voice acting, patience, multiple attempts

**Proxy Check**
- `http://www.proxyornot.com/`
- Known ISPs (Comcast, TWC) = 99.99% legit IP

### 1.7 Starting Point: Username/Alias

**Alias Search**
- `https://pipl.com/` — best
- `http://knowem.com/`
- `https://namechk.com/`
- More effective with specific/unique aliases

### 1.8 Starting Point: Image

**Reverse Image Search**
- `https://www.tineye.com/` — 11.8B images indexed
- `https://images.google.com/` — Google Images
- Upload image or paste URL → find where image appears online

**EXIF/Geotag**
- `http://www.geoimgr.com/`
- `http://exifdata.com/`
- `http://regex.info/exif.cgi`
- Extracts: GPS coordinates, camera info, date taken

### 1.9 Starting Point: Website/Domain

**WHOIS Lookup**
- `https://whois.domaintools.com/WEBSITE`
- `https://www.easywhois.com/`
- `https://whois.icann.org/`
- `https://who.godaddy.com`
- Gives: registrant name, address, phone, email, org
- Note: private registration hides info

### 1.10 Google Dorking

**Core Operators**
- `site:TARGET` — filter by site
- `"exact term"` — exact match
- `-exclude` — exclude term
- `cache:URL` — view cached/deleted pages

**Example Searches**
- `site:hackforums.net "target" "skype"`
- `site:hackforums.net "target" "@gmail.com"`
- `filetype:sql "username , password"` — find DB dumps
- `"Skype: TARGET"` — find Skype mentions
- `"email: TARGET"` — find email mentions

### 1.11 Database Forensics (GREP)

**Setup**
1. Download Windows Grep: `http://www.wingrep.com/download.htm`
2. Create folder "Database" on desktop
3. Configure: directory + file types (`.sql .txt .csv .doc`)
4. Search databases for emails, usernames, IPs, passwords

**Finding Databases**
- Search Pastebin: "database dump", "SQL users dump", "website dump"
- `http://db.aggron.party/dblookup.php?key=***&tool=dblookup&string=TERM`
- `http://skidbase.io` — $0.50 per lookup

**MD5 Hash Cracking**
- `http://www.cmd5.com/english.aspx` — 7.8T passwords
- `http://md5.rednoize.com` — 56M passwords
- `http://www.md5decrypter.com` — 15M passwords
- MD5 = 32 characters (16 bytes)

### 1.12 Hacked-Data Search Engines

- `https://haveibeenpwned.com/` — check if leaked
- `https://haveibeenpwned.com/NotifyMe` — alerts
- `https://www.hacked-db.com/`
- `https://indexeus.com/` — search by name, email, phone, IP

### 1.13 SSN & Credit Report

**SSN Lookup (Paid)**
- `https://ssndob.so` — BTC only
- Search by name + location
- Validate: `http://www.ssnvalidator.com/`

**Credit Report**
- `http://www.annualcreditreport.com/`
- `http://www.creditkarma.com/`
- Requires answering security questions (need full dox)

### 1.14 Ancestors/Relatives

- `http://www.advancedbackgroundchecks.com/`
- `http://www.findmypast.com/`
- `http://www.archives.com/search/ancestor`
- `http://www.familytreesearcher.com/`
- Need: name, middle name, last name, age, state

---

## Part 2: Anti-OSINT (Defensive — Removing Info)

### 2.1 Remove Info from Lookup Sites

- Intelius: `https://www.intelius.com/optout.php` (needs ID)
- Acxiom: Opt-Out page
- MyLife: `privacy@mylife.com` or 1-888-704-1900
- Spokeo: `http://www.spokeo.com/privacy`
- BeenVerified: Reddit guide
- PeekYou: `http://www.peekyou.com/about/contact/optout/`
- Whitepages: `http://www.whitepages.com/privacy_central#6`
- Radaris: `http://radaris.com/removal/`
- PeopleSmart: `http://www.peoplesmart.com/opt-out`
- US Search: `http://www.ussearch.com/consumer/ala/landing.do?did=590`

### 2.2 Delete Social Media

- Facebook: `https://www.facebook.com/help/delete_account`
- Twitter: `http://twitter.com/settings/accounts/confirm_deactivation`
- MySpace: `http://www.myspace.com/my/settings/account/cancel`
- Yahoo: `https://edit.yahoo.com/config/delete_user`
- Gmail: `https://www.google.com/accounts/DeleteAccount`
- Outlook: `https://account.live.com/CloseAccount.aspx`
- Skype: Contact support to remove from directory (7-30 days)

### 2.3 Remove Dox from Pastebin

1. Find "Report Abuse" button
2. Sign in, file complaint
3. Wait 3-5 business days
4. Message: "Your site is hosting private information of mine that hackers gained illegally..."

### 2.4 Remove Google Cache

1. `https://www.google.com/webmasters/tools/removals?pli=1`
2. Enter URL of removed page
3. Click "Request removal"
4. Check status at same URL

### 2.5 Update/Fake a Dox

1. Find existing dox on you
2. Copy to new Pastebin with same title
3. Change identifying details (name, address, number)
4. Keep some real info (Skype, HF) for believability
5. Submit as "updated" version

### 2.6 Properly Fake a Dox

1. Use `http://fakenamegenerator.com` for fake identity
2. Fill template with fake info
3. Include some real accounts for believability
4. Find IP/proxy matching fake location
5. Submit with same title as original

### 2.7 Deindexation (12 Private Methods)

**Cloaking** — Copy dox, alter slightly, repost as "updated" over 3-5 days
**Cloned Content** — Post 20+ times to manipulate page ranking
**Slaved Content** — Grab inspect element code, repost to boost ranking
**Keyword Scrambling** — Alter keywords to lead to false information
**Page Ranking Altercation** — Post on low quality sites to drag down rankings
**Font Matching** — Match site font, create fake screenshots (needs XSS)
**Infoscoping** — Microscopic font cached by Google but invisible on page
**Doorway Pages** — Create trap door links with fake info chains
**100:1 Principle** — Spam false info using iMacros on Pastebin.ca, slexy.org
**Rich Snippets** — Copy Google ad URLs to paste sites for ranking boost
**Site Duplication** — Combine Doorway Pages + 100:1
**Interlinking** — Link 5+ fake doxes together with URLs at bottom

### 2.8 Trail Obfuscation

- **TimeStomp** — Alter file creation timestamps
- **Transmogrify** — Modify file headers (MZ → custom hex)
- **Data Poisoning** — False trails, alias leaching (hijack email → grow synthetic alias)

### 2.9 Data Hiding

- **Encryption** — 128-bit Microsoft Word, .batch files with passwords
- **Steganography** — StegFS (hide data in Linux ext2 unused blocks)
- **Slacker** — Hide data in NTFS slack space
- **HPA/DCO** — Hide in Host Protected Area or Device Configuration Overlay

### 2.10 Artifact Wiping

- **Disk Cleaning** — BCwipe (`jetico.com`), CyberScrub (`cyberscrub.com`)
- **File Wiping** — BCwipe for individual files
- **Disk Degaussing** — Magnetic field wipe (expensive, total destruction)
- **Physical Destruction** — Pulverisation, shredding, incineration, melting

---

## Part 3: Anonymity Checklist

- [ ] Remove info from ALL lookup sites
- [ ] Delete or lock down social media
- [ ] Make Skype unresolveable / removed from directory
- [ ] Use Firefox with security hardening
- [ ] VPN (paid preferred — 143VPN, VPNSecure)
- [ ] XMPP + OTR instead of Skype
- [ ] BTC for payments (blockchain.info)
- [ ] Check `https://haveibeenpwned.com/` for leaks
- [ ] Use throwaway emails (10minutemail.com)
- [ ] Don't reuse aliases across platforms
- [ ] Google yourself regularly
- [ ] Remove Google cache after removing content

---

## Quick Reference: Tool Matrix

| Starting Point | Best Tool | Result |
|----------------|-----------|--------|
| Email | Pipl, Facebook forgot pw | Name, accounts, Skype |
| Name | 10digits, Whitepages | Address, phone, relatives |
| Phone | 10digits, reversemobile | Name, address |
| Skype | skypegrab.net | IP, email |
| IP | ipaddress.com, ISP SE | Location, ISP, name, SSN |
| Address | Whitepages, Zillow | Residents, house details |
| Alias | Pipl, Namechk, KnowEm | Accounts, email |
| Image | TinEye, Google Images | Other aliases, profiles |
| Domain | whois.domaintools.com | Owner name, address, email |
| Username | site: + Google dorking | Posts, emails, Skype |
