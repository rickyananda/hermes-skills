# 9router.com Design Patterns

Extracted from https://9router.com — modern dark-themed SaaS landing page for an AI router/gateway product.

## Color Scheme (Dark Mode)

```css
:root {
  --bg: #0a0a0f;
  --bg-alt: #12121a;
  --surface: #1a1a2e;
  --surface-2: #232340;
  --border: #2a2a45;
  --border-subtle: #1e1e35;
  --text: #e8e8f0;
  --text-muted: #8888aa;
  --text-subtle: #555570;
  --accent: #6c5ce7;        /* Purple primary */
  --accent-2: #a29bfe;      /* Light purple */
  --gradient-1: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #74b9ff 100%);
  --gradient-2: linear-gradient(135deg, #6c5ce7 0%, #e17055 100%);  /* Purple to coral */
}
```

## Light Mode Variables

```css
[data-theme="light"] {
  --bg: #f8f9fc;
  --bg-alt: #ffffff;
  --surface: #ffffff;
  --surface-2: #f0f0f8;
  --border: #e0e0ea;
  --text: #1a1a2e;
  --text-muted: #666680;
}
```

## Key Layout Sections

1. **Nav** — Fixed, backdrop-filter blur, logo + links + theme toggle + CTA button
2. **Hero** — Centered, badge (animated dot), multi-line h1 with gradient text, subtitle, 2 buttons, code snippet
3. **Stats Bar** — 4-column grid, gradient numbers, uppercase labels
4. **Features Grid** — 9 cards (3x3), icon + title + description, hover gradient top border
5. **How It Works** — 3 numbered steps, each with icon + title + description + code snippet
6. **Providers Grid** — Tiered sections (Free/OAuth/API Key), colored chips with dots
7. **Tools Grid** — 12+ tool cards with icons, compact layout
8. **CTA** — Centered, gradient glow background, 2 buttons
9. **Footer** — Logo + links + copyright

## CSS Techniques

- **Grid background pattern** with radial mask:
  ```css
  .grid-bg {
    background-image:
      linear-gradient(rgba(var(--accent-rgb),0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(var(--accent-rgb),0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%);
  }
  ```

- **Glass-morphism nav**:
  ```css
  nav {
    background: rgba(10,10,15,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-subtle);
  }
  ```

- **Gradient text**:
  ```css
  .gradient {
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  ```

- **Scroll animations** via IntersectionObserver:
  ```css
  .fade-in { opacity: 0; transform: translateY(30px); transition: 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  ```

- **Feature card hover effect** — gradient top border appears on hover:
  ```css
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--gradient-1); opacity: 0; transition: 0.25s;
  }
  .feature-card:hover::before { opacity: 1; }
  ```

## Typography

- **Font:** Inter (Google Fonts)
- **Headings:** 800-900 weight, letter-spacing: -0.02em to -0.03em
- **Body:** 400-500 weight, line-height: 1.6
- **Code:** JetBrains Mono or monospace, colored accent

## Icon System

- Material Icons Outlined via Google Fonts CDN
- Used in: nav, hero buttons, feature cards, step icons, section badges
