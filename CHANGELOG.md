# Changelog

All notable changes to Portage are documented here.
Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`

---

## [0.11.0] — 2026-06-21

### Added
- **Historical Return Profile Override** — Added a "Historical" market profile option on the dashboard with 10% asset mix increments, 8 historical eras/starting points, description panels, and era-average overflow fill.
- **Retirement Age Sweep Analyzer** — Added the retirement age sweep simulator to analyze the success of the plan across a range of retirement ages.

## [0.10.1] — 2026-06-21

### Added
- **E2E Testing & Demo Plan Integration** — Added E2E integration tests based on the Jack & Dianne demonstration plan.
- **Drawdown Strategies Testing** — Added unit test coverage for Bengen, Guyton-Klinger, and Fixed Percentage drawdown strategies.

### Fixed
- **Local Data Leaks & Pathing** — Replaced absolute local paths with relative links in documentation and cleaned up variable names in `AnalysisTab.tsx`.

## [0.10.0] — 2026-06-21

### Added
- **Plan Viability Analyzer** — Added a required return rate sweep chart and side-by-side historical Asset Mix suggestions table.

### Changed
- **Meltdown Optimizer UI** — Repositioned floor and OAS clawback annotations, and added an optimal minimum dot marker.
- **Spending Sweep UI** — Restyled benchmarks as red dots with bold labels, hid built-in Plotly legends, added a clean custom HTML legend, and extended the Y-axis to 110% headroom to prevent label clipping.
- **Spaghetti Plot UI** — Highlighted the Final Portfolio Balance column in the details table in amber-50 to match the Monte Carlo P10 column, and updated the best-case line to solid grey with thickness 3.
- **Coast FIRE Calculator UI** — Converted the metric selector to a segmented toggle next to the title, standardized status boxes to always use the amber theme, and added a custom HTML legend.

## [0.9.0] — 2026-06-20

### Added
- **Life Insurance Needs Analyser** — Added a simulator that runs the full Canadian tax and decumulation projection engine under various longevity scenarios to determine life insurance coverage requirements.

---

## [0.8.0] — 2026-06-20

### Added
- **Coast FIRE Calculator** — Added a backwards-solving simulator that runs the full Canadian tax and decumulation projection engine to find the exact age/year you can stop saving and let compound growth cover retirement retirement spending under Plan or Historical Rates.
- **Sustainable Spending Rate Simulation** — Added a Rate Simulation selector (Plan vs Historical Rates) and Plan Rates sweep calculation to the Sustainable Spending Sweep card.

### Changed
- **Analysis Tab UI Standardizations** — Standardized layout spacing, headers, buttons ("Run" / "Re-Run"), loading panels, placeholders, and charts across all Analysis tab cards.
- **Color Palettes** — Standardized color palettes for charts and benchmarks across the Analysis cards to match the global design system.
- **Modals Reference Updates** — Updated info modals on all Analysis tab cards to clearly explain which parameters are overridden and which are preserved during sweeps/simulations.

## [0.7.1] — 2026-06-18

### Added
- **Monotone Cubic Smoothing** — Integrated monotone cubic interpolation for the historical spending sweep success rate curve, preventing overshoot and keeping rates bounded.
- **Retirement Spending Benchmarks Highlight** — Added color-coded open circles on the success rate chart for in-range benchmarks (Lean FIRE, Avg. Household, Chubby FIRE, and Fat FIRE) with matching solid dot indicators next to their titles in the sidebar.

### Changed
- **Updated Benchmark Descriptions** — Set Lean FIRE description to "Basic spending, Canadian average" and Avg. Household description to "Household spending, Canadian average".

---

## [0.7.0] — 2026-06-18

### Added
- **Monte Carlo Enhancements** — Expanded the simulation engine to support multiple models: Traditional (Gaussian, Student's t, and Skewed Normal distributions), Constant CMA Reduction, Dynamic CMA Reduction (with linear decay), Simple Bootstrap, and Block Bootstrap (preserving business cycles).
- **Markov Regime-Switching** — Added a two-state Markov simulation cycling between Expansion (Bull) and Contraction (Bear) regimes, with customizable parameters (expected return, volatility, and average duration) and steady-state starting initialization.
- **Historical Sequence Stress Test** — Added a rolling sequence analyzer testing the plan against S&P 500 and bond market history from 1871 onwards.
- **Dynamic Start Year Disabling** — Greyed out and disabled starting years in the historical dropdown that do not provide enough remaining data to complete the simulation's duration, automatically adjusting the selected value if the horizon changes.

---

## [0.6.7] — 2026-06-06

### Changed
- **Unique Download Filenames** — Updated exported JSON and markdown AI context filenames to include a unique compact timestamp (`-YYYY-MM-DD-HHmmss`) to prevent local download collisions and improve file organization.

---

## [0.6.6] — 2026-06-06

### Changed
- **Analysis Tab Aesthetics** — Wrapped all simulation and optimizer cards in standard `CardGrid` elements and updated the root layout container to `space-y-4` to ensure section divider gaps match the Dashboard tab's layout spacing.
- **Optimizer Re-ordering** — Swapped the order of the optimizer cards so that the CPP / OAS Timing Optimizer is positioned before the RRSP Meltdown Optimizer.
- **Control Button Alignment** — Aligned the primary "Run" and "Re-run" buttons to the left of the input/configuration fields on all Analysis tab cards.

---

## [0.6.5] — 2026-06-06

### Fixed
- **Survivor Spending What-Ifs** — The survivor spending phase start age (when `linkedToFirstDeath` is enabled) now dynamically resolves based on the effective longevity settings, ensuring that what-if overrides to planning end ages automatically update the start of survivor spending in the projection.

---

## [0.6.4] — 2026-06-06

### Fixed
- **CPP/OAS Start Date Clamping** — Added store-level validation that clamps CPP and OAS start dates to their eligible age ranges (CPP: `[60, 70]`, OAS: `[65, 70]`) automatically when birthdays or dates are modified.
- **Optimizer Crash** — Fixed a crash in the government benefits optimizer when the user's configured base age was outside the swept range.

---

## [0.6.3] — 2026-06-06

### Added
- **Foreign Tax Credit** — Added a 15% non-refundable Foreign Tax Credit (FTC) to the tax engine to credit back withholding tax paid at source on foreign equities (e.g. US/intl dividends) and prevent double taxation.

### Fixed
- **OAS Clawback Deduction** — Deduct the OAS clawback recovery tax from Net Income to calculate Taxable Income before applying Federal and Ontario tax brackets, correcting a bug that over-taxed users on the OAS amount they repaid.

### Changed
- Added a performance warning breadcrumb to the pension splitting optimizer function noting the linear sweep bottleneck for future optimization.

---

## [0.6.2] — 2026-06-03

### Fixed
- Fixed RRIF minimum withdrawal factor calculations for ages under 71 to correctly use the formula `1 / (90 - age)` instead of hardcoded table values.

---

## [0.6.1] — 2026-06-02

### Fixed
- Charts in Spending by Year (Settings), Monte Carlo, RRSP Meltdown Optimizer, and CPP/OAS Timing Optimizer cards were overflowing their card boundaries due to `height` being set inside the Plotly layout object instead of on the container element; moved to `style={{ height }}` on all affected charts

---

## [0.6.0] — 2026-06-02

### Added
- **CPP/OAS Timing Optimizer** (Analysis tab) — sweeps CPP start ages 60–70 and OAS start ages 65–70 independently for each person; maximizes household lifetime CPP (including survivor benefit) and net OAS (gross minus clawback); line+marker charts with Optimal and Configured markers; "Apply to Dashboard" button sets all four start ages as what-if overrides
- **Lifestyle Spending modifier** (Base Plan Modifications) — new what-if below Market with three modes: Base (no change), Subsistence (replaces all spending phases with a flat constant and clears recurring additional spending), Lean (subtracts a fixed amount from each phase); preview line chart matching the rate profile style with Max/Avg/Min stats; flows through the full projection and Monte Carlo automatically

### Fixed
- Pension split optimizer now sweeps both A→B and B→A directions and returns the globally optimal direction; previously only swept A→B
- Pension split direction and amount now visible in the annual summary table (tax section, expanded view only) in compact `A→B $X` format
- Monte Carlo best case (pMax) line removed — it compressed the useful P10–P90 band; worst case line retained as it shows portfolio depletion point
- Monte Carlo P10 and P25 hover tooltips were silently skipped; now show correct percentile labels
- Monte Carlo P90/P75 hover label backgrounds were transparent (unreadable); fixed by assigning visible trace colours
- Monte Carlo P10 milestone column highlighted amber to draw focus to the conservative scenario

### Changed
- Base Plan Modifications info modal updated with Lifestyle Spending section; stale Manual Pension Splitting entry removed

---

## [0.5.0] — 2026-06-02

### Added
- **Analysis tab** — new left-side tab alongside Dashboard; houses tools that loop the projection engine for analysis and optimisation rather than a single deterministic run
- **RRSP Meltdown Optimizer** — sweeps the Cover Spending Gap `grossIncomeCeiling` parameter independently for each person to find the lifetime-tax-minimising ceiling. Dynamic extension continues past the OAS full-clawback income until the curve turns up (5 consecutive rising points) or a hard cap of 3× full-clawback income is reached. Annotated reference lines for income floor, OAS clawback start, and OAS fully clawed back. "Apply to Dashboard" button writes the optimal ceilings to the drawdown strategy what-if. All thresholds (OAS clawback, federal brackets) sourced from Tax Settings — no hardcoded values.

### Changed
- Monte Carlo simulation moved from Dashboard to the Analysis tab
- Tab components are now kept mounted when navigating between tabs (hidden with `display:none` rather than unmounted), so Monte Carlo and optimizer results survive tab switches

---

## [0.4.0] — 2026-06-02

### Added
- **Home Sale / Downsizing** one-shot event in the Dashboard modifications panel — injects net sale proceeds directly into HISA, Person A Non-Reg, or Person B Non-Reg in the year of the sale. Non-taxable (principal residence exemption); non-reg deposits increase ACB equally so no embedded capital gain is created on entry.
- **Monte Carlo simulation** in the Dashboard — runs the plan hundreds of times with normally distributed return noise around the configured rate profile. Shows a fan chart (P10–P90 bands, best/worst case envelope, deterministic profile line in red), four headline stats (probability of success, depletion rate, earliest depletion age, median depletion age), and a milestone percentile table (P10/P25/P50/P75/P90 at Today, each retirement, each person's death, and end of plan).

---

## [0.3.1] — 2026-06-01

### Changed
- Renamed "Assumptions" tab to "Settings"

### Added
- Reset buttons on Inflation and Portfolio Return Rates cards

---

## [0.3.0] — 2026-06-01

### Added
- **Market Shock rate profile** — flat-rate baseline with a one-time crash modelled as a damped oscillator. Sliders for shock year, magnitude (0 to −50%), recovery period, and damping (overdamped = pure exponential decay; underdamped = ringing oscillation around baseline).
- **Duty Cycle control for Cyclical profiles** — adjusts the fraction of each cycle spent above the midpoint return (5%–95%). Values above 50% compress the trough into a narrow dip; values below 50% compress the crest. Approaches a square wave at the extremes.

### Fixed
- Info modals now have a scrollable content area with a viewport-aware max height, preventing them from extending off screen on smaller displays.

---

## [0.2.0] — 2026-05-31

### Added
- Spousal RRSP displayed as a dedicated card below the primary RRSP/RRIF section; contributor receives the tax deduction, annuitant holds the balance; 3-year attribution rule noted in info modal; surplus routing stays in the primary account only
- 13 new engine smoke tests: RRIF minimum trajectory, OAS clawback amount, DB pension bridge cutoff, pension split tax reduction, and survivor asset rollover exact amounts

### Fixed
- CPP survivor benefit: deceased's deferral factor no longer transferred to the survivor; combined maximum cap now correctly scales with the survivor's own deferral factor
- RRSP contribution tax deduction: contributions now reduce net income before tax is calculated (CRA T1 line 20800); previously the deduction was missing entirely
- Spousal RRSP balance seeding: A's spousal balance was incorrectly pooled with A's own RRSP instead of B's

### Changed
- CPP/OAS info modal: corrected CPP2 history, OAS clawback note, and survivor benefit explanation

---

## [0.1.2] — 2026-05-30

### Changed
- Spending by Year chart (Assumptions tab) now stacked by category: Lifestyle (red), Contributions (blue), Unexpected Expense (amber), with legend
- Survivor phase toggle renamed to "Survivor Phase — starts at [Name]'s death" for clarity
- Survivor phase: age input removed (never relevant); phase name is non-editable; spending/growth fields grey out when toggle is off; column alignment maintained with other phases
- Survivor phase engine: when toggle is off, phase is fully excluded from simulation — preceding phase runs to end of plan
- Spend-gap info panel updated: clarifies that base plan contributions are deducted from income before surplus is calculated for routing

---

## [0.1.1] — 2026-05-30

### Fixed
- HISA withdrawals now appear in the income chart (were tracked in the engine but missing from chart and source chips)
- Spend-gap info panel updated to clarify that base plan contributions (RRSP, TFSA, Non-Reg) are deducted before surplus routing

### Changed
- Version is now auto-imported from `package.json`; no manual sync needed in `App.tsx`

### Docs
- `CHANGELOG.md` created
- `README.md`: added Bengen Rule and Guyton-Klinger to drawdown strategies, Lifestyle Change and flat rate profile to What-If section, rewrote Key Outcomes section to reflect current 4-group structure
- `PROJECT_INSTRUCTIONS.md`: added version bump workflow

---

## [0.1.0] — 2026-05-29

### Added
- Initial release
- Full household retirement projection engine (Ontario, 2026 tax year)
- Dashboard with What-If panel, Key Outcomes, Income/Tax/Portfolio charts, Annual Summary table
- Input tabs: Household, Assumptions, DB Pension, CPP/OAS, Employment, RRSP, TFSA, Non-Registered, Cash, Other Income, Spending, Tax Settings
- Scenario save/load/reset system
- Single-file HTML build (no server required)
- JSON export/import for plan portability
