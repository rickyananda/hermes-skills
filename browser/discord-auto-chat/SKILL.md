---
name: discord-auto-chat
description: Discord auto-chat bot with human-like behavior — typing indicators, variable delays, context-aware messages, lurk mode. Linux-compatible ESM Node.js.
trigger: user wants Discord auto-chat, push messages to Discord channel, Discord bot spam, auto-chat
---

# Discord Auto Chat v2.0 — Human-Like Edition

Enhanced version of [PushDC-NTE](https://github.com/Svz1404/PushDC-NTE) by NT-Exhaust, rewritten for human-like behavior.

## Setup

```bash
git clone https://github.com/Svz1404/PushDC-NTE.git
cd PushDC-NTE
npm install
```

Replace `index.js` with the enhanced version (see `scripts/index.js`).

Add tokens to `token.txt` (one per line, user tokens):
```
MTxxxxxxxxxxxxxxx
OTxxxxxxxxxxxxxxx
```

Run:
```bash
node index.js
```

## Features (v2.0 vs original)

| Feature | Original | v2.0 |
|---|---|---|
| Message generation | Copy random msg, remove 1 char | 4 strategies: react (40%), short reaction (25%), mutate (20%), pool (15%) |
| Typing indicator | None | Simulated before every send |
| Delay | Static | Variable with "thinking" pauses and quick bursts |
| Lurk mode | None | 10% chance to skip (just read) |
| AFK simulation | None | 20% chance of 30-120s break per cycle |
| Stats | None | Live counter (sent/deleted/errors/runtime) |
| User-Agent | None | Chrome Linux X11 |

## Message Strategies

1. **React to recent (40%)** — fetches last 50 messages, picks one, transforms:
   - Truncate + emoji
   - Just emoji
   - Agree ("yeah 💀", "fr 🔥")
   - Mutate (see below)
2. **Short reaction (25%)** — random from pools: laughing, reactions, filler+emoji, questions, emoji
3. **Mutate existing (20%)** — copy + transformation:
   - Remove random char
   - Swap adjacent chars
   - Lowercase all
   - Add emoji
   - Truncate words
   - Duplicate a word
4. **Random pool (15%)** — reactions + laughing + filler

## Human-Like Timing

- Base delay: user-configured min/max (default 8-25s)
- 15% chance: "thinking" pause (2-4x longer)
- 5% chance: quick burst (0.3-0.7x)
- Typing indicator: 150-400ms per char + 500-3000ms think time, capped at 8s
- AFK break: 20% chance per cycle, 30-120 seconds

## Pitfalls

- **Token format**: Discord user tokens, NOT bot tokens. Bot tokens have a different API behavior.
- **Rate limits**: 429 responses are auto-handled with retry_after, but high volume still risks account action.
- **Linux headless**: Works fine on servers. No GUI needed.
- **ESM only**: `package.json` must have `"type": "module"`. Node >= 18 required.
- **Token.txt newline**: Each token on its own line, no trailing spaces.

## Extending

- **Custom message pool**: Add a `messages.txt` file and load it instead of hardcoded pools
- **Reply mode**: Use Discord's `message_reference` field to reply to specific messages
- **Schedule**: Wrap the main loop with time checks (e.g., only run 9am-11pm)
- **Multi-channel**: Already supported — comma-separated channel IDs at prompt

## Files

- `scripts/index.js` — Enhanced v2.0 script (319 lines)
- Original: https://github.com/Svz1404/PushDC-NTE
