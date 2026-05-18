# HackerOne Report Template

## Form Fields

HackerOne reports typically have these fields:
- **Report Intent**: "I found a security vulnerability"
- **Severity**: CVSS-based (Low/Medium/High/Critical)
- **Description**: Full technical writeup
- **Affected target, feature, or URL**
- **Description of problem**
- **Steps to reproduce**
- **Proof of Concept** (video or scripts)
- **Is knowledge of this issue currently public?**
- **References**
- **Impact Summary**
- **Attachments**

## Template: Information Disclosure / Cloudflare Bypass

```
## Summary

[One paragraph: what's the vulnerability, what's the impact]

## Steps To Reproduce

1. Query DNS TXT record: `nslookup -type=TXT target.com`
2. SPF record reveals real IP: `v=spf1 +ip4:X.X.X.X`
3. Access service directly: `https://service.target.com:PORT`
4. [Additional verification steps]

## Impact

1. [Direct impact - e.g., WAF bypass]
2. [Secondary impact - e.g., brute force target]
3. [Information leaked - e.g., version disclosure]

## Supporting Material/References

- Origin IP: X.X.X.X
- Service URL: https://service:port
- Banner: [service banner text]
- SPF Record: [full SPF record]

## Video PoC

[Link to YouTube unlisted or Streamable]
```

## Template: Exposed Service / Misconfiguration

```
## Summary

The [service name] on target.com is publicly accessible at [URL/IP:port], exposing [what's exposed] to unauthorized users.

## Steps To Reproduce

1. Navigate to [URL]
2. [Observe the exposed service/login panel]
3. [Demonstrate the issue]

## Impact

[What can an attacker do with this access?]

## Remediation

[How to fix - e.g., restrict access to internal network, add IP whitelist]
```

## Tips

- Be specific and factual — no hype
- Include exact commands and URLs
- Video PoC is STRONGLY recommended (some programs require it)
- Don't submit duplicates — search first
- Quality > quantity (HackerOne Signal score matters)
- Some programs have limited report slots (4-5 for new hunters)
- Always read program rules for specific requirements
