---
name: crypto-airdrop-grinding
description: "Multi-account crypto airdrop grinding — wallet generation, funding, automated on-chain transactions, leaderboard tracking."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [crypto, solana, airdrop, grinding, web3, blockchain]
---

# Crypto Airdrop Grinding

Multi-account strategy for accumulating on-chain activity on testnets/devnets to qualify for potential airdrops.

## When to Use

- User wants to grind activity on a blockchain protocol (devnet/testnet)
- Protocol has a leaderboard, score system, or activity tracker
- Multiple accounts needed to maximize coverage

## General Pattern

### 1. Wallet Generation (Node.js + @solana/web3.js)

```javascript
import { Keypair } from "@solana/web3.js";
import fs from "fs";

const wallets = [];
for (let i = 0; i < 100; i++) {
  wallets.push(Keypair.generate());
}

// Save with secret keys for later use
const walletData = wallets.map((w, i) => ({
  index: i,
  address: w.publicKey.toBase58(),
  secret_key_array: Array.from(w.secretKey),
}));
fs.writeFileSync("wallets.json", JSON.stringify(walletData, null, 2));
```

### 2. Funding from Main Wallet

Send SOL/tokens from a funded main wallet to each sub-wallet:

```javascript
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const fundAmount = 0.08 * LAMPORTS_PER_SOL; // Adjust per protocol needs

for (const w of wallets) {
  const ix = SystemProgram.transfer({
    fromPubkey: mainWallet.publicKey,
    toPubkey: w.publicKey,
    lamports: BigInt(Math.floor(fundAmount)),
  });
  await sendAndConfirm(connection, [ix], [mainWallet]);
  await sleep(1000); // Rate limit
}
```

### 3. Automated Protocol Interaction

Each protocol has specific instructions. Pattern:
- Reverse-engineer the program's instruction format (discriminators, accounts)
- Build TransactionInstruction with correct account ordering
- Send via VersionedTransaction with skipPreflight

```javascript
const ix = new TransactionInstruction({
  programId: PROGRAM_ID,
  keys: [
    { pubkey: protocolState, isSigner: false, isWritable: false },
    { pubkey: somePDA, isSigner: false, isWritable: true },
    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ],
  data: Buffer.concat([discriminator("instruction_name"), ...encodedArgs]),
});
```

### 4. Monitoring Dashboard

Create a simple HTTP server that reads results JSON and serves a live HTML dashboard:

```javascript
const http = require("http");
const server = http.createServer(async (req, res) => {
  if (req.url === "/api/data") {
    const results = JSON.parse(fs.readFileSync("results.json"));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ results }));
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(HTML); // Serve dashboard HTML
  }
});
server.listen(8888);
```

## Pitfalls

- **Account ordering matters** — Solana programs validate accounts by position. Missing or wrong-order accounts cause cascading errors (3010 seller not signer, 3012 listing not init). Always match the frontend JS exactly.
- **MPL Core assets** — Many Solana protocols require Metaplex Core assets. Use UMI SDK: `createSignerFromKeypair(umi, fromWeb3JsKeypair(web3Keypair))` then `signerIdentity(signer)`.
- **Devnet faucet limits** — Most faucets give 2 SOL per request with rate limits. Fund sub-wallets from a main wallet instead.
- **SOL per wallet** — ~0.05-0.08 SOL is typically enough for 10-15 transactions on devnet (each tx costs ~0.000005 SOL + rent for accounts).
- **Leaderboard indexing** — On-chain transactions may not immediately reflect in leaderboard APIs. Indexers have delay (minutes to hours).
- **Rate limiting** — Add 1-2 second delays between transactions to avoid rate limits from RPC providers.
- **Results persistence** — Save results to JSON after each wallet completes. If script crashes, you can resume from where you left off.

## File Organization

```
~/netrun_wallets.json          # Wallet addresses + secret keys
~/netrun_grind_results.json    # Per-wallet results (actions, balances)
~/netrun_grind_only.mjs        # Main grinding script
~/netrun_dashboard.js          # HTTP dashboard server
```

## Reference

See `references/solana-program-patterns.md` for specific protocol instruction formats.
