# Netrun.xyz Protocol Reference

Solana devnet metaprotocol for creating tokens, NFTs, domains, and trading.

## Program Details
- **Program ID:** `FqDHFYCYfLadhHjEkbsxTmNmW4f2kMb6Pxf2sSFoRn1G`
- **MPL Core Program:** `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`
- **Network:** Solana Devnet
- **RPC:** `https://devnet.helius-rpc.com/?api-key=...`

## API Endpoints
- **Imprints:** `https://app.netrun.xyz/api/imprints` (all on-chain activity)
- **Leaderboard:** `https://app.netrun.xyz/api/leaderboard` (top 50 by score)

## Leaderboard Scoring
- Score = actions × 10
- Minimum ~41 actions to appear on leaderboard (rank 50 has 410 score)
- Top wallets have 1000+ actions

## Instruction Types

### create_state_token
Create a new fungible token.
```
discriminator: sha256("global:create_state_token")[0:8]
data: [discriminator, symbol(String), maxSupply(u64), mintLimit(u64), decimals(u8)]
accounts: [protocolState, stateTokenPDA, mplAsset, signer, systemProgram]
```

### mint_state_token
Mint tokens from an existing state token.
```
discriminator: sha256("global:mint_state_token")[0:8]
data: [discriminator] (no additional data)
accounts: [protocolState, stateTokenPDA, mplAsset, mintRecordPDA, signer, systemProgram]
```

### register_domain
Register a .net domain.
```
discriminator: sha256("global:register_domain")[0:8]
data: [discriminator, domain(String)]
accounts: [protocolState, domainPDA, mplAsset, signer, systemProgram]
```

### create_imprint
Create an NFT imprint.
```
discriminator: sha256("global:create_imprint")[0:8]
data: [discriminator, name(String), imageHash(32 bytes)]
accounts: [protocolState, imprintPDA, mplAsset, signer, systemProgram]
```

### list_asset
List an asset on the market.
```
discriminator: sha256("global:list_asset")[0:8]
data: [discriminator, price(u64), kind(u8)]
accounts: [protocolState, listingPDA, asset, collection(NETRUN_PROGRAM), signer, MPL_CORE, systemProgram]
```

### update_listing
Update listing price.
```
discriminator: sha256("global:update_listing")[0:8]
data: [discriminator, newPrice(u64)]
accounts: [listingPDA, asset, signer]
```

### delist_asset
Remove asset from market.
```
discriminator: sha256("global:delist_asset")[0:8]
data: [discriminator]
accounts: [listingPDA, asset, collection(NETRUN_PROGRAM), signer, MPL_CORE, systemProgram]
```

## PDA Seeds
- Protocol State: `["protocol_state"]`
- State Token: `["state_token", symbol]`
- Imprint: `["imprint", asset_pubkey]`
- Mint Record: `["mint_record", state_token_pubkey, asset_pubkey]`
- Domain: `["domain", domain_name]`
- Listing: `["listing", asset_pubkey]`

## Grinding Strategy
Each wallet should execute:
1. Create 2 tokens (create_state_token)
2. Mint each token 2x (mint_state_token) = 4 mints
3. Register 2 domains (register_domain)
4. Create 2 NFTs (create_imprint)
5. List 3 assets (list_asset)
Total: ~13 actions per wallet

## Contact Info (Surabaya Office)
- Order: (031) 398 3518, 398 2342, 398 2582
- CS: (031) 398 2244
- WhatsApp: 0821-4207-8380, 0821-4207-8381
