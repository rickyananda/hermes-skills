# Live Dashboard Pattern

Node.js server serving HTML dashboard with auto-refreshing JSON data.

## Server Structure

```javascript
const http = require("http");
const fs = require("fs");

const HTML = `<!DOCTYPE html>...`; // Full HTML with embedded CSS/JS

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/data") {
    // Read data from JSON file
    let results = [];
    try { results = JSON.parse(fs.readFileSync("results.json", "utf-8")); } catch {}
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ results, totalWallets: 100 }));
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(HTML);
  }
});

server.listen(8888);
```

## Frontend Auto-Refresh

```javascript
async function refresh() {
  const res = await fetch('/api/data');
  const data = await res.json();
  // Update DOM elements
  document.getElementById('walletsDone').textContent = data.results.length;
  // ... update other elements
}
refresh();
setInterval(refresh, 5000); // Refresh every 5 seconds
```

## Key Design Decisions

1. **Single HTML file** — Embed all CSS/JS in the HTML string. No external dependencies.
2. **Server reads JSON each request** — Always serves latest data from disk.
3. **5-second refresh interval** — Balance between freshness and server load.
4. **Progress bar** — Visual indicator of completion percentage.
5. **Clickable links** — Each wallet links to Solana Explorer for verification.
6. **Color-coded breakdown** — Different colors for different action types.

## CSS Theme

Dark theme with accent colors:
- Background: `#0a0a0f`
- Cards: `#12121a`
- Green: `#00ff88` (success/completion)
- Blue: `#00ccff` (info/links)
- Pink: `#ff66cc` (NFTs)
- Yellow: `#ffcc00` (domains)
- Orange: `#ff8844` (listings)
