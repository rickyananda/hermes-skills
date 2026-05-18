---
name: maigret
description: "Maigret — username OSINT tool that checks 3000+ sites for accounts and extracts profile data. GitHub: soxoj/maigret"
tags: [osint, username, social-media, recon, intelligence, hacking]
---

# Maigret 🕵️‍♂️

Collect a dossier on a person **by username only** — checks 3000+ sites and extracts all available info from profile pages. No API keys required.

**Repo:** https://github.com/soxoj/maigret
**Version:** 0.6.1
**Stars:** 28.9k ⭐
**License:** MIT
**Python:** 3.10+
**Author:** soxoj

## Installation

```bash
# Pip
pip install maigret

# Docker (CLI)
docker pull soxoj/maigret
docker run -v /mydir:/app/reports soxoj/maigret:latest username --html

# Docker (Web UI)
docker run -p 5000:5000 soxoj/maigret:web

# Windows: standalone EXE from GitHub Releases
```

## Quick Start

```bash
# Basic scan (top 500 sites by traffic)
maigret username

# Scan ALL 3000+ sites
maigret username -a

# Multiple usernames
maigret user1 user2 user3 -a
```

## Core Features

- **3000+ sites** — default scans top 500, use `-a` for all
- **Profile extraction** — name, bio, photo, links to other accounts (via socid_extractor)
- **Recursive search** — automatically searches discovered usernames/IDs
- **Tag filtering** — by category or country (`--tags photo,dating`, `--tags us`)
- **Auto-updates** database from GitHub every 24h, falls back to built-in DB offline
- **Tor/I2P** — works with .onion and .i2p sites
- **Cloudflare bypass** — via FlareSolverr integration (experimental)
- **Web UI** — built-in graph visualization + downloadable reports
- **AI analysis** — OpenAI-powered investigation summary
- **No API keys** needed for basic usage

## Export Formats

```bash
maigret user --html          # HTML report
maigret user --pdf           # PDF report (needs pip install 'maigret[pdf]')
maigret user --json ndjson   # Newline-delimited JSON
maigret user --json simple   # Simple JSON
maigret user --csv           # CSV
maigret user --txt           # Plain text
maigret user --graph         # Interactive D3 graph (HTML)
maigret user --xmind         # XMind 8 mindmap (not 2022+)
```

## Advanced Usage

### Parse URL → Recursive Search
```bash
# Extract IDs from a profile page, then search with those
maigret --parse https://example.com/profile/johndoe
```

### Username Permutation
```bash
# Generate variants: johndoe, j.doe, j_doe, etc.
maigret --permute john doe
```

### Tag Filtering
```bash
maigret user --tags photo,dating    # sites tagged photo OR dating
maigret user --tags us              # US sites only
maigret user --tags crypto          # crypto-related sites
```

### Proxy / Tor / I2P
```bash
maigret user --proxy socks5://127.0.0.1:1080
maigret user --tor-proxy socks5://127.0.0.1:9050
maigret user --i2p-proxy http://127.0.0.1:4444
```

### Cloudflare Bypass (Experimental)
```bash
# Requires FlareSolverr running
docker run -d -p 8191:8191 --name flaresolverr ghcr.io/flaresolverr/flaresolverr:latest
maigret --cloudflare-bypass username
```

### AI Analysis
```bash
export OPENAI_API_KEY=***
maigret user --ai
maigret user --ai --ai-model gpt-4o-mini

# Or set in settings.json:
# openai_api_key, openai_api_base_url (supports any OpenAI-compatible API)
```

AI produces: likely real name, location, occupation, interests, languages, confidence, follow-up leads.

### Web Interface
```bash
maigret --web 5000
# Open http://127.0.0.1:5000
```

Features: results graph visualization, downloadable reports in all formats from single page.

### Database Self-Check (Maintainers)
```bash
maigret --self-check
maigret --self-check --auto-disable
```

## Python Library Usage

```python
# Maigret can be embedded in Python projects
# The CLI is a thin wrapper around an async function
# See: https://maigret.readthedocs.io/en/latest/library-usage.html
```

## Settings

Config file: `settings.json`
- `openai_api_key` — for AI analysis
- `openai_api_base_url` — custom OpenAI-compatible endpoint
- `cloudflare_bypass.enabled` — enable Cloudflare bypass

## Reports

Maigret generates comprehensive reports with:
- List of all found accounts with URLs
- Extracted profile data (name, bio, avatar, location)
- Links between accounts
- Visual graph of connections (D3 interactive or XMind)

## Troubleshooting

- 403s/timeout errors: see TROUBLESHOOTING.md in repo
- PDF reports need system graphics libs on Linux/macOS
- Build errors: see installation troubleshooting docs
- Database auto-update fails offline: falls back to built-in DB

## Docs

- Full docs: https://maigret.readthedocs.io
- Quick start: https://maigret.readthedocs.io/en/latest/quick-start.html
- CLI options: https://maigret.readthedocs.io/en/latest/command-line-options.html
- Features: https://maigret.readthedocs.io/en/latest/features.html
- Contributing: https://github.com/soxoj/maigret/blob/main/CONTRIBUTING.md

## Site Database

Full site list: https://github.com/soxoj/maigret/blob/main/sites.md
Sites include: social media, forums, dating, crypto, coding platforms, content creators, and more.
