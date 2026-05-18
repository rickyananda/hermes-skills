---
name: crypto-airdrop-research
description: Research crypto platforms and airdrop opportunities. Explore DeFi/NFT apps, analyze grinding strategies, and identify potential airdrop farming methods.
tags: [crypto, airdrop, defi, nft, solana, web3]
triggers:
  - user asks about crypto platforms, airdrops, or DeFi
  - user wants to "grind" a protocol for potential airdrop
  - user shares a crypto/web3 app URL to explore
  - user asks about farming strategies or testnet participation
---

# Crypto & Airdrop Research

## Purpose
Research crypto platforms, identify airdrop opportunities, and develop grinding strategies for DeFi/NFT protocols.

## Research Workflow

### Step 1: Platform Exploration
1. **Navigate to the app** and explore main pages:
   - Home/Explorer (main activity feed)
   - Tokens (if available)
   - Collections (NFT-related)
   - Market/Trading
   - Leaderboard (crucial for airdrop farming)
   - About/Litepaper (understand the protocol)

2. **Identify the blockchain** (Solana, Ethereum, Base, Arbitrum, etc.)
3. **Check wallet requirements** (Phantom, MetaMask, etc.)
4. **Find faucet links** for testnet tokens

### Step 2: Documentation Analysis
1. **Read the litepaper/whitepaper** - understand core innovation
2. **Check docs** - find API endpoints, smart contract addresses
3. **Review tokenomics** - potential airdrop criteria
4. **Check social channels** (Discord, Twitter) for community insights

### Step 3: Grinding Strategy Development
1. **Identify on-chain activities** that earn points/score:
   - Token creation/minting
   - NFT minting
   - Domain registration
   - Trading volume
   - Liquidity provision
   - Testnet participation

2. **Calculate costs** (gas fees, testnet vs mainnet)
3. **Identify automation opportunities** (scripts, bots)
4. **Track leaderboard metrics** (what actions earn points)

### Step 4: Automation Planning
1. **Check for APIs** (REST, GraphQL, WebSocket)
2. **Identify repeatable actions** that can be scripted
3. **Plan wallet management** (multiple wallets if beneficial)
4. **Set up monitoring** (alerts for new opportunities)

## Common Airdrop Farming Patterns

### Solana-based Protocols
- **Phantom Wallet** required
- Switch to **Devnet** for testnet activities
- Use **Solana faucet** for testnet SOL
- Activities: create tokens, mint NFTs, register domains, trade

### EVM-based Protocols
- **MetaMask** or compatible wallet
- Bridge assets if needed
- Activities: swaps, liquidity, staking, governance voting

### Layer 2 Solutions
- **Bridge from mainnet** (may require minimum amounts)
- **Testnet participation** often rewarded
- Activities: transactions, contract deployments, app usage

## Key Metrics to Track
- **Leaderboard position** (if available)
- **Transaction count** (more = better for many airdrops)
- **Unique days active** (consistency matters)
- **Volume traded** (some protocols weight by volume)
- **Assets created** (tokens, NFTs, domains)

## Pitfalls to Avoid
- **Don't use mainnet funds for testnet** - always verify network
- **Don't share private keys** - legitimate protocols never ask
- **Don't pay for "airdrop lists"** - most are scams
- **Verify contract addresses** - use official links only
- **Check gas costs** - some activities may not be worth the gas

## Programmatic Wallet Creation (Python)
When the user needs a wallet created server-side (no browser):
```python
from solders.keypair import Keypair
import base58, json

keypair = Keypair()
address = str(keypair.pubkey())
secret_b58 = base58.b58encode(bytes(keypair)).decode()
secret_array = list(bytes(keypair))  # Phantom import format
```
- Save to `~/solana_wallet.json` with address, secret_key_b58, secret_key_array
- **⚠️ NEVER share secret keys in public channels**

## Solana Devnet Faucet — Workarounds
The official faucet (`api.devnet.solana.com` → `requestAirdrop`) is **heavily IP-rate-limited**. Server-side requests almost always fail with `code: -32603` or `code: 429`.

**Workarounds (in order of reliability):**
1. **Phantom built-in faucet** — user opens Phantom, clicks "Request Airdrop" directly (best success rate)
2. **faucet.solana.com** — user visits from their own browser, connects GitHub to unlock higher limits
3. **solfaucet.com** — third-party faucet, also rate-limited but different IP pool
4. **Sol Faucet (solfaucet.com)** — community faucet, may work when official is dry

**What NOT to do:** Don't loop/retry `requestAirdrop` RPC calls from the server — the rate limit is per-IP and persists for hours.

## Tools & Resources
- **Wallet Extensions**: Phantom (Solana), MetaMask (EVM)
- **Python libs**: `pip install solders solana base58` — create wallets, sign txns, query balances
- **Node.js libs**: `npm install @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @metaplex-foundation/umi-web3js-adapters @solana/web3.js` — create MPL Core assets, sign transactions
- **Block Explorers**: Solscan, Etherscan, etc.
- **Faucets**: Protocol-specific or community faucets (see workarounds above)
- **Analytics**: Dune Analytics, Flipside Crypto

## Solana Program Interaction (Advanced)

### Critical: MPL Core Asset Requirement
Many Solana protocols (like Netrun) require assets to be **Metaplex Core (MPL Core) assets** before they can be used in protocol instructions. This means:
1. First create an MPL Core asset using the `@metaplex-foundation/mpl-core` SDK
2. Then pass that asset address to the protocol's instructions

**Error if skipped**: `AssetNotMplCore (6000)` — "Asset is not owned by the mpl-core program"

### Node.js UMI Setup Pattern
```javascript
const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const { mplCore, create } = require("@metaplex-foundation/mpl-core");
const { generateSigner, signerIdentity, createSignerFromKeypair } = require("@metaplex-foundation/umi");
const { fromWeb3JsKeypair } = require("@metaplex-foundation/umi-web3js-adapters");
const { Keypair } = require("@solana/web3.js");

// CRITICAL: Use createSignerFromKeypair, NOT direct keypair assignment
const umi = createUmi(RPC_URL).use(mplCore());
const web3Keypair = Keypair.fromSecretKey(secretKey);
const umiKeypair = fromWeb3JsKeypair(web3Keypair);
const signer = createSignerFromKeypair(umi, umiKeypair);
umi.use(signerIdentity(signer));

// Generate asset signer
const asset = generateSigner(umi);

// Create MPL Core asset
await create(umi, {
  asset: asset,
  name: "My Asset",
  uri: "https://arweave.net/...",
}).sendAndConfirm(umi);

// Use asset.publicKey in subsequent protocol instructions
```

### Common Anchor Error Codes
| Code | Name | Meaning |
|------|------|---------|
| 3010 | AccountNotSigner | Account missing `isSigner: true` |
| 3012 | AccountNotInitialized | PDA account not created yet (upstream tx failed) |
| 6000 | AssetNotMplCore | Asset not owned by MPL Core program |
| 6005 | Custom | Protocol-specific validation error |

### Account Ordering Pitfall
When building Solana instructions, **account order matters**. Always verify against the frontend JS code:
- Use `browser_console` to find the JS bundle containing instruction builders
- Search for the instruction name (e.g., `listAssetInstruction`)
- Match the exact account order from the decompiled code

**Example (Netrun ListAsset)**:
```
Keys: [protocolState, listingPDA, asset, collection, seller, MPL_CORE, SystemProgram]
```
Missing `collection` (fallback to program ID) causes downstream `AccountNotInitialized` errors.

### Debugging Failed Transactions
```python
# Check transaction status
r = httpx.post(RPC_URL, json={
    "jsonrpc": "2.0", "id": 1,
    "method": "getTransaction",
    "params": [tx_hash, {"encoding": "json"}]
})
logs = r.json()["result"]["meta"]["logMessages"]
# Look for "Program log:" lines for error details
```

### Leaderboard/Indexing Mystery
Some protocols use **backend indexers** for leaderboards that may not immediately reflect on-chain activity. If you have many successful transactions but 0 score:
- The indexer may have a delay (minutes to hours)
- The indexer may only count specific instruction types
- The indexer may require a minimum activity threshold
- Check if there's a different API endpoint for wallet-specific scores

See `references/netrun-xyz-research.md` for detailed Netrun-specific technical reference.

## When User Shares a Platform URL
1. Navigate to the app
2. Explore all main pages systematically
3. Check for wallet connection requirements
4. Look for leaderboard/points system
5. Identify grinding activities
6. Report findings with clear action items

## Example: Netrun.xyz (Solana)
- **Platform**: Metaprotocol for programmable NFTs on Solana
- **Network**: Devnet/Testnet
- **Wallet**: Phantom (switch to devnet)
- **Activities**: Create tokens, mint NFTs, register domains, trade
- **Leaderboard**: Yes - tracks score and actions
- **Faucet**: Link in footer
- **Market**: Buy/sell assets with SOL