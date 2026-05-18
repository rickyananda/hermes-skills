# Ccode.dev Registration Reference

## Site Info
- **URL:** https://www.ccode.dev
- **Type:** Claude API relay (中转站) — Chinese SaaS
- **Language:** Chinese (with English toggle)
- **Contact:** WeChat support, Telegram: https://t.me/ccode_official

## Registration Flow
1. Terms popup blocks all fields until accepted
2. Email + Password + Invitation Code (required)
3. Email verification — 6-digit code sent to email
4. Rate limit: ~3-5 attempts before lockout (5-10 min cooldown)

## Referral Link (auto-fills invitation code)
```
https://www.ccode.dev/register?aff=4LGGXRF3ZSNS
```
- Invitation code `4LGGXRF3ZSNS` auto-filled from this link

## Available Models
- claude-opus-4-6-thinking
- claude-opus-4-7-high/low/max/medium/xhigh
- claude-sonnet-4-6-thinking

## Known Issues
- Forms don't submit via `dispatchEvent(new Event('submit'))` on this site
- Browser automation may be blocked by anti-bot detection
- Verification emails may land in spam or not arrive (Gmail)
- Rate limiting is aggressive

## Session Status (2026-05-16)
- Registered with `airdrophuntier96@gmail.com` / `Riku@2026!xK`
- Email verification pending — code never received
- Account exists but unverified
- User may need to complete verification manually from device
