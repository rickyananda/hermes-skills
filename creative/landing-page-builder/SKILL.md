---
name: landing-page-builder
description: Build modern landing pages inspired by reference sites, push to GitHub, and generate bilingual (EN/CN) project descriptions. Covers design analysis, single-file HTML implementation, local testing, GitHub deployment, and documentation generation.
triggers:
  - user asks to build a website "like" or "inspired by" a reference URL
  - user wants a SaaS/product landing page pushed to GitHub
  - user asks for bilingual project descriptions (English + Chinese)
  - user says "bikin web ala [site]" or similar Indonesian phrasing
  - user asks for a dashboard, analytics page, or data visualization UI
  - user says "bikin dashboard" or "buat web dashboard"
---

# Landing Page Builder

Build production-ready landing pages inspired by reference sites. Full pipeline: analyze reference → implement → test → push to GitHub → generate bilingual docs.

## Workflow

### 0. Clarify Product Context (before building)
Before writing any code, ask the user:
- **What is this website for?** (product, service, portfolio, template)
- **Product name and tagline?**
- **Any specific content or features?**

Don't assume — the user may want a generic template or a specific product page. Asking upfront prevents rework.

### 1. Analyze Reference Site
- Browse the reference URL with `browser_navigate` + `browser_snapshot(full=true)`
- Use `browser_console` to extract CSS variables, color scheme, fonts:
  ```js
  const computed = getComputedStyle(document.body);
  const root = getComputedStyle(document.documentElement);
  // Extract: bg, color, font, and all --custom properties
  ```
- Identify key design elements: hero style, card layouts, color palette, typography, animations, navigation pattern
- Note the tech stack (frameworks, icon libraries, fonts)

### 2. Implement Single-File HTML
- Create a self-contained `index.html` with all CSS/JS inline
- Use CDN for external deps (Alpine.js, Google Fonts, Material Icons)
- Key design patterns to replicate (see `references/9router-design-patterns.md` for complete CSS):
  - **Dark theme** with CSS custom properties for easy theming
  - **Gradient accents** (purple/coral or per-reference palette)
  - **Glass-morphism nav** with `backdrop-filter: blur()`
  - **Grid background** with radial mask for depth
  - **Scroll animations** via IntersectionObserver
  - **Responsive** with CSS Grid + Flexbox + clamp()
- Sections to include (adapt to reference):
  - Nav with logo, links, theme toggle, CTA
  - Hero with badge, h1, subtitle, buttons, code snippet
  - Stats bar (number grid)
  - Features grid (cards with icons)
  - How It Works (numbered steps)
  - Providers/Tools showcase (chips or cards)
  - CTA section with glow effect
  - Footer

### 3. Test Locally
```bash
# Start local server on non-standard port to avoid conflicts
python3 -m http.server 8765
# Open in browser, take screenshots of each section
# Use browser_scroll + browser_vision for coverage
```

### 4. Push to GitHub
```bash
# Create repo via API
curl -s -H "Authorization: token $TOKEN" https://api.github.com/user/repos \
  -d '{"name":"repo-name","description":"...","private":false}'

# Push code
git remote add origin https://x-access-token:$TOKEN@github.com/user/repo.git
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages (make it live)
After pushing to GitHub, deploy via GitHub Pages:

```bash
# Enable GitHub Pages via API (POST, not PUT — PUT returns 404 for new pages)
curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$USER/$REPO/pages \
  -d '{"source":{"branch":"main","path":"/"}}'

# Wait for build (typically 30-90 seconds)
sleep 30
curl -s -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$USER/$REPO/pages \
  | grep '"status"'  # "building" → wait more → "built"

# Verify site is live
curl -s -o /dev/null -w "%{http_code}" https://$USER.github.io/$REPO/  # Should be 200
```

**URL format:** `https://<username>.github.io/<repo-name>/`

**Pitfall:** GitHub Pages API uses **POST** for first-time enable, not PUT. PUT returns 404.

### 6. Generate Bilingual Descriptions
The user expects **English + Chinese (中文)** project descriptions with this structure:

```
📝 DESKRIPSI PROJECT - [NAME]

English Version:
- Project title and one-line summary
- "Core Features & Logic Flow:" — numbered list of 6-10 features
- "Technical Implementation:" — tech stack + bullet list of technical features
- "Impact:" — paragraph on value/use cases
- GitHub link
- Tool usage statement (Hermes Agent, Claude Code, etc.)

Chinese Version (中文版):
- Full Chinese translation of the above
- Same structure, same sections
```

Write descriptions that highlight:
- Specific numbers (50+ providers, 9 service types, etc.)
- Technical depth (CSS techniques, APIs used)
- Real-world value (performance, zero dependencies, etc.)

📋 **Template**: See `references/bilingual-description-template.md` for the exact EN/CN structure with placeholders.
📋 **MIMO Format**: See `references/mimo-submission-format.md` for MIMO platform submission format (EN/CN with tool usage statement).

### Dashboard Variant
For analytics/dashboard UIs (like Kiro's app.kiro.dev), add these sections:
- **Sidebar navigation** — fixed left sidebar with sections (Overview, Management, Settings)
- **Stat cards** — 4-card grid with gradient top borders, trend indicators (up/down arrows + %)
- **Charts** — Chart.js with custom gradients, dual Y-axes, formatted tooltips
  - Line chart: spending over time with gradient fill
  - Doughnut chart: category distribution with cutout
- **Heatmap grid** — 7-column grid with intensity-based background colors
- **Data tables** — styled tables with model dots, progress bars, monospace numbers
- **Date range selector** — segmented button group (1D, 7D, 14D, 30D) that filters all data
- Use `JetBrains Mono` for numerical/monetary data display
- Alpine.js reactive data: `get` computed properties for derived stats

📋 **Chart.js patterns**: See `references/chartjs-dashboard-patterns.md`

## Pitfalls

- **Ask before building**: Don't assume what the site is for. Always clarify product name, purpose, and content before writing code. Starting without this info means rebuilding later.
- **Port conflicts**: `python3 -m http.server 8080` often fails. Use 8765 or another uncommon port. Always start with `background=true`.
- **Vision failures**: `browser_vision` may fail (404 on vision endpoints). Screenshots are still captured — reference them via the `screenshot_path` in the error output.
- **GitHub token in commands**: Wrap token usage carefully. The approval system flags PAT patterns — this is expected, just needs user approval.
- **Single-file preference**: User expects a complete `index.html` with everything inline. Don't split into multiple files unless asked.
- **Bilingual output**: Always provide BOTH English and Chinese versions. The user uses these descriptions for platform submissions.
- **Description format preference**: User specifically wants the detailed format with "Core Features & Logic Flow", "Technical Implementation", "Impact", and tool usage statement. Don't use a simplified version unless explicitly asked.

## Tech Stack Defaults

- **HTML5** semantic markup
- **CSS3** with custom properties, Grid, Flexbox, animations
- **Alpine.js** via CDN for reactive state (theme toggle, etc.)
- **Google Fonts** — Inter as default
- **Material Icons Outlined** for iconography
- No build tools, no bundlers — pure static files
