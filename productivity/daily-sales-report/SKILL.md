---
name: daily-sales-report
description: "Write daily sales reports from raw data — format, calculate percentages, structure for submission."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [sales, reports, daily, productivity, retail]
    related_skills: [google-workspace, notion]
---

# Daily Sales Report Writing

Help users write structured daily sales reports from raw, informal data. Users typically provide scattered numbers via chat — your job is to organize, calculate percentages, format cleanly, and produce a submission-ready report.

## Trigger
- User says "laporan harian", "daily report", "report penjualan"
- User provides raw sales numbers and asks you to format/write a report
- User gives scattered product data with targets and achievements

## Workflow

### 1. Collect Raw Data
User provides data in any format. Typical fields:
- Store name (toko)
- Date
- Product categories with: achievement, target, percentage
- Notes/issues (kendala)

Accept informal input like:
```
Elastex: 50kg, target 100kg
Bee Brand: 105Ltr
```

### 2. Calculate Missing Values
- If achievement + target given but no percentage → calculate: `(achievement / target * 100).toFixed(0)%`
- If percentage missing and can't calculate → mark as `-`
- Always show: achievement / target = percentage format

### 3. Format Report
Use the user's preferred structure. Default Indonesian business report format:

```markdown
## LAPORAN HARIAN SALES
**Toko:** [NAME]
**Tanggal:** [DATE]

### PENCAPAIAN CCM
- Penjualan Hari Ini: Rp [amount]
- Akumulasi Bulan Ini: Rp [amount]
- Target: Rp [amount]
- Persen: [%]

### PRODUK FOKUS
1. [Product]: [achievement] [unit] / [target] [unit] = [%]
...

### CATATAN / KENDALA
- [notes]
```

### 4. Save & Reuse
- Save template to file for daily reuse
- User provides only changed numbers next time
- Update nominal values only, keep product names/structure

## User Preferences (CRITICAL)
- **Language:** Indonesian slang (gue/lo) for chat, formal Indonesian for reports
- **Format:** Clean, minimal, no excessive explanation
- **Workflow:** User gives raw data → you format → save → done. Don't over-explain.
- **Updates:** When user says "update data nominal aja", ONLY change numbers, keep everything else
- **Product names:** Never change product names unless explicitly told
- **Don't ask unnecessary questions** — if data is missing, mark as `-` and move on

## Pitfalls
- DON'T ask "mau format gimana?" if user already showed you the format once — use it
- DON'T add products that weren't mentioned
- DON'T change product category groupings (CCM vs RM vs Produk Fokus)
- DON'T recalculate percentages user already provided — trust their numbers
- DON'T ask excessive clarification questions — if the data is reasonably clear, calculate and present it; user will correct if wrong
- DON'T confuse CCM and RM categories. Pylox, Bee Brand, Elastex, Woodstain, Komilex = RM. Tinting products (Weatherbond, Spot-less, Easywash, Vinilex when tinted) = CCM
- DON'T assume duplicate product entries are errors — CCM items can have multiple entries with different kemasan/prices (e.g., "Elastex 285rb" + "Elastex 134rb" are separate transactions)
- **DON'T restructure the user's report format.** Preserve their EXACT layout — no extra markdown headers (`##`), no `---` dividers, no reordering sections. If their template uses plain text with `:` separators, keep it that way. Adding formatting the user didn't ask for = "Yang rapi dong bro" correction.
- DO present calculated totals first, ask clarifying questions AFTER if truly ambiguous
- DO save reports to files so user can reference them later
- DO keep a price list reference file per store for cross-referencing
- **DO regenerate and present the full report when user says "update"** — don't just confirm changes silently. Show the complete updated report in their format.
- **DO treat incremental data as additions to the day's running total.** User may give sales data throughout the day in multiple messages. Accumulate: read previous totals from template, add new data, update file, present full report.

### Price Calculation Rules
- **RM pricing is per kemasan** — 1kg, 4kg, 20kg have DIFFERENT per-kg rates (not a simple multiplier). Always check the price list for the specific kemasan.
- **CCM prices are transaction-based** — user gives the nominal directly (e.g., "Spotless 340000"). Don't try to reverse-engineer kg/L from the price.
- When user says "Elastex rm 4kg", confirm: is it 4 × 1kg kemasan, or 1 × 4kg kemasan? Different prices (4 × 75rb = 300rb vs 285rb). Default to what matches the price list.

## Related Files
- See `references/nippon-paint-products.md` for Nippon Paint product categories and naming conventions
- See `references/nippon-paint-price-list.md` for detailed pricing reference

## Nippon Paint Specific Workflow

When user works at Nippon Paint dealer:
1. **Read price list** from `references/nippon-paint-price-list.md` and the template file
2. User provides raw data: "Elastex rm 4kg, Bee Brand rm 9kg, Pylox 4pcs"
3. **Calculate totals** — multiply quantities by prices, sum CCM and RM separately
4. **Update template file directly** — don't ask for confirmation unless genuinely ambiguous
5. **Present clean summary** — show what you calculated and saved
6. Next time, user provides only changed numbers — you update nominal only
7. Never change product names unless explicitly told
8. Only ask clarifying questions if the data is truly unparseable (missing unit, conflicting numbers)

### Template File
- User's authoritative report template: `~/laporan_harian_sedulur.md`
- Price list reference: `~/harga_rm_sedulur.md` (also mirrored in `references/nippon-paint-price-list.md`)
- **Always read the template file first** to get current accumulated values and exact format
- **Match the user's format EXACTLY** when presenting the report — don't add headers, dividers, or restructuring

### Report Sections (Nippon Paint)
- **CCM**: Colour Creations Mix sales (tinting products). User gives nominal directly per transaction (e.g., "Spotless 340000"). Same product can appear multiple times with different kemasan/prices.
- **RM**: Ready Mix sales (pre-mixed products). Calculate from quantity × price per kemasan. Use price list — different kemasan have different per-unit rates.
- **Produk Fokus**: Products with specific targets (min 1 gallon)
- **CCM Fokus**: Specific CCM products with individual targets
