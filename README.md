<img width="132" height="132" alt="portage-icon" src="https://github.com/user-attachments/assets/71241c4a-ff1e-4b79-bfa1-c07c30d2866c" />

# Portage — Canadian Retirement Wealth Planner

A private, browser-based retirement planning tool for Canadian couples (Ontario). Built to model complex retirement scenarios with full transparency into the underlying calculations.

**Version 0.10.0**

## Philosophy

- **Private by design** — all data lives in your browser's localStorage, nothing is sent to any server
- **Present-day dollars** — all output is expressed in today's purchasing power, making year-over-year comparisons meaningful
- **Date-accurate** — calculations use exact calendar dates but may display years, the engine calculates month-by-month for income pro-ration
- **Portable** — the entire application builds to a single self-contained HTML file (~8MB) with no external dependencies at runtime

---

## Features

### Income Sources

- **Employment income** — per-person salary with configurable real growth rate, pro-rated to the month of retirement
- **DB Pension** — defined benefit pension with CPI indexing, bridge benefit, CPP integration reduction at 65, early retirement reduction factor, survivor benefit percentage, and independent modelling per person
- **CPP** — early/deferred start with full actuarial adjustment at ages 70/60 and survivor benefits calculated per CRA rules
- **OAS** — deferred start with full actuarial adjustment at age 70, clawbacks caculated per CRA rules, and  Clawback at 15% above the optional GIS supplement per person
- **Other income** — recurring or one-time items per person or joint, taxable/non-taxable flag, with start/end dates and real growth rate

### Investment Accounts

- **RRSP/RRIF** — contribution planning with lump-sum or spread timing; RRIF conversion date; CRA mandatory minimums by age (or younger spouse's age); spousal RRSP balance and contributions; additional annual draw above minimum; per-account return rate override
- **TFSA** — per-person balance and contributions with contribution end date and optional return override
- **Non-Registered** — ACB tracking; annual yield breakdown (eligible dividends, foreign income, interest); capital gains on withdrawal via ACB ratio; optional return override
- **HISA** — joint high-interest savings with configurable interest rate and minimum balance floor

### Spending

- **Spending phases** — multiple phases (e.g. Go-Go / Slow-Go / No-Go / Survivor) each with an annual amount and real growth rate; Survivor phase can be linked to the first death so its start date adjusts automatically
- **Additional spending** — recurring or one-time items keyed to the reference person's age, in today's dollars

### Tax Engine (Ontario + Federal, 2026 reference year, CPI-indexed forward)

- Full marginal tax on employment, pension, CPP, OAS, RRIF, eligible dividends (38% gross-up with federal + Ontario credits), non-eligible dividends, foreign income, and interest income
- Capital gains at 50% inclusion (two-tier structure preserved for scenario analysis; proposed 66.67% above $250k was cancelled January 2025)
- Pension income splitting — auto-optimized each year or manual (0–50% of eligible pension from Person A to Person B)
- Age amount, pension income amount, basic personal amount — all CPI-indexed
- Ontario surtax: 20% on Ontario tax above $5,818; additional 36% above $7,446
- OAS clawback at 15% above the annual threshold
- Foreign Tax Credit (FTC) — 15% non-refundable credit for withholding tax paid at source on foreign investments (e.g. US/intl dividends) to prevent double taxation

### Withdrawal / Drawdown Strategies

Six strategies control how account withdrawals are orchestrated each year. All strategies respect mandatory RRIF minimums.

- **None** — no proactive draws; accounts grow until RRIF minimums force withdrawals; spending shortfalls are not covered
- **Fixed Withdrawal** — explicit annual dollar amounts per person per account, CPI-indexed; draws fire regardless of need; shortfalls and surpluses are not automatically managed
- **Fixed Percentage** — annual draw as a configurable percentage of balance with a floor minimum per account; Same approach — no automatic gap-filling
- **Cover Spending Gap** — each year, any shortfall between net household income and spending is filled by drawing from accounts in a configured priority order, and any surplus is routed back into accounts. Operates in two phases per person:
  - *Meltdown phase* (retired, pre-RRIF): configurable proactive RRSP draw up to a gross income ceiling (intentional meltdown at lower rates), plus reactive deficit draws in priority order with per-account annual caps
  - *RRIF phase* (after RRIF conversion): mandatory minimums drawn first; remaining deficit filled from configured accounts; surplus routed as configured
- **Bengen Rule** — sets a year-1 draw amount as a percentage of portfolio (e.g. 4%), then inflation-indexes that dollar amount each subsequent year regardless of portfolio performance; account draw order is configurable per person. Deficit and surplus can optionally flow through HISA
- **Guyton-Klinger Rule** — starts like Bengen (inflation-indexed % of year-1 portfolio), but applies guardrail adjustments: if the current withdrawal rate rises above the upper guardrail (portfolio underperformance), the draw is cut by a configurable %; if it falls below the lower guardrail (outperformance), the draw is raised; an optional 15-year rule disables cuts in the final 15 years of each person's plan

### What-If Analysis (Dashboard)

Overlay modifications on the base plan without changing it. All effective values update instantly; the base plan is untouched.

- Drawdown strategy and all parameters
- Market return profile (flat, step, front-loaded, back-loaded, cyclical crest/trough, seeded noise) with outlook shift and amplitude scaling
- Spending profile (subsistence, lean)
- Personal inflation rate and CPI rate (with fixed-rate presets)
- Longevity (planning end age) per person
- Retirement date per person, with cascade toggles for pension start, RRSP/TFSA/non-reg contribution end dates
- Layoff event with optional taxable severance per person
- CPP and OAS start ages per person
- Unexpected one-time expense
- Lifestyle change — a permanent recurring offset (positive or negative) to lifestyle spending starting from a chosen date
- Pension splitting mode and percentage


### Scenarios

Named snapshots of the current what-if state. Each scenario is saved as a table row with its name and date. Load any scenario to restore its what-if configuration; delete scenarios individually. Scenarios are included in the JSON export and restored on import.

Use the **Freeze** button to lock the current key outcomes, then load a scenario or make changes — the metric tiles show the delta (▲/▼) against the frozen baseline.

### Key Outcomes (Dashboard)

Outcome tiles organized into four groups, all with frozen scenario deltas (▲/▼ vs baseline). Clicking any tile opens a year-by-year detail table.

- **Portfolio** — total invested assets (RRSP/RRIF + TFSA + Non-Reg + HISA) at key milestones:  at start, at Person A's retirement, at Person B's retirement, at peak, at Person A's death, at Person B's death
- **Spending Shortfall** — gaps where spending exceeds all income and configured withdrawals:  years with shortfall, average annual shortfall, peak shortfall year
- **Net Income** — after-tax household income available for spending:  average, minimum, and maximum annual net income over the plan
- **Tax** — combined federal + Ontario income tax:  lifetime total, average effective rate, peak year
- **Government Benefits** — CPP and OAS outcomes:  CPP and OAS total collected, OAS clawback paid, CPP and OAS vs age-65-start comparison

### Charts (Dashboard)

All charts have an independent x-axis selector (calendar year / Person A age / Person B age) and source chips for filtering. Each chart resets independently.

- **Income** — gross or net toggle; household/per-person filter; source chips (employment, DB pension, bridge, CPP, OAS, RRIF, TFSA draws, non-reg draws, other income)
- **Tax Paid** — household/per-person filter
- **Portfolio Balances** — stacked by account type (RRSP/RRIF, TFSA, Non-Reg, HISA); household/per-person filter with account-type chips
- **Annual Cash Flow** — green/red bars showing surplus or deficit each year

### Annual Summary Table

Detailed projection outcomes displayed as expandable column groups (Year, Income, Tax, Portfolio) with optional person colour tinting. Age labels show `(deceased)` past each person's planning end date.

### Optimizers & Simulations (Analysis Tab)

Detailed analysis tools to stress-test your plan under varying market conditions and optimize specific tax and retirement options:

- **Monte Carlo Simulation** — Runs your plan hundreds of times with randomized annual market return sequences. Supports multiple simulation models:
  - *Traditional* (using baseline expected return as the mean with Gaussian, Student's t, or Skewed Normal noise distributions).
  - *Constant CMA Reduction* (reducing expected returns by a fixed safety margin).
  - *Dynamic CMA Reduction* (reducing returns in the early years with a decay factor to model near-term market headwinds).
  - *Simple / Block Bootstrap* (drawing random single years or consecutive multi-year blocks of S&P 500 & bond returns directly from historical data since 1871).
  - *Regime Switching* (two-state Markov chain cycling between expansion/bull and contraction/bear regimes with custom transit probabilities).
- **Historical Sequence Stress Test** — Evaluates your plan against chronological rolling periods from S&P 500 and bond market history (1871–present). Supports annual or monthly start date resolution (simulating ~1,500 monthly paths to capture peak/trough timing). Highlights the worst and best historical periods.
- **Sustainable Spending Sweep** — Evaluates your plan across a range of flat base retirement spending levels using configured plan rates or historical rolling sequences. Identifies the maximum sustainable basic retirement spending at a selected success rate target, highlighting Lean, Average, Chubby, and Fat FIRE benchmarks with monotone cubic interpolation to prevent rate overshoots.
- **Coast FIRE Calculator** — Calculates the exact age and calendar year you can stop making future savings contributions (TFSA, RRSP, and Non-Registered) and let compound interest grow your existing assets to support your retirement spending, evaluated using the full tax and decumulation projection engine under Plan or Historical Rates.
- **CPP / OAS Timing Optimizer** — Sweeps all start combinations (CPP ages 60–70; OAS ages 65–70) to find the household-lifetime-benefit-maximizing start ages for each spouse independently. Accurately models survivor benefit combined caps and OAS clawback thresholds. Allows applying the optimal start ages to the Dashboard with one click.
- **RRSP Meltdown Optimizer** — Sweeps the proactive meltdown gross income ceiling for the *Cover Spending Gap* drawdown strategy to find the level that minimizes lifetime household income taxes (including OAS clawback impact) between retirement and RRIF conversion.

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
- **2026 tax reference year** — brackets and credits are indexed forward by CPI each year in the engine
- **Annual granularity** — the engine walks year-by-year with a monthly inner loop for income pro-ration; account balances compound annually
- **Single household** — two people; no support for blended families or more complex household structures
- **Exploratory strategies** — Fixed Withdrawal and Fixed Percentage are designed for scenario exploration, not as complete decumulation optimizers; they do not automatically reinvest surplus or fill shortfalls

---

## Privacy

No data ever leaves your machine. There are no accounts, no analytics, and no network requests after the initial page load. The production build has zero runtime dependencies on external servers — it is a single static HTML file.

---

## License

Portage is licensed under the [GNU Affero General Public License v3.0](file:///Users/jamesmoser/Projects/portage/LICENSE) (AGPL-3.0). Under this copyleft license, any modifications or deployments of this software as a network service must make their complete source code available under the same terms.

