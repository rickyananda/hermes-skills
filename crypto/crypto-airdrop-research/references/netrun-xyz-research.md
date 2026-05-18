# Netrun.xyz - Solana Metaprotocol (Technical Reference)

## Overview
**Website**: https://app.netrun.xyz
**Type**: Metaprotocol for programmable non-fungible systems
**Blockchain**: Solana (Devnet/Testnet)
**Standard**: Metaplex Core (MPL Core)
**Program ID**: `FqDHFYCYfLadhHjEkbsxTmNmW4f2kMb6Pxf2sSFoRn1G`
**MPL Core Program**: `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`

## API Endpoints
- **Imprints**: `GET https://app.netrun.xyz/api/imprints` — returns all tokens, NFTs, domains, mints
- **Leaderboard**: `GET https://app.netrun.xyz/api/leaderboard` — returns top 50 by score
- **RPC**: `https://devnet.helius-rpc.com/?api-key=<key>` (check frontend for current key)

## Instruction Types (8 total)

### 1. create_state_token
Create a new token with max supply and mint limit.
**Accounts**: [protocolState, stateTokenPDA, asset, authority(signer), SystemProgram]
**Data**: discriminator(8) + string(symbol) + u64(maxSupply) + u64(mintLimit) + u8(decimals)

### 2. mint_state_token
Mint tokens from an existing token.
**Accounts**: [protocolState, stateTokenPDA, asset, mintRecordPDA, minter(signer), SystemProgram]
**Data**: discriminator(8) only

### 3. register_domain
Register a domain name.
**Accounts**: [protocolState, domainPDA, asset, authority(signer), SystemProgram]
**Data**: discriminator(8) + string(domainName)

### 4. create_imprint
Create an NFT (programmable imprint).
**Accounts**: [protocolState, imprintPDA, asset, authority(signer), SystemProgram]
**Data**: discriminator(8) + string(name) + bytes32(imageHash)

### 5. list_asset
List an asset for sale on the market.
**Accounts**: [protocolState, listingPDA, asset, collection(fallback=program), seller(signer), MPL_CORE, SystemProgram]
**Data**: discriminator(8) + u64(price) + u8(kind) [0=token, 1=nft, 2=domain]
**⚠️ CRITICAL**: Collection account MUST be included (use NETRUN_PROGRAM as fallback if no collection)

### 6. update_listing
Update the price of a listed asset.
**Accounts**: [listingPDA, asset, seller(signer)]
**Data**: discriminator(8) + u64(newPrice)

### 7. delist_asset
Remove an asset from the market.
**Accounts**: [listingPDA, asset, collection(fallback=program), seller(signer), MPL_CORE, SystemProgram]
**Data**: discriminator(8) only
**⚠️ CRITICAL**: Same collection account requirement as list_asset

### 8. buy_asset
Buy an asset from the market.
**Accounts**: [protocolState, listingPDA, seller, buyer(signer), asset, collection(fallback=program), MPL_CORE, SystemProgram]
**Data**: discriminator(8) + u64(maxPrice)

## PDA Derivation (Seeds)

```javascript
// Protocol State
findPDA(["protocol_state"], NETRUN_PROGRAM)

// State Token
findPDA(["state_token", symbol_bytes], NETRUN_PROGRAM)

// Imprint
findPDA(["imprint", asset_pubkey_bytes], NETRUN_PROGRAM)

// Mint Record
findPDA(["mint_record", state_token_bytes, asset_pubkey_bytes], NETRUN_PROGRAM)

// Domain
findPDA(["domain", domain_name_bytes], NETRUN_PROGRAM)

// Listing
findPDA(["listing", asset_pubkey_bytes], NETRUN_PROGRAM)
```

## Discriminator Format
```javascript
// Anchor-style: sha256("global:<instruction_name>")[0..8]
crypto.createHash("sha256").update(`global:${prefix}`).digest().slice(0, 8)
```

## Data Encoding Helpers
```javascript
function encodeString(s) {
  const encoded = Buffer.from(s);
  const len = Buffer.alloc(4);
  len.writeUInt32LE(encoded.length, 0);
  return Buffer.concat([len, encoded]);
}

function encodeU64(val) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(val), 0);
  return buf;
}

function encodeU8(val) {
  return Buffer.from([val & 0xff]);
}
```

## Leaderboard Scoring
- **Score formula**: actions × 10 (each action = 10 points)
- **Min actions for top 50**: ~40 actions
- **Top entry**: ~1700 actions = ~17000 score
- **⚠️ Mystery**: Backend indexer may not immediately reflect on-chain activity. Despite 115+ imprints created, score remained 0 in testing. Possible causes:
  - Indexer delay (hours)
  - Only counts specific instruction types
  - Requires minimum threshold before indexing
  - May use different tracking mechanism than imprint API

## Imprint Types
- `token` — Created via `create_state_token`
- `mint` — Created via `mint_state_token`
- `nft` — Created via `create_imprint`
- `domain` — Created via `register_domain`

## Known Pitfalls

### 1. MPL Core Asset Requirement
All `asset` parameters must be MPL Core assets (owned by `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`). Create them first using the UMI SDK.

### 2. Collection Account in Market Instructions
`list_asset` and `delist_asset` require a `collection` account at index 3. If no collection exists, use `NETRUN_PROGRAM` as fallback. Missing this causes:
- `AccountNotSigner (3010)` on seller
- `AccountNotInitialized (3012)` on listing (because list_asset failed silently)

### 3. Transaction Success Rate
- **Before fix**: 18/50 success (36%)
- **After fix**: 30/33 success (91%)
- Key fix: Add collection account to list/delist instructions

### 4. UMI Signer Setup
```javascript
// ❌ WRONG — causes "signer.signTransaction is not a function"
umi.use(signerIdentity(keypair));

// ✅ CORRECT — use createSignerFromKeypair
const signer = createSignerFromKeypair(umi, umiKeypair);
umi.use(signerIdentity(signer));
```

## Team
- Hector Doyle
- Jadon Carter
- Royce Miller

## Links
- **About**: https://www.netrun.xyz
- **Litepaper**: https://www.netrun.xyz/litepaper
- **Discord**: Available on site
- **Solana Faucet**: Link in app footer
