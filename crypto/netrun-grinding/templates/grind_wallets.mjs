// netrun_grind_only.mjs — Grind funded wallets on app.netrun.xyz
// Reads wallet file, grinds each wallet, saves results with resume support.
// Usage: node netrun_grind_only.mjs

import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage, VersionedTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { generateSigner, signerIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import crypto from "crypto";
import fs from "fs";

const RPC_URL = "https://devnet.helius-rpc.com/?api-key=YOUR_KEY";
const NETRUN_PROGRAM = new PublicKey("FqDHFYCYfLadhHjEkbsxTmNmW4f2kMb6Pxf2sSFoRn1G");
const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const WALLETS_FILE = "/home/user/netrun_wallets.json";
const RESULTS_FILE = "/home/user/netrun_grind_results.json";
const DELAY_MS = 1500;

// --- Helpers ---
function findPDA(seeds, programId) { return PublicKey.findProgramAddressSync(seeds, programId); }
function encodeString(s) { const e = Buffer.from(s); const l = Buffer.alloc(4); l.writeUInt32LE(e.length, 0); return Buffer.concat([l, e]); }
function encodeU64(v) { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(v), 0); return b; }
function encodeU8(v) { return Buffer.from([v & 0xff]); }
function discriminator(p) { return crypto.createHash("sha256").update(`global:${p}`).digest().slice(0, 8); }
function getProtocolState() { const [p] = findPDA([Buffer.from("protocol_state")], NETRUN_PROGRAM); return p; }
function getStateTokenPDA(s) { const [p] = findPDA([Buffer.from("state_token"), Buffer.from(s)], NETRUN_PROGRAM); return p; }
function getImprintPDA(a) { const [p] = findPDA([Buffer.from("imprint"), a.toBuffer()], NETRUN_PROGRAM); return p; }
function getMintRecordPDA(st, a) { const [p] = findPDA([Buffer.from("mint_record"), st.toBuffer(), a.toBuffer()], NETRUN_PROGRAM); return p; }
function getDomainPDA(n) { const [p] = findPDA([Buffer.from("domain"), Buffer.from(n)], NETRUN_PROGRAM); return p; }
function getListingPDA(a) { const [p] = findPDA([Buffer.from("listing"), a.toBuffer()], NETRUN_PROGRAM); return p; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function randomSymbol(len = 6) { const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; let s = ""; for (let i = 0; i < len; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }

async function sendAndConfirm(connection, instructions, signers) {
  try {
    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const msg = new TransactionMessage({ payerKey: signers[0].publicKey, recentBlockhash: blockhash, instructions }).compileToV0Message();
    const tx = new VersionedTransaction(msg);
    tx.sign(signers);
    return await connection.sendTransaction(tx, { skipPreflight: true });
  } catch { return null; }
}

async function createMplAsset(umi, name) {
  const asset = generateSigner(umi);
  await create(umi, { asset, name, uri: "https://arweave.net/grind" }).sendAndConfirm(umi);
  return new PublicKey(asset.publicKey.toString());
}

async function grindWallet(connection, wallet, index) {
  const umi = createUmi(RPC_URL).use(mplCore());
  const umiKP = fromWeb3JsKeypair(wallet);
  const signer = createSignerFromKeypair(umi, umiKP);
  umi.use(signerIdentity(signer));

  const bal = await connection.getBalance(wallet.publicKey);
  if (bal < 10000000) { process.stdout.write(`⏭️ [${index}] Skip (low balance)\n`); return null; }

  const actions = { tokens: 0, mints: 0, domains: 0, nfts: 0, listed: 0 };
  const allAssets = [];
  const symbols = [];

  // 1. Create 2 tokens
  for (let i = 0; i < 2; i++) {
    const sym = randomSymbol();
    try {
      const asset = await createMplAsset(umi, sym);
      const pda = getStateTokenPDA(sym);
      const ix = new TransactionInstruction({
        programId: NETRUN_PROGRAM,
        keys: [
          { pubkey: getProtocolState(), isSigner: false, isWritable: false },
          { pubkey: pda, isSigner: false, isWritable: true },
          { pubkey: asset, isSigner: false, isWritable: false },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.concat([discriminator("create_state_token"), encodeString(sym), encodeU64(21000000), encodeU64(1000), encodeU8(0)]),
      });
      if (await sendAndConfirm(connection, [ix], [wallet])) { actions.tokens++; symbols.push(sym); }
    } catch {}
    await sleep(DELAY_MS);
  }

  // 2. Mint each token 2x
  for (const sym of symbols) {
    const stPDA = getStateTokenPDA(sym);
    for (let i = 0; i < 2; i++) {
      try {
        const asset = await createMplAsset(umi, `${sym}m${i}`);
        const mrPDA = getMintRecordPDA(stPDA, asset);
        const ix = new TransactionInstruction({
          programId: NETRUN_PROGRAM,
          keys: [
            { pubkey: getProtocolState(), isSigner: false, isWritable: false },
            { pubkey: stPDA, isSigner: false, isWritable: true },
            { pubkey: asset, isSigner: false, isWritable: false },
            { pubkey: mrPDA, isSigner: false, isWritable: true },
            { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: discriminator("mint_state_token"),
        });
        if (await sendAndConfirm(connection, [ix], [wallet])) { actions.mints++; allAssets.push(asset); }
      } catch {}
      await sleep(DELAY_MS);
    }
  }

  // 3. Register 2 domains
  for (let i = 0; i < 2; i++) {
    const domain = `${randomSymbol(5).toLowerCase()}.net`;
    try {
      const asset = await createMplAsset(umi, domain);
      const dpda = getDomainPDA(domain);
      const ix = new TransactionInstruction({
        programId: NETRUN_PROGRAM,
        keys: [
          { pubkey: getProtocolState(), isSigner: false, isWritable: false },
          { pubkey: dpda, isSigner: false, isWritable: true },
          { pubkey: asset, isSigner: false, isWritable: false },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.concat([discriminator("register_domain"), encodeString(domain)]),
      });
      if (await sendAndConfirm(connection, [ix], [wallet])) { actions.domains++; allAssets.push(asset); }
    } catch {}
    await sleep(DELAY_MS);
  }

  // 4. Create 2 NFTs
  for (let i = 0; i < 2; i++) {
    const name = `NFT${randomSymbol(4)}`;
    try {
      const asset = await createMplAsset(umi, name);
      const ipda = getImprintPDA(asset);
      const hash = crypto.createHash("sha256").update(`${name}_${Date.now()}`).digest();
      const ix = new TransactionInstruction({
        programId: NETRUN_PROGRAM,
        keys: [
          { pubkey: getProtocolState(), isSigner: false, isWritable: false },
          { pubkey: ipda, isSigner: false, isWritable: true },
          { pubkey: asset, isSigner: false, isWritable: false },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: Buffer.concat([discriminator("create_imprint"), encodeString(name), hash]),
      });
      if (await sendAndConfirm(connection, [ix], [wallet])) { actions.nfts++; allAssets.push(asset); }
    } catch {}
    await sleep(DELAY_MS);
  }

  // 5. List 3 assets on market
  for (const asset of allAssets.slice(0, 3)) {
    const lpda = getListingPDA(asset);
    const price = BigInt(Math.floor(Math.random() * 900000000 + 100000000));
    const ix = new TransactionInstruction({
      programId: NETRUN_PROGRAM,
      keys: [
        { pubkey: getProtocolState(), isSigner: false, isWritable: false },
        { pubkey: lpda, isSigner: false, isWritable: true },
        { pubkey: asset, isSigner: false, isWritable: true },
        { pubkey: NETRUN_PROGRAM, isSigner: false, isWritable: false },
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: MPL_CORE, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.concat([discriminator("list_asset"), encodeU64(price), encodeU8(0)]),
    });
    if (await sendAndConfirm(connection, [ix], [wallet])) actions.listed++;
    await sleep(DELAY_MS);
  }

  const total = Object.values(actions).reduce((a, b) => a + b, 0);
  const finalBal = await connection.getBalance(wallet.publicKey);
  process.stdout.write(`✅ [${index}] ${wallet.publicKey.toBase58().slice(0,6)}... | ${total} acts | ${(finalBal/LAMPORTS_PER_SOL).toFixed(4)} SOL\n`);
  return { wallet: wallet.publicKey.toBase58(), actions, totalActions: total, finalBalance: finalBal };
}

// --- Main ---
async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  const walletData = JSON.parse(fs.readFileSync(WALLETS_FILE, "utf-8"));
  let results = [];
  try { results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf-8")); } catch {}
  const doneSet = new Set(results.map(r => r.wallet));

  console.log(`🚀 GRINDING ${walletData.length} wallets (${results.length} already done)`);

  for (let i = 0; i < walletData.length; i++) {
    const wd = walletData[i];
    if (doneSet.has(wd.address)) continue;
    const kp = Keypair.fromSecretKey(new Uint8Array(wd.secret_key_array));
    const result = await grindWallet(connection, kp, i);
    if (result) {
      results.push(result);
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    }
  }

  const totalAll = results.reduce((s, r) => s + r.totalActions, 0);
  console.log(`\n🎉 DONE! ${results.length} wallets | ${totalAll} total actions`);
}

main().catch(console.error);
