import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart, withTotals } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { exactAgeAt, intAgeAt, getYear, dateAtAge, jan1 } from '../../engine/dates'
import { DEFAULT_STATE } from '../../engine/defaults'
import { rrifMinFactor } from '../../engine/tax'
import { CHART_COLORS } from '../PaletteTab'
import type { RRSPAccount } from '../../engine/types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

const RRIF_TABLE: [number, number][] = [
  [65,4.00],[66,4.17],[67,4.35],[68,4.53],[69,4.73],
  [70,5.00],[71,5.28],[72,5.40],[73,5.53],[74,5.67],
  [75,5.82],[76,5.98],[77,6.17],[78,6.36],[79,6.58],
  [80,6.82],[85,8.51],[90,11.92],[95,20.00],
]

function RRSPSection({ label, account, birthDate, retirementDate, spouseName, onChange, onReset, personColor }: {
  label: string
  account: RRSPAccount
  birthDate: string
  retirementDate: string
  spouseName: string
  onChange: (v: RRSPAccount) => void
  onReset: () => void
  personColor?: string
}) {
  const rrifAge = Math.round(exactAgeAt(birthDate, account.rrifConversionDate))

  const infoModal = (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold mb-1">Contributions and Cash Flow</p>
        <p>Annual RRSP contributions are <strong>not</strong> included in your spending profile — they are added on top as a separate cash outflow. This means your spending phases should reflect lifestyle costs only. The Spending Breakdown chart on the Dashboard shows contributions as a distinct segment alongside lifestyle spending.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Lump Sum vs Spread</p>
        <p>Lump sum applies the full annual contribution on Jan 1 each year. Spread pro-rates the contribution evenly through the year. In both cases the final partial year is adjusted to the contribution end date month — lump sum still receives the full amount if the end date falls within that year.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">RRIF Conversion</p>
        <p>A RRIF (Registered Retirement Income Fund) is the post-contribution phase of an RRSP. You stop contributing and CRA mandates annual minimum withdrawals, all of which are fully taxable. You must convert by December 31 of the year you turn 71. Converting earlier triggers mandatory withdrawals sooner — sometimes useful for RRSP meltdown planning to spread income over more years at lower tax rates.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">RRIF Minimum Withdrawals</p>
        <p>The minimum is a percentage of the Jan 1 balance, rising with age. By default the percentage is based on the account holder's age. If {spouseName} is younger, you can elect to use their age instead — this lowers the mandatory minimum each year, leaving more capital invested and tax-deferred for longer. There is no downside to making this election if {spouseName} is younger; you can always withdraw more than the minimum voluntarily.</p>
        <p className="mt-2 text-xs text-slate-500">CRA minimum withdrawal factors (% of Jan 1 RRIF balance):</p>
        <div className="mt-1.5 grid grid-cols-5 gap-1">
          {RRIF_TABLE.map(([age, pct]) => (
            <div key={age} className="rounded bg-slate-50 border border-slate-200 px-2 py-1 text-center">
              <div className="text-[10px] text-slate-500">Age {age}</div>
              <div className="text-xs font-semibold text-slate-700">{pct.toFixed(2)}%</div>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-slate-400">Ages 81–84, 86–89, 91–94 interpolate between the values shown.</p>
      </div>
    </div>
  )

  return (
    <SectionCard title={label} width="half" personColor={personColor} onReset={onReset} info={infoModal}>

      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Current RRSP Balance" value={account.balance}
          onChange={v => onChange({ ...account, balance: v })}
          prefix="$" min={0} step={1000} decimals={0} />
        <div />
        <ToggleInput label="Override Return Rate"
          value={account.returnRateOverrideEnabled}
          onChange={v => onChange({ ...account, returnRateOverrideEnabled: v })} />
        <NumberInput label="Return Rate" value={account.returnRateOverridePct}
          onChange={v => onChange({ ...account, returnRateOverridePct: v })}
          suffix="%" min={-30} max={30} step={0.1} decimals={1} size="sm"
          disabled={!account.returnRateOverrideEnabled} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <ToggleInput label="Lump Sum at Year Start"
            value={account.contributionTiming === 'lump'}
            onChange={v => onChange({ ...account, contributionTiming: v ? 'lump' : 'spread' })}
            tooltip="On: full annual contribution applied Jan 1 — the final year still gets the full amount if the end date falls within that year. Off: contribution spread evenly through the year, with the final year pro-rated to the end date month." />
          <NumberInput label="Annual Contribution" value={account.annualContribution}
            onChange={v => onChange({ ...account, annualContribution: v })}
            prefix="$" min={0} step={500} decimals={0} />
        </div>
        <div className="flex items-end gap-2">
          <DateInput label="Last Contribution Date" value={account.contributionEndDate}
            onChange={v => onChange({ ...account, contributionEndDate: v })} />
          <button type="button" className="btn-primary shrink-0"
            onClick={() => onChange({ ...account, contributionEndDate: retirementDate })}>
            Use Retirement Date
          </button>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="RRIF Conversion Age" value={rrifAge}
            onChange={v => onChange({ ...account, rrifConversionDate: dateAtAge(birthDate, Math.min(71, Math.max(55, Math.round(v)))) })}
            min={55} max={71} step={1} decimals={0} size="sm"
            tooltip="Age at RRIF conversion. Maximum 71 — must convert by Dec 31 of the year you turn 71." />
          <DateInput label="RRIF Conversion Date" value={account.rrifConversionDate}
            onChange={v => onChange({ ...account, rrifConversionDate: v })}
            tooltip="Converting earlier triggers mandatory withdrawals sooner." />
          <NumberInput label="Additional Withdrawal Above Minimum" value={account.additionalWithdrawalAboveMinimum}
            onChange={v => onChange({ ...account, additionalWithdrawalAboveMinimum: v })}
            prefix="$" min={0} step={500} decimals={0} className="col-span-2"
            tooltip="Annual extra withdrawal above CRA minimum — useful for RRSP meltdown strategy." />
        </div>
        <div className="mt-3">
          <ToggleInput label={`Use ${spouseName}'s age for RRIF minimums`}
            value={account.useSpouseAgeForMinimums}
            onChange={v => onChange({ ...account, useSpouseAgeForMinimums: v })}
            tooltip={`If ${spouseName} is younger, elect their age to reduce your mandatory annual minimums.`} />
        </div>
      </div>
    </SectionCard>
  )
}

function SpousalRRSPSection({ label, account, retirementDate, spouseName, annuitantName, onChange, onReset, personColor }: {
  label: string
  account: RRSPAccount
  retirementDate: string
  spouseName: string
  annuitantName: string
  onChange: (v: RRSPAccount) => void
  onReset: () => void
  personColor?: string
}) {
  const infoModal = (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold mb-1">How It Works</p>
        <p><strong>{spouseName}</strong> is the contributor and gets the tax deduction. <strong>{annuitantName}</strong> is the annuitant — the plan is held in their name and withdrawals are reported as <strong>{annuitantName}'s</strong> income, which is beneficial if they will be in a lower tax bracket in retirement.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">3-Year Attribution Rule</p>
        <p>If {annuitantName} withdraws from this account within 3 calendar years of {spouseName}'s last contribution, the withdrawn amount (up to total recent contributions) is attributed back to {spouseName}'s income for that year. <strong>The app does not model this rule.</strong> To avoid unexpected tax, {annuitantName} should not withdraw until at least 3 calendar years after {spouseName}'s last contribution.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Surplus Routing</p>
        <p>Surplus routing and drawdown strategies act on {annuitantName}'s primary RRSP/RRIF pool only. Spousal RRSP contributions are from the base plan only — enter the planned annual amount directly.</p>
      </div>
    </div>
  )

  return (
    <SectionCard title={label} width="half" personColor={personColor} onReset={onReset} info={infoModal}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Spousal RRSP Balance" value={account.spousalBalance}
            onChange={v => onChange({ ...account, spousalBalance: v })}
            prefix="$" min={0} step={1000} decimals={0}
            tooltip={`Current balance of the spousal RRSP held in ${annuitantName}'s name, funded by ${spouseName}.`} />
          <div />
          <ToggleInput label="Lump Sum at Year Start"
            value={account.spousalContributionTiming === 'lump'}
            onChange={v => onChange({ ...account, spousalContributionTiming: v ? 'lump' : 'spread' })}
            tooltip="On: full annual contribution applied Jan 1. Off: spread evenly through the year, pro-rated to the last contribution date month." />
          <NumberInput label="Annual Contribution" value={account.spousalAnnualContribution}
            onChange={v => onChange({ ...account, spousalAnnualContribution: v })}
            prefix="$" min={0} step={500} decimals={0} />
        </div>
        <div className="flex items-end gap-2">
          <DateInput label="Last Contribution Date" value={account.spousalLastContributionDate}
            onChange={v => onChange({ ...account, spousalLastContributionDate: v })}
            tooltip={`Date of ${spouseName}'s last contribution. Important for the 3-year attribution rule.`} />
          <button type="button" className="btn-primary shrink-0"
            onClick={() => onChange({ ...account, spousalLastContributionDate: retirementDate })}>
            Use Retirement Date
          </button>
        </div>
      </div>
    </SectionCard>
  )
}

export function RRSPTab() {
  const state = useStore()
  const { rrspA, rrspB, personA, personB, update } = state
  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')

  const currentYear = new Date().getFullYear()
  const pi = state.personalInflationRatePct / 100
  const rates = state.returnRates
  const refBirth = (state.ageReferencePerson === 'personB' ? personB : personA).birthDate
  const endYearA = getYear(dateAtAge(personA.birthDate, personA.planningEndAge))
  const endYearB = getYear(dateAtAge(personB.birthDate, personB.planningEndAge))
  const years = Array.from({ length: Math.max(endYearA, endYearB) - currentYear + 1 }, (_, i) => currentYear + i)

  // Own contributions only (no spousal) — used for each person's own RRSP growth.
  function ownContrib(account: RRSPAccount, year: number, infl: number): number {
    const endY = getYear(account.contributionEndDate)
    if (account.annualContribution <= 0 || year > endY) return 0
    const base = account.annualContribution * infl
    return (account.contributionTiming === 'lump' || year < endY)
      ? base : base * parseInt(account.contributionEndDate.substring(5, 7), 10) / 12
  }

  // Spousal contributions made BY this account holder TO the other person's RRSP.
  function spousalContrib(account: RRSPAccount, year: number, infl: number): number {
    const endSY = getYear(account.spousalLastContributionDate)
    if (account.spousalAnnualContribution <= 0 || year > endSY) return 0
    const base = account.spousalAnnualContribution * infl
    return (account.spousalContributionTiming === 'lump' || year < endSY)
      ? base : base * parseInt(account.spousalLastContributionDate.substring(5, 7), 10) / 12
  }

  // A's pool = A's own balance + what B funded for A (held in A's name).
  // B's pool = B's own balance + what A funded for B (held in B's name).
  const rrspAVals: number[] = [], rrspBVals: number[] = []
  let balA = rrspA.balance + rrspB.spousalBalance
  let balB = rrspB.balance + rrspA.spousalBalance
  for (const year of years) {
    const yp = year - currentYear
    const infl = Math.pow(1 + pi, yp)
    const aAlive = year <= endYearA, bAlive = year <= endYearB
    // Spousal rollover at death
    if (!aAlive && balA > 0) { balB += balA; balA = 0 }
    if (!bAlive && balB > 0) { balA += balB; balB = 0 }
    const age = exactAgeAt(refBirth, `${year}-06-15`)
    const nomRet = (acct: RRSPAccount) => acct.returnRateOverrideEnabled ? acct.returnRateOverridePct / 100
      : age < 55 ? rates.upTo55 / 100 : age < 65 ? rates.from55to65 / 100
      : age < 70 ? rates.from65to70 / 100 : rates.from70plus / 100
    const isRrifA = jan1(year) >= rrspA.rrifConversionDate
    const isRrifB = jan1(year) >= rrspB.rrifConversionDate
    // A's balance grows by A's own contributions + B's spousal-for-A.
    // B's balance grows by B's own contributions + A's spousal-for-B.
    const contribA = (aAlive && !isRrifA ? ownContrib(rrspA, year, infl) : 0)
                   + (bAlive && !isRrifB ? spousalContrib(rrspB, year, infl) : 0)
    const contribB = (bAlive && !isRrifB ? ownContrib(rrspB, year, infl) : 0)
                   + (aAlive && !isRrifA ? spousalContrib(rrspA, year, infl) : 0)
    const withA = isRrifA ? balA * rrifMinFactor(intAgeAt(rrspA.useSpouseAgeForMinimums ? personB.birthDate : personA.birthDate, `${year}-01-01`)) + rrspA.additionalWithdrawalAboveMinimum * infl : 0
    const withB = isRrifB ? balB * rrifMinFactor(intAgeAt(rrspB.useSpouseAgeForMinimums ? personA.birthDate : personB.birthDate, `${year}-01-01`)) + rrspB.additionalWithdrawalAboveMinimum * infl : 0
    balA = Math.max(0, balA + contribA - withA) * (1 + nomRet(rrspA))
    balB = Math.max(0, balB + contribB - withB) * (1 + nomRet(rrspB))
    rrspAVals.push(balA / infl)
    rrspBVals.push(balB / infl)
  }
  const maxRrsp = Math.max(0, ...rrspAVals.map((a, i) => a + rrspBVals[i]))
  const chartData: Data[] = [
    { x: years, y: rrspAVals, name: `${aName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifA } },
    { x: years, y: rrspBVals, name: `${bName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifB } },
  ]

  return (
    <CardGrid>
      <RRSPSection label={`RRSP / RRIF — ${aName}`}
        account={rrspA} birthDate={personA.birthDate} retirementDate={personA.retirementDate}
        spouseName={bName}
        onChange={v => update('rrspA', v)}
        onReset={() => update('rrspA', { ...DEFAULT_STATE.rrspA, contributionEndDate: personA.retirementDate, rrifConversionDate: dateAtAge(personA.birthDate, 71) })}
        personColor={personA.color} />
      <RRSPSection label={`RRSP / RRIF — ${bName}`}
        account={rrspB} birthDate={personB.birthDate} retirementDate={personB.retirementDate}
        spouseName={aName}
        onChange={v => update('rrspB', v)}
        onReset={() => update('rrspB', { ...DEFAULT_STATE.rrspB, contributionEndDate: personB.retirementDate, rrifConversionDate: dateAtAge(personB.birthDate, 71) })}
        personColor={personB.color} />

      <SpousalRRSPSection label={`Spousal RRSP — ${aName} contributes for ${bName}`}
        account={rrspA} retirementDate={personA.retirementDate}
        spouseName={aName} annuitantName={bName}
        onChange={v => update('rrspA', v)}
        onReset={() => update('rrspA', { ...rrspA, spousalBalance: 0, spousalAnnualContribution: 0, spousalLastContributionDate: personA.retirementDate })}
        personColor={personB.color} />
      <SpousalRRSPSection label={`Spousal RRSP — ${bName} contributes for ${aName}`}
        account={rrspB} retirementDate={personB.retirementDate}
        spouseName={bName} annuitantName={aName}
        onChange={v => update('rrspB', v)}
        onReset={() => update('rrspB', { ...rrspB, spousalBalance: 0, spousalAnnualContribution: 0, spousalLastContributionDate: personB.retirementDate })}
        personColor={personA.color} />

      <SectionCard title="RRSP / RRIF Balances" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Projected RRSP and RRIF balances over time, based on contributions, RRIF mandatory minimums, any additional withdrawals above minimum, and the assumed portfolio return rate. Balances are shown in today's dollars.</p>
            <p>This is a <em>standalone preview</em> — it does not include withdrawals driven by the drawdown strategy in the Dashboard. Use this chart to verify your contribution end dates, RRIF conversion age, and the general trajectory of each account. The Dashboard shows the full simulation including spending gap withdrawals.</p>
            <p>After RRIF conversion, the balance will decline as mandatory minimums are taken each year. If the balance appears to grow into the RRIF phase, the portfolio return rate is outpacing the minimum withdrawal — which becomes increasingly unlikely at older ages as minimums accelerate.</p>
          </div>
        }>
        <PlotlyChart
          data={withTotals(chartData)}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: ',.0f', title: { text: 'Account Balance ($)', font: { size: 11 } }, range: [0, maxRrsp > 0 ? maxRrsp * 1.05 : 10000] },
            xaxis: { ...buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge) },
          }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>

    </CardGrid>
  )
}
