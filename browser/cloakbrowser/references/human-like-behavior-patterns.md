# Human-Like Behavior Patterns for Platform Automation

Anti-detection patterns for bots/scripts that interact with messaging platforms (Discord, Telegram, WhatsApp, Slack) via API. Not browser-specific — applies to any automated platform interaction.

## 1. Variable Timing (Anti-Rate-Pattern Detection)

Static delays are the #1 bot giveaway. Use jittered delays with behavioral variance:

```javascript
const humanDelay = (minMs, maxMs) => {
  const base = randomBetween(minMs, maxMs);
  // 15% chance: "thinking" pause (2-4x longer) — user pausing to think
  if (Math.random() < 0.15) return base * randomBetween(2, 4);
  // 5% chance: quick burst (0.3-0.7x) — user typing fast
  if (Math.random() < 0.05) return Math.floor(base * (0.3 + Math.random() * 0.4));
  return base;
};
```

**Ranges that work:**
- Chat messages: 8-25s base, occasional 50-100s
- Form submissions: 3-8s base
- Reactions: 1-4s base

## 2. Typing/Activity Indicators

Most chat platforms have a typing indicator API. Trigger it before sending:

```javascript
// Discord typing indicator
const sendTyping = async (channelId, token) => {
  await fetch(`https://discord.com/api/v9/channels/${channelId}/typing`, {
    method: 'POST',
    headers: { 'Authorization': token }
  });
};

// Show typing for realistic duration based on message length
const simulateTyping = async (channelId, token, msgLength) => {
  const typingMs = Math.min(msgLength * randomBetween(150, 400) + randomBetween(500, 3000), 8000);
  await sendTyping(channelId, token);
  // Discord typing indicator expires every ~10s, re-trigger if needed
  const intervals = Math.ceil(typingMs / 7000);
  for (let i = 0; i < intervals; i++) {
    await sleep(Math.min(typingMs - (i * 7000), 7000));
    if (i < intervals - 1) await sendTyping(channelId, token);
  }
};
```

## 3. Lurk Behavior (Passive Presence)

Real users don't send messages every time they visit a channel. Add lurk probability:

```javascript
// 10% chance: just read, don't send
if (Math.random() < 0.10) {
  console.log('Lurking (skipping this round)');
  await sleep(randomBetween(3000, 8000));
  continue;
}
```

## 4. AFK Simulation (Breaks)

Real users take breaks — bathroom, snacks, phone calls:

```javascript
// 20% chance between cycles: simulate going AFK
if (Math.random() < 0.20) {
  const afkTime = randomBetween(30000, 120000); // 30s-2min
  await sleep(afkTime);
}
```

## 5. Message Variation Strategies

Never send the exact same message twice. Strategies by probability:

| Strategy | Probability | Technique |
|----------|-------------|-----------|
| React to recent | 40% | Truncate recent msg + emoji, agree, modify |
| Short reaction | 25% | lol, nice, 💀, emoji-only |
| Copy + mutate | 20% | Swap chars, repeat word, lowercase, truncate |
| Pool random | 15% | Pick from predefined message pool |

### Mutation techniques:
- Remove random character
- Swap two adjacent characters
- Lowercase everything
- Append emoji
- Truncate to 70% of words
- Duplicate a random word

## 6. Multi-Token Rotation

Distribute activity across multiple accounts to avoid per-account rate limits:

```javascript
let tokenIndex = 0;
// In loop:
const token = tokens[tokenIndex % tokens.length];
tokenIndex++;
```

## 7. Stats & Monitoring

Track sent/deleted/errors for health monitoring. Print every 5 min for long-running scripts.

## Pitfalls

- **Discord typing indicator expires ~10s** — re-trigger for longer messages
- **Rate limits (429)** — always implement retry-after handling, exponential backoff
- **Token validation** — check tokens work before starting main loop
- **User-Agent consistency** — match the platform's expected UA string for your "OS"
- **Don't mutate too aggressively** — messages should still be readable, not garbled
