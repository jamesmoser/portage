# Portage — Canadian Retirement Wealth Planner

A private, browser-based retirement planning tool for Canadian couples (Ontario). Built to model complex retirement scenarios with full transparency into the underlying calculations.

## Philosophy

- **Private by design** — all data lives in your browser's localStorage. Nothing is sent to any server.
- **Present-day dollars** — all output is expressed in today's purchasing power, making year-over-year comparisons meaningful.
- **Date-accurate** — calculations use exact calendar dates, not calendar years. Ages entered by the user are converted to dates internally.
- **Portable** — the entire application builds to a single self-contained HTML file (~5MB) with no external dependencies at runtime.

## Features

### Income Sources
- **DB Pension** — defined benefit pension with CPI indexing (with optional cap), bridge benefit, CPP integration, early reduction factor, survivor benefit, and per-person modelling
- **CPP & OAS** — early/deferred start with full actuarial adjustment factors (CPP: ±0.6%/month before/after 65, +0.7%/month after 65; OAS: +0.6%/month deferral). OAS clawback modelled at 15% above threshold.
- **Employment income** — per-person salary with configurable real growth rate, ending at retirement
- **Other income** — recurring or one-time items with taxable/non-taxable flag, keyed to the reference person's age

### Accounts
- **RRSP/RRIF** — contribution planning with lump-sum or spread timing, RRIF conversion date, CRA minimum withdrawals by age, spousal RRSP, additional withdrawal above minimum, per-account return rate override
- **TFSA** — balance and contribution tracking per person, per-account return rate override
- **Non-Registered** — ACB tracking, annual yield breakdown (eligible dividends, foreign income, interest), capital gains on withdrawal, spousal rollover at death with deferred gain
- **HISA** — joint high-interest savings account with configurable rate and minimum balance target

### Spending
- **Spending phases** — up to 5 phases (e.g. Go-Go / Slow-Go / No-Go / Survivor) with real growth rates; the survivor phase can be linked to first death
- **Additional spending** — recurring or one-time items keyed to the reference person's age

### Tax Engine (Ontario + Federal, 2024 reference year, CPI-indexed forward)
- Full marginal tax on employment, pension, CPP, OAS, RRIF, eligible/non-eligible dividends, foreign income, interest
- Capital gains at 50% inclusion rate (two-tier structure preserved for scenario analysis; proposed 66.67% above $250k was cancelled January 2025)
- Pension income splitting — auto-optimized or manual (0–50% of eligible pension from Person A to Person B)
- Age amount, pension income amount, basic personal amount
- Ontario surtax (20% above $5,315; +36% above $6,802)
- OAS clawback at 15% above threshold

### Withdrawal Strategies
Four strategies control how account withdrawals are orchestrated each year. All strategies respect mandatory RRIF minimums. Draws begin at retirement and are pro-rated in the first retirement year and year of death.

- **None** — no proactive draws; accounts grow until gap-fill logic or RRIF minimums force withdrawals
- **Spend Gap** — withdraws from accounts in a configured order (TFSA first, RRSP first, Non-Reg first, or optimized) to cover any spending shortfall after income
- **Fixed Withdrawal** — explicit per-person annual dollar amounts from each account type (RRSP/RRIF, TFSA, Non-Reg, HISA). After first death the higher of the two per-person amounts continues for the survivor. Non-reg draws are pre-tax with capital gains flowing through the tax engine.
- **Fixed Percentage** — annual draw as a percentage of balance with a floor, per account type. Applies to each person's account independently. Same pre-tax treatment for non-reg and HISA. No automatic gap-filling — any shortfall shows as a deficit in the Cash Flow chart.

### What-If Analysis (Dashboard)
Overlay modifications on the base plan without changing it:
- Return rate offset, inflation rate, CPI rate
- Longevity per person
- CPP and OAS start ages per person
- Retirement date per person (with cascade toggles for pension, RRSP, TFSA, non-reg contribution end dates)
- Layoff event with severance per person
- Unexpected one-time expense
- Withdrawal order
- Pension split mode
- Drawdown strategy and parameters
- Market return profile (step, front-loaded, back-loaded, cyclical crest/trough, noise) with outlook shift and beta scaling

### Scenarios
Named what-if snapshots — save the current what-if state, switch between scenarios, compare outcomes. Key metrics freeze on save for delta comparison.

### Key Outcomes (Dashboard)
Six headline metrics with frozen scenario deltas:
- Portfolio at death (last survivor)
- Total lifetime tax paid
- Average effective tax rate
- Peak portfolio value
- Years with spending shortfall
- Total shortfall amount

Clicking any metric opens a year-by-year detail table.

### Charts (Dashboard)
All charts have an x-axis selector (calendar year, Person A age, Person B age) and source chips for filtering. Each chart is independent.

- **Income** — gross or net toggle, household/per-person filter, source chips (pension, CPP, OAS, RRIF, TFSA, non-reg, employment, other)
- **Tax Paid** — household/per-person filter
- **Portfolio Balances** — stacked by account type (RRSP/RRIF, TFSA, Non-Reg, HISA), household/per-person filter
- **Annual Cash Flow** — green/red bars showing surplus or deficit each year

### Annual Summary Table
Expandable column groups (Year, Income, Tax, Portfolio) with person colour tinting toggle. Age labels show `(deceased)` past each person's planning end date.

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

## Data Management

- **Auto-save** — changes are saved to localStorage automatically
- **Export** — hamburger menu → Export JSON, saves a full snapshot to your Downloads folder
- **Import** — hamburger menu → Import JSON, restores a previously exported snapshot
- **Per-card reset** — each data entry card has a reset button (↺) that restores that card's fields to defaults without affecting the rest of your plan

## Tech Stack

- React 19 + TypeScript
- Vite 6 + vite-plugin-singlefile
- Zustand v5 (state management)
- Tailwind CSS v3
- Plotly.js (charts, loaded async)

## Scope & Limitations

- Ontario only — provincial tax calculations are hardcoded for Ontario
- 2024 tax reference year — brackets and credits are indexed forward by CPI each year in the engine
- Annual projection granularity — the engine walks year-by-year with a monthly inner loop for income pro-ration; account balances compound annually
- Withdrawal strategies are exploratory — Fixed Withdrawal and Fixed Percentage are designed for scenario exploration, not as a complete decumulation optimizer. Surplus income is not reinvested; draws fire regardless of need. A full optimizer with account ordering and surplus reinvestment is a future concern.

## Privacy

No data ever leaves your machine. There are no accounts, no analytics, no network requests after the initial page load. The production build has zero runtime dependencies on external servers.
