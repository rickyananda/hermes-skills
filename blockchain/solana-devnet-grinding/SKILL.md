---
name: solana-devnet-grinding
description: "Automate Solana devnet multi-account grinding for airdrops — wallet generation, SOL distribution, program interaction, leaderboard climbing."
version: 1.0.0
author: Naru
tags: [solana, devnet, grinding, airdrop, multi-wallet, blockchain]
platforms: [linux]
metadata:
  hermes:
    tags: [blockchain, solana, airdrop, automation]
---

# Solana Devnet Multi-Account Grinding

Automate creation and grinding of multiple Solana wallets on devnet protocols for airdrop farming.

## When to Use
- User wants to grind a Solana devnet protocol (Netrun, etc.)
- Need to create multiple wallets and execute transactions on each
- Climbing leaderboards that track on-chain activity

## Prerequisites
```bash
npm install @solana/web3.js @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @metaplex-foundation/umi bs58
```

## Architecture Pattern

### Three-Phase Pipeline
1. **Generate** — Create N wallets, save to JSON file
2. **Fund** — Transfer SOL from main wallet to each sub-wallet
3. **Grind** — Execute protocol transactions on each wallet

### File Structure
```
~/netrun_wallets.json      # Wallet addresses + secret keys
~/netrun_grind_results.json # Per-wallet results (actions, balance)
~/netrun_grind_only.mjs     # Grinding script (skip funding)
~/netrun_multi_grinder.mjs  # Full pipeline (generate + fund + grind)
~/netrun_dashboard.js       # Live monitoring dashboard
```

## Step 1: Wallet Generation & Funding

```javascript
import { Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Generate wallets
const wallets = [];
for (let i = 0; i < 100; i++) wallets.push(Keypair.generate());

// Save with secret keys
const walletData = wallets.map((w, i) => ({
  index: i,
  address: w.publicKey.toBase58(),
  secret_key_array: Array.from(w.secretKey),
}));
fs.writeFileSync("netrun_wallets.json", JSON.stringify(walletData, null, 2));

// Fund from main wallet (batch of 10)
const fundAmount = 0.08 * LAMPORTS_PER_SOL; // ~0.08 SOL per wallet
for (let batch = 0; batch < 10; batch++) {
  const batchWallets = wallets.slice(batch * 10, (batch + 1) * 10);
  for (const w of batchWallets) {
    const ix = SystemProgram.transfer({
      fromPubkey: mainWallet.publicKey,
      toPubkey: w.publicKey,
      lamports: BigInt(Math.floor(fundAmount)),
    });
    await sendAndConfirm(connection, [ix], [mainWallet]);
  }
}
```

### SOL Budget
- Each wallet needs ~0.05-0.06 SOL for grinding (~12-15 transactions)
- Fund 0.08 SOL per wallet to leave buffer
- 100 wallets × 0.08 SOL = 8 SOL needed from main wallet

## Step 2: Program Interaction (Netrun Example)

### PDA Derivation
```javascript
function findPDA(seeds, programId) {
  return PublicKey.findProgramAddressSync(seeds, programId);
}

// Protocol PDAs
getProtocolState() → findPDA([Buffer.from("protocol_state")], program)
getStateTokenPDA(symbol) → findPDA([Buffer.from("state_token"), Buffer.from(symbol)], program)
getImprintPDA(asset) → findPDA([Buffer.from("imprint"), asset.toBuffer()], program)
getDomainPDA(name) → findPDA([Buffer.from("domain"), Buffer.from(name)], program)
getListingPDA(asset) → findPDA([Buffer.from("listing"), asset.toBuffer()], program)
```

### Instruction Discriminator
```javascript
import crypto from "crypto";
function discriminator(prefix) {
  return crypto.createHash("sha256").update(`global:${prefix}`).digest().slice(0, 8);
}
```

### MPL Core Asset Creation
```javascript
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { generateSigner, signerIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";

async function createMplAsset(umi, name) {
  const asset = generateSigner(umi);
  await create(umi, { asset, name, uri: "https://arweave.net/grind" }).sendAndConfirm(umi);
  return new PublicKey(asset.publicKey.toString());
}
```

### Transaction Pattern
```javascript
async function sendAndConfirm(connection, instructions, signers) {
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const messageV0 = new TransactionMessage({
    payerKey: signers[0].publicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  const tx = new VersionedTransaction(messageV0);
  tx.sign(signers);
  return await connection.sendTransaction(tx, { skipPreflight: true });
}
```

## Step 3: Resume-Capable Grinding

Always save results after each wallet completes. On restart, skip already-completed wallets:

```javascript
let results = [];
try { results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf-8")); } catch {}
const doneSet = new Set(results.map(r => r.wallet));

for (let i = 0; i < walletData.length; i++) {
  if (doneSet.has(walletData[i].address)) continue; // Skip completed
  const result = await grindWallet(connection, wallet, i);
  if (result) {
    results.push(result);
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2)); // Save immediately
  }
}
```

## Step 4: Live Dashboard

Create a Node.js HTTP server that serves:
- `/` — HTML dashboard with auto-refresh (5s interval)
- `/api/data` — JSON endpoint reading from results file

Dashboard shows: progress bar, total actions, per-wallet breakdown, SOL usage.

See `references/dashboard-pattern.md` for full implementation.

## Pitfalls

1. **Account ordering matters** — Solana programs validate accounts by position. Missing an account causes cascading errors (3010 seller not signer, 3012 listing not init). Always match the frontend JS account order exactly.

2. **MPL Core assets need UMI SDK** — Can't create MPL Core assets with pure web3.js. Use UMI SDK with `fromWeb3JsKeypair()` adapter.

3. **Devnet faucet rate limits** — Don't rely on faucet for each wallet. Fund from main wallet instead.

4. **Node.js stdout buffering** — Background processes may not show output until flush. Use `process.stdout.write()` instead of `console.log()` for progress, or write to files.

5. **SOL budget calculation** — Each transaction costs ~0.000005 SOL in fees + rent for new accounts (~0.003 SOL per PDA account). Budget 0.06-0.08 SOL per wallet.

6. **Leaderboard scoring** — Score = actions × 10. Minimum ~41 actions to appear on leaderboard. Types of actions matter (create_token, mint, domain, nft, list all count).

## Verification
- Check wallet balances: `connection.getBalance(pubkey)`
- Verify transactions on Solana Explorer: `https://explorer.solana.com/address/{pubkey}?cluster=devnet`
- Check leaderboard: `https://app.netrun.xyz/api/leaderboard`
- Monitor results file for progress
