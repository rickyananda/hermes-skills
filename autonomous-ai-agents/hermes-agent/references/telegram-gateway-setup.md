# Telegram Gateway Setup

Setting up Telegram requires edits in **three places** — the interactive `hermes gateway setup` wizard handles this, but manual setup is often needed in headless/container environments.

## Required Configuration

### 1. config.yaml — gateway section

Add a top-level `gateway:` section if missing:

```yaml
gateway:
  enabled: true
  platforms:
    - telegram
```

### 2. config.yaml — telegram section

Under the existing `telegram:` key, add the bot token:

```yaml
telegram:
  bot_token: '<BOT_TOKEN>'
  reactions: false
  channel_prompts: {}
  allowed_chats: ''
```

### 3. ~/.hermes/.env — environment variables

```bash
TELEGRAM_BOT_TOKEN=<BOT_TOKEN>
GATEWAY_ALLOW_ALL_USERS=true
```

Without `GATEWAY_ALLOW_ALL_USERS=true`, the gateway logs:
> "No user allowlists configured. All unauthorized users will be denied."
and refuses all messages.

For production, use per-user allowlists instead:
```bash
TELEGRAM_ALLOWED_USERS=user_id_1,user_id_2
```

## Pitfalls

- **`hermes config set` does NOT work** for nested gateway/telegram keys — it tries to interpret dot notation as an env var name and raises `ValueError: Invalid environment variable name`. Edit `config.yaml` directly.
- **systemd may fail** in containers/WSL without systemd. Run `hermes gateway run` in foreground mode as fallback.
- **Bot token format**: `<bot_id>:<token_string>` — get from @BotFather on Telegram.
- The gateway uses **polling mode** by default (not webhooks). No port exposure needed.

## Verification

```bash
# Start gateway
hermes gateway run

# Check logs for success
tail -20 ~/.hermes/logs/gateway.log
# Should see: "[Telegram] Connected to Telegram (polling mode)"
#             "✓ telegram connected"
```

## Stopping

```bash
hermes gateway stop
# Or kill the foreground process with Ctrl+C
```
