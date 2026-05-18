# Analyzing a Live Website's Design System

When the user says "build something like [site]" or "ala ala [site]", extract the target site's design tokens before building. This replaces guessing with actual values.

## Workflow

1. **Browse the target site** with `browser_navigate`
2. **Extract CSS variables** via browser console:

```javascript
// Get CSS custom properties from :root
const vars = {};
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      if (rule.selectorText === ':root' || rule.selectorText === '::root') {
        for (const prop of rule.style) {
          if (prop.startsWith('--')) {
            vars[prop] = rule.style.getPropertyValue(prop).trim();
          }
        }
      }
    }
  } catch(e) {}  // cross-origin sheets throw
}
JSON.stringify(vars, null, 2);
```

3. **Extract computed body styles**:

```javascript
const s = getComputedStyle(document.body);
JSON.stringify({
  bg: s.backgroundColor,
  color: s.color,
  font: s.fontFamily,
  fontSize: s.fontSize,
  lineHeight: s.lineHeight,
});
```

4. **Check for dark/light themes**:

```javascript
const html = document.documentElement;
const classes = html.className + ' | ' + document.body.className;
const dataTheme = html.getAttribute('data-theme') || html.getAttribute('data-color-scheme');
JSON.stringify({classes, dataTheme});
```

5. **Get layout structure** via `browser_snapshot(full=true)` — captures headings, sections, navigation, card grids, CTAs
6. **Take screenshots** with `browser_vision` for visual reference (colors, spacing, gradients, card styles)

## What to Extract

- **Colors**: background, text, accent, muted, surface, border
- **Typography**: font family, sizes, weights, line heights
- **Spacing**: padding, margins, gaps (from key containers)
- **Border radius**: cards, buttons, inputs
- **Shadows**: elevation patterns
- **Layout**: grid/flex patterns, max-widths, section spacing
- **Components**: card styles, button styles, navigation patterns

## Common Pitfalls

- Cross-origin stylesheets throw when accessed — wrap in try/catch
- Dark mode may be toggled via class on `<html>` or `<body>`, check both
- Some sites use CSS layers or scoping — check multiple selectors, not just `:root`
- Font families may include system fallbacks — strip `-apple-system, BlinkMacSystemFont, system-ui, sans-serif` to get the actual chosen font
- Colors may be in `rgb()` format — convert to hex if needed for readability
