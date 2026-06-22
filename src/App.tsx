import { useState, useRef, useEffect } from 'react'
import { useStore } from './store/useStore'
import type { AppState, SpendGapPhaseConfig, SpendGapSurplusItem, DrawdownStrategyConfig } from './engine/types'
import portageIcon from './assets/portage-icon.png'

import { DashboardTab }   from './tabs/DashboardTab'
import { AnalysisTab }    from './tabs/AnalysisTab'
import { AssumptionsTab } from './tabs/AssumptionsTab'
import { IncomeTab }      from './tabs/IncomeTab'
import { InvestmentsTab } from './tabs/InvestmentsTab'
import { DatasetSelectorPopover } from './components/DatasetSelectorPopover'

import { version as APP_VERSION } from '../package.json'

// ─── AI Context Generator ─────────────────────────────────────────────────────

function generateAIContext(): string {
  const store  = useStore.getState()
  const s      = store as unknown as AppState
  const wi     = store.whatIfs
  const today  = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  const aName  = s.personA.name  || 'Person A'
  const bName  = s.personB.name  || 'Person B'
  const refName = s.ageReferencePerson === 'personB' ? bName : aName

  const c   = (v: number) => `$${Math.round(v).toLocaleString('en-CA')}`
  const pct = (v: number) => `${v}%`

  const lines: string[] = []
  const h  = (...ls: string[]) => lines.push(...ls)
  const br = () => lines.push('')

  // ── Local helpers ──────────────────────────────────────────────────────────

  function ageBetween(birthDate: string, targetDate: string): string {
    const b = new Date(birthDate + 'T00:00:00')
    const t = new Date(targetDate + 'T00:00:00')
    let years = t.getFullYear() - b.getFullYear()
    let months = t.getMonth() - b.getMonth()
    if (months < 0) { years--; months += 12 }
    return months === 0 ? `${years}` : `${years}y ${months}m`
  }

  function approxDateFromAge(birthDate: string, decimalAge: number): string {
    const b = new Date(birthDate + 'T00:00:00')
    const totalMonths = Math.round(decimalAge * 12)
    const y = Math.floor(totalMonths / 12)
    const m = totalMonths % 12
    return new Date(b.getFullYear() + y, b.getMonth() + m, 1).toISOString().slice(0, 10)
  }

  function cppEffective(monthly65: number, birthDate: string, startDate: string): number {
    const b = new Date(birthDate + 'T00:00:00')
    const age65 = new Date(b.getFullYear() + 65, b.getMonth(), 1)
    const start = new Date(startDate + 'T00:00:00')
    const months = (start.getFullYear() - age65.getFullYear()) * 12 + (start.getMonth() - age65.getMonth())
    const factor = months < 0 ? Math.max(0.64, 1 + months * 0.006) : 1 + Math.min(months, 60) * 0.007
    return monthly65 * factor
  }

  function oasEffective(monthly65: number, birthDate: string, startDate: string): number {
    const b = new Date(birthDate + 'T00:00:00')
    const age65 = new Date(b.getFullYear() + 65, b.getMonth(), 1)
    const start = new Date(startDate + 'T00:00:00')
    const months = (start.getFullYear() - age65.getFullYear()) * 12 + (start.getMonth() - age65.getMonth())
    return monthly65 * (1 + Math.max(0, Math.min(60, months)) * 0.006)
  }

  // ── Compute effective values (base + active modifications) ─────────────────

  const effRetireDateA = wi.retirementA?.enabled
    ? approxDateFromAge(s.personA.birthDate, wi.retirementA.value.retirementAge)
    : s.personA.retirementDate
  const effRetireDateB = wi.retirementB?.enabled
    ? approxDateFromAge(s.personB.birthDate, wi.retirementB.value.retirementAge)
    : s.personB.retirementDate

  const effCppStartA = wi.cppStartAgeA.enabled
    ? approxDateFromAge(s.personA.birthDate, wi.cppStartAgeA.value) : s.cppA.startDate
  const effCppStartB = wi.cppStartAgeB.enabled
    ? approxDateFromAge(s.personB.birthDate, wi.cppStartAgeB.value) : s.cppB.startDate
  const effOasStartA = wi.oasStartAgeA.enabled
    ? approxDateFromAge(s.personA.birthDate, wi.oasStartAgeA.value) : s.oasA.startDate
  const effOasStartB = wi.oasStartAgeB.enabled
    ? approxDateFromAge(s.personB.birthDate, wi.oasStartAgeB.value) : s.oasB.startDate

  const effLongevityA = wi.longevityA.enabled ? wi.longevityA.value : s.personA.planningEndAge
  const effLongevityB = wi.longevityB.enabled ? wi.longevityB.value : s.personB.planningEndAge
  const effInflation  = wi.inflationRate.enabled  ? wi.inflationRate.value  : s.personalInflationRatePct
  const effCpi        = wi.cpiRate?.enabled        ? wi.cpiRate.value        : s.cpiRatePct
  const effReturnOff  = wi.returnRateOffset.enabled ? wi.returnRateOffset.value : 0

  const effPSMode = s.withdrawalStrategy.pensionSplitMode
  const effPSPct  = s.withdrawalStrategy.pensionSplitPct

  const effDrawdown: DrawdownStrategyConfig =
    wi.drawdownStrategy.enabled
      ? wi.drawdownStrategy.value
      : {
          strategyType:    s.withdrawalStrategy.drawdownStrategy,
          fixedPct:        s.withdrawalStrategy.drawdownFixedPct,
          fixedWithdrawal: s.withdrawalStrategy.drawdownFixedWithdrawal,
          spendGapConfig:  s.withdrawalStrategy.spendGapConfig,
          bengenConfig:    s.withdrawalStrategy.bengenConfig,
          gkConfig:        s.withdrawalStrategy.gkConfig,
        }

  const effRates = {
    upTo55:     s.returnRates.upTo55     + effReturnOff,
    from55to65: s.returnRates.from55to65 + effReturnOff,
    from65to70: s.returnRates.from65to70 + effReturnOff,
    from70plus: s.returnRates.from70plus + effReturnOff,
  }

  const cppEffA = cppEffective(s.cppA.estimatedMonthlyAt65, s.personA.birthDate, effCppStartA)
  const cppEffB = cppEffective(s.cppB.estimatedMonthlyAt65, s.personB.birthDate, effCppStartB)
  const oasEffA = oasEffective(s.oasA.estimatedMonthlyAt65, s.personA.birthDate, effOasStartA)
  const oasEffB = oasEffective(s.oasB.estimatedMonthlyAt65, s.personB.birthDate, effOasStartB)

  // Helpers for modification-aware display
  const modVal = (modEnabled: boolean, eff: string, base: string) =>
    modEnabled ? `**${eff}** *(base: ${base})*` : eff

  // ── Drawdown strategy helpers ──────────────────────────────────────────────

  const acctLabel = (a: string) =>
    a === 'rrif' ? 'RRSP/RRIF (above minimum)' : a.toUpperCase()

  function describePhase(phase: SpendGapPhaseConfig, personName: string, phaseLabel: string): void {
    h(`**${personName} — ${phaseLabel}**`)
    if (phase.grossIncomeCeiling > 0) {
      h(`Proactive RRSP meltdown: draw up to a gross income ceiling of ${c(phase.grossIncomeCeiling)}/yr (today's $, CPI-indexed). This intentionally deregisters RRSP assets at lower marginal rates before mandatory RRIF minimums kick in.`)
    } else {
      h(`No proactive RRSP meltdown — RRSP/RRIF drawn only reactively to fill a spending gap.`)
    }
    if (phase.deficitItems.length > 0) {
      h(`If a spending gap remains after all income, draw from accounts in this order:`)
      h(`| Priority | Account | Annual Cap |`, `|---|---|---|`)
      phase.deficitItems.forEach((item, i) => {
        const cap = item.unlimited ? 'Unlimited' : item.cap === 0 ? 'Skip this account' : `${c(item.cap)}/yr max`
        h(`| ${i + 1} | ${acctLabel(item.account)} | ${cap} |`)
      })
    }
    br()
  }

  function describeSurplus(items: SpendGapSurplusItem[], label: string): void {
    if (items.length === 0) {
      h(`*${label}:* No surplus routing — excess income is not reinvested.`)
      return
    }
    h(`*${label} — route surplus in this order:*`)
    h(`| Priority | Account | Annual Limit |`, `|---|---|---|`)
    items.forEach((item, i) => {
      const isLast = i === items.length - 1
      const limit = item.unlimited ? 'Unlimited'
        : isLast ? 'Unlimited (receives all remaining)'
        : item.limit === 0 ? 'Skip' : `${c(item.limit)}/yr`
      h(`| ${i + 1} | ${item.account.toUpperCase()} | ${limit} |`)
    })
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Document
  // ══════════════════════════════════════════════════════════════════════════

  h('# Portage — Canadian Retirement Plan Context')
  h(`*Generated: ${today}*`)
  br()
  h('This document contains the complete inputs for a Canadian (Ontario) household retirement projection. All monetary values are in **today\'s dollars** — nominal future amounts are deflated using the personal inflation rate. Combined federal + Ontario income tax is calculated annually using 2026 bracket values, CPI-indexed forward.')
  br()
  h('> **How to use this context:** The plan has a *base plan* (the permanent foundation) and *current modifications* (temporary what-if overrides active at time of export). Effective values — base plan with modifications applied — are shown throughout, with the original base value noted in parentheses where a modification is active. **Reason from the effective values.** They represent what the simulation is currently computing.')
  br()
  h('---')
  br()

  // ── 1. Household ────────────────────────────────────────────────────────────
  h('## 1. Household')
  br()
  h(`| | ${aName} | ${bName} |`,
    `|---|---|---|`,
    `| Birth Date | ${s.personA.birthDate} | ${s.personB.birthDate} |`,
    `| Gender | ${s.personA.gender} | ${s.personB.gender} |`,
    `| Retirement Date | ${modVal(!!wi.retirementA?.enabled, effRetireDateA, s.personA.retirementDate)} | ${modVal(!!wi.retirementB?.enabled, effRetireDateB, s.personB.retirementDate)} |`,
    `| Approximate Retirement Age | ${ageBetween(s.personA.birthDate, effRetireDateA)} | ${ageBetween(s.personB.birthDate, effRetireDateB)} |`,
    `| Planning Horizon | ${modVal(wi.longevityA.enabled, `Age ${effLongevityA}`, `Age ${s.personA.planningEndAge}`)} | ${modVal(wi.longevityB.enabled, `Age ${effLongevityB}`, `Age ${s.personB.planningEndAge}`)} |`)
  br()
  h(`- **Age reference person** (spending phase triggers, return rate tier transitions): **${refName}**`)
  h(`- Province: **Ontario**`)
  br()
  h('---')
  br()

  // ── 2. Income Sources ────────────────────────────────────────────────────────
  h('## 2. Income Sources')
  br()

  h('### 2.1 Employment Income')
  br()
  h(`| Person | Current Annual Income | Real Growth/yr | Retires |`,
    `|---|---|---|---|`,
    `| ${aName} | ${c(s.employmentA.annualAmount)} | ${pct(s.employmentA.growthRatePct)} | ${effRetireDateA} |`,
    `| ${bName} | ${c(s.employmentB.annualAmount)} | ${pct(s.employmentB.growthRatePct)} | ${effRetireDateB} |`)
  br()
  h('Real growth is above personal inflation — 0% means income keeps pace with inflation. Income is pro-rated to the month of retirement in the retirement year; employment income stops the day before the retirement date.')
  br()

  h('### 2.2 Defined Benefit Pension')
  br()
  const pensions = [
    { name: aName, p: s.dbPensionA },
    { name: bName, p: s.dbPensionB },
  ].filter(x => x.p.enabled)
  const noPension = [
    { name: aName, p: s.dbPensionA },
    { name: bName, p: s.dbPensionB },
  ].filter(x => !x.p.enabled)

  if (pensions.length === 0) {
    h('Neither person has a DB pension.')
  } else {
    for (const { name, p } of pensions) {
      h(`**${name}${p.planName ? ` — ${p.planName}` : ''}**`)
      h(`- First payment date: ${p.startDate}`)
      h(`- Annual benefit at start: ${c(p.annualAmount)} (today's dollars)`)
      const indexDesc = p.cpiIndexed
        ? (p.cpiIndexingCapEnabled ? `CPI-indexed, capped at ${p.cpiIndexingCap}%/yr` : 'Fully CPI-indexed')
        : `Fixed at ${p.indexingRatePct}%/yr`
      h(`- Indexing: ${indexDesc}`)
      if (p.bridgeBenefitAmount > 0) {
        h(`- Bridge benefit: ${c(p.bridgeBenefitAmount)}/yr additional until ${p.bridgeBenefitEndDate} (typically when CPP starts)`)
      }
      if (p.cppIntegration && p.cppIntegrationAmount > 0) {
        h(`- CPP integration: pension reduces by ${c(p.cppIntegrationAmount)}/yr at age 65`)
      }
      h(`- Survivor benefit: ${Math.round(p.survivorBenefitPct * 100)}% of base pension continues to the surviving spouse`)
      br()
    }
  }
  if (noPension.length > 0) {
    h(`${noPension.map(x => x.name).join(' and ')} ${noPension.length === 1 ? 'has' : 'have'} no DB pension.`)
    br()
  }

  h('### 2.3 Canada Pension Plan (CPP)')
  br()
  h(`| Person | Monthly at 65 | Effective Start Date | Start Age | Effective Monthly | Effective Annual |`,
    `|---|---|---|---|---|---|`,
    `| ${aName} | $${s.cppA.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${modVal(wi.cppStartAgeA.enabled, effCppStartA, s.cppA.startDate)} | ${ageBetween(s.personA.birthDate, effCppStartA)} | $${Math.round(cppEffA).toLocaleString('en-CA')} | ${c(cppEffA * 12)} |`,
    `| ${bName} | $${s.cppB.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${modVal(wi.cppStartAgeB.enabled, effCppStartB, s.cppB.startDate)} | ${ageBetween(s.personB.birthDate, effCppStartB)} | $${Math.round(cppEffB).toLocaleString('en-CA')} | ${c(cppEffB * 12)} |`)
  br()
  h('CPP deferral: −0.6%/month before age 65 (max −36% at age 60), +0.7%/month after age 65 (max +42% at age 70). Survivor CPP: 60% of the deceased\'s entitlement paid to the surviving spouse (subject to CPP maximums).')
  br()

  h('### 2.4 Old Age Security (OAS)')
  br()
  const oasFacA = s.oasA.estimatedMonthlyAt65 > 0 ? `${(oasEffA / s.oasA.estimatedMonthlyAt65 * 100).toFixed(0)}%` : '100%'
  const oasFacB = s.oasB.estimatedMonthlyAt65 > 0 ? `${(oasEffB / s.oasB.estimatedMonthlyAt65 * 100).toFixed(0)}%` : '100%'
  h(`| Person | Monthly at 65 | Effective Start Date | Start Age | Deferral Factor | Effective Monthly | Effective Annual |`,
    `|---|---|---|---|---|---|---|`,
    `| ${aName} | $${s.oasA.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${modVal(wi.oasStartAgeA.enabled, effOasStartA, s.oasA.startDate)} | ${ageBetween(s.personA.birthDate, effOasStartA)} | ${oasFacA} | $${Math.round(oasEffA).toLocaleString('en-CA')} | ${c(oasEffA * 12)} |`,
    `| ${bName} | $${s.oasB.estimatedMonthlyAt65.toLocaleString('en-CA')} | ${modVal(wi.oasStartAgeB.enabled, effOasStartB, s.oasB.startDate)} | ${ageBetween(s.personB.birthDate, effOasStartB)} | ${oasFacB} | $${Math.round(oasEffB).toLocaleString('en-CA')} | ${c(oasEffB * 12)} |`)
  br()
  h(`OAS deferral: +0.6%/month after age 65, maximum +36% at age 70. Clawback: 15% of net income above ~$95,323 (2026, CPI-indexed annually). OAS does not pass to a survivor — it stops at death.`)
  const gisPeople = [
    ...(s.oasA.gisEligible ? [`${aName}: $${s.oasA.gisMonthlyAmount}/month`] : []),
    ...(s.oasB.gisEligible ? [`${bName}: $${s.oasB.gisMonthlyAmount}/month`] : []),
  ]
  if (gisPeople.length > 0) h(`GIS supplement (income-tested, not modelled precisely): ${gisPeople.join(', ')}`)
  br()

  h('### 2.5 Other Income')
  br()
  if (s.otherIncome.otherItems.length === 0) {
    h('None configured.')
  } else {
    h(`| Label | Annual | Attributed To | Taxable | Real Growth | Start | End |`,
      `|---|---|---|---|---|---|---|`)
    for (const item of s.otherIncome.otherItems) {
      const attr = item.attributedTo === 'personA' ? aName : item.attributedTo === 'personB' ? bName : 'Joint'
      h(`| ${item.label} | ${c(item.annualAmount)} | ${attr} | ${item.taxable ? 'Yes' : 'No'} | ${pct(item.growthRatePct)}/yr | ${item.startDate} | ${item.endDate} |`)
    }
  }
  br()
  h('---')
  br()

  // ── 3. Investment Accounts ──────────────────────────────────────────────────
  h('## 3. Investment Accounts')
  br()
  h(`All balances are in today's dollars as of ${today}. The simulation compounds at nominal return rates and deflates outputs to today's purchasing power.`)
  br()

  h('### 3.1 RRSP / RRIF')
  br()
  const rrspRows: [string, string, string][] = [
    ['Balance', c(s.rrspA.balance), c(s.rrspB.balance)],
    ...(s.rrspA.spousalBalance > 0 || s.rrspB.spousalBalance > 0
      ? [['Spousal RRSP Balance', c(s.rrspA.spousalBalance), c(s.rrspB.spousalBalance)] as [string,string,string]] : []),
    ['Annual Contribution', c(s.rrspA.annualContribution), c(s.rrspB.annualContribution)],
    ['Contributions End', s.rrspA.contributionEndDate, s.rrspB.contributionEndDate],
    ['RRIF Conversion Date', s.rrspA.rrifConversionDate, s.rrspB.rrifConversionDate],
    ['Use Spouse Age for RRIF Minimums', s.rrspA.useSpouseAgeForMinimums ? 'Yes' : 'No', s.rrspB.useSpouseAgeForMinimums ? 'Yes' : 'No'],
    ...(s.rrspA.additionalWithdrawalAboveMinimum > 0 || s.rrspB.additionalWithdrawalAboveMinimum > 0
      ? [['Extra Annual Draw Above Minimum', c(s.rrspA.additionalWithdrawalAboveMinimum), c(s.rrspB.additionalWithdrawalAboveMinimum)] as [string,string,string]] : []),
    ...(s.rrspA.returnRateOverrideEnabled || s.rrspB.returnRateOverrideEnabled
      ? [['Return Rate Override', s.rrspA.returnRateOverrideEnabled ? pct(s.rrspA.returnRateOverridePct) : '(portfolio rate)', s.rrspB.returnRateOverrideEnabled ? pct(s.rrspB.returnRateOverridePct) : '(portfolio rate)'] as [string,string,string]] : []),
  ]
  h(`| | ${aName} | ${bName} |`, `|---|---|---|`)
  for (const [label, a, b] of rrspRows) h(`| ${label} | ${a} | ${b} |`)
  br()
  h('RRSP must convert to RRIF by Dec 31 of the year the holder turns 71. RRIF mandatory minimums are taxable withdrawals — roughly 5.3% at age 71, rising to 20% at 95. "Using spouse\'s age" for minimums reduces mandatory draws when the account holder is older.')
  br()

  h('### 3.2 TFSA')
  br()
  const tfsaRows: [string, string, string][] = [
    ['Balance', c(s.tfsaA.balance), c(s.tfsaB.balance)],
    ['Annual Contribution', c(s.tfsaA.annualContribution), c(s.tfsaB.annualContribution)],
    ['Contributions End', s.tfsaA.contributionEndDate, s.tfsaB.contributionEndDate],
    ...(s.tfsaA.returnRateOverrideEnabled || s.tfsaB.returnRateOverrideEnabled
      ? [['Return Rate Override', s.tfsaA.returnRateOverrideEnabled ? pct(s.tfsaA.returnRateOverridePct) : '(portfolio rate)', s.tfsaB.returnRateOverrideEnabled ? pct(s.tfsaB.returnRateOverridePct) : '(portfolio rate)'] as [string,string,string]] : []),
  ]
  h(`| | ${aName} | ${bName} |`, `|---|---|---|`)
  for (const [label, a, b] of tfsaRows) h(`| ${label} | ${a} | ${b} |`)
  br()
  h('TFSA withdrawals are completely tax-free. Contribution room is restored the following calendar year. No mandatory withdrawals — ideal for tax-free compounding and last-resort draws.')
  br()

  h('### 3.3 Non-Registered')
  br()
  const nrRows: [string, string, string][] = [
    ['Balance', c(s.nonRegA.balance), c(s.nonRegB.balance)],
    ['Adjusted Cost Base (ACB)', c(s.nonRegA.acb), c(s.nonRegB.acb)],
    ['Annual Contribution', c(s.nonRegA.annualContribution), c(s.nonRegB.annualContribution)],
    ['Contributions End', s.nonRegA.contributionEndDate, s.nonRegB.contributionEndDate],
    ['Eligible Dividend Yield', pct(s.nonRegA.eligibleDivYieldPct), pct(s.nonRegB.eligibleDivYieldPct)],
    ['Foreign Income Yield', pct(s.nonRegA.foreignIncomeYieldPct), pct(s.nonRegB.foreignIncomeYieldPct)],
    ['Interest Yield', pct(s.nonRegA.interestYieldPct), pct(s.nonRegB.interestYieldPct)],
    ...(s.nonRegA.returnRateOverrideEnabled || s.nonRegB.returnRateOverrideEnabled
      ? [['Return Rate Override', s.nonRegA.returnRateOverrideEnabled ? pct(s.nonRegA.returnRateOverridePct) : '(portfolio rate)', s.nonRegB.returnRateOverrideEnabled ? pct(s.nonRegB.returnRateOverridePct) : '(portfolio rate)'] as [string,string,string]] : []),
  ]
  h(`| | ${aName} | ${bName} |`, `|---|---|---|`)
  for (const [label, a, b] of nrRows) h(`| ${label} | ${a} | ${b} |`)
  br()
  h('Annual yields (dividends, foreign income, interest) are taxable in the year earned regardless of withdrawals. Capital gains arise on withdrawal, calculated via the ACB ratio. Eligible dividends are grossed up 38% then a federal credit of ~15% of the grossed-up amount applies.')
  br()

  h('### 3.4 HISA / Cash (Joint)')
  br()
  h(`| | Value |`, `|---|---|`,
    `| Balance | ${c(s.cash.hisaBalance)} |`,
    `| Interest Rate (nominal) | ${pct(s.cash.hisaRatePct)} |`,
    `| Minimum Floor Target | ${c(s.cash.hisaMinBalance)} |`)
  br()
  h('Joint account used for liquidity and short-term surplus. Interest is taxable. The minimum floor is a planning target — years where the HISA falls below it signal a liquidity concern.')
  br()
  h('---')
  br()

  // ── 4. Spending Plan ────────────────────────────────────────────────────────
  h('## 4. Spending Plan')
  br()
  h(`Phase start ages and additional spending items are anchored to **${refName}**'s birthday. All amounts are in today's dollars.`)
  br()

  h('### 4.1 Lifestyle Phases')
  br()
  h(`| Phase | ${refName}'s Start Age | Annual Amount | Real Growth/yr |`,
    `|---|---|---|---|`)
  for (const phase of s.spendingPhases) {
    const startLabel = phase.linkedToFirstDeath
      ? `First death (${aName} or ${bName})`
      : `Age ${phase.startAge}`
    const growthDesc = phase.growthRatePct === 0
      ? '0% (constant real purchasing power)'
      : `${phase.growthRatePct > 0 ? '+' : ''}${pct(phase.growthRatePct)}/yr`
    h(`| ${phase.label} | ${startLabel} | ${c(phase.annualAmount)} | ${growthDesc} |`)
  }
  br()
  h('Real growth is above personal inflation. Negative real growth means spending declines in purchasing power over time — typical for slow-go and no-go retirement phases as activity decreases.')
  br()

  if (s.additionalSpending.length > 0) {
    h('### 4.2 Additional Spending')
    br()
    h(`| Label | Amount | ${refName}'s Age | Type |`, `|---|---|---|---|`)
    for (const item of s.additionalSpending) {
      h(`| ${item.label} | ${c(item.amount)} | ${item.startAge} | ${item.recurring ? 'Recurring from that age' : 'One-time in that year'} |`)
    }
    br()
  }

  h('---')
  br()

  // ── 5. Key Assumptions ──────────────────────────────────────────────────────
  h('## 5. Key Assumptions')
  br()

  h('### 5.1 Portfolio Return Rates (Nominal)')
  br()
  h(`Returns are tiered by **${refName}**'s age. The effective real return is the nominal rate minus the personal inflation rate — this is approximately what the portfolio grows by in today's dollars.`)
  br()
  const showOff = effReturnOff !== 0
  h(`| ${refName}'s Age Band | Effective Nominal Return | Approx. Real Return |`,
    `|---|---|---|`,
    `| Up to 55 | ${showOff ? `**${pct(effRates.upTo55)}** *(base: ${pct(s.returnRates.upTo55)})*` : pct(s.returnRates.upTo55)} | ~${(effRates.upTo55 - effInflation).toFixed(1)}%/yr |`,
    `| 55 to 65 | ${showOff ? `**${pct(effRates.from55to65)}** *(base: ${pct(s.returnRates.from55to65)})*` : pct(s.returnRates.from55to65)} | ~${(effRates.from55to65 - effInflation).toFixed(1)}%/yr |`,
    `| 65 to 70 | ${showOff ? `**${pct(effRates.from65to70)}** *(base: ${pct(s.returnRates.from65to70)})*` : pct(s.returnRates.from65to70)} | ~${(effRates.from65to70 - effInflation).toFixed(1)}%/yr |`,
    `| 70+ | ${showOff ? `**${pct(effRates.from70plus)}** *(base: ${pct(s.returnRates.from70plus)})*` : pct(s.returnRates.from70plus)} | ~${(effRates.from70plus - effInflation).toFixed(1)}%/yr |`)
  br()

  h('### 5.2 Inflation Rates')
  br()
  h(`| Rate | Effective Value | Role in Model |`,
    `|---|---|---|`,
    `| Personal Inflation | ${modVal(wi.inflationRate.enabled, pct(effInflation), pct(s.personalInflationRatePct))} | Deflates all output to today's purchasing power |`,
    `| CPI | ${modVal(!!wi.cpiRate?.enabled, pct(effCpi), pct(s.cpiRatePct))} | Indexes DB pension, CPP/OAS amounts, and tax brackets forward each year |`)
  br()

  h('### 5.3 Tax Framework')
  br()
  const cgRate = s.taxSettings.capitalGainsInclusionRate * 100
  const psDesc = effPSMode === 'auto'
    ? `Auto-optimized each year — the model allocates up to 50% of eligible pension income from ${aName} to ${bName} to minimize combined tax`
    : `Manual — ${pct(effPSPct)} of eligible pension income allocated from ${aName} to ${bName}`
  h(`- **Jurisdiction:** Ontario + Federal combined, 2026 bracket values, CPI-indexed forward annually`,
    `- **Capital gains inclusion:** ${pct(cgRate)} of net realized gains included in taxable income (${100 - cgRate}% exempt)`,
    `- **Eligible dividends:** Grossed up 38%; federal dividend tax credit ~15.0% of grossed-up amount; Ontario credit ~10.0%`,
    `- **Pension income splitting:** ${psDesc}`,
    `- **OAS clawback:** 15% of net income above ~$95,323 (2026, CPI-indexed annually)`,
    `- **Ontario surtax:** 20% surcharge on Ontario tax above $5,818; additional 36% surcharge on Ontario tax above $7,446 (2026)`)
  br()
  h('---')
  br()

  // ── 6. Drawdown Strategy ────────────────────────────────────────────────────
  h('## 6. Drawdown Strategy')
  br()

  if (wi.drawdownStrategy.enabled) {
    h('*Note: The drawdown strategy is currently set via a modification (what-if override) on top of the base plan.*')
    br()
  }

  const ds = effDrawdown

  if (ds.strategyType === 'none') {
    h('**No proactive drawdown strategy is configured.**')
    br()
    h('The simulation draws only mandatory RRIF minimums after each person\'s RRIF conversion date. Any shortfall between net household income and spending is not covered from the portfolio — the plan relies entirely on its income streams (employment, DB pension, CPP, OAS, other income). Any annual income surplus is not automatically reinvested.')

  } else if (ds.strategyType === 'spendGap') {
    h('**Strategy: Cover Spending Gap**')
    br()
    h('Each year, the engine calculates total net household income (after tax and OAS clawback). If it falls short of total spending, the deficit is filled by drawing from investment accounts in a defined priority order. If income exceeds spending, the surplus is routed into accounts in a defined order. The strategy has two operating phases per person: *meltdown* (retired, before RRIF conversion) and *RRIF* (after conversion, when mandatory minimums apply).')
    br()

    describePhase(ds.spendGapConfig.meltdownA, aName, 'Meltdown Phase (retired, pre-RRIF)')
    describePhase(ds.spendGapConfig.meltdownB, bName, 'Meltdown Phase (retired, pre-RRIF)')

    describePhase(ds.spendGapConfig.rrifA, aName, 'RRIF Phase (after RRIF conversion)')
    describePhase(ds.spendGapConfig.rrifB, bName, 'RRIF Phase (after RRIF conversion)')

    h('**Surplus Routing**')
    br()
    describeSurplus(ds.spendGapConfig.surplusMeltdownItems, 'Meltdown phase')
    br()
    describeSurplus(ds.spendGapConfig.surplusRrifItems, 'RRIF phase')
    br()
    if (ds.spendGapConfig.stopContributionsWhenPartnerRetired) {
      h('*Contributions for each person stop when their partner retires.*')
      br()
    }

  } else if (ds.strategyType === 'fixedWithdrawal') {
    h('**Strategy: Fixed Annual Withdrawals**')
    br()
    h('A fixed annual dollar amount (today\'s dollars, CPI-indexed forward) is withdrawn from each account each year, regardless of income or spending needs. These withdrawals are in addition to mandatory RRIF minimums.')
    br()
    const fw = ds.fixedWithdrawal
    h(`| Account | ${aName} | ${bName} |`,
      `|---|---|---|`,
      `| RRSP / RRIF | ${c(fw.rrspAmountA)} | ${c(fw.rrspAmountB)} |`,
      `| TFSA | ${c(fw.tfsaAmountA)} | ${c(fw.tfsaAmountB)} |`,
      `| Non-Registered | ${c(fw.nonRegAmountA)} | ${c(fw.nonRegAmountB)} |`,
      `| HISA (joint) | ${c(fw.hisaAmount)} | — |`)
    br()

  } else if (ds.strategyType === 'fixedPct') {
    h('**Strategy: Fixed Percentage of Balance**')
    br()
    h('A fixed percentage of each account\'s end-of-prior-year balance is withdrawn annually, with a floor minimum. These withdrawals are in addition to mandatory RRIF minimums.')
    br()
    const fp = ds.fixedPct
    h(`| Account | % of Balance | Annual Minimum |`,
      `|---|---|---|`,
      `| RRSP / RRIF | ${pct(fp.rrspPct)} | ${c(fp.rrspMin)} |`,
      `| TFSA | ${pct(fp.tfsaPct)} | ${c(fp.tfsaMin)} |`,
      `| Non-Registered | ${pct(fp.nonRegPct)} | ${c(fp.nonRegMin)} |`,
      `| HISA | ${pct(fp.hisaPct)} | ${c(fp.hisaMin)} |`)
    br()
  }

  h('---')
  br()

  // ── 7. Current Modifications ────────────────────────────────────────────────
  h('## 7. Current Modifications')
  br()

  const mods: string[] = []

  if (wi.retirementA?.enabled) {
    const cfg = wi.retirementA.value
    const cascades = [cfg.cascadePension && 'DB pension', cfg.cascadeRrsp && 'RRSP contributions', cfg.cascadeTfsa && 'TFSA contributions', cfg.cascadeNonReg && 'non-reg contributions'].filter(Boolean).join(', ') || 'none'
    mods.push(`**${aName} Retirement Age:** Changed to age ${cfg.retirementAge} (~${effRetireDateA}). Base: ${s.personA.retirementDate}. Cascaded dates: ${cascades}.`)
  }
  if (wi.retirementB?.enabled) {
    const cfg = wi.retirementB.value
    const cascades = [cfg.cascadePension && 'DB pension', cfg.cascadeRrsp && 'RRSP contributions', cfg.cascadeTfsa && 'TFSA contributions', cfg.cascadeNonReg && 'non-reg contributions'].filter(Boolean).join(', ') || 'none'
    mods.push(`**${bName} Retirement Age:** Changed to age ${cfg.retirementAge} (~${effRetireDateB}). Base: ${s.personB.retirementDate}. Cascaded dates: ${cascades}.`)
  }
  if (wi.longevityA.enabled)
    mods.push(`**${aName} Planning Horizon:** Age ${wi.longevityA.value} (base: age ${s.personA.planningEndAge}).`)
  if (wi.longevityB.enabled)
    mods.push(`**${bName} Planning Horizon:** Age ${wi.longevityB.value} (base: age ${s.personB.planningEndAge}).`)
  if (wi.cppStartAgeA.enabled)
    mods.push(`**${aName} CPP Start Age:** Age ${wi.cppStartAgeA.value} (~${effCppStartA}). Base: ${s.cppA.startDate}. Effective monthly: $${Math.round(cppEffA).toLocaleString('en-CA')} vs. base $${s.cppA.estimatedMonthlyAt65.toLocaleString('en-CA')} at 65.`)
  if (wi.cppStartAgeB.enabled)
    mods.push(`**${bName} CPP Start Age:** Age ${wi.cppStartAgeB.value} (~${effCppStartB}). Base: ${s.cppB.startDate}. Effective monthly: $${Math.round(cppEffB).toLocaleString('en-CA')} vs. base $${s.cppB.estimatedMonthlyAt65.toLocaleString('en-CA')} at 65.`)
  if (wi.oasStartAgeA.enabled)
    mods.push(`**${aName} OAS Start Age:** Age ${wi.oasStartAgeA.value} (~${effOasStartA}). Base: ${s.oasA.startDate}. Effective monthly: $${Math.round(oasEffA).toLocaleString('en-CA')} vs. base $${s.oasA.estimatedMonthlyAt65.toLocaleString('en-CA')} at 65 (${oasFacA} of base).`)
  if (wi.oasStartAgeB.enabled)
    mods.push(`**${bName} OAS Start Age:** Age ${wi.oasStartAgeB.value} (~${effOasStartB}). Base: ${s.oasB.startDate}. Effective monthly: $${Math.round(oasEffB).toLocaleString('en-CA')} vs. base $${s.oasB.estimatedMonthlyAt65.toLocaleString('en-CA')} at 65 (${oasFacB} of base).`)
  if (wi.inflationRate.enabled)
    mods.push(`**Personal Inflation:** ${pct(wi.inflationRate.value)} (base: ${pct(s.personalInflationRatePct)}). All real returns and today's-dollar outputs shift accordingly.`)
  if (wi.cpiRate?.enabled)
    mods.push(`**CPI Rate:** ${pct(wi.cpiRate.value)} (base: ${pct(s.cpiRatePct)}). Affects DB pension indexing, CPP/OAS benefit growth, and tax bracket indexing.`)
  if (wi.returnRateOffset.enabled && wi.returnRateOffset.value !== 0) {
    const sign = wi.returnRateOffset.value > 0 ? '+' : ''
    mods.push(`**Portfolio Returns:** All tiers shifted by ${sign}${pct(wi.returnRateOffset.value)}. Effective: ${pct(effRates.upTo55)} / ${pct(effRates.from55to65)} / ${pct(effRates.from65to70)} / ${pct(effRates.from70plus)} (base: ${pct(s.returnRates.upTo55)} / ${pct(s.returnRates.from55to65)} / ${pct(s.returnRates.from65to70)} / ${pct(s.returnRates.from70plus)}).`)
  }
  if (wi.drawdownStrategy.enabled)
    mods.push(`**Drawdown Strategy:** Overridden to "${wi.drawdownStrategy.value.strategyType}" (see Section 6 for full details). Base plan strategy: "${s.withdrawalStrategy.drawdownStrategy}".`)
  if (wi.marketProfile?.enabled) {
    const mp = wi.marketProfile.value
    const names: Record<string, string> = { step: 'Step (base tiers)', frontLoaded: 'Front-loaded', backLoaded: 'Back-loaded', cyclicalCrest: 'Cyclical (crest start)', cyclicalTrough: 'Cyclical (trough start)', noise: 'Random noise' }
    mods.push(`**Market Profile:** ${names[mp.profileType] ?? mp.profileType}, outlook offset ${mp.outlookOffset > 0 ? '+' : ''}${mp.outlookOffset}%, amplitude ${mp.beta}×.`)
  }
  if (wi.layoffA?.enabled) {
    const { date, severance } = wi.layoffA.value
    mods.push(`**${aName} Layoff:** Employment ends ${date}${severance > 0 ? ` with ${c(severance)} taxable severance` : ''}. Retirement and contribution end dates adjusted.`)
  }
  if (wi.layoffB?.enabled) {
    const { date, severance } = wi.layoffB.value
    mods.push(`**${bName} Layoff:** Employment ends ${date}${severance > 0 ? ` with ${c(severance)} taxable severance` : ''}. Retirement and contribution end dates adjusted.`)
  }
  if (wi.unexpectedExpense?.enabled && wi.unexpectedExpense.value.amount > 0) {
    const { date, amount } = wi.unexpectedExpense.value
    mods.push(`**Unexpected Expense:** One-time household spending of ${c(amount)} in ${date.slice(0, 4)}.`)
  }
  if (wi.homeSale?.enabled && wi.homeSale.value.amount > 0) {
    const { date, amount, account } = wi.homeSale.value
    const acctLabel = account === 'hisa' ? 'HISA' : account === 'nonRegA' ? `${aName}'s Non-Reg` : `${bName}'s Non-Reg`
    mods.push(`**Home Sale / Downsizing:** Net proceeds of ${c(amount)} deposited to ${acctLabel} in ${date.slice(0, 4)}. Non-taxable (principal residence exemption).`)
  }

  if (mods.length === 0) {
    h('No modifications are currently active. The simulation reflects the base plan only.')
  } else {
    h(`${mods.length} modification${mods.length > 1 ? 's are' : ' is'} currently active. All effective values in Sections 1–6 already incorporate these changes. The base plan values are noted in parentheses for reference.`)
    br()
    for (const mod of mods) h(`- ${mod}`)
  }
  br()
  h('---')
  br()

  // ── 8. Canadian Rules Reference ─────────────────────────────────────────────
  h('## 8. Key Canadian Rules Built Into This Model')
  br()
  h(`- **CPP:** Max ~$1,508/month base + ~$55/month CPP2 (2026). Deferral: −0.6%/month before 65, +0.7%/month after (cap −36% at 60, +42% at 70). Survivor: 60% of deceased's entitlement to the survivor.`,
    `- **OAS:** Max ~$742/month at 65 (2026). Deferral: +0.6%/month past 65, max +36% at 70. Clawback: 15% above ~$95,323 net income. No survivor OAS.`,
    `- **RRIF minimums:** CRA table by age — ~5.3% at 71, ~6.8% at 75, ~10.2% at 85, ~20.0% at 95+. All mandatory withdrawals are fully taxable.`,
    `- **Pension income splitting:** Up to 50% of eligible pension income (DB pension, RRIF withdrawals after age 65) may be allocated to a lower-income spouse for tax purposes.`,
    `- **TFSA:** Tax-free growth and withdrawals. Contribution room ($7,000/yr in 2026, indexed) restored in the following calendar year.`,
    `- **Capital gains:** ${pct(cgRate)} of net gains included in income (${100 - cgRate}% exempt). Gains triggered on withdrawal at the ACB ratio.`,
    `- **Ontario surtax:** Applied to Ontario tax itself — 20% above $5,818 and 36% above $7,446 of Ontario tax owing (2026).`)
  br()
  h('---')
  br()

  // ── 9. How to Use ────────────────────────────────────────────────────────────
  h('## 9. How to Use This Context')
  br()
  h('You have a complete picture of this retirement plan. Some productive ways to engage:')
  br()
  h('**Questions this context can support:**',
    `- Is this plan sustainable to both planning horizons (${aName} to ${effLongevityA}, ${bName} to ${effLongevityB})?`,
    `- What is the approximate income gap between retirement and government benefits start?`,
    `- How do RRIF mandatory minimums grow over time and what is their tax cost?`,
    `- Is there OAS clawback risk given the income and drawdown structure?`,
    `- Is the CPP/OAS timing well-chosen relative to the spending plan and planning horizons?`)
  br()
  h('**Hypotheticals you can model qualitatively:**',
    `- "What if CPP is delayed to age 67?" — apply the deferral factor (+16.8% of base monthly), assess break-even crossover against planning horizon`,
    `- "What if personal inflation rises to 4%?" — all return tiers lose ~2 pp of real return; spending phases cost more in nominal terms`,
    `- "What if ${aName} retires 2 years earlier?" — reduced employment income, earlier pension start if cascaded, shorter RRSP accumulation`,
    `- "What if the portfolio earns 1% less across all tiers?" — trace the compounding effect on account balances over 30+ years`,
    `- "What is the tax cost of not doing an RRSP meltdown before RRIF conversion?"`)
  br()
  h('**When running a hypothetical:**',
    '1. State the assumption change explicitly',
    '2. Identify which effective parameters change and by how much',
    '3. Walk through first-order impacts: income, tax, portfolio balance',
    '4. Note second-order effects: OAS clawback, RRIF minimum sizing, pension splitting eligibility, survivor income adequacy',
    '5. Give a qualitative assessment of sustainability under the modified assumption')
  br()

  return lines.join('\n')
}

function downloadAIContext() {
  const md   = generateAIContext()
  const blob = new Blob([md], { type: 'text/markdown' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '')
  a.download = `portage-ai-context-${timestamp}.md`
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
            <li><strong>Base Plan (right tabs)</strong> — Enter your household data across the Settings, Income, and Investments tabs. This is the foundation of the simulation.</li>
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
            <span className="font-medium">2026 (CPI-indexed forward)</span>
          </div>

        </div>
        <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
          <p>Portage is a personal planning tool, not professional financial advice. All projections are estimates — accuracy depends on your inputs and assumptions about future returns, inflation, and longevity.</p>
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
  { id: 'analysis',  label: 'Analysis',  Component: AnalysisTab  },
]

const INPUT_TABS = [
  { id: 'assumptions', label: 'Settings', Component: AssumptionsTab },
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

  // Keep all tabs mounted so analysis results (MC, meltdown optimizer) survive
  // navigation.  Active tab uses display:contents (no layout effect); inactive
  // tabs use display:none so they are hidden but not unmounted.

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

        <div className="flex items-center gap-3">
          {/* Dataset Selector Popover */}
          <DatasetSelectorPopover />

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
                <button className={menuItemClass} onClick={() => { downloadAIContext(); closeMenu() }}>
                  <svg className={menuIcon} fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                  Export AI Context
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
        {ALL_TABS.map(t => (
          <div key={t.id} style={{ display: activeTab === t.id ? 'contents' : 'none' }}>
            <t.Component />
          </div>
        ))}
      </main>
    </div>
  )
}
