# Changelog

All notable changes to Portage are documented here.
Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`

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
- `CLAUDE.md`: added version bump workflow

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
