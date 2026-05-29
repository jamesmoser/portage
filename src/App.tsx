import { useState, useRef, useEffect } from 'react'
import { useStore } from './store/useStore'
import type { AppState } from './engine/types'
import portageIcon from './assets/portage-icon.png'

import { DashboardTab }   from './tabs/DashboardTab'
import { AssumptionsTab } from './tabs/AssumptionsTab'
import { IncomeTab }      from './tabs/IncomeTab'
import { InvestmentsTab } from './tabs/InvestmentsTab'

const APP_VERSION = '0.1.0'

// ─── AI Prompt Generator ──────────────────────────────────────────────────────

function generateAIPrompt(): string {
  const s = useStore.getState() as AppState
  const aName  = s.personA.name || 'Person A'
  const bName  = s.personB.name || 'Person B'
  const refName = s.ageReferencePerson === 'personB' ? bName : aName
  const today  = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  const currency = (v: number) => `$${Math.round(v).toLocaleString('en-CA')}`
  const pct    = (v: number) => `${v}%`

  const lines: string[] = []
  const h  = (...s: string[]) => lines.push(...s)
  const br = () => lines.push('')

  h('# Portage — Canadian Retirement Plan Briefing', `Generated: ${today}`)
  br()
  h('All monetary values are in today\'s dollars. This document contains the complete base plan inputs for a Canadian retirement projection (Ontario). The model inflates nominal returns forward, deflates all outputs to today\'s purchasing power using the personal inflation rate, and calculates combined federal + Ontario income tax annually including OAS clawback.')
  br()
  h('---')
  br()

  // ── Household ───────────────────────────────────────────────────────────────
  h('## Household')
  br()
  h(`| | ${aName} | ${bName} |`,
    `|---|---|---|`,
    `| Birth Date | ${s.personA.birthDate} | ${s.personB.birthDate} |`,
    `| Retirement Date | ${s.personA.retirementDate} | ${s.personB.retirementDate} |`,
    `| Planning Horizon | Age ${s.personA.planningEndAge} | Age ${s.personB.planningEndAge} |`)
  br()
  h(`Age reference person (for spending phase triggers): **${refName}**`, 'Province: Ontario')
  br()

  // ── Employment ──────────────────────────────────────────────────────────────
  h('## Employment Income')
  br()
  h(`| Person | Annual | Real Growth |`,
    `|---|---|---|`,
    `| ${aName} | ${currency(s.employmentA.annualAmount)} | ${pct(s.employmentA.growthRatePct)}/yr |`,
    `| ${bName} | ${currency(s.employmentB.annualAmount)} | ${pct(s.employmentB.growthRatePct)}/yr |`)
  br()
  h('Income is pro-rated to the month of retirement in the retirement year.')
  br()

  // ── DB Pension ──────────────────────────────────────────────────────────────
  h('## Defined Benefit Pension')
  br()
  const pensions = [
    { name: aName, p: s.dbPensionA },
    { name: bName, p: s.dbPensionB },
  ].filter(x => x.p.enabled)

  if (pensions.length === 0) {
    h('Neither person has a DB pension.')
  } else {
    for (const { name, p } of pensions) {
      h(`**${name}**${p.planName ? ` — ${p.planName}` : ''}`)
      h(`- Benefit: ${currency(p.annualAmount)}/yr starting ${p.startDate}`)
      const indexDesc = p.cpiIndexed
        ? (p.cpiIndexingCapEnabled ? `CPI-indexed (cap ${p.cpiIndexingCap}%)` : 'CPI-indexed')
        : `Fixed-indexed at ${p.indexingRatePct}%/yr`
      h(`- Indexing: ${indexDesc}`)
      if (p.bridgeBenefitAmount > 0) {
        h(`- Bridge benefit: ${currency(p.bridgeBenefitAmount)}/yr until ${p.bridgeBenefitEndDate}`)
      }
      h(`- Survivor benefit: ${p.survivorBenefitPct * 100}%`)
      br()
    }
  }

  const noPension = [
    { name: aName, p: s.dbPensionA },
    { name: bName, p: s.dbPensionB },
  ].filter(x => !x.p.enabled)
  if (noPension.length > 0 && pensions.length > 0) {
    h(`${noPension.map(x => x.name).join(' and ')} ${noPension.length === 1 ? 'has' : 'have'} no DB pension.`)
    br()
  }

  // ── CPP ─────────────────────────────────────────────────────────────────────
  h('## Canada Pension Plan (CPP)')
  br()
  h(`| Person | Est. Monthly at 65 | Start Date |`,
    `|---|---|---|`,
    `| ${aName} | $${s.cppA.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${s.cppA.startDate} |`,
    `| ${bName} | $${s.cppB.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${s.cppB.startDate} |`)
  br()
  h('Early start (before 65): −0.6%/month. Deferred start (after 65): +0.7%/month, max at 70. Survivor benefit: 60% of deceased spouse\'s entitlement.')
  br()

  // ── OAS ─────────────────────────────────────────────────────────────────────
  h('## Old Age Security (OAS)')
  br()
  h(`| Person | Est. Monthly at 65 | Start Date |`,
    `|---|---|---|`,
    `| ${aName} | $${s.oasA.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${s.oasA.startDate} |`,
    `| ${bName} | $${s.oasB.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${s.oasB.startDate} |`)
  br()
  h('Deferral past 65: +0.6%/month (max +36% at 70). Clawback: 15% of net income above ~$90,997 (2024, CPI-indexed).')
  br()

  // ── Investments ─────────────────────────────────────────────────────────────
  h('## Investment Accounts')
  br()
  h('### RRSP / RRIF')
  br()
  h(`| | ${aName} | ${bName} |`,
    `|---|---|---|`,
    `| Balance | ${currency(s.rrspA.balance)} | ${currency(s.rrspB.balance)} |`,
    ...(s.rrspA.spousalBalance > 0 || s.rrspB.spousalBalance > 0
      ? [`| Spousal RRSP | ${currency(s.rrspA.spousalBalance)} | ${currency(s.rrspB.spousalBalance)} |`]
      : []),
    `| Annual Contribution | ${currency(s.rrspA.annualContribution)} | ${currency(s.rrspB.annualContribution)} |`,
    `| Contribution End | ${s.rrspA.contributionEndDate} | ${s.rrspB.contributionEndDate} |`,
    `| RRIF Conversion | ${s.rrspA.rrifConversionDate} | ${s.rrspB.rrifConversionDate} |`)
  br()
  h('### TFSA')
  br()
  h(`| | ${aName} | ${bName} |`,
    `|---|---|---|`,
    `| Balance | ${currency(s.tfsaA.balance)} | ${currency(s.tfsaB.balance)} |`,
    `| Annual Contribution | ${currency(s.tfsaA.annualContribution)} | ${currency(s.tfsaB.annualContribution)} |`)
  br()
  h('### Non-Registered')
  br()
  h(`| | ${aName} | ${bName} |`,
    `|---|---|---|`,
    `| Balance | ${currency(s.nonRegA.balance)} | ${currency(s.nonRegB.balance)} |`,
    `| Adjusted Cost Base | ${currency(s.nonRegA.acb)} | ${currency(s.nonRegB.acb)} |`,
    `| Annual Contribution | ${currency(s.nonRegA.annualContribution)} | ${currency(s.nonRegB.annualContribution)} |`,
    ...(s.nonRegA.eligibleDivYieldPct > 0 || s.nonRegB.eligibleDivYieldPct > 0
      ? [`| Eligible Div Yield | ${pct(s.nonRegA.eligibleDivYieldPct)} | ${pct(s.nonRegB.eligibleDivYieldPct)} |`]
      : []),
    ...(s.nonRegA.foreignIncomeYieldPct > 0 || s.nonRegB.foreignIncomeYieldPct > 0
      ? [`| Foreign Income Yield | ${pct(s.nonRegA.foreignIncomeYieldPct)} | ${pct(s.nonRegB.foreignIncomeYieldPct)} |`]
      : []))
  br()
  h('### HISA / Cash (Joint)')
  br()
  h(`- Balance: ${currency(s.cash.hisaBalance)}`,
    `- Interest rate: ${pct(s.cash.hisaRatePct)}`,
    `- Minimum floor: ${currency(s.cash.hisaMinBalance)}`)
  br()

  // ── Other Income ────────────────────────────────────────────────────────────
  h('## Other Income')
  br()
  if (s.otherIncome.otherItems.length === 0) {
    h('None.')
  } else {
    h(`| Label | Annual | Attributed To | Taxable | Growth | Start | End |`,
      `|---|---|---|---|---|---|---|`)
    for (const item of s.otherIncome.otherItems) {
      const attr = item.attributedTo === 'personA' ? aName : item.attributedTo === 'personB' ? bName : 'Joint'
      h(`| ${item.label} | ${currency(item.annualAmount)} | ${attr} | ${item.taxable ? 'Yes' : 'No'} | ${pct(item.growthRatePct)}/yr | ${item.startDate} | ${item.endDate} |`)
    }
  }
  br()

  // ── Spending ─────────────────────────────────────────────────────────────────
  h('## Spending Plan')
  br()
  h(`### Phases (${refName}'s age as reference)`)
  br()
  h(`| Phase | Start Age | Annual | Real Growth |`,
    `|---|---|---|---|`)
  for (const phase of s.spendingPhases) {
    const startLabel = phase.linkedToFirstDeath ? 'Linked to first death' : String(phase.startAge)
    h(`| ${phase.label} | ${startLabel} | ${currency(phase.annualAmount)} | ${phase.growthRatePct >= 0 ? '+' : ''}${pct(phase.growthRatePct)}/yr |`)
  }
  br()

  if (s.additionalSpending.length > 0) {
    h('### Additional Spending')
    br()
    h(`| Label | Amount | ${refName}'s Age | Type |`,
      `|---|---|---|---|`)
    for (const item of s.additionalSpending) {
      h(`| ${item.label} | ${currency(item.amount)} | ${item.startAge} | ${item.recurring ? 'Recurring' : 'One-time'} |`)
    }
    br()
  }

  // ── Assumptions ─────────────────────────────────────────────────────────────
  h('## Key Assumptions')
  br()
  h(`- **Personal inflation**: ${pct(s.personalInflationRatePct)} — deflates all outputs to today's purchasing power`,
    `- **CPI**: ${pct(s.cpiRatePct)} — indexes DB pension, CPP, OAS, and tax brackets forward`,
    `- **Portfolio returns (nominal)**: ${pct(s.returnRates.upTo55)} (to 55) / ${pct(s.returnRates.from55to65)} (55–65) / ${pct(s.returnRates.from65to70)} (65–70) / ${pct(s.returnRates.from70plus)} (70+)`,
    `- **Tax**: Ontario 2024 combined federal + provincial rates, CPI-indexed forward`,
    `- **Capital gains inclusion**: ${pct(s.taxSettings.capitalGainsInclusionRate * 100)} on all gains`,
    `- **Pension splitting**: ${s.withdrawalStrategy.pensionSplitMode === 'auto' ? 'Auto-optimized each year' : `Manual at ${s.withdrawalStrategy.pensionSplitPct}%`}`)
  br()

  // ── Analysis Request ─────────────────────────────────────────────────────────
  h('---')
  br()
  h('## Analysis Request')
  br()
  h('You are reviewing a Canadian retirement plan for an Ontario household. Please provide a thorough analysis covering:')
  br()
  h('1. **Sustainability** — Does the plan appear sustainable to both planning horizons given the spending phases and income sources?',
    `2. **Key risks** — Longevity (${bName} to age ${s.personB.planningEndAge}), sequence of returns, inflation mismatch, RRSP/RRIF concentration, OAS clawback exposure`,
    '3. **Government benefits timing** — Are the CPP and OAS start ages well-chosen given the planning horizons and spending gap between retirement and benefit start?',
    '4. **RRSP/RRIF management** — What are the RRIF forced withdrawal implications at conversion? Is proactive RRSP meltdown advisable before conversion?',
    '5. **Tax efficiency** — Pension splitting opportunities, capital gains management, account withdrawal sequencing, bracket management',
    '6. **Spending plan critique** — Are the phase amounts and transitions realistic? Is the survivor phase adequately funded?',
    '7. **Priority scenarios to stress-test** — Which combinations of variables represent the most important risks to model?')
  br()

  return lines.join('\n')
}

function downloadAIPrompt() {
  const md   = generateAIPrompt()
  const blob = new Blob([md], { type: 'text/markdown' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `portage-ai-prompt-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg leading-none">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Help — How to Use Portage" onClose={onClose}>
      <div className="space-y-4 text-sm text-slate-700">
        <div>
          <p className="font-semibold text-slate-800 mb-1">Overview</p>
          <p>Portage is a Canadian retirement planning tool for Ontario households. It simulates your financial lifecycle from today through the end of your planning horizon, calculating income, tax, account balances, and cash flow in today's dollars each year.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Workflow</p>
          <ol className="list-decimal list-outside ml-4 space-y-1.5">
            <li><strong>Base Plan (right tabs)</strong> — Enter your household data across the Assumptions, Income, and Investments tabs. This is the foundation of the simulation.</li>
            <li><strong>Dashboard</strong> — Review the Key Outcomes and charts. With no drawdown strategy selected, you see your income and portfolio growth as-is.</li>
            <li><strong>Drawdown Strategy</strong> — Configure how accounts are drawn down in retirement. Cover Spending Gap is the most comprehensive option.</li>
            <li><strong>Base Plan Modifications</strong> — Adjust individual parameters (retirement age, CPP/OAS timing, inflation, longevity) to see their impact on outcomes.</li>
            <li><strong>Scenarios</strong> — Save named configurations of the drawdown strategy and modifications. Use Freeze to compare two scenarios side-by-side on the Key Outcomes tiles.</li>
          </ol>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Data &amp; Privacy</p>
          <p>All data is stored locally in your browser (localStorage). Nothing is sent to any server. Use <strong>Export JSON</strong> to save a backup file and <strong>Import JSON</strong> to restore it. Saved scenarios are included in the export.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Today's Dollars</p>
          <p>All output values are expressed in today's purchasing power — future nominal amounts are deflated by the personal inflation rate. This makes year-over-year comparisons meaningful and keeps everything comparable to your current budget.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Info Modals</p>
          <p>Every card throughout the tool has an <strong>ⓘ</strong> button in its header. Click it for detailed guidance on what each input means and how it affects the simulation.</p>
        </div>
      </div>
    </Modal>
  )
}

function VersionModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="About Portage" onClose={onClose}>
      <div className="space-y-4 text-sm text-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <img src={portageIcon} alt="Portage" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">Portage</p>
            <p className="text-slate-500">Canadian Retirement Wealth Planner</p>
            <p className="text-xs text-slate-400 mt-0.5">Version {APP_VERSION}</p>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Province</span>
            <span className="font-medium">Ontario</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tax year</span>
            <span className="font-medium">2024 (CPI-indexed forward)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Capital gains inclusion</span>
            <span className="font-medium">50%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">CPP deferral</span>
            <span className="font-medium">−0.6%/mo before 65, +0.7%/mo after</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">OAS deferral</span>
            <span className="font-medium">+0.6%/mo after 65 (max +36%)</span>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-3 text-xs text-slate-400">
          <p>Built with React, TypeScript, Vite, Tailwind CSS, and Plotly.js. All computation runs locally in your browser — no data leaves your machine.</p>
        </div>
      </div>
    </Modal>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const DASHBOARD_TABS = [
  { id: 'dashboard', label: 'Dashboard', Component: DashboardTab },
]

const INPUT_TABS = [
  { id: 'assumptions', label: 'Assumptions', Component: AssumptionsTab },
  { id: 'income',      label: 'Income',      Component: IncomeTab      },
  { id: 'investments', label: 'Investments', Component: InvestmentsTab },
]

const ALL_TABS = [...DASHBOARD_TABS, ...INPUT_TABS]

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { exportJSON, importJSON, resetToDefaults, lastSaved } = useStore()
  const fileRef  = useRef<HTMLInputElement>(null)
  const menuRef  = useRef<HTMLDivElement>(null)
  const [activeTab,    setActiveTab]    = useState('dashboard')
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [helpOpen,     setHelpOpen]     = useState(false)
  const [versionOpen,  setVersionOpen]  = useState(false)

  const ActiveComponent = ALL_TABS.find(t => t.id === activeTab)?.Component ?? (() => null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  const menuItemClass = 'flex items-center w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors gap-3'
  const menuItemDangerClass = 'flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 transition-colors gap-3'
  const menuIcon = 'w-[18px] h-[18px] shrink-0'
  const iconColor = '#7B1515'

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Modals ── */}
      {helpOpen    && <HelpModal    onClose={() => setHelpOpen(false)} />}
      {versionOpen && <VersionModal onClose={() => setVersionOpen(false)} />}

      {/* ── Header ── */}
      <header className="px-5 py-3 flex items-center justify-between shrink-0" style={{ backgroundColor: '#7B1515' }}>
        <div className="flex items-center gap-3">
          <img src={portageIcon} alt="Portage" className="h-[50px] w-[50px] rounded-full" />
          <div>
            <h1 className="font-display text-[23px] font-bold text-white tracking-tight">Portage</h1>
            <p className="text-[11px] text-red-200 mt-0.5">Canadian Retirement Wealth Planner</p>
          </div>
        </div>

        {/* Burger menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            className={`w-10 h-10 flex flex-col justify-center items-center gap-[5px] rounded-xl transition-colors
              ${menuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${menuOpen ? 'w-4' : 'w-5'}`} />
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${menuOpen ? 'w-5' : 'w-5'}`} />
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${menuOpen ? 'w-4' : 'w-5'}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">

              {/* File */}
              <div className="pt-2">
                <p className="px-4 pt-2 pb-1 text-[11px] font-bold" style={{ color: iconColor }}>File</p>
                <button className={menuItemClass} onClick={() => { exportJSON(); closeMenu() }}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Export JSON
                </button>
                <label className={`${menuItemClass} cursor-pointer`}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Import JSON
                  <input ref={fileRef} type="file" accept=".json" className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]
                      if (f) await importJSON(f)
                      if (fileRef.current) fileRef.current.value = ''
                      closeMenu()
                    }} />
                </label>
              </div>

              <div className="my-2 border-t border-slate-100" />

              {/* Tools */}
              <div>
                <p className="px-4 pt-1 pb-1 text-[11px] font-bold" style={{ color: iconColor }}>Tools</p>
                <button className={menuItemClass} onClick={() => { downloadAIPrompt(); closeMenu() }}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                  Generate AI Prompt
                </button>
              </div>

              <div className="my-2 border-t border-slate-100" />

              {/* About */}
              <div>
                <p className="px-4 pt-1 pb-1 text-[11px] font-bold" style={{ color: iconColor }}>About</p>
                <button className={menuItemClass} onClick={() => { setHelpOpen(true); closeMenu() }}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  Help
                </button>
                <button className={menuItemClass} onClick={() => { setVersionOpen(true); closeMenu() }}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  About Portage
                </button>
              </div>

              <div className="my-2 border-t border-slate-100" />

              {/* Danger */}
              <div className="pb-2">
                <button className={menuItemDangerClass}
                  style={{ color: iconColor }}
                  onClick={() => {
                    if (confirm('Reset all data to defaults? This cannot be undone.')) {
                      resetToDefaults()
                      closeMenu()
                    }
                  }}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  Reset to Defaults
                </button>
              </div>

              {/* Auto-saved timestamp */}
              {lastSaved && (
                <div className="border-t border-slate-100 px-4 py-2.5">
                  <p className="text-[11px] text-slate-400">
                    Auto-saved {lastSaved.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Tab strip ── */}
      <nav className="px-5 shrink-0" style={{ backgroundColor: '#6B1010' }}>
        <div className="flex items-end justify-between pt-2.5 overflow-x-auto scrollbar-hide">
          {/* Dashboard — left */}
          <div className="flex items-end gap-0.5">
            {DASHBOARD_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-32 py-2 text-sm font-medium text-center whitespace-nowrap rounded-t-lg transition-all duration-100
                  ${activeTab === t.id
                    ? 'text-slate-900 shadow-sm'
                    : 'text-red-200 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === t.id ? { backgroundColor: '#f2f3f5' } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Base plan inputs — right */}
          <div className="flex items-end gap-0.5">
            <span className="self-center pr-2 text-sm font-medium text-red-300 whitespace-nowrap">
              Base Plan
            </span>
            <div className="self-stretch w-px bg-white/20 mb-1 mr-1" />
            {INPUT_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-32 py-2 text-sm font-medium text-center whitespace-nowrap rounded-t-lg transition-all duration-100
                  ${activeTab === t.id
                    ? 'text-slate-900 shadow-sm'
                    : 'text-red-200 hover:text-white hover:bg-white/10'
                  }`}
                style={activeTab === t.id ? { backgroundColor: '#f2f3f5' } : undefined}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Tab content ── */}
      <main className="flex-1 overflow-auto p-5">
        <ActiveComponent />
      </main>
    </div>
  )
}
