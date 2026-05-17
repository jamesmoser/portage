import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { exactAgeAt, getYear, dateAtAge } from '../../engine/dates'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

function cppAdjFactor(startDate: string, birthDate: string): number {
  const age = exactAgeAt(birthDate, startDate)
  if (age <= 65) return Math.max(0, 1 - 0.006 * (65 - age) * 12)
  return Math.min(1 + 0.007 * (age - 65) * 12, 1.42)
}

function oasAdjFactor(startDate: string, birthDate: string): number {
  const age = exactAgeAt(birthDate, startDate)
  if (age <= 65) return 1.0
  return Math.min(1 + 0.006 * (age - 65) * 12, 1.36)
}

interface MiniChartProps {
  label: string
  monthlyAt65: number
  startDate: string
  birthDate: string
  planEndAge: number
  adjFactor: number
  cpiRatePct: number
  personalInflationRatePct: number
  color: string
  personABirth: string
  personBBirth: string
  aLabel: string
  bLabel: string
  xAxisMode: XAxisMode
}

function BenefitMiniChart({ label, monthlyAt65, startDate, birthDate, planEndAge, adjFactor, cpiRatePct, personalInflationRatePct, color, personABirth, personBBirth, xAxisMode }: MiniChartProps) {
  const currentYear = new Date().getFullYear()
  const startYear   = getYear(startDate)
  const endYear     = getYear(dateAtAge(birthDate, planEndAge))
  const cpi = cpiRatePct / 100
  const pi  = personalInflationRatePct / 100
  const annualAdjusted = monthlyAt65 * 12 * adjFactor

  const years: number[] = []
  const values: number[] = []

  for (let y = currentYear; y <= endYear; y++) {
    const active         = y >= startYear
    const yearsFromStart = active ? Math.max(0, y - startYear) : 0
    const yearsFromNow   = y - currentYear
    const nominal        = active ? annualAdjusted * Math.pow(1 + cpi, yearsFromStart) : 0
    const pd             = nominal / Math.pow(1 + pi, Math.max(0, yearsFromNow))
    years.push(y)
    values.push(pd)
  }

  const data: Data[] = [{
    x: years, y: values,
    type: 'bar',
    name: label,
    marker: { color },
  }]

  return (
    <PlotlyChart
      data={data}
      layout={{
        yaxis: { tickformat: '$,.0f', title: { text: "Annual $ (today's)", font: { size: 10 } } },
        xaxis: { ...buildXAxis(years, xAxisMode, personABirth, personBBirth) },
        showlegend: false,
      }}
      style={{ height: 200 }}
    />
  )
}

export function CPPOASTab() {
  const { cppA, cppB, oasA, oasB, personA, personB, cpiRatePct, personalInflationRatePct, taxSettings, update } = useStore()
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')
  const aName = personA.name || 'A'
  const bName = personB.name || 'B'

  const cppFactA = cppAdjFactor(cppA.startDate, personA.birthDate)
  const cppFactB = cppAdjFactor(cppB.startDate, personB.birthDate)
  const oasFactA = oasAdjFactor(oasA.startDate, personA.birthDate)
  const oasFactB = oasAdjFactor(oasB.startDate, personB.birthDate)

  const cppAgeA = exactAgeAt(personA.birthDate, cppA.startDate)
  const cppAgeB = exactAgeAt(personB.birthDate, cppB.startDate)
  const oasAgeA = exactAgeAt(personA.birthDate, oasA.startDate)
  const oasAgeB = exactAgeAt(personB.birthDate, oasB.startDate)

  return (
    <CardGrid>
      {/* CPP Person A */}
      <SectionCard title={`CPP — ${personA.name || 'Person A'}`} width="half" personColor={personA.color}>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput
            label="Estimated Monthly CPP at Age 65 (today's $)"
            value={cppA.estimatedMonthlyAt65}
            onChange={v => update('cppA', { ...cppA, estimatedMonthlyAt65: v })}
            prefix="$"
            min={0} max={1400} step={10} decimals={0}
            tooltip="From your My Service Canada Account — select 'Estimated monthly CPP retirement pension at age 65'"
          />
          <DateInput
            label="CPP Start Date"
            value={cppA.startDate}
            onChange={v => update('cppA', { ...cppA, startDate: v })}
            tooltip="You can start CPP between age 60 and 70. Starting before 65 reduces the amount; after 65 increases it."
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-slate-400">Start Age</div>
            <div className="text-sm font-semibold text-slate-700">{cppAgeA.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjustment Factor</div>
            <div className={`text-sm font-semibold ${cppFactA >= 1 ? 'text-green-700' : 'text-amber-600'}`}>
              {(cppFactA * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Monthly (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(cppA.estimatedMonthlyAt65 * cppFactA).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Annual (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(cppA.estimatedMonthlyAt65 * 12 * cppFactA).toFixed(0)}
            </div>
          </div>
        </div>
        {cppA.estimatedMonthlyAt65 > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-400 mb-1">Annual CPP in present-day dollars over time:</p>
            <BenefitMiniChart
              label="CPP A" monthlyAt65={cppA.estimatedMonthlyAt65} startDate={cppA.startDate}
              birthDate={personA.birthDate} planEndAge={personA.planningEndAge}
              adjFactor={cppFactA} cpiRatePct={cpiRatePct}
              personalInflationRatePct={personalInflationRatePct} color={personA.color}
              personABirth={personA.birthDate} personBBirth={personB.birthDate}
              aLabel={aName} bLabel={bName} xAxisMode={xAxisMode}
            />
          </div>
        )}
      </SectionCard>

      {/* CPP Person B */}
      <SectionCard title={`CPP — ${personB.name || 'Person B'}`} width="half" personColor={personB.color}>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput
            label="Estimated Monthly CPP at Age 65 (today's $)"
            value={cppB.estimatedMonthlyAt65}
            onChange={v => update('cppB', { ...cppB, estimatedMonthlyAt65: v })}
            prefix="$"
            min={0} max={1400} step={10} decimals={0}
          />
          <DateInput
            label="CPP Start Date"
            value={cppB.startDate}
            onChange={v => update('cppB', { ...cppB, startDate: v })}
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-slate-400">Start Age</div>
            <div className="text-sm font-semibold text-slate-700">{cppAgeB.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjustment Factor</div>
            <div className={`text-sm font-semibold ${cppFactB >= 1 ? 'text-green-700' : 'text-amber-600'}`}>
              {(cppFactB * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Monthly (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(cppB.estimatedMonthlyAt65 * cppFactB).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Annual (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(cppB.estimatedMonthlyAt65 * 12 * cppFactB).toFixed(0)}
            </div>
          </div>
        </div>
        {cppB.estimatedMonthlyAt65 > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-400 mb-1">Annual CPP in present-day dollars over time:</p>
            <BenefitMiniChart
              label="CPP B" monthlyAt65={cppB.estimatedMonthlyAt65} startDate={cppB.startDate}
              birthDate={personB.birthDate} planEndAge={personB.planningEndAge}
              adjFactor={cppFactB} cpiRatePct={cpiRatePct}
              personalInflationRatePct={personalInflationRatePct} color={personB.color}
              personABirth={personA.birthDate} personBBirth={personB.birthDate}
              aLabel={aName} bLabel={bName} xAxisMode={xAxisMode}
            />
          </div>
        )}
      </SectionCard>

      {/* CPP rules callout */}
      <SectionCard title="CPP Adjustment Rules" width="full">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
          {[
            { title: 'Age 60 (earliest)', body: 'Reduced by 36% from age-65 amount', detail: 'Factor: 64%' },
            { title: 'Before 65',         body: '−0.6% per month early',             detail: 'Max reduction: 36%' },
            { title: 'After 65',          body: '+0.7% per month deferred',           detail: 'Max increase: 42%' },
            { title: 'Age 70 (latest)',   body: 'Maximum benefit — no further increase', detail: 'Factor: 142%' },
          ].map(item => (
            <div key={item.title} className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
              <div className="font-semibold mb-1">{item.title}</div>
              <div>{item.body}</div>
              <div className="font-medium mt-0.5">{item.detail}</div>
            </div>
          ))}
        </div>
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>

      {/* OAS Person A */}
      <SectionCard title={`OAS — ${personA.name || 'Person A'}`} width="half" personColor={personA.color}>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput
            label="Estimated Monthly OAS at Age 65 (today's $)"
            value={oasA.estimatedMonthlyAt65}
            onChange={v => update('oasA', { ...oasA, estimatedMonthlyAt65: v })}
            prefix="$"
            min={0} max={900} step={1} decimals={0}
            tooltip="Standard 2024 max OAS is ~$713/mo. Reduced if fewer than 40 years of Canadian residency."
          />
          <DateInput
            label="OAS Start Date"
            value={oasA.startDate}
            onChange={v => update('oasA', { ...oasA, startDate: v })}
            tooltip="OAS can start between 65 and 70. Each month deferred past 65 increases OAS by 0.6% (max +36% at 70)."
          />
          <ToggleInput
            label="GIS Eligible (Guaranteed Income Supplement)"
            value={oasA.gisEligible}
            onChange={v => update('oasA', { ...oasA, gisEligible: v })}
            tooltip="GIS is an additional non-taxable benefit for low-income OAS recipients"
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-slate-400">Start Age</div>
            <div className="text-sm font-semibold text-slate-700">{oasAgeA.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Deferral Bonus</div>
            <div className={`text-sm font-semibold ${oasFactA > 1 ? 'text-green-700' : 'text-slate-700'}`}>
              {(oasFactA * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Monthly (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(oasA.estimatedMonthlyAt65 * oasFactA).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Annual (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(oasA.estimatedMonthlyAt65 * 12 * oasFactA).toFixed(0)}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* OAS Person B */}
      <SectionCard title={`OAS — ${personB.name || 'Person B'}`} width="half" personColor={personB.color}>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput
            label="Estimated Monthly OAS at Age 65 (today's $)"
            value={oasB.estimatedMonthlyAt65}
            onChange={v => update('oasB', { ...oasB, estimatedMonthlyAt65: v })}
            prefix="$"
            min={0} max={900} step={1} decimals={0}
          />
          <DateInput
            label="OAS Start Date"
            value={oasB.startDate}
            onChange={v => update('oasB', { ...oasB, startDate: v })}
          />
          <ToggleInput
            label="GIS Eligible"
            value={oasB.gisEligible}
            onChange={v => update('oasB', { ...oasB, gisEligible: v })}
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-slate-400">Start Age</div>
            <div className="text-sm font-semibold text-slate-700">{oasAgeB.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Deferral Bonus</div>
            <div className={`text-sm font-semibold ${oasFactB > 1 ? 'text-green-700' : 'text-slate-700'}`}>
              {(oasFactB * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Monthly (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(oasB.estimatedMonthlyAt65 * oasFactB).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Adjusted Annual (today's $)</div>
            <div className="text-sm font-semibold text-blue-700">
              ${(oasB.estimatedMonthlyAt65 * 12 * oasFactB).toFixed(0)}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* OAS Clawback */}
      <SectionCard title="OAS Clawback" width="full">
        <div className="grid grid-cols-2 gap-3 items-end">
          <NumberInput
            label="Clawback Threshold (today's $)"
            value={taxSettings.oasClawbackThreshold}
            onChange={v => update('taxSettings', { ...taxSettings, oasClawbackThreshold: v })}
            prefix="$"
            min={0} step={100} decimals={0}
            tooltip="Net income above this threshold triggers OAS recovery tax. 2024 value: $90,997. Indexed to CPI each year."
          />
          <div className="text-xs text-slate-500 pb-1.5">
            <span className="font-medium">Recovery tax:</span> 15% of net income above threshold, up to the full OAS received.
            Individual, not household — calculated separately for each person.
          </div>
        </div>
      </SectionCard>
    </CardGrid>
  )
}
