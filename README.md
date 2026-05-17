# Portage — Canadian Retirement Wealth Planner

A private, browser-based retirement planning tool for Canadian couples (Ontario). Built to model complex retirement scenarios with full transparency into the underlying calculations.

## Philosophy

- **Private by design** — all data lives in your browser's localStorage. Nothing is sent to any server.
- **Present-day dollars** — all output is expressed in today's purchasing power, making year-over-year comparisons meaningful.
- **Date-accurate** — calculations use exact calendar dates, not calendar years. Ages entered by the user are converted to dates internally.
- **Portable** — the entire application builds to a single self-contained HTML file (~5MB) with no external dependencies at runtime.

## Features

- **Household setup** — two-person household with independent birth dates, retirement dates, and planning horizons
- **DB Pension** — defined benefit pension modelling with CPI indexing, bridge benefit, CPP integration, and survivor benefit
- **CPP & OAS** — early/deferred start optimization with actuarial adjustment factors and OAS clawback
- **RRSP/RRIF** — contribution planning, RRIF conversion, minimum withdrawals, spousal RRSP
- **TFSA** — balance and contribution tracking per person
- **Non-Registered** — ACB tracking, yield breakdown (eligible dividends, foreign income, interest)
- **Spending phases** — Go-Go / Slow-Go / No-Go / Survivor phases with real growth rates (positive or negative)
- **Additional spending** — recurring or one-time items keyed to the reference person's age
- **Tax engine** — full Ontario + Federal marginal tax, pension income splitting (auto-optimized or manual), age amount, OAS clawback, eligible/non-eligible dividends, capital gains
- **Withdrawal strategy** — configurable order (TFSA first, non-reg first, RRSP first, or optimized)
- **Scenario modelling** — coming soon

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
- Capital gains inclusion rate — modelled at 50% (the proposed 66.67% above $250k was cancelled in January 2025); the two-tier structure is preserved for scenario analysis
- Annual projection granularity — monthly granularity is planned

## Privacy

No data ever leaves your machine. There are no accounts, no analytics, no network requests after the initial page load. The production build has zero runtime dependencies on external servers.
