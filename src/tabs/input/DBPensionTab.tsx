import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { getYear, dateAtAge } from '../../engine/dates'
import type { DBPension } from '../../engine/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

interface PersonPensionCardProps {
  label: string
  pension: DBPension
  onChange: (updates: Partial<DBPension>) => void
  personColor: string
  retirementDate: string
}

function PersonPensionCard({ label, pension, onChange, personColor, retirementDate }: PersonPensionCardProps) {
  const [linked, setLinked] = useState(() => pension.startDate === retirementDate)

  // When retirementDate changes externally, keep startDate in sync if linked
  useEffect(() => {
    if (linked && pension.startDate !== retirementDate) {
      onChange({ startDate: retirementDate })
    }
  }, [retirementDate, linked]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SectionCard title={label} width="half" personColor={personColor}>
      <div className="mb-4">
        <ToggleInput
          label="Has DB Pension"
          value={pension.enabled}
          onChange={v => onChange({ enabled: v })}
        />
      </div>

      {!pension.enabled && (
        <p className="text-xs text-slate-400 italic">No defined benefit pension for this person.</p>
      )}

      {pension.enabled && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 grid grid-cols-2 gap-3 items-end">
            <ToggleInput
              label="Starts at retirement date"
              value={linked}
              onChange={v => {
                setLinked(v)
                if (v) onChange({ startDate: retirementDate })
              }}
            />
            {!linked && (
              <DateInput
                label="First Payment Date"
                value={pension.startDate}
                onChange={v => onChange({ startDate: v })}
                tooltip="Date the pension first pays — typically the month after retirement."
              />
            )}
          </div>
          <NumberInput
            label="Lifetime Annual Benefit (today's $)"
            value={pension.annualAmount}
            onChange={v => onChange({ annualAmount: v })}
            prefix="$" min={0} step={100} decimals={0}
            tooltip="Gross pension payment for life, before taxes. Enter the calculated amount after any early retirement reduction."
          />
          <NumberInput
            label="Bridge Benefit (today's $)"
            value={pension.bridgeBenefitAmount}
            onChange={v => onChange({ bridgeBenefitAmount: v })}
            prefix="$" min={0} step={100} decimals={0}
            tooltip="Temporary top-up paid in addition to the lifetime benefit, typically until CPP begins."
          />
          <DateInput
            label="Bridge Termination Date"
            value={pension.bridgeBenefitEndDate}
            onChange={v => onChange({ bridgeBenefitEndDate: v })}
            tooltip="Date the bridge benefit stops — typically when CPP starts."
          />
          <div className="col-span-2">
            <NumberInput
              label="Survivor Benefit %"
              value={pension.survivorBenefitPct * 100}
              onChange={v => onChange({ survivorBenefitPct: v / 100 })}
              suffix="%" min={0} max={100} step={1} decimals={0}
              tooltip="Fraction of the lifetime benefit paid to the surviving spouse. Common values: 60%, 66.67%, 100%."
            />
          </div>
          <ToggleInput
            label="CPI Indexed"
            value={pension.cpiIndexed}
            onChange={v => onChange({ cpiIndexed: v })}
          />
          <NumberInput
            label="Indexing Cap"
            value={pension.cpiIndexingCap}
            onChange={v => onChange({ cpiIndexingCap: v })}
            suffix="% / year" min={0} max={10} step={0.1} decimals={1}
            tooltip="Maximum annual CPI adjustment. 0 = uncapped. Common: 3% for OMERS."
            disabled={!pension.cpiIndexed}
          />
        </div>
      )}
    </SectionCard>
  )
}

export function DBPensionTab() {
  const { dbPensionA, dbPensionB, personA, personB, personalInflationRatePct, cpiRatePct, update } = useStore()
  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'
  const pi = personalInflationRatePct / 100
  const cpi = cpiRatePct / 100
  const currentYear = new Date().getFullYear()

  function buildTraces(
    pension: DBPension,
    birthDate: string,
    endAge: number,
    personName: string,
    baseColor: string,
    bridgeColor: string,
  ): Data[] {
    if (!pension.enabled || pension.annualAmount === 0) return []
    const startYear  = getYear(pension.startDate)
    const bridgeEndY = getYear(pension.bridgeBenefitEndDate)
    const endYear    = getYear(dateAtAge(birthDate, endAge))
    const indexRate  = pension.cpiIndexed
      ? (pension.cpiIndexingCap > 0 ? Math.min(cpi, pension.cpiIndexingCap / 100) : cpi)
      : 0
    const years: number[] = [], baseVals: number[] = [], bridgeVals: number[] = []
    for (let y = currentYear; y <= endYear; y++) {
      const active = y >= startYear
      const yrsOfPension = active ? Math.max(0, y - startYear) : 0
      const yrsFromNow   = y - currentYear
      const inflFactor   = Math.pow(1 + pi, yrsFromNow)
      const baseNom      = active ? pension.annualAmount * Math.pow(1 + indexRate, yrsOfPension) : 0
      const bridgeNom    = active && y < bridgeEndY && pension.bridgeBenefitAmount > 0
        ? pension.bridgeBenefitAmount * Math.pow(1 + indexRate, yrsOfPension)
        : 0
      years.push(y)
      baseVals.push(baseNom / inflFactor)
      bridgeVals.push(bridgeNom / inflFactor)
    }

    return [
      { x: years, y: baseVals,   type: 'bar', name: `${personName} — lifetime`, marker: { color: baseColor } },
      { x: years, y: bridgeVals, type: 'bar', name: `${personName} — bridge`,   marker: { color: bridgeColor } },
    ]
  }

  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')

  const tracesA = buildTraces(dbPensionA, personA.birthDate, personA.planningEndAge, aName, personA.color, '#7dd3fc')
  const tracesB = buildTraces(dbPensionB, personB.birthDate, personB.planningEndAge, bName, personB.color, '#86efac')
  const allTraces = [...tracesA, ...tracesB]

  const sampleYears = (tracesA[0]?.x ?? tracesB[0]?.x ?? []) as number[]
  const dbXAxis = buildXAxis(sampleYears, xAxisMode, personA.birthDate, personB.birthDate)

  return (
    <CardGrid>
      <PersonPensionCard
        label={`DB Pension — ${aName}`}
        pension={dbPensionA}
        onChange={updates => update('dbPensionA', { ...dbPensionA, ...updates })}
        personColor={personA.color}
        retirementDate={personA.retirementDate}
      />

      <PersonPensionCard
        label={`DB Pension — ${bName}`}
        pension={dbPensionB}
        onChange={updates => update('dbPensionB', { ...dbPensionB, ...updates })}
        personColor={personB.color}
        retirementDate={personB.retirementDate}
      />

      <SectionCard title="Present-Day Dollar Preview" width="full">
        {allTraces.length > 0
          ? <>
              <PlotlyChart
                data={allTraces}
                layout={{
                  barmode: 'stack',
                  yaxis: { tickformat: '$,.0f', title: { text: "Annual income (today's $)", font: { size: 11 } } },
                  xaxis: { ...dbXAxis },
                }}
                style={{ height: 280 }}
              />
              <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
            </>
          : <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              Enable a DB pension and enter an amount above to see the projection.
            </div>
        }
      </SectionCard>
    </CardGrid>
  )
}
