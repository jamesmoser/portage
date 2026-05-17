import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { runProjection } from '../../engine/projection'
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

  const { dataPoints } = useMemo(() => runProjection(state), [state])

  const years = dataPoints.map(d => d.year)
  const nonRegAVals = dataPoints.map(d => d.nonRegA)
  const nonRegBVals = dataPoints.map(d => d.nonRegB)
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

      <SectionCard title="Non-Registered Balances — Present-Day Dollars" width="full">
        {dataPoints.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="h-32 flex items-center justify-center text-sm text-slate-400">
            Enter a balance or contribution to see the projection.
          </div>
        )}
      </SectionCard>
    </CardGrid>
  )
}
