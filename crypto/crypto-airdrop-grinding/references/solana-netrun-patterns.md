# Solana Program Patterns — Netrun XYZ

## Program Info
- **Program ID:** `FqDHFYCYfLadhHjEkbsxTmNmW4f2kMb6Pxf2sSFoRn1G`
- **Network:** Solana Devnet
- **RPC:** Helius devnet (`https://devnet.helius-rpc.com/?api-key=...`)
- **MPL Core:** `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`

## PDA Seeds

| PDA | Seeds |
|-----|-------|
| Protocol State | `["protocol_state"]` |
| State Token | `["state_token", symbol]` |
| Imprint | `["imprint", asset_pubkey]` |
| Mint Record | `["mint_record", state_token, asset_pubkey]` |
| Domain | `["domain", domain_name]` |
| Listing | `["listing", asset_pubkey]` |

## Instruction Discriminators

```javascript
function discriminator(prefix) {
  return crypto.createHash("sha256").update(`global:${prefix}`).digest().slice(0, 8);
}
```

| Instruction | Prefix | Data |
|-------------|--------|------|
| create_state_token | `"create_state_token"` | discriminator + encodeString(symbol) + encodeU64(maxSupply) + encodeU64(mintLimit) + encodeU8(0) |
| mint_state_token | `"mint_state_token"` | discriminator only |
| create_imprint | `"create_imprint"` | discriminator + encodeString(name) + imageHash(32 bytes) |
| register_domain | `"register_domain"` | discriminator + encodeString(domain) |
| list_asset | `"list_asset"` | discriminator + encodeU64(price) + encodeU8(kind) |
| update_listing | `"update_listing"` | discriminator + encodeU64(newPrice) |
| delist_asset | `"delist_asset"` | discriminator only |

## Account Ordering

### create_state_token
1. protocolState (R)
2. stateTokenPDA (W)
3. assetPubkey (R) — MPL Core asset
4. wallet ( signer, W)
5. SystemProgram (R)

### mint_state_token
1. protocolState (R)
2. stateTokenPDA (W)
3. assetPubkey (R)
4. mintRecordPDA (W)
5. wallet ( signer, W)
6. SystemProgram (R)

### create_imprint
1. protocolState (R)
2. imprintPDA (W)
3. assetPubkey (R)
4. wallet ( signer, W)
5. SystemProgram (R)

### register_domain
1. protocolState (R)
2. domainPDA (W)
3. assetPubkey (R)
4. wallet ( signer, W)
5. SystemProgram (R)

### list_asset
1. protocolState (R)
2. listingPDA (W)
3. asset (W)
4. collection — use NETRUN_PROGRAM as fallback (R)
5. wallet / seller ( signer, W)
6. MPL_CORE (R)
7. SystemProgram (R)

### update_listing
1. listingPDA (W)
2. asset (R)
3. wallet ( signer, R)

### delist_asset
1. listingPDA (W)
2. asset (W)
3. collection — use NETRUN_PROGRAM as fallback (R)
4. wallet / seller ( signer, W)
5. MPL_CORE (R)
6. SystemProgram (R)

## Scoring System

- **Score = Actions × 10**
- **Minimum to appear on leaderboard:** 41 actions (score 410)
- **Top 50 shown** on leaderboard page
- **API:** `https://app.netrun.xyz/api/leaderboard`
- **Imprints API:** `https://app.netrun.xyz/api/imprints`

## Action Types That Count

Each of these counts as 1 action:
- create_state_token (Create token)
- mint_state_token (Mint tokens)
- create_imprint (Create NFT)
- register_domain (Register .net domain)
- list_asset (List on market)
- update_listing (Update price)
- delist_asset (Delist from market)

## Efficient Grinding Strategy

Per wallet (~13 actions, ~0.057 SOL):
1. Create 2 tokens (2 actions)
2. Mint each token 2x (4 actions)
3. Register 2 domains (2 actions)
4. Create 2 NFTs (2 actions)
5. List 3 assets on market (3 actions)

Total: 13 actions × 10 = 130 score per wallet
