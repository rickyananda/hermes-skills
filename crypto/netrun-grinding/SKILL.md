---
name: netrun-grinding
description: "Grind app.netrun.xyz (Solana devnet metaprotocol) — create tokens, NFTs, domains, market listings. Multi-account automation for leaderboard climbing."
triggers:
  - "netrun"
  - "netrun.xyz"
  - "grind netrun"
  - "solana devnet grinding"
  - "netrun leaderboard"
---

# Netrun.xyz Grinding

Grinding automation for [app.netrun.xyz](https://app.netrun.xyz) — a Solana devnet metaprotocol where on-chain actions earn leaderboard score (potential airdrop signal).

## Key Facts

- **Program ID:** `FqDHFYCYfLadhHjEkbsxTmNmW4f2kMb6Pxf2sSFoRn1G`
- **MPL Core Program:** `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`
- **Chain:** Solana devnet
- **Leaderboard API:** `https://app.netrun.xyz/api/leaderboard`
- **Imprints API:** `https://app.netrun.xyz/api/imprints`
- **Scoring:** 1 action = 10 score points. Top 50 shown on leaderboard.
- **Minimum to appear on leaderboard:** ~41 actions (score 410)

## Available Actions (Instructions)

All instruction discriminators = `sha256("global:<instruction_name>").slice(0, 8)`

### 1. CreateStateToken
Create a new fungible token with supply/mint config.
- **PDA:** `["state_token", symbol_bytes]`
- **Accounts:** protocolState, stateTokenPDA, mplAsset, authority(signer), systemProgram
- **Data:** discriminator + encodeString(symbol) + encodeU64(maxSupply) + encodeU64(mintLimit) + encodeU8(decimals)

### 2. MintStateToken
Mint tokens from an existing state token.
- **PDA:** `["mint_record", stateTokenPDA.toBuffer(), asset.toBuffer()]`
- **Accounts:** protocolState, stateTokenPDA, mplAsset, mintRecordPDA, authority(signer), systemProgram
- **Data:** discriminator only

### 3. CreateImprint (NFT)
Create an NFT imprint on-chain.
- **PDA:** `["imprint", asset.toBuffer()]`
- **Accounts:** protocolState, imprintPDA, mplAsset, authority(signer), systemProgram
- **Data:** discriminator + encodeString(name) + 32-byte imageHash

### 4. RegisterDomain
Register a `.net` domain name.
- **PDA:** `["domain", domain_name_bytes]`
- **Accounts:** protocolState, domainPDA, mplAsset, authority(signer), systemProgram
- **Data:** discriminator + encodeString(domain)

### 5. ListAsset
List an asset on the marketplace.
- **PDA:** `["listing", asset.toBuffer()]`
- **Accounts:** protocolState, listingPDA, asset, collection(=NETRUN_PROGRAM), seller(signer), MPL_CORE, systemProgram
- **Data:** discriminator + encodeU64(price) + encodeU8(kind)

### 6. UpdateListing
Update price of a listed asset.
- **Accounts:** listingPDA, asset, seller(signer)
- **Data:** discriminator + encodeU64(newPrice)

### 7. DelistAsset
Remove asset from marketplace.
- **Accounts:** listingPDA, asset, collection(=NETRUN_PROGRAM), seller(signer), MPL_CORE, systemProgram
- **Data:** discriminator only

## Common PDA Seeds

```
protocol_state: ["protocol_state"]
state_token:    ["state_token", symbol_bytes]
imprint:        ["imprint", asset_pubkey_bytes]
mint_record:    ["mint_record", state_token_bytes, asset_bytes]
domain:         ["domain", name_bytes]
listing:        ["listing", asset_pubkey_bytes]
```

## Multi-Account Grinding Pattern

User prefers funding sub-wallets from main wallet (not individual faucet claims).

1. **Generate wallets** — `Keypair.generate()`, save secret keys to JSON file
2. **Fund from main** — `SystemProgram.transfer` from main wallet (~0.08 SOL each)
3. **Grind each wallet** — create 2 tokens, mint 4x, register 2 domains, create 2 NFTs, list 3 assets
4. **Track results** — save per-wallet action counts and final balances to JSON

Each wallet uses ~0.05 SOL for a full grind cycle (~11-13 actions).

## Pitfalls

- **MPL asset creation required first** — Each Netrun action needs an MPL Core asset created BEFORE the instruction. Use `@metaplex-foundation/mpl-core` `create()`.
- **NFT CreateImprint needs 32-byte hash** — The imageHash field is exactly 32 bytes (sha256 digest). Don't truncate or pad.
- **ListAsset collection account** — Must pass `NETRUN_PROGRAM` as the collection (fallback), not a real collection PDA. Missing this causes Error 3010/3012.
- **DelistAsset same collection pattern** — Also needs `NETRUN_PROGRAM` as collection.
- **Leaderboard indexer delay** — The leaderboard uses a backend indexer, not direct on-chain reads. There can be significant delay between transaction confirmation and score appearing.
- **Imprints API is global** — `/api/imprints` returns ALL platform imprints, not per-wallet. Filter by `creator` field.
- **Devnet faucet rate limits** — If using faucet for initial funding, rate limits apply. Prefer transferring from a funded main wallet.
- **Node.js stdout buffering** — When running long scripts in background, `process.stdout.write()` is needed for real-time output. `console.log` may buffer.
- **Skip wallets with low balance** — Before grinding a wallet, check balance > 0.01 SOL to avoid wasting time on drained wallets.
- **Resume support** — The grind-only script reads existing results JSON and skips completed wallets. This allows restarting interrupted runs without re-grinding.
- **Results file format** — `netrun_grind_results.json` contains array of `{wallet, actions, totalActions, finalBalance}` objects. Used by both grinder (resume) and dashboard (display).

## Helper Functions (Node.js)

```javascript
function encodeString(s) {
  const e = Buffer.from(s); const l = Buffer.alloc(4);
  l.writeUInt32LE(e.length, 0); return Buffer.concat([l, e]);
}
function encodeU64(v) { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(v), 0); return b; }
function encodeU8(v) { return Buffer.from([v & 0xff]); }
function discriminator(p) {
  return crypto.createHash("sha256").update(`global:${p}`).digest().slice(0, 8);
}
function findPDA(seeds, programId) {
  return PublicKey.findProgramAddressSync(seeds, programId);
}
```

## Wallet File Format

```json
[
  {
    "index": 0,
    "address": "...base58...",
    "secret_key_array": [1, 2, 3, ...]
  }
]
```

## Monitoring Dashboard

See `references/monitoring-dashboard.md` for the real-time dashboard pattern (Node.js server + HTML frontend polling `/api/data` every 5s).

## Scripts

- `netrun_multi_grinder.mjs` — Full pipeline: create wallets → fund from main → grind all
- `netrun_grind_only.mjs` — Grind-only mode (wallets already funded). Supports resume via results JSON.
- `netrun_dashboard.js` — HTTP dashboard server on port 8888

## References

- `references/netrun-api.md` — API endpoint details
- `references/monitoring-dashboard.md` — Dashboard architecture and styling
