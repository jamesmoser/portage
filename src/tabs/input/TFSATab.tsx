import { useMemo, useState, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { runProjection } from '../../engine/projection'
import { CHART_COLORS } from '../PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

export function TFSATab() {
  const state = useStore()
  const { tfsaA, tfsaB, personA, personB, update } = state
  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')
  const currentYear = new Date().getFullYear()

  // When unchecking "stop at retirement", ensure a valid year is shown (guard against stale 0 in localStorage)
  const setStopAtRetirementA = useCallback((v: boolean) => {
    update('tfsaA', { ...tfsaA, contributionStopAtRetirement: v, contributionEndYear: !v && tfsaA.contributionEndYear < 2000 ? currentYear : tfsaA.contributionEndYear })
  }, [tfsaA, currentYear, update])
  const setStopAtRetirementB = useCallback((v: boolean) => {
    update('tfsaB', { ...tfsaB, contributionStopAtRetirement: v, contributionEndYear: !v && tfsaB.contributionEndYear < 2000 ? currentYear : tfsaB.contributionEndYear })
  }, [tfsaB, currentYear, update])

  const { dataPoints } = useMemo(() => runProjection(state), [state])

  const years = dataPoints.map(d => d.year)
  const chartData: Data[] = [
    { x: years, y: dataPoints.map(d => d.tfsaA), name: `${aName} TFSA`, type: 'bar', marker: { color: CHART_COLORS.tfsaA } },
    { x: years, y: dataPoints.map(d => d.tfsaB), name: `${bName} TFSA`, type: 'bar', marker: { color: CHART_COLORS.tfsaB } },
  ]

  return (
    <CardGrid>
      <SectionCard title={`TFSA — ${aName}`} width="half" personColor={personA.color}>
        <div className="space-y-3">
          <NumberInput label="Current Balance" value={tfsaA.balance}
            onChange={v => update('tfsaA', { ...tfsaA, balance: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Annual Contribution" value={tfsaA.annualContribution}
            onChange={v => update('tfsaA', { ...tfsaA, annualContribution: v })}
            prefix="$" min={0} step={500} decimals={0} />
          <ToggleInput label="Stop Contributions at Retirement"
            value={tfsaA.contributionStopAtRetirement}
            onChange={setStopAtRetirementA} />
          {!tfsaA.contributionStopAtRetirement && (
            <NumberInput label="Final Contribution Year" value={tfsaA.contributionEndYear}
              onChange={v => update('tfsaA', { ...tfsaA, contributionEndYear: v })}
              min={2000} max={2100} step={1} decimals={0} size="sm" />
          )}
          <ToggleInput label="Override Return Rate"
            value={tfsaA.returnRateOverrideEnabled}
            onChange={v => update('tfsaA', { ...tfsaA, returnRateOverrideEnabled: v })} />
          {tfsaA.returnRateOverrideEnabled && (
            <NumberInput label="Return Rate" value={tfsaA.returnRateOverridePct}
              onChange={v => update('tfsaA', { ...tfsaA, returnRateOverridePct: v })}
              suffix="%" min={0} max={30} step={0.1} decimals={1} size="sm" />
          )}
        </div>
      </SectionCard>

      <SectionCard title={`TFSA — ${bName}`} width="half" personColor={personB.color}>
        <div className="space-y-3">
          <NumberInput label="Current Balance" value={tfsaB.balance}
            onChange={v => update('tfsaB', { ...tfsaB, balance: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Annual Contribution" value={tfsaB.annualContribution}
            onChange={v => update('tfsaB', { ...tfsaB, annualContribution: v })}
            prefix="$" min={0} step={500} decimals={0} />
          <ToggleInput label="Stop Contributions at Retirement"
            value={tfsaB.contributionStopAtRetirement}
            onChange={setStopAtRetirementB} />
          {!tfsaB.contributionStopAtRetirement && (
            <NumberInput label="Final Contribution Year" value={tfsaB.contributionEndYear}
              onChange={v => update('tfsaB', { ...tfsaB, contributionEndYear: v })}
              min={2000} max={2100} step={1} decimals={0} size="sm" />
          )}
          <ToggleInput label="Override Return Rate"
            value={tfsaB.returnRateOverrideEnabled}
            onChange={v => update('tfsaB', { ...tfsaB, returnRateOverrideEnabled: v })} />
          {tfsaB.returnRateOverrideEnabled && (
            <NumberInput label="Return Rate" value={tfsaB.returnRateOverridePct}
              onChange={v => update('tfsaB', { ...tfsaB, returnRateOverridePct: v })}
              suffix="%" min={0} max={30} step={0.1} decimals={1} size="sm" />
          )}
        </div>
      </SectionCard>

      <SectionCard title="TFSA Balances — Present-Day Dollars" width="full">
        {dataPoints.length > 0 ? (
          <>
            <PlotlyChart
              data={chartData}
              layout={{
                barmode: 'stack',
                yaxis: { tickformat: ',.0f', title: { text: 'Account Balance ($)', font: { size: 11 } } },
                xaxis: { ...buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate) },
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
