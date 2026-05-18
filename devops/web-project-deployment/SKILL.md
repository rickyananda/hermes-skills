---
name: web-project-deployment
description: Full workflow for building, testing, and deploying web projects via GitHub Pages. Includes bilingual description templates and screenshot capture.
triggers:
  - user asks to build a website or web app
  - user mentions deploying to GitHub Pages
  - user wants a project online/live
  - user asks for project descriptions in multiple languages
---

# Web Project Deployment Workflow

## Standard Pipeline

1. **Build** — Create HTML/CSS/JS single-page app
2. **Test locally** — `python3 -m http.server <port>` (use background process)
3. **Take screenshots** — Use browser_vision at different scroll positions
4. **Push to GitHub** — git init → add → commit → create repo → push
5. **Deploy GitHub Pages** — Enable via API, wait for build
6. **Provide descriptions** — English + Chinese (中文版) format

## GitHub Pages Deployment

```bash
# Create repo
curl -s -H "Authorization: token <PAT>" https://api.github.com/user/repos \
  -d '{"name":"<repo-name>","description":"<desc>","private":false}'

# Enable Pages
curl -s -X POST -H "Authorization: token <PAT>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<user>/<repo>/pages \
  -d '{"source":{"branch":"main","path":"/"}}'

# Check status (wait for "built")
curl -s -H "Authorization: token <PAT>" \
  https://api.github.com/repos/<user>/<repo>/pages | grep '"status"'
```

**Pitfall:** Pages build takes 30-90 seconds. Check status before verifying URL.

## Screenshot Capture

Take screenshots at multiple scroll positions:
1. Hero/header section (top)
2. Features/content (middle)
3. Tables/details (bottom)

Use `browser_vision` for each — even if vision analysis fails, screenshots are captured at the path shown in output.

## Bilingual Description Template

### English Version
```
**Project: [Name] — [Subtitle]**

[1-2 sentence overview]

**Core Features & Logic Flow:**
1. [Feature 1]
2. [Feature 2]
...

**Technical Implementation:** [Tech stack details]

**Impact:** [Why this matters]

**GitHub:** https://github.com/<user>/<repo>
```

### Chinese Version (中文版)
```
**项目：[Name] — [Subtitle]**

[Chinese translation of overview]

**核心功能与逻辑流：**
1. [Feature 1 in Chinese]
...

**技术实现：** [Tech details in Chinese]

**影响：** [Impact in Chinese]

**GitHub:** https://github.com/<user>/<repo>
```

## Dark Theme SaaS Design Patterns

User prefers:
- Dark backgrounds (#0a0a0f, #13131a)
- Purple/coral accent gradients
- Material Icons Outlined
- Inter font family
- JetBrains Mono for code/numbers
- Chart.js for data visualization
- Alpine.js for reactivity
- CSS custom properties for theming
- Scroll-triggered animations (IntersectionObserver)
- Responsive: sidebar on desktop, hamburger on mobile

## Pitfalls

- Don't use `&` in foreground terminal commands — use `background=true`
- Port conflicts: try different ports if 8080 is in use (8765, 8766, etc.)
- GitHub Pages API: use POST (not PUT) to enable
- Vision analysis may fail but screenshots still capture — don't retry endlessly
- Kill background servers after testing to free ports

## Quick Reference Files

- **Xiaomi MiMo 100T tokens**: `references/xiaomi-mimo-100t-tokens.md` — Free token program for developers
