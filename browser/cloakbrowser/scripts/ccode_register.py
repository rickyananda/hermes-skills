#!/usr/bin/env python3
"""
ccode.dev Auto Register Script
Bypasses Cloudflare Turnstile via CloakBrowser.

Usage:
  pip install cloakbrowser
  python3 ccode_register.py

Edit EMAILS and PASSWORD below before running.
"""
from cloakbrowser import launch
import time
import sys

# ============== CONFIG ==============
EMAILS = [
    "email1@gmail.com",
    "email2@gmail.com",
    # Add more emails here
]
PASSWORD = "P@ssw0rd2025!"
REFERRAL_CODE = "4LGGXRF3ZSNS"
REGISTER_URL = f"https://www.ccode.dev/register?aff={REFERRAL_CODE}"
# ====================================

def register_account(email, password):
    browser = launch(headless=True)
    page = browser.new_page()

    try:
        print(f"\n[+] Registering: {email}")

        page.goto(REGISTER_URL)
        time.sleep(4)

        # Fill all input fields
        inputs = page.query_selector_all("input")
        for inp in inputs:
            t = (inp.get_attribute("type") or "").lower()
            ph = (inp.get_attribute("placeholder") or "").lower()
            nm = (inp.get_attribute("name") or "").lower()

            if "email" in ph or t == "email":
                inp.fill(email)
                print(f"    [✓] Email filled")
            elif t == "password":
                inp.fill(password)
                print(f"    [✓] Password filled")
            elif "invite" in ph or "invite" in nm or "code" in ph:
                val = inp.get_attribute("value") or ""
                if not val:
                    inp.fill(REFERRAL_CODE)
                    print(f"    [✓] Referral code filled")
                else:
                    print(f"    [✓] Referral code pre-filled: {val}")

        time.sleep(1)

        # Click register button
        buttons = page.query_selector_all("button")
        for btn in buttons:
            text = (btn.text_content() or "").strip().lower()
            if "register" in text or "sign up" in text:
                btn.click()
                print(f"    [✓] Register clicked")
                break

        time.sleep(6)

        # Check result
        body = page.text_content("body") or ""
        page.screenshot(path=f"/tmp/ccode_{email.split('@')[0]}.png")

        if "success" in body.lower() or "verify" in body.lower() or "check" in body.lower():
            print(f"    [✓] SUCCESS! Check email {email} for verification code")
            return True
        elif "already" in body.lower():
            print(f"    [!] Account already exists")
            return False
        elif "rate" in body.lower() or "limit" in body.lower():
            print(f"    [!] Rate limited! Wait a few minutes")
            return False
        else:
            print(f"    [?] Unknown result. Screenshot: /tmp/ccode_{email.split('@')[0]}.png")
            print(f"    Body: {body[:200]}")
            return None

    except Exception as e:
        print(f"    [✗] Error: {e}")
        return False
    finally:
        browser.close()


if __name__ == "__main__":
    print("=" * 50)
    print("  ccode.dev Auto Register")
    print(f"  Referral: {REFERRAL_CODE}")
    print(f"  Accounts: {len(EMAILS)}")
    print("=" * 50)

    results = {"success": 0, "failed": 0, "unknown": 0}

    for email in EMAILS:
        result = register_account(email, PASSWORD)
        if result is True:
            results["success"] += 1
        elif result is False:
            results["failed"] += 1
        else:
            results["unknown"] += 1
        # Delay between accounts to avoid rate limits
        time.sleep(5)

    print("\n" + "=" * 50)
    print(f"  DONE! Success: {results['success']} | Failed: {results['failed']} | Unknown: {results['unknown']}")
    print("=" * 50)
