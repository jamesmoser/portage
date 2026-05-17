import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { exactAgeAt, getYear, dateAtAge } from '../../engine/dates'
import type { NonRegAccount } from '../../engine/types'
import { CHART_COLORS } from '../PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

function NonRegSection({ label, account, onChange, personColor }: {
  label: string
  account: NonRegAccount
  onChange: (v: NonRegAccount) => void
  personColor?: string
}) {
  return (
    <SectionCard title={label} width="half" personColor={personColor}>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Current Balance" value={account.balance}
          onChange={v => onChange({ ...account, balance: v })}
          prefix="$" min={0} step={1000} decimals={0} />
        <NumberInput label="Adjusted Cost Base (ACB)" value={account.acb}
          onChange={v => onChange({ ...account, acb: v })}
          prefix="$" min={0} step={1000} decimals={0}
          tooltip="Book value — only the gain above ACB is subject to capital gains tax on withdrawal." />
        <NumberInput label="Annual Contribution" value={account.annualContribution}
          onChange={v => onChange({ ...account, annualContribution: v })}
          prefix="$" min={0} step={500} decimals={0} />
        <div /> {/* spacer */}
        <div className="col-span-2">
          <ToggleInput label="Override Return Rate"
            value={account.returnRateOverrideEnabled}
            onChange={v => onChange({ ...account, returnRateOverrideEnabled: v })} />
        </div>
        {account.returnRateOverrideEnabled && (
          <div className="col-span-2">
            <NumberInput label="Return Rate" value={account.returnRateOverridePct}
              onChange={v => onChange({ ...account, returnRateOverridePct: v })}
              suffix="%" min={0} max={30} step={0.1} decimals={1} size="sm" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
        <p className="text-xs font-medium text-slate-500">Annual yield rates (% of portfolio balance)</p>
        <p className="text-xs text-slate-400 -mt-1">
          These flows are taxable each year regardless of sales. Capital gains are realized on withdrawal via ACB.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="Canadian Eligible Dividends"
            value={account.eligibleDivYieldPct}
            onChange={v => onChange({ ...account, eligibleDivYieldPct: v })}
            suffix="% / yr" min={0} max={20} step={0.1} decimals={1} size="sm"
            tooltip="Annual eligible dividend income as % of balance. Grossed up 38%, eligible for dividend tax credit." />
          <NumberInput label="Foreign Income"
            value={account.foreignIncomeYieldPct}
            onChange={v => onChange({ ...account, foreignIncomeYieldPct: v })}
            suffix="% / yr" min={0} max={20} step={0.1} decimals={1} size="sm"
            tooltip="US/international distributions as % of balance. Taxed at full marginal rate." />
          <NumberInput label="Interest"
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

  const retireYearA = getYear(personA.retirementDate)
  const retireYearB = getYear(personB.retirementDate)

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
    const contribA = aAlive && year < retireYearA && nonRegA.annualContribution > 0 ? nonRegA.annualContribution * infl : 0
    const contribB = bAlive && year < retireYearB && nonRegB.annualContribution > 0 ? nonRegB.annualContribution * infl : 0
    balA = (balA + contribA) * (1 + nomRet(nonRegA))
    balB = (balB + contribB) * (1 + nomRet(nonRegB))
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
        account={nonRegA} onChange={v => update('nonRegA', v)} personColor={personA.color} />
      <NonRegSection label={`Non-Registered — ${bName}`}
        account={nonRegB} onChange={v => update('nonRegB', v)} personColor={personB.color} />

      <SectionCard title="Non-Registered Balances" width="full"
        info="Account balance without plan withdrawals — contributions (until retirement) and growth only. The full plan balance (after spending gap withdrawals) is shown in the Income Overview tab.">
        <PlotlyChart
          data={chartData}
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
