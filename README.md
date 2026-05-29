# Portage — Canadian Retirement Wealth Planner

A private, browser-based retirement planning tool for Canadian couples (Ontario). Built to model complex retirement scenarios with full transparency into the underlying calculations.

**Version 0.1.0**

## Philosophy

- **Private by design** — all data lives in your browser's localStorage. Nothing is sent to any server.
- **Present-day dollars** — all output is expressed in today's purchasing power, making year-over-year comparisons meaningful.
- **Date-accurate** — calculations use exact calendar dates, not calendar years. Ages are converted to dates internally; the engine walks month-by-month for income pro-ration.
- **Portable** — the entire application builds to a single self-contained HTML file (~5MB) with no external dependencies at runtime.

---

## Features

### Income Sources

- **DB Pension** — defined benefit pension with CPI indexing (with optional annual cap), bridge benefit, CPP integration reduction at 65, early retirement reduction factor, survivor benefit percentage, and independent modelling per person
- **CPP** — early/deferred start with full actuarial adjustment (−0.6%/month before age 65, +0.7%/month after age 65, maximum ±42%/36% at ages 70/60). Survivor CPP modelled at 60% of deceased's entitlement.
- **OAS** — deferred start with +0.6%/month after age 65 (max +36% at 70). Clawback at 15% above the threshold (~$90,997 in 2024, CPI-indexed). Optional GIS supplement per person.
- **Employment income** — per-person salary with configurable real growth rate, pro-rated to the month of retirement
- **Other income** — recurring or one-time items per person or joint, taxable/non-taxable flag, with start/end dates and real growth rate

### Investment Accounts

- **RRSP/RRIF** — contribution planning with lump-sum or spread timing; RRIF conversion date; CRA mandatory minimums by age (or younger spouse's age); spousal RRSP balance and contributions; additional annual draw above minimum; per-account return rate override
- **TFSA** — per-person balance and contributions with contribution end date and optional return override
- **Non-Registered** — ACB tracking; annual yield breakdown (eligible dividends, foreign income, interest); capital gains on withdrawal via ACB ratio; optional return override
- **HISA** — joint high-interest savings with configurable interest rate and minimum balance floor

### Spending

- **Spending phases** — multiple phases (e.g. Go-Go / Slow-Go / No-Go / Survivor) each with an annual amount and real growth rate. The survivor phase can be linked to the first death so its start date adjusts automatically.
- **Additional spending** — recurring or one-time items keyed to the reference person's age, in today's dollars

### Tax Engine (Ontario + Federal, 2024 reference year, CPI-indexed forward)

- Full marginal tax on employment, pension, CPP, OAS, RRIF, eligible dividends (38% gross-up with federal + Ontario credits), non-eligible dividends, foreign income, and interest income
- Capital gains at 50% inclusion (two-tier structure preserved for scenario analysis; proposed 66.67% above $250k was cancelled January 2025)
- Pension income splitting — auto-optimized each year or manual (0–50% of eligible pension from Person A to Person B)
- Age amount, pension income amount, basic personal amount — all CPI-indexed
- Ontario surtax: 20% on Ontario tax above $5,315; additional 36% above $6,802
- OAS clawback at 15% above the annual threshold

### Withdrawal / Drawdown Strategies

Four strategies control how account withdrawals are orchestrated each year. All strategies respect mandatory RRIF minimums.

- **None** — no proactive draws; accounts grow until RRIF minimums force withdrawals. Spending shortfalls are not covered.
- **Cover Spending Gap** — each year, any shortfall between net household income and spending is filled by drawing from accounts in a configured priority order, and any surplus is routed back into accounts. Operates in two phases per person:
  - *Meltdown phase* (retired, pre-RRIF): configurable proactive RRSP draw up to a gross income ceiling (intentional meltdown at lower rates), plus reactive deficit draws in priority order with per-account annual caps
  - *RRIF phase* (after RRIF conversion): mandatory minimums drawn first; remaining deficit filled from configured accounts; surplus routed as configured
- **Fixed Withdrawal** — explicit annual dollar amounts per person per account, CPI-indexed. Draws fire regardless of need; shortfalls and surpluses are not automatically managed.
- **Fixed Percentage** — annual draw as a configurable percentage of balance with a floor minimum per account. Same approach — no automatic gap-filling.

### What-If Analysis (Dashboard)

Overlay modifications on the base plan without changing it. All effective values update instantly; the base plan is untouched.

- Portfolio return rate offset (shifts all tiers uniformly)
- Market return profile (step, front-loaded, back-loaded, cyclical crest/trough, seeded noise) with outlook shift and amplitude scaling
- Personal inflation rate and CPI rate
- Longevity (planning end age) per person
- Retirement date per person, with cascade toggles for pension start, RRSP/TFSA/non-reg contribution end dates
- Layoff event with optional taxable severance per person
- CPP and OAS start ages per person
- Unexpected one-time expense
- Pension splitting mode and percentage
- Drawdown strategy and all parameters

### Scenarios

Named snapshots of the current what-if state. Each scenario is saved as a table row with its name and date. Load any scenario to restore its what-if configuration; delete scenarios individually. Scenarios are included in the JSON export and restored on import.

Use the **Freeze** button to lock the current key outcomes, then load a scenario or make changes — the metric tiles show the delta (▲/▼) against the frozen baseline.

### Key Outcomes (Dashboard)

Six headline metric tiles with frozen scenario deltas:

- Portfolio at last survivor's death
- Total lifetime tax paid
- Average effective tax rate
- Peak portfolio value
- Years with spending shortfall
- Total shortfall amount

Clicking any tile opens a year-by-year detail table.

### Charts (Dashboard)

All charts have an independent x-axis selector (calendar year / Person A age / Person B age) and source chips for filtering. Each chart resets independently.

- **Income** — gross or net toggle; household/per-person filter; source chips (employment, DB pension, bridge, CPP, OAS, RRIF, TFSA draws, non-reg draws, other income)
- **Tax Paid** — household/per-person filter
- **Portfolio Balances** — stacked by account type (RRSP/RRIF, TFSA, Non-Reg, HISA); household/per-person filter with account-type chips
- **Annual Cash Flow** — green/red bars showing surplus or deficit each year

### Annual Summary Table

Expandable column groups (Year, Income, Tax, Portfolio) with optional person colour tinting. Age labels show `(deceased)` past each person's planning end date.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Data is saved automatically to localStorage.

### Production Build

```bash
npm run build
```

Produces `dist/index.html` — a single self-contained file you can open in any browser, move to a USB drive, or share directly. No web server required.

---

## Data Management

All data operations are available from the **menu** (top-right of the header):

**File**
- **Export JSON** — saves a full plan snapshot (base plan + scenarios) to your Downloads folder
- **Import JSON** — restores a previously exported snapshot; what-if state resets on import

**Tools**
- **Export AI Context** — generates a comprehensive markdown document (`portage-ai-context-*.md`) containing the complete plan in a format suitable for loading into an AI assistant. Includes all base plan inputs with explanatory notes, the active drawdown strategy described in plain English, and all current modifications with effective values clearly distinguished from base values. Useful for asking an AI to run hypothetical scenarios or provide analysis without giving it access to your tool.

**About**
- **Help** — workflow guide and data/privacy notes
- **About Portage** — version, tax year, and technical details

**Danger**
- **Reset to Defaults** — clears all plan data and restores factory defaults (scenarios are preserved in any exported JSON)

**Per-card reset** — each data entry card has a reset button (↺) that restores that card's fields to defaults without affecting the rest of the plan.

---

## Tech Stack

- React 19 + TypeScript
- Vite 6 + vite-plugin-singlefile
- Zustand v5 (state management)
- Tailwind CSS v3
- Plotly.js (charts, loaded async)

---

## Scope & Limitations

- **Ontario only** — provincial tax calculations are hardcoded for Ontario; multi-province support is a future concern
- **2024 tax reference year** — brackets and credits are indexed forward by CPI each year in the engine
- **Annual granularity** — the engine walks year-by-year with a monthly inner loop for income pro-ration; account balances compound annually
- **Single household** — two people; no support for blended families or more complex household structures
- **Exploratory strategies** — Fixed Withdrawal and Fixed Percentage are designed for scenario exploration, not as complete decumulation optimizers; they do not automatically reinvest surplus or fill shortfalls

---

## Privacy

No data ever leaves your machine. There are no accounts, no analytics, and no network requests after the initial page load. The production build has zero runtime dependencies on external servers — it is a single static HTML file.
