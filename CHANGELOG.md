# Changelog

All notable changes to Portage are documented here.
Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`

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
