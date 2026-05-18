# Crypto/NFT/Web3 Scam Patterns

Common patterns observed in crypto scam projects. Use these as a checklist when investigating suspicious sites.

## 1. Fake NFT/Token Projects

**Pattern:** Professional-looking website with "Connect Wallet" button, but no real smart contract, no audit, no team.

**Indicators:**
- "Fractionalized NFTs", "ERC-804" (non-standard or fake token standards)
- "NFTs backed by X tokens" without actual contract address
- "Fully reversible bridge" without explaining the mechanism
- Gamification (XP, vaults, mystery boxes) without real product
- "Gold Pass", "Silver Pass", "Priority Access" reward tiers

**Example:** cappuccinov4.xyz — "Underground Access Network" with XP system, vaults, and reward passes, but no contract address, no audit, no team.

## 2. Wallet Drainer Sites

**Pattern:** Site asks you to connect wallet, then requests malicious approvals that drain your tokens.

**Indicators:**
- "Connect Wallet" is the primary CTA
- No clear explanation of what the contract does
- Requests unlimited token approvals
- Uses SetApprovalForAll or similar dangerous functions
- Site looks rushed or generic

**Defense:** Always check what you're approving on Etherscan before signing.

## 3. Phishing Forms

**Pattern:** Google Forms or custom forms collecting wallet addresses, private keys, or seed phrases.

**Indicators:**
- Form asks for wallet address (to target you later)
- Form asks for "seed phrase" or "private key" (NEVER give these)
- Form requires social media engagement (like, RT, follow) to "qualify"
- "WL Application" forms that collect personal info
- URL shorteners hiding the form destination

**Example:** "Fraccapy WL Application" Google Form collecting X username + wallet address.

## 4. Engagement Farming

**Pattern:** Build hype through social media engagement, then rug pull or disappear.

**Indicators:**
- Mass-following (20,000+ following with <1,000 followers)
- Very new account (< 30 days) with suspicious follower count
- "Like, RT, and Quote" requirements
- Referral programs that reward recruitment
- Daily missions/tasks that require social sharing
- Leaderboards that create FOMO

## 5. Fake Airdrops

**Pattern:** "Claim your free tokens!" but the claim process requires connecting wallet or sending ETH.

**Indicators:**
- Unsolicited airdrop notifications
- Claim process requires wallet connection
- "Send 0.1 ETH to receive 10 ETH" scams
- Fake token contracts that look like real ones

## 6. Rug Pull Indicators

**Pattern:** Project launches, builds TVL/liquidity, then founders drain funds.

**Indicators:**
- Anonymous team
- No audit from reputable firm
- Concentrated token ownership
- No time-locked liquidity
- Aggressive marketing without substance
- "Underground" or "exclusive" language to create urgency

## 7. Ponzi/Pyramid Schemes

**Pattern:** Returns come from new investor deposits, not actual revenue.

**Indicators:**
- Guaranteed returns (e.g., "earn 1% daily")
- Referral bonuses (earn X% of referee's deposits)
- Complex tier systems (Bronze, Silver, Gold, Diamond)
- "Staking" with suspiciously high APY
- No clear revenue model

## Red Flag Scoring

| Indicator | Score |
|-----------|-------|
| Domain < 30 days old | +2 |
| Anonymous team | +2 |
| No audit/contract | +2 |
| "Connect Wallet" without clear contract | +3 |
| Forms collecting wallet addresses | +3 |
| Mass-following on social media | +2 |
| Gamification without real product | +2 |
| No community (Discord/Telegram) | +1 |
| Paid blue check (not earned) | +1 |
| URL shortener hiding destination | +2 |
| Requires social engagement to "qualify" | +2 |
| Guarantees returns | +3 |
| Referral bonuses | +2 |

**0-3:** Probably safe (verify anyway)
**4-7:** Suspicious — proceed with caution
**8-12:** Likely scam — do not interact
**13+:** Confirmed scam — report immediately
