import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart, withTotals } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { DEFAULT_STATE } from '../../engine/defaults'
import { exactAgeAt, getYear, dateAtAge } from '../../engine/dates'
import { CHART_COLORS } from '../PaletteTab'
import type { TFSAAccount } from '../../engine/types'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

function TFSASection({ label, account, birthDate, planningEndAge, retirementDate, onChange, onReset, personColor }: {
  label: string
  account: TFSAAccount
  birthDate: string
  planningEndAge: number
  retirementDate: string
  onChange: (v: TFSAAccount) => void
  onReset: () => void
  personColor?: string
}) {
  const deathDate = dateAtAge(birthDate, planningEndAge)

  const infoModal = (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold mb-1">Contributions and Cash Flow</p>
        <p>Annual TFSA contributions are <strong>not</strong> included in your spending profile — they are added on top as a separate cash outflow. Your spending phases should reflect lifestyle costs only. The Spending Breakdown chart on the Dashboard shows contributions as a distinct segment. This correctly models the RRSP meltdown strategy: extra RRSP withdrawals fund both lifestyle spending and TFSA contributions, with the net cash flow reflecting the true movement of money.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Tax-Free Savings Account</p>
        <p>All growth inside a TFSA is tax-free, and withdrawals are never added to taxable income. This means TFSA withdrawals have no impact on income-tested benefits such as OAS, GIS, or the Age Amount — making them the most tax-efficient source of retirement income.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Contribution Room</p>
        <p>Room accumulates every calendar year for any Canadian resident age 18+, regardless of employment or retirement status. The 2026 annual limit is $7,000, indexed to CPI in $500 increments. Any amount <strong>withdrawn in a year is restored as new contribution room on January 1 of the following year</strong> — so strategic withdrawals in one year can be re-contributed the next.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">RRSP Meltdown Strategy</p>
        <p>A common high-net-worth approach is to draw down the RRSP/RRIF early in retirement (while tax brackets are manageable) and redirect the after-tax proceeds into the TFSA each year. This shifts assets from a fully-taxable account into a permanently tax-free one, reducing future RRIF minimums and their impact on OAS clawback. To model this: set the annual TFSA contribution to the expected after-tax RRSP proceeds and use "Date of Death" as the end date.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Lump Sum vs Spread</p>
        <p>Lump sum applies the full annual contribution on Jan 1. Spread pro-rates the contribution evenly through the year. The final partial year is adjusted to the contribution end date month in both cases.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Death and Survivor Transfer</p>
        <p>A TFSA can be transferred to a surviving spouse as an <strong>exempt contribution</strong> — it does not consume the survivor's existing contribution room. The model applies this rollover automatically in the year following the first death.</p>
      </div>
    </div>
  )

  return (
    <SectionCard title={label} width="half" personColor={personColor} onReset={onReset} info={infoModal}>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Current Balance" value={account.balance}
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
    </SectionCard>
  )
}

export function TFSATab() {
  const state = useStore()
  const { tfsaA, tfsaB, personA, personB, update } = state
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

  function tfsaContrib(account: TFSAAccount, year: number, infl: number): number {
    if (account.annualContribution <= 0) return 0
    const endYear = getYear(account.contributionEndDate)
    if (year > endYear) return 0
    const base = account.annualContribution * infl
    return (account.contributionTiming === 'lump' || year < endYear)
      ? base : base * parseInt(account.contributionEndDate.substring(5, 7), 10) / 12
  }

  const tfsaAVals: number[] = [], tfsaBVals: number[] = []
  let balA = tfsaA.balance, balB = tfsaB.balance
  for (const year of years) {
    const yp = year - currentYear
    const infl = Math.pow(1 + pi, yp)
    const aAlive = year <= endYearA, bAlive = year <= endYearB
    // Spousal rollover at death
    if (!aAlive && balA > 0) { balB += balA; balA = 0 }
    if (!bAlive && balB > 0) { balA += balB; balB = 0 }
    const age = exactAgeAt(refBirth, `${year}-06-15`)
    const nomRet = (acct: TFSAAccount) => acct.returnRateOverrideEnabled ? acct.returnRateOverridePct / 100
      : age < 55 ? rates.upTo55 / 100 : age < 65 ? rates.from55to65 / 100
      : age < 70 ? rates.from65to70 / 100 : rates.from70plus / 100
    balA = (balA + (aAlive ? tfsaContrib(tfsaA, year, infl) : 0)) * (1 + nomRet(tfsaA))
    balB = (balB + (bAlive ? tfsaContrib(tfsaB, year, infl) : 0)) * (1 + nomRet(tfsaB))
    tfsaAVals.push(balA / infl)
    tfsaBVals.push(balB / infl)
  }
  const maxTfsa = Math.max(0, ...tfsaAVals.map((a, i) => a + tfsaBVals[i]))
  const chartData: Data[] = [
    { x: years, y: tfsaAVals, name: `${aName} TFSA`, type: 'bar', marker: { color: CHART_COLORS.tfsaA } },
    { x: years, y: tfsaBVals, name: `${bName} TFSA`, type: 'bar', marker: { color: CHART_COLORS.tfsaB } },
  ]

  return (
    <CardGrid>
      <TFSASection label={`TFSA — ${aName}`}
        account={tfsaA} birthDate={personA.birthDate} planningEndAge={personA.planningEndAge}
        retirementDate={personA.retirementDate}
        onChange={v => update('tfsaA', v)}
        onReset={() => update('tfsaA', { ...DEFAULT_STATE.tfsaA, contributionEndDate: dateAtAge(personA.birthDate, personA.planningEndAge) })}
        personColor={personA.color} />
      <TFSASection label={`TFSA — ${bName}`}
        account={tfsaB} birthDate={personB.birthDate} planningEndAge={personB.planningEndAge}
        retirementDate={personB.retirementDate}
        onChange={v => update('tfsaB', v)}
        onReset={() => update('tfsaB', { ...DEFAULT_STATE.tfsaB, contributionEndDate: dateAtAge(personB.birthDate, personB.planningEndAge) })}
        personColor={personB.color} />

      <SectionCard title="TFSA Balances" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Projected TFSA balance over time based on contributions, growth, and the spousal rollover at first death. Balances are in today's dollars.</p>
            <p>This is a <em>standalone preview</em> — withdrawals made by the drawdown strategy in the Dashboard are not included here. Use this chart to see whether contributions are building the TFSA as expected and when the balance would peak. The Dashboard shows the full simulated result including spending gap draws.</p>
            <p>After the first death, the surviving spouse's TFSA bar will step up as the deceased's balance rolls over — this transfer does not consume the survivor's contribution room.</p>
          </div>
        }>
        <PlotlyChart
          data={withTotals(chartData)}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: ',.0f', title: { text: 'Account Balance ($)', font: { size: 11 } }, range: [0, maxTfsa > 0 ? maxTfsa * 1.05 : 10000] },
            xaxis: { ...buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge) },
          }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>
    </CardGrid>
  )
}
