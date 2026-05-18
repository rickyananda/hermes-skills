# Netrun.xyz API Reference

## Endpoints

### Leaderboard
```
GET https://app.netrun.xyz/api/leaderboard
```
Returns top 50 wallets ranked by score.
```json
{
  "programId": "FqDHFYCYfLadhHjEkbsxTmNmW4f2kMb6Pxf2sSFoRn1G",
  "entries": [
    {
      "rank": 1,
      "wallet": "8MZ4xg...",
      "score": 18690,
      "actions": 1869,
      "updatedAt": "2026-05-16T04:12:17Z"
    }
  ]
}
```
- Score = actions × 10
- Minimum 41 actions to appear on board (rank 50)
- Updated via backend indexer (not real-time)

### Imprints (All Activity)
```
GET https://app.netrun.xyz/api/imprints
```
Returns ALL platform imprints (17,000+). Filter by `creator` field for specific wallet.
```json
{
  "id": "17731",
  "address": "...",
  "type": "token|mint|nft",
  "name": "SYMBOL",
  "decodedContent": { ... },
  "creator": "...wallet...",
  "owner": "...wallet...",
  "timestamp": 1778904815000
}
```
Types:
- `token` — CreateStateToken (discriminator `0x00`)
- `mint` — MintStateToken (discriminator `0x01`)
- `nft` — CreateImprint (discriminator `NFT`)

### Wallet Profile
```
GET https://app.netrun.xyz/{wallet_address}
```
Returns wallet-specific stats (accessible via browser).

## RPC
Helius devnet RPC (preferred):
```
https://devnet.helius-rpc.com/?api-key=<KEY>
```
Standard devnet:
```
https://api.devnet.solana.com
```

## Scoring Analysis
- Top grinder (rank 1): 1,869 actions → creates ~2 tokens/sec with random 8-char symbols
- Pattern: mass CreateStateToken with random symbols is the fastest scoring method
- Each action ≈ 10 points
- Mixed actions (tokens + mints + domains + NFTs + listings) diversify on-chain footprint
