import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { InfoPanel } from '../../components/InfoPanel'
import { getYear, dateAtAge, dateAtDecimalAge } from '../../engine/dates'
import type { DBPension } from '../../engine/types'
import { DEFAULT_STATE } from '../../engine/defaults'
import { CHART_COLORS } from '../PaletteTab'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

interface PersonPensionCardProps {
  label: string
  pension: DBPension
  onChange: (updates: Partial<DBPension>) => void
  onReset: () => void
  personColor: string
  retirementDate: string
  cpiRatePct: number
  personalInflationRatePct: number
}

function PersonPensionCard({ label, pension, onChange, onReset, personColor, retirementDate, cpiRatePct, personalInflationRatePct }: PersonPensionCardProps) {
  return (
    <SectionCard title={label} width="half" personColor={personColor} onReset={onReset}>
      <div className="mb-4">
        <ToggleInput
          label="Has Defined Benefit Pension"
          value={pension.enabled}
          onChange={v => onChange({ enabled: v })}
        />
      </div>

      {pension.enabled && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <div className="flex items-end gap-2">
              <DateInput
                label="First Payment Date"
                value={pension.startDate}
                onChange={v => onChange({ startDate: v })}
                tooltip="Date the pension first pays — typically the month after retirement."
              />
              <button
                type="button"
                className="btn-primary shrink-0"
                onClick={() => onChange({ startDate: retirementDate })}
              >
                Use Retirement Date
              </button>
            </div>
          </div>
          <div className="col-span-2">
            <NumberInput
              label="Lifetime Annual Benefit"
              value={pension.annualAmount}
              onChange={v => onChange({ annualAmount: v })}
              prefix="$" min={0} step={100} decimals={0}
              tooltip="Gross pension payment for life, before taxes. Enter the calculated amount after any early retirement reduction."
            />
          </div>
          <NumberInput
            label="Bridge Benefit"
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
              label="Survivor Benefit"
              value={pension.survivorBenefitPct * 100}
              onChange={v => onChange({ survivorBenefitPct: v / 100 })}
              suffix="%" min={0} max={100} step={1} decimals={0} size="sm"
              tooltip="Fraction of the lifetime benefit paid to the surviving spouse. Common values: 60%, 66.67%, 100%."
            />
          </div>
          <ToggleInput
            label="Indexed"
            value={pension.cpiIndexed}
            onChange={v => onChange({ cpiIndexed: v, indexingRatePct: v ? cpiRatePct : 0 })}
          />
          <div className="flex items-end gap-2">
            <NumberInput
              label="Indexing Rate"
              value={pension.indexingRatePct ?? 0}
              onChange={v => onChange({ indexingRatePct: v })}
              suffix="% / year" min={0} max={20} step={0.1} decimals={2} size="sm"
              tooltip="Annual rate at which pension payments grow. Auto-set to CPI when indexing is enabled."
              disabled={!pension.cpiIndexed}
            />
            <button
              type="button"
              className="btn-primary shrink-0"
              onClick={() => onChange({ indexingRatePct: cpiRatePct })}
              disabled={!pension.cpiIndexed}
            >
              Use CPI
            </button>
          </div>
          <ToggleInput
            label="Apply Indexing Cap"
            value={pension.cpiIndexingCapEnabled ?? false}
            onChange={v => onChange({ cpiIndexingCapEnabled: v })}
            disabled={!pension.cpiIndexed}
          />
          <NumberInput
            label="Indexing Cap"
            value={pension.cpiIndexingCap}
            onChange={v => onChange({ cpiIndexingCap: v })}
            suffix="% / year" min={0} max={10} step={0.1} decimals={2} size="sm"
            tooltip="Maximum annual indexing adjustment. Common: 3% for OMERS."
            disabled={!pension.cpiIndexed || !(pension.cpiIndexingCapEnabled ?? false)}
          />
          <div className="col-span-2">
            {(() => {
              const rawRate    = pension.indexingRatePct ?? cpiRatePct
              const capOn     = pension.cpiIndexingCapEnabled ?? false
              const effectiveRate = pension.cpiIndexed
                ? (capOn && pension.cpiIndexingCap > 0 ? Math.min(rawRate, pension.cpiIndexingCap) : rawRate)
                : 0
              const realImpact = effectiveRate - personalInflationRatePct
              const realAbs = Math.abs(realImpact).toFixed(2)
              const capActive = pension.cpiIndexed && capOn && pension.cpiIndexingCap > 0 && rawRate > pension.cpiIndexingCap

              return (
                <InfoPanel>
                  {pension.cpiIndexed ? (
                    <>
                      Payments are indexed at <strong>{effectiveRate.toFixed(2)}% / year</strong>
                      {capActive && <> (capped at {pension.cpiIndexingCap.toFixed(2)}%; rate is {rawRate.toFixed(2)}%)</>}.{' '}
                      In today's dollars, purchasing power effectively{' '}
                      {Math.abs(realImpact) < 0.005
                        ? <strong>stays flat</strong>
                        : realImpact > 0
                          ? <strong>increases by {realAbs}% / year</strong>
                          : <strong>erodes by {realAbs}% / year</strong>
                      }.
                    </>
                  ) : (
                    <>
                      Payments are <strong>not indexed</strong> to inflation. In today's dollars,
                      purchasing power erodes at <strong>{personalInflationRatePct.toFixed(2)}% / year</strong>.
                    </>
                  )}
                </InfoPanel>
              )
            })()}
          </div>
        </div>
      )}
    </SectionCard>
  )
}

export function DBPensionTab() {
  const { dbPensionA, dbPensionB, employmentA, employmentB, personA, personB, personalInflationRatePct, cpiRatePct, update } = useStore()
  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'
  const pi  = personalInflationRatePct / 100
  const cpi = cpiRatePct / 100
  const currentYear = new Date().getFullYear()

  const endYearA   = getYear(dateAtDecimalAge(personA.birthDate, personA.planningEndAge))
  const endYearB   = getYear(dateAtDecimalAge(personB.birthDate, personB.planningEndAge))
  const maxEndYear = Math.max(endYearA, endYearB)
  const allYears   = Array.from({ length: maxEndYear - currentYear + 1 }, (_, i) => currentYear + i)

  function pd(nom: number, y: number) {
    return nom / Math.pow(1 + pi, y - currentYear)
  }

  function pensionIndexRate(pension: DBPension): number {
    if (!pension.cpiIndexed) return 0
    const rate   = (pension.indexingRatePct != null ? pension.indexingRatePct : cpi * 100) / 100
    const capOn  = pension.cpiIndexingCapEnabled ?? (pension.cpiIndexingCap > 0)
    return capOn && pension.cpiIndexingCap > 0 ? Math.min(rate, pension.cpiIndexingCap / 100) : rate
  }

  // Count months in `year` where monthStart satisfies all active conditions.
  // fromDate: source starts on or after this date (inclusive month-start check).
  // untilDate: source ends before this date (exclusive). Pass null for no end.
  // deathDate: person alive up to and including this date. Pass null for no death cap.
  function monthFrac(year: number, fromDate: string | null, untilDate: string | null, death: string | null): number {
    let n = 0
    for (let m = 1; m <= 12; m++) {
      const md = `${year}-${String(m).padStart(2, '0')}-01`
      if (fromDate  && md < fromDate)  continue
      if (untilDate && md >= untilDate) continue
      if (death     && md > death)     continue
      n++
    }
    return n / 12
  }

  function buildEmploymentTrace(
    annualAmount: number, growthRatePct: number,
    retirementDate: string, color: string, label: string,
  ): Data {
    const retireYear = getYear(retirementDate)
    const g = growthRatePct / 100
    const vals = allYears.map(y => {
      if (y > retireYear) return 0
      const full = pd(annualAmount * Math.pow(1 + g, y - currentYear), y)
      if (y < retireYear) return full
      return full * monthFrac(y, null, retirementDate, null)
    })
    return { x: allYears, y: vals, type: 'bar', name: label, marker: { color } }
  }

  function buildPensionTraces(
    pension: DBPension, birthDate: string, planEndAge: number,
    personName: string, ltbColor: string, bridgeColor: string,
  ): Data[] {
    if (!pension.enabled || pension.annualAmount === 0) return []
    const startYear  = getYear(pension.startDate)
    const bridgeEndY = getYear(pension.bridgeBenefitEndDate)
    const death      = dateAtDecimalAge(birthDate, planEndAge)
    const endYear    = getYear(death)
    const ir         = pensionIndexRate(pension)
    const ltbVals: number[] = [], bridgeVals: number[] = []
    allYears.forEach(y => {
      if (y < startYear || y > endYear) { ltbVals.push(0); bridgeVals.push(0); return }
      const yop      = Math.max(0, y - startYear)
      const fullLtb  = pd(pension.annualAmount       * Math.pow(1 + ir, yop), y)
      const fullBrg  = pd(pension.bridgeBenefitAmount * Math.pow(1 + ir, yop), y)
      ltbVals.push(fullLtb * monthFrac(y, pension.startDate, null, death))
      bridgeVals.push(
        pension.bridgeBenefitAmount > 0 && y <= bridgeEndY
          ? fullBrg * monthFrac(y, pension.startDate, pension.bridgeBenefitEndDate, death)
          : 0
      )
    })
    return [
      { x: allYears, y: ltbVals,    type: 'bar', name: `${personName} — pension`,        marker: { color: ltbColor } },
      { x: allYears, y: bridgeVals, type: 'bar', name: `${personName} — bridge benefit`, marker: { color: bridgeColor } },
    ]
  }

  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')

  const empTraceA = buildEmploymentTrace(employmentA.annualAmount, employmentA.growthRatePct, personA.retirementDate, CHART_COLORS.employmentA, `${aName} — employment`)
  const empTraceB = buildEmploymentTrace(employmentB.annualAmount, employmentB.growthRatePct, personB.retirementDate, CHART_COLORS.employmentB, `${bName} — employment`)
  const pensionTracesA = buildPensionTraces(dbPensionA, personA.birthDate, personA.planningEndAge, aName, CHART_COLORS.pensionA, CHART_COLORS.pensionBridgeA)
  const pensionTracesB = buildPensionTraces(dbPensionB, personB.birthDate, personB.planningEndAge, bName, CHART_COLORS.pensionB, CHART_COLORS.pensionBridgeB)
  const allTraces = [empTraceA, empTraceB, ...pensionTracesA, ...pensionTracesB]
  const hasData = empTraceA.y.some((v: number) => v > 0) || empTraceB.y.some((v: number) => v > 0) || pensionTracesA.length > 0 || pensionTracesB.length > 0

  const dbXAxis = buildXAxis(allYears, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge)

  return (
    <CardGrid>
      <PersonPensionCard
        label={`Defined Benefit Pension — ${aName}`}
        pension={dbPensionA}
        onChange={updates => update('dbPensionA', { ...dbPensionA, ...updates })}
        onReset={() => update('dbPensionA', {
          ...DEFAULT_STATE.dbPensionA,
          startDate: personA.retirementDate,
          bridgeBenefitEndDate: dateAtAge(personA.birthDate, 65),
        })}
        personColor={personA.color}
        retirementDate={personA.retirementDate}
        cpiRatePct={cpiRatePct}
        personalInflationRatePct={personalInflationRatePct}
      />

      <PersonPensionCard
        label={`Defined Benefit Pension — ${bName}`}
        pension={dbPensionB}
        onChange={updates => update('dbPensionB', { ...dbPensionB, ...updates })}
        onReset={() => update('dbPensionB', {
          ...DEFAULT_STATE.dbPensionB,
          startDate: personB.retirementDate,
          bridgeBenefitEndDate: dateAtAge(personB.birthDate, 65),
        })}
        personColor={personB.color}
        retirementDate={personB.retirementDate}
        cpiRatePct={cpiRatePct}
        personalInflationRatePct={personalInflationRatePct}
      />

      <SectionCard title="Employment and Pension Income" width="full">
        {hasData
          ? <>
              <PlotlyChart
                data={allTraces}
                layout={{
                  barmode: 'stack',
                  yaxis: { tickformat: ',.0f', title: { text: 'Annual Income ($)', font: { size: 11 } } },
                  xaxis: { ...dbXAxis },
                }}
                style={{ height: 280 }}
              />
              <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
            </>
          : <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              Enter employment income or enable a defined benefit pension above to see the projection.
            </div>
        }
      </SectionCard>
    </CardGrid>
  )
}
