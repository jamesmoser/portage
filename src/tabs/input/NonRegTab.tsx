import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart, withTotals } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { exactAgeAt, getYear, dateAtAge } from '../../engine/dates'
import { DEFAULT_STATE } from '../../engine/defaults'
import type { NonRegAccount } from '../../engine/types'
import { CHART_COLORS } from '../PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

function NonRegSection({ label, account, birthDate, planningEndAge, retirementDate, onChange, onReset, personColor }: {
  label: string
  account: NonRegAccount
  birthDate: string
  planningEndAge: number
  retirementDate: string
  onChange: (v: NonRegAccount) => void
  onReset: () => void
  personColor?: string
}) {
  const deathDate = dateAtAge(birthDate, planningEndAge)

  const infoModal = (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold mb-1">Contributions and Cash Flow</p>
        <p>Annual non-registered contributions are <strong>not</strong> included in your spending profile — they are added on top as a separate cash outflow. Your spending phases should reflect lifestyle costs only. The Spending Breakdown chart on the Dashboard shows contributions as a distinct segment alongside lifestyle spending.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Non-Registered Account</p>
        <p>A non-registered account has no contribution limits and no tax shelter. Growth is partially taxable each year through dividends and interest, and capital gains are realized when you sell or withdraw. This makes it the least tax-efficient account, but it's also the most flexible — no limits on contributions, withdrawals, or investment type.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Adjusted Cost Base (ACB)</p>
        <p>The ACB is your total book value — what you paid for your holdings. Only the gain above ACB is subject to capital gains tax when you withdraw. The model tracks the ACB ratio: when you withdraw a portion of the account, the same proportion of ACB is consumed, and only the excess is a taxable gain. Enter the current ACB to get accurate capital gains calculations.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Annual Yield Rates</p>
        <p>These represent income flows that are taxable each year, regardless of whether you sell anything:</p>
        <ul className="mt-1 ml-3 space-y-0.5 list-disc list-outside">
          <li><strong>Canadian eligible dividends</strong> — grossed up 38% and eligible for the federal and Ontario dividend tax credit. Most tax-efficient of the three.</li>
          <li><strong>Foreign income</strong> — US and international distributions taxed at your full marginal rate (no gross-up or credit).</li>
          <li><strong>Interest</strong> — bonds, GICs, and savings interest, taxed at full marginal rate.</li>
        </ul>
        <p className="mt-1">Capital gains from portfolio growth are only realized on withdrawal — not tracked annually.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Contributions and Timing</p>
        <p>Lump sum applies the full annual contribution on Jan 1. Spread pro-rates evenly through the year. The final partial year is adjusted to the end date month.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Death and Survivor Transfer</p>
        <p>At death, the non-registered account is transferred to the surviving spouse at its original ACB — the embedded capital gain is deferred, not triggered. The model transfers both balance and ACB to the survivor in the year following the first death.</p>
      </div>
    </div>
  )

  return (
    <SectionCard title={label} width="half" personColor={personColor} onReset={onReset} info={infoModal}>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Current Balance" value={account.balance}
          onChange={v => onChange({ ...account, balance: v })}
          prefix="$" min={0} step={1000} decimals={0} />
        <NumberInput label="Adjusted Cost Base (ACB)" value={account.acb}
          onChange={v => onChange({ ...account, acb: v })}
          prefix="$" min={0} step={1000} decimals={0}
          tooltip="Book value — only the gain above ACB is subject to capital gains tax on withdrawal." />
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
            tooltip="On: full annual contribution applied Jan 1. Off: contribution spread evenly, with the final year pro-rated to the end date month." />
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
          <button type="button" className="btn-primary shrink-0"
            onClick={() => onChange({ ...account, contributionEndDate: deathDate })}>
            Use Date of Death
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="Annual Eligible Dividends"
            value={account.eligibleDivYieldPct}
            onChange={v => onChange({ ...account, eligibleDivYieldPct: v })}
            suffix="% / yr" min={0} max={20} step={0.1} decimals={1} size="sm"
            tooltip="Annual eligible dividend income as % of balance. Grossed up 38%, eligible for dividend tax credit." />
          <NumberInput label="Annual Foreign Income"
            value={account.foreignIncomeYieldPct}
            onChange={v => onChange({ ...account, foreignIncomeYieldPct: v })}
            suffix="% / yr" min={0} max={20} step={0.1} decimals={1} size="sm"
            tooltip="US/international distributions as % of balance. Taxed at full marginal rate." />
          <NumberInput label="Annual Interest"
            value={account.interestYieldPct}
            onChange={v => onChange({ ...account, interestYieldPct: v })}
            suffix="% / yr" min={0} max={20} step={0.1} decimals={1} size="sm"
            tooltip="Bond, GIC, or savings interest as % of balance. Taxed at full marginal rate." />
        </div>
      </div>
    </SectionCard>
  )
}

export function NonRegTab() {
  const state = useStore()
  const { nonRegA, nonRegB, personA, personB, update } = state
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

  function nonRegContrib(account: NonRegAccount, year: number, infl: number): number {
    if (account.annualContribution <= 0) return 0
    const endYear = getYear(account.contributionEndDate)
    if (year > endYear) return 0
    const base = account.annualContribution * infl
    return (account.contributionTiming === 'lump' || year < endYear)
      ? base : base * parseInt(account.contributionEndDate.substring(5, 7), 10) / 12
  }

  const nonRegAVals: number[] = [], nonRegBVals: number[] = []
  let balA = nonRegA.balance, balB = nonRegB.balance
  for (const year of years) {
    const yp = year - currentYear
    const infl = Math.pow(1 + pi, yp)
    const aAlive = year <= endYearA, bAlive = year <= endYearB
    // Spousal rollover at death (balance + ACB transfer, gain stays deferred)
    if (!aAlive && balA > 0) { balB += balA; balA = 0 }
    if (!bAlive && balB > 0) { balA += balB; balB = 0 }
    const age = exactAgeAt(refBirth, `${year}-06-15`)
    const nomRet = (acct: NonRegAccount) => acct.returnRateOverrideEnabled ? acct.returnRateOverridePct / 100
      : age < 55 ? rates.upTo55 / 100 : age < 65 ? rates.from55to65 / 100
      : age < 70 ? rates.from65to70 / 100 : rates.from70plus / 100
    balA = (balA + (aAlive ? nonRegContrib(nonRegA, year, infl) : 0)) * (1 + nomRet(nonRegA))
    balB = (balB + (bAlive ? nonRegContrib(nonRegB, year, infl) : 0)) * (1 + nomRet(nonRegB))
    nonRegAVals.push(balA / infl)
    nonRegBVals.push(balB / infl)
  }
  const maxNonReg = Math.max(0, ...nonRegAVals.map((a, i) => a + nonRegBVals[i]))
  const chartData: Data[] = [
    { x: years, y: nonRegAVals, name: `${aName} Non-Reg`, type: 'bar', marker: { color: CHART_COLORS.nonRegA } },
    { x: years, y: nonRegBVals, name: `${bName} Non-Reg`, type: 'bar', marker: { color: CHART_COLORS.nonRegB } },
  ]

  return (
    <CardGrid>
      <NonRegSection label={`Non-Registered — ${aName}`}
        account={nonRegA} birthDate={personA.birthDate} planningEndAge={personA.planningEndAge}
        retirementDate={personA.retirementDate}
        onChange={v => update('nonRegA', v)}
        onReset={() => update('nonRegA', { ...DEFAULT_STATE.nonRegA, contributionEndDate: personA.retirementDate })}
        personColor={personA.color} />
      <NonRegSection label={`Non-Registered — ${bName}`}
        account={nonRegB} birthDate={personB.birthDate} planningEndAge={personB.planningEndAge}
        retirementDate={personB.retirementDate}
        onChange={v => update('nonRegB', v)}
        onReset={() => update('nonRegB', { ...DEFAULT_STATE.nonRegB, contributionEndDate: personB.retirementDate })}
        personColor={personB.color} />

      <SectionCard title="Non-Registered Balances" width="full"
        info="Account balance without plan withdrawals — contributions (until retirement) and growth only. The full plan balance (after spending gap withdrawals) is shown in the Income Overview tab.">
        <PlotlyChart
          data={withTotals(chartData)}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: ',.0f', title: { text: 'Account Balance ($)', font: { size: 11 } }, range: [0, maxNonReg > 0 ? maxNonReg * 1.05 : 10000] },
            xaxis: { ...buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge) },
          }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>
    </CardGrid>
  )
}
