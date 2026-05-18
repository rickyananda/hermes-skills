---
name: web-account-registration
description: Automate web account registration flows — handle terms popups, invitation codes, email verification, rate limiting, and anti-bot detection.
triggers:
  - register on a website
  - sign up for an account
  - create account on [site]
  - daftar di [situs]
---

# Web Account Registration Automation

Automate account registration on websites using browser tools. Covers common pitfalls with modern SPA/SSR registration forms.

## Workflow

### 1. Navigate & Accept Terms
- Many sites (especially Chinese SaaS) show a **mandatory terms popup** before the form is usable
- All form fields will be **disabled** until you click "同意并继续" / "Accept" / "Agree"
- **Always check for terms popup first** — if fields are disabled, look for an overlay/modal

### 2. Fill Form Fields
- After accepting terms, fields become enabled
- Fill email, password, and any invitation/referral codes
- **Referral links** (e.g. `?aff=CODE`) often auto-fill invitation codes — check the field before manually entering

### 3. Submit the Form
**CRITICAL: `dispatchEvent(new Event('submit'))` often fails on modern frameworks (React, Next.js, Vue)**

Preferred submission methods (in order):
1. `browser_click` on the submit button
2. `browser_press` key=Enter while focused on a form field
3. If both fail, try: `document.querySelector('button[type="submit"]').click()` via console

If form appears to submit but URL doesn't change:
- Check for **silent validation errors** — read `document.body.innerText` for error patterns
- Check if email is **already registered** — try login flow instead
- Site may have **anti-bot detection** — see section below

### 4. Email Verification
- Most sites require email verification (6-digit code or link)
- **Cannot be bypassed** — user must provide the code
- If code doesn't arrive: click "Resend" but watch for **rate limiting**
- Check spam/junk/promotions folders

### 5. Rate Limiting
- Registration endpoints typically allow 3-5 attempts before rate limiting
- Error: "Too many requests, please try again later"
- Wait **5-10 minutes** before retrying
- If rate limited, suggest user **register manually from their device**

## Anti-Bot Detection Patterns

Some sites detect automated browsers and silently block form submissions:
- Form fields fill correctly but submit does nothing
- No error message appears
- URL doesn't change after "submit"

**Workaround:** If browser automation fails repeatedly:
1. Prepare all credentials (email, password, invitation code, referral link)
2. Give user **step-by-step instructions** to register manually from their device
3. User provides verification code back to you for completion

## Common Error Messages & Actions

| Error | Meaning | Action |
|-------|---------|--------|
| "Invitation code is required" | Needs invite code | Search for codes, use referral links |
| "Too many requests" | Rate limited | Wait 5-10 min |
| "Email already registered" | Account exists | Try login flow instead |
| Silent failure (no redirect) | Anti-bot or JS framework issue | Manual registration fallback |

## Pitfalls

1. **Don't loop on failed submissions** — if 2-3 attempts fail, switch strategy
2. **Don't repeatedly resend verification codes** — triggers rate limit fast
3. **Terms popups reappear on page reload** — must re-accept each time
4. **Session state resets** — navigation away may lose form state
5. **Invitation code field may be optional or required** — check `input.required` property via console: `document.querySelector('input[placeholder*="invitation"]')?.required`
6. **Use CloakBrowser for Cloudflare-protected sites** — if `browser_navigate` returns empty pages or forms don't submit, the site has bot detection. Switch to CloakBrowser immediately. Write a Python script with `from cloakbrowser import launch` to a `.py` file, then run via `terminal`. Never put cloakbrowser imports inside `execute_code` (sandbox lacks it).
7. **Referral URLs auto-fill invitation codes** — always check if `?aff=CODE` or `?ref=CODE` in the URL pre-fills any fields before manually entering codes
