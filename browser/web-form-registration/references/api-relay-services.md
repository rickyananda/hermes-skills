# API Relay Services

## Ccode.dev
- **URL**: https://www.ccode.dev
- **Type**: Claude API relay (中转站) from China
- **Tagline**: "目前最稳、最具有性价比的Claude中转站，假一赔三！"
- **Registration**: Requires invitation code
- **Referral link format**: `https://www.ccode.dev/register?aff=CODE`
- **Models available**:
  - claude-opus-4-6-thinking
  - claude-opus-4-7-high/low/max/medium/xhigh
  - claude-sonnet-4-6-thinking
- **Support**: WeChat customer service (QR code on site)
- **Telegram**: https://t.me/ccode_official
- **Pricing**: Group discounts available (0.3 tenths, -39%)
- **Features**: Max x5/x20 account pools, auto-routing, ban protection

## BazaarLink Probe
- **URL**: https://bazaarlink.ai/probe
- **Type**: API relay quality checker
- **Purpose**: Detect model swapping, token inflation, prompt injection
- **Tests**: 76 automated tests
- **Attack detection**:
  - AC-1.a: Response tampering
  - AC-1.b: Conditional injection
  - AC-2: Secret scanning
- **Cost per probe**: $0.018-$0.870 depending on model
- **Features**: Proxy Monitor, endpoint monitoring, fraud proxy detection
- **Based on**: arXiv 2604.08407 — LLM relay supply chain attack research

## How to Verify API Relay Quality
1. Register on relay service
2. Get API key
3. Go to https://bazaarlink.ai/probe
4. Enter API base URL and key
5. Run full probe (76 tests)
6. Check score — 80+ is good, <50 is suspicious
7. Look for model swapping detection results

## Other Free/Cheap API Options
- Groq: Free tier with Llama/Mixtral
- Google Gemini: Free tier
- HuggingFace: Free inference API
- OpenRouter: Pay-per-use, many models
- GitHub Student Pack: Includes API credits
