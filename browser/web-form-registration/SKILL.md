---
name: web-form-registration
description: Automate web form filling, account registration, and email verification flows using browser tools. Handle terms popups, invitation codes, rate limits, and JS form submission.
triggers:
  - user asks to register on a website
  - user asks to create an account
  - user asks to fill out a web form
  - user asks to sign up for a service
  - user provides a registration link
---

# Web Form Registration

## Workflow

### 1. Navigate & Accept Terms
- Navigate to registration URL
- Look for terms/conditions popup (common on Chinese sites)
- Click "同意并继续" / "Accept" / "Agree" to dismiss
- Terms popup blocks form inputs until accepted

### 2. Check for Auto-Filled Fields
- Referral/invitation links often auto-fill codes via URL params
- Check `?aff=` or `?ref=` or `?invite=` parameters
- Auto-filled fields are usually disabled (read-only) — don't try to edit them

### 3. Fill Form
- Fill email first, then password
- Use `browser_type` for each field (clears then types)
- Password: generate strong one (12+ chars, mixed case, numbers, symbols)
- Save credentials for user immediately after creation

### 4. Submit Form
- Try `browser_click` on submit button first
- If button is disabled or click doesn't work, use JS:
  ```javascript
  document.querySelector('form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
  ```
- Check `window.location.href` after submission to confirm redirect

### 5. Email Verification
- Most sites redirect to `/email-verify` or similar
- Code is usually 6 digits
- **User must check their own email** — agent cannot access external email
- Click "Resend" if code doesn't arrive (but watch for rate limits)
- Rate limit: "Too many requests" = wait 5-10 minutes

### 6. Handle Errors
- **Rate limit**: Wait and retry, or ask user to do it manually
- **Email already registered**: Try different email
- **Invitation code required**: Search for codes via Telegram/Discord groups
- **Form won't submit**: Try JS submission, check for hidden validation errors

## Pitfalls

- Don't ask user for email/password before navigating to the site — get the form ready first
- Terms popup blocks form — always check for it before trying to fill fields
- Invitation code from referral links is auto-filled and disabled — don't try to change it
- Rate limits are common on Chinese API relay sites — space out attempts
- Browser session can reset if page reloads — re-navigate if elements go stale
- "Create Account" button may be disabled until terms accepted

## User Communication Style

- Indonesian slang user (gue/lo/bro)
- **Minimal questions, direct action** — don't ask repeatedly, just do it
- When form needs user input (like email verification code), explain clearly what they need to do
- Don't apologize excessively for limitations
- Use monospace blocks for copy-pasteable content (passwords, codes, URLs)

## Reference Files

- `references/api-relay-services.md` — Known API relay services and testing tools
