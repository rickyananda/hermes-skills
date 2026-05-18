# Enable All Toolsets

Quick reference for enabling all available toolsets in Hermes Agent.

## Method 1: Edit config.yaml Directly

Edit `~/.hermes/config.yaml` and replace the `toolsets:` section:

```yaml
toolsets:
- hermes-cli
- web
- search
- vision
- video
- image_gen
- video_gen
- computer_use
- terminal
- moa
- skills
- browser
- cronjob
- messaging
- file
- tts
- todo
- memory
- session_search
- clarify
- code_execution
- delegation
- homeassistant
- kanban
- discord
- discord_admin
- yuanbao
- feishu_doc
- feishu_drive
- spotify
- debugging
```

## Method 2: Use CLI Commands

```bash
# Enable specific toolsets
hermes tools enable web
hermes tools enable browser
hermes tools enable terminal
# ... etc

# Or use interactive UI
hermes tools
```

## Method 3: Backup First, Then Edit

```bash
# Backup current config
cp ~/.hermes/config.yaml ~/.hermes/config.yaml.bak.$(date +%Y%m%d_%H%M%S)

# Edit config
nano ~/.hermes/config.yaml
```

## Available Toolsets

| Toolset | Description |
|---------|-------------|
| `web` | Web search and content extraction |
| `search` | Web search only |
| `browser` | Browser automation |
| `terminal` | Shell commands and process management |
| `file` | File read/write/search/patch |
| `code_execution` | Sandboxed Python execution |
| `vision` | Image analysis |
| `image_gen` | AI image generation |
| `video` | Video analysis |
| `video_gen` | Video generation |
| `computer_use` | Computer control |
| `tts` | Text-to-speech |
| `skills` | Skill management |
| `memory` | Persistent memory |
| `session_search` | Search past conversations |
| `delegation` | Subagent task delegation |
| `cronjob` | Scheduled tasks |
| `clarify` | Ask clarifying questions |
| `messaging` | Cross-platform messaging |
| `todo` | Task planning |
| `kanban` | Multi-agent work queue |
| `debugging` | Debug tools |
| `moa` | Mixture of Agents |
| `homeassistant` | Smart home control |
| `discord` | Discord integration |
| `discord_admin` | Discord admin tools |
| `feishu_doc` | Feishu document tools |
| `feishu_drive` | Feishu drive tools |
| `yuanbao` | Yuanbao integration |
| `spotify` | Spotify playback |

## After Changes

Toolset changes require a new session:
- In CLI: exit and relaunch `hermes`
- In gateway: `/restart` or `hermes gateway restart`
- In session: `/reset` to start fresh

## Pitfalls

- Don't enable toolsets you don't need — increases token usage
- Some toolsets require API keys (image_gen, tts, etc.)
- `computer_use` is powerful but risky — use with caution
- `debugging` adds overhead — only enable when needed
- Changes don't apply mid-session — must start new session
