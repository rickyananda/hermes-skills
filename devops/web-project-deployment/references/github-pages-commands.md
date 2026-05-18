# GitHub Pages Deployment Commands

## Enable GitHub Pages via API

```bash
# Create repo
curl -s -H "Authorization: token <PAT>" \
  https://api.github.com/user/repos \
  -d '{"name":"<repo-name>","description":"<desc>","private":false}'

# Enable Pages (POST, not PUT)
curl -s -X POST \
  -H "Authorization: token <PAT>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<user>/<repo>/pages \
  -d '{"source":{"branch":"main","path":"/"}}'

# Check build status
curl -s -H "Authorization: token <PAT>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<user>/<repo>/pages | grep '"status"'
```

## Status Values
- `"building"` — Build in progress (wait 30-90s)
- `"built"` — Build complete, site is live
- `null` — Pages not enabled or error

## Live URL Format
```
https://<username>.github.io/<repo-name>/
```

## Pitfalls
- Use POST (not PUT) to enable Pages
- Build takes 30-90 seconds — check status before verifying
- 404 initially is normal — wait for build to complete
- Repo must be public for free GitHub accounts

## Git Push Pattern

```bash
cd <project-dir>
git init
git add -A
git commit -m "feat: <description>"
git remote add origin https://x-access-token:<PAT>@github.com/<user>/<repo>.git
git branch -M main
git push -u origin main
```

## Local Testing

```bash
# Start server (use background=true in Hermes)
python3 -m http.server <port>

# Test URL
http://localhost:<port>

# Kill after testing
# Use process(action="kill", session_id=<id>)
```
