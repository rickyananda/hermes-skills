# JS Bundle Analysis — Quick Reference

Extract intelligence from minified JavaScript bundles. Use when analyzing any web application.

## API Route Discovery
```bash
# Find all API routes
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '/api/[a-zA-Z0-9/_-]+' | sort -u

# Find all HTTP URLs
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP 'https?://[^\s"\\]+' | sort -u

# Find npm package names (@scope/package)
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '@[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+' | sort -u

# Find environment variable references
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '(process\.env\.[A-Z_]+|NEXT_PUBLIC_[A-Z_]+|REACT_APP_[A-Z_]+|VITE_[A-Z_]+)' | sort -u

# Find hardcoded strings (emails, keys, tokens)
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' | sort -u
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '(sk-[a-zA-Z0-9]{20,}|pk_[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z_-]{35})' | sort -u
```

## Source Map Check
```bash
# Check if source maps are exposed (returns original source!)
curl -sI "https://site.com/assets/index-XXXXX.js.map"
# If 200 → download and analyze:
curl -s "https://site.com/assets/index-XXXXX.js.map" | python3 -c "import sys,json;d=json.load(sys.stdin);print('\n'.join(d.get('sources',[])[:50]))"
```

## Framework Detection
```bash
# React
curl -s "https://site.com/assets/index-XXXXX.js" | grep -c 'createElement\|jsx\|useState'

# Next.js
curl -s "https://site.com/" | grep -o '__NEXT_DATA__'

# Vue
curl -s "https://site.com/assets/index-XXXXX.js" | grep -c 'vue\|createApp\|ref('

# Svelte
curl -s "https://site.com/" | grep -o 'svelte'

# Vite (check for hashed asset filenames)
curl -s "https://site.com/" | grep -oP 'assets/[a-zA-Z0-9_-]+\.(js|css)'
```

## Backend Tech Detection
```bash
# Response headers reveal backend
curl -sI "https://site.com/" | grep -i 'x-powered-by\|server\|via\|x-aspnet\|x-runtime'

# Common patterns:
# x-powered-by: Express → Node.js/Express
# x-powered-by: PHP/8.x → PHP
# server: nginx → Nginx reverse proxy
# server: Apache → Apache
# x-aspnet-version → ASP.NET
# via: 1.1 google → Google Cloud
# server: Vercel → Vercel hosting
# server: Netlify → Netlify hosting
```

## Wallet/Web3 Detection
```bash
# Check for wallet connection code
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '(wagmi|rainbow|metamask|walletconnect|web3modal|connectWallet|ethers|viem|thirdweb|reown)[a-zA-Z0-9_]*' | sort -u

# Check for contract addresses (Ethereum)
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '0x[a-fA-F0-9]{40}' | sort -u

# Check for known drainer patterns
curl -s "https://site.com/assets/index-XXXXX.js" | grep -oP '(setApprovalForAll|approve\(|transferFrom|safeTransferFrom)[^)]*\)' | head -10
```
