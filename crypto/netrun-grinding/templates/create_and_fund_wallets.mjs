// create_and_fund_wallets.mjs — Generate wallets and fund from main wallet
// Usage: node create_and_fund_wallets.mjs [count] [sol_per_wallet]

import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import crypto from "crypto";
import fs from "fs";

const RPC_URL = "https://devnet.helius-rpc.com/?api-key=YOUR_KEY";
const WALLETS_FILE = "/home/user/netrun_wallets.json";

// Main wallet (funding source)
const mainWalletData = JSON.parse(fs.readFileSync("/home/user/solana_wallet.json", "utf-8"));
const mainWallet = Keypair.fromSecretKey(new Uint8Array(mainWalletData.secret_key_array));

const COUNT = parseInt(process.argv[2] || "100");
const SOL_PER = parseFloat(process.argv[3] || "0.08");

async function sendTx(connection, instructions, signers) {
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const msg = new TransactionMessage({ payerKey: signers[0].publicKey, recentBlockhash: blockhash, instructions }).compileToV0Message();
  const tx = new VersionedTransaction(msg);
  tx.sign(signers);
  return await connection.sendTransaction(tx, { skipPreflight: true });
}

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  
  console.log(`📱 Creating ${COUNT} wallets...`);
  const wallets = [];
  for (let i = 0; i < COUNT; i++) wallets.push(Keypair.generate());
  
  const walletData = wallets.map((w, i) => ({
    index: i, address: w.publicKey.toBase58(), secret_key_array: Array.from(w.secretKey),
  }));
  fs.writeFileSync(WALLETS_FILE, JSON.stringify(walletData, null, 2));
  console.log(`✅ ${COUNT} wallets saved to ${WALLETS_FILE}`);

  console.log(`💰 Funding ${COUNT} wallets with ${SOL_PER} SOL each...`);
  const lamports = Math.floor(SOL_PER * LAMPORTS_PER_SOL);
  
  for (let i = 0; i < wallets.length; i++) {
    try {
      const ix = SystemProgram.transfer({ fromPubkey: mainWallet.publicKey, toPubkey: wallets[i].publicKey, lamports: BigInt(lamports) });
      await sendTx(connection, [ix], [mainWallet]);
      process.stdout.write(`  ✅ ${i + 1}/${COUNT}\r`);
    } catch (e) {
      console.error(`  ❌ ${i + 1}: ${e.message.slice(0, 60)}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const finalBal = await connection.getBalance(mainWallet.publicKey);
  console.log(`\n💰 Main wallet remaining: ${(finalBal / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
}

main().catch(console.error);
