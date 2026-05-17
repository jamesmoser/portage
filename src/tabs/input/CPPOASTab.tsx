import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { SelectInput } from '../../components/SelectInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { exactAgeAt, dateAtAge } from '../../engine/dates'
import { runProjection } from '../../engine/projection'
import { DEFAULT_STATE, CPP_COMBINED_MAX_MONTHLY, OAS_MAX_MONTHLY } from '../../engine/defaults'
import { CHART_COLORS } from '../PaletteTab'
import { InfoPanel } from '../../components/InfoPanel'
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

export function CPPOASTab() {
  const state = useStore()
  const { cppA, cppB, oasA, oasB, personA, personB, update } = state
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

  const { dataPoints } = useMemo(() => runProjection(state), [state])
  const projYears = dataPoints.map(d => d.year)

  const annualA = cppA.estimatedMonthlyAt65 * 12 * cppFactA
  const annualB = cppB.estimatedMonthlyAt65 * 12 * cppFactB
  const survivorFromA = annualA * 0.60   // payable to B when A dies
  const survivorFromB = annualB * 0.60   // payable to A when B dies

  const fmt0 = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })

  function cppMonthlyFromInputs(mode: string, pct: number, years: number, max: number): number {
    if (mode === 'pctOfMax')   return Math.round(max * pct / 100)
    if (mode === 'yearsAtMax') return Math.round((years / 39) * max)
    return 0
  }

  function switchCppMode(key: 'cppA' | 'cppB', current: typeof cppA, mode: typeof cppA.inputMode) {
    const monthly = current.estimatedMonthlyAt65
    const max     = current.maxMonthlyBenefit || CPP_COMBINED_MAX_MONTHLY
    const pctOfMax   = Math.min(100, Math.round(monthly / max * 100))
    const yearsAtMax = Math.min(40,  Math.round(monthly / max * 39))
    update(key, { ...current, inputMode: mode, pctOfMax, yearsAtMax })
  }

  function clampOasDate(date: string, birthDate: string): string {
    const min = dateAtAge(birthDate, 65)
    const max = dateAtAge(birthDate, 70)
    if (date < min) return min
    if (date > max) return max
    return date
  }

  function oasMonthlyFromYears(years: number, max: number): number {
    return Math.round((Math.min(years, 40) / 40) * max)
  }

  function switchOasMode(key: 'oasA' | 'oasB', current: typeof oasA, mode: typeof oasA.inputMode) {
    const monthly = current.estimatedMonthlyAt65
    const max = current.maxMonthlyBenefit || OAS_MAX_MONTHLY
    const yearsOfResidency = Math.min(40, Math.round(monthly / max * 40))
    update(key, { ...current, inputMode: mode, yearsOfResidency })
  }

  const annualOasA = oasA.estimatedMonthlyAt65 * 12 * oasFactA
    + (oasA.gisEligible ? (oasA.gisMonthlyAmount ?? 0) * 12 : 0)
  const annualOasB = oasB.estimatedMonthlyAt65 * 12 * oasFactB
    + (oasB.gisEligible ? (oasB.gisMonthlyAmount ?? 0) * 12 : 0)

  const oasInfoModal = (
    <div className="space-y-2 text-sm">
      <p><strong>Residency-based benefit</strong> — Unlike CPP, OAS is not based on employment or contributions. Eligibility requires at least 10 years of Canadian residency after age 18; the full benefit requires 40 years. Most long-term Canadian residents qualify for the full amount.</p>
      <p><strong>Estimation Methods</strong> — <em>Direct Entry</em>: enter the monthly amount from your My Service Canada account. <em>Years of Residency</em>: enter your years of Canadian residency after age 18; the app calculates (years ÷ 40) × the maximum benefit.</p>
      <p><strong>Deferral</strong> — OAS can start between age 65 and 70. There is no early option. Each month deferred past 65 increases the benefit by 0.6% per month (maximum +36% at age 70). There is no survivor benefit — payments stop at death.</p>
      <p><strong>Clawback (OAS Recovery Tax)</strong> — 15% of net income above ~$90,997 (2024, indexed to CPI annually), calculated per person. The clawback is <strong>not applied in the base model</strong> and will be addressed in scenario analysis for high-income projections.</p>
      <p><strong>GIS (Guaranteed Income Supplement)</strong> — A non-taxable monthly top-up for low-income OAS recipients. If enabled, the app adds the entered GIS amount to OAS in the base projection, but does <strong>not apply the income test</strong>. For high earners, GIS would be $0 in practice. The 2024 maximum for a coupled recipient is ~$641/month.</p>
    </div>
  )

  const govChartData: Data[] = [
    { x: projYears, y: dataPoints.map(d => d.cppA), type: 'bar', name: `${aName} CPP`, marker: { color: CHART_COLORS.cppA } },
    { x: projYears, y: dataPoints.map(d => d.cppB), type: 'bar', name: `${bName} CPP`, marker: { color: CHART_COLORS.cppB } },
    { x: projYears, y: dataPoints.map(d => d.oasA), type: 'bar', name: `${aName} OAS`, marker: { color: CHART_COLORS.oasA } },
    { x: projYears, y: dataPoints.map(d => d.oasB), type: 'bar', name: `${bName} OAS`, marker: { color: CHART_COLORS.oasB } },
  ]

  const cppInfoModal = (
    <div className="space-y-2 text-sm">
      <p><strong>My Service Canada estimate</strong> — The app uses your projected monthly CPP at age 65 from your My Service Canada account. This reflects your actual earnings history and contribution record and is the most accurate input available for planning.</p>
      <p><strong>CPP Enhancement (CPP2)</strong> — Since 2019, CPP contributions are split into two tiers (base CPP and CPP2 on earnings between the YMPE and YAMPE). My Service Canada's projected retirement amount includes both tiers, so entering the figure from your statement implicitly captures CPP2 with no separate input required.</p>
      <p><strong>CPP Disability</strong> — CPP disability is not modelled in this app. If you are currently receiving CPP disability, your My Service Canada statement will show that benefit rather than a retirement projection — contact Service Canada for an equivalent retirement estimate. Note: years spent on CPP disability are excluded from the contributory period, which is favourable to the retirement calculation.</p>
      <p><strong>Survivor Benefit</strong> — When the CPP recipient dies, the surviving spouse receives up to 60% of the deceased's adjusted retirement pension. This calculation assumes the survivor is age 65 or older at the time. The combined CPP (survivor + own) cannot exceed the maximum CPP pension; this cap is not applied here.</p>
      <p><strong>Estimation Methods</strong> — Three methods are available. <em>Direct Entry</em>: enter the projected amount from My Service Canada directly. <em>% of Maximum</em>: enter your benefit as a percentage of the 2024 combined maximum ({fmt0(CPP_COMBINED_MAX_MONTHLY)}/month). <em>Years at Maximum</em>: enter years of full contributions; the app calculates (years ÷ 39) × maximum. All methods assume the combined base CPP + CPP2 maximum. <strong>CPP2 caveat:</strong> CPP2 only started January 2024, so the CPP2 component (~$130/month at full contribution) is overstated for anyone retiring before completing a full career of CPP2 contributions. Use Direct Entry from My Service Canada for the most accurate figure.</p>
      <p><strong>Start Age Adjustment Rates</strong></p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { title: 'Age 60 (earliest)', body: '−0.6% per month early',          detail: 'Factor: 64%' },
          { title: 'Before 65',         body: '−0.6% per month early',          detail: 'Max reduction: 36%' },
          { title: 'After 65',          body: '+0.7% per month deferred',        detail: 'Max increase: 42%' },
          { title: 'Age 70 (latest)',   body: 'No further increase past age 70', detail: 'Factor: 142%' },
        ].map(item => (
          <div key={item.title} className="p-2 bg-amber-100 rounded border border-amber-200 text-amber-900">
            <div className="font-semibold mb-0.5">{item.title}</div>
            <div>{item.body}</div>
            <div className="font-medium mt-0.5">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <CardGrid>
      {/* CPP Person A */}
      <SectionCard title={`CPP — ${personA.name || 'Person A'}`} width="half" personColor={personA.color}
        onReset={() => update('cppA', { estimatedMonthlyAt65: 0, startDate: dateAtAge(personA.birthDate, 65) })}
        info={cppInfoModal}>
        <div className="space-y-3">
          <SelectInput
            label="Estimation Method"
            value={cppA.inputMode}
            onChange={v => switchCppMode('cppA', cppA, v as typeof cppA.inputMode)}
            options={[
              { value: 'direct',     label: 'Direct Entry' },
              { value: 'pctOfMax',   label: '% of Maximum Benefit' },
              { value: 'yearsAtMax', label: 'Years at Max Earnings' },
            ]}
          />

          {cppA.inputMode === 'direct' && (
            <NumberInput
              label="Estimated Monthly CPP at Age 65"
              value={cppA.estimatedMonthlyAt65}
              onChange={v => update('cppA', { ...cppA, estimatedMonthlyAt65: v })}
              prefix="$" min={0} max={1600} step={10} decimals={0} size="sm"
              tooltip="From your My Service Canada Account — select 'Estimated monthly CPP retirement pension at age 65'"
            />
          )}
          {cppA.inputMode === 'pctOfMax' && (
            <>
              <NumberInput
                label="Maximum Monthly Benefit"
                value={cppA.maxMonthlyBenefit}
                onChange={v => update('cppA', { ...cppA, maxMonthlyBenefit: v, estimatedMonthlyAt65: cppMonthlyFromInputs('pctOfMax', cppA.pctOfMax, 0, v) })}
                prefix="$" min={0} max={2000} step={1} decimals={0} size="sm"
                tooltip="Combined CPP + CPP2 maximum. Defaults to the 2024 combined maximum of $1,494/month."
              />
              <NumberInput
                label="% of Maximum Benefit"
                value={cppA.pctOfMax}
                onChange={v => update('cppA', { ...cppA, pctOfMax: v, estimatedMonthlyAt65: cppMonthlyFromInputs('pctOfMax', v, 0, cppA.maxMonthlyBenefit) })}
                suffix="%" min={0} max={100} step={1} decimals={0} size="sm"
              />
            </>
          )}
          {cppA.inputMode === 'yearsAtMax' && (
            <>
              <NumberInput
                label="Maximum Monthly Benefit"
                value={cppA.maxMonthlyBenefit}
                onChange={v => update('cppA', { ...cppA, maxMonthlyBenefit: v, estimatedMonthlyAt65: cppMonthlyFromInputs('yearsAtMax', 0, cppA.yearsAtMax, v) })}
                prefix="$" min={0} max={2000} step={1} decimals={0} size="sm"
                tooltip="Combined CPP + CPP2 maximum. Defaults to the 2024 combined maximum of $1,494/month."
              />
              <NumberInput
                label="Years at Max Earnings"
                value={cppA.yearsAtMax}
                onChange={v => update('cppA', { ...cppA, yearsAtMax: v, estimatedMonthlyAt65: cppMonthlyFromInputs('yearsAtMax', 0, v, cppA.maxMonthlyBenefit) })}
                min={0} max={40} step={1} decimals={0} size="sm"
                tooltip="Years with earnings at or above the YAMPE (~$73,200 in 2024). Assumes all years count toward both base CPP and CPP2."
              />
            </>
          )}

          <div className="grid grid-cols-2 gap-2 items-end">
            <NumberInput
              label="Start Age"
              value={cppAgeA}
              onChange={v => update('cppA', { ...cppA, startDate: dateAtAge(personA.birthDate, Math.round(v)) })}
              min={60} max={70} step={1} decimals={1} size="sm"
            />
            <DateInput
              label="Start Date"
              value={cppA.startDate}
              onChange={v => update('cppA', { ...cppA, startDate: v })}
            />
          </div>
        </div>
        <div className="mt-3">
          <InfoPanel>
            CPP starts at age <strong>{cppAgeA.toFixed(1)}</strong> with an adjustment factor of{' '}
            <strong className={cppFactA >= 1 ? 'text-green-700' : 'text-amber-700'}>{(cppFactA * 100).toFixed(1)}%</strong>.
            {' '}Annual benefit: <strong>{fmt0(annualA)}</strong> (today's $).
            {' '}Survivor benefit payable to {bName}: <strong>{fmt0(survivorFromA)} / year</strong> from {aName}'s age {personA.planningEndAge}.
          </InfoPanel>
        </div>
      </SectionCard>

      {/* CPP Person B */}
      <SectionCard title={`CPP — ${personB.name || 'Person B'}`} width="half" personColor={personB.color}
        onReset={() => update('cppB', { estimatedMonthlyAt65: 0, startDate: dateAtAge(personB.birthDate, 65) })}
        info={cppInfoModal}>
        <div className="space-y-3">
          <SelectInput
            label="Estimation Method"
            value={cppB.inputMode}
            onChange={v => switchCppMode('cppB', cppB, v as typeof cppB.inputMode)}
            options={[
              { value: 'direct',     label: 'Direct Entry' },
              { value: 'pctOfMax',   label: '% of Maximum Benefit' },
              { value: 'yearsAtMax', label: 'Years at Max Earnings' },
            ]}
          />

          {cppB.inputMode === 'direct' && (
            <NumberInput
              label="Estimated Monthly CPP at Age 65"
              value={cppB.estimatedMonthlyAt65}
              onChange={v => update('cppB', { ...cppB, estimatedMonthlyAt65: v })}
              prefix="$" min={0} max={1600} step={10} decimals={0} size="sm"
            />
          )}
          {cppB.inputMode === 'pctOfMax' && (
            <>
              <NumberInput
                label="Maximum Monthly Benefit"
                value={cppB.maxMonthlyBenefit}
                onChange={v => update('cppB', { ...cppB, maxMonthlyBenefit: v, estimatedMonthlyAt65: cppMonthlyFromInputs('pctOfMax', cppB.pctOfMax, 0, v) })}
                prefix="$" min={0} max={2000} step={1} decimals={0} size="sm"
                tooltip="Combined CPP + CPP2 maximum. Defaults to the 2024 combined maximum of $1,494/month."
              />
              <NumberInput
                label="% of Maximum Benefit"
                value={cppB.pctOfMax}
                onChange={v => update('cppB', { ...cppB, pctOfMax: v, estimatedMonthlyAt65: cppMonthlyFromInputs('pctOfMax', v, 0, cppB.maxMonthlyBenefit) })}
                suffix="%" min={0} max={100} step={1} decimals={0} size="sm"
              />
            </>
          )}
          {cppB.inputMode === 'yearsAtMax' && (
            <>
              <NumberInput
                label="Maximum Monthly Benefit"
                value={cppB.maxMonthlyBenefit}
                onChange={v => update('cppB', { ...cppB, maxMonthlyBenefit: v, estimatedMonthlyAt65: cppMonthlyFromInputs('yearsAtMax', 0, cppB.yearsAtMax, v) })}
                prefix="$" min={0} max={2000} step={1} decimals={0} size="sm"
                tooltip="Combined CPP + CPP2 maximum. Defaults to the 2024 combined maximum of $1,494/month."
              />
              <NumberInput
                label="Years at Max Earnings"
                value={cppB.yearsAtMax}
                onChange={v => update('cppB', { ...cppB, yearsAtMax: v, estimatedMonthlyAt65: cppMonthlyFromInputs('yearsAtMax', 0, v, cppB.maxMonthlyBenefit) })}
                min={0} max={40} step={1} decimals={0} size="sm"
                tooltip="Years with earnings at or above the YAMPE (~$73,200 in 2024). Assumes all years count toward both base CPP and CPP2."
              />
            </>
          )}

          <div className="grid grid-cols-2 gap-2 items-end">
            <NumberInput
              label="Start Age"
              value={cppAgeB}
              onChange={v => update('cppB', { ...cppB, startDate: dateAtAge(personB.birthDate, Math.round(v)) })}
              min={60} max={70} step={1} decimals={1} size="sm"
            />
            <DateInput
              label="Start Date"
              value={cppB.startDate}
              onChange={v => update('cppB', { ...cppB, startDate: v })}
            />
          </div>
        </div>
        <div className="mt-3">
          <InfoPanel>
            CPP starts at age <strong>{cppAgeB.toFixed(1)}</strong> with an adjustment factor of{' '}
            <strong className={cppFactB >= 1 ? 'text-green-700' : 'text-amber-700'}>{(cppFactB * 100).toFixed(1)}%</strong>.
            {' '}Annual benefit: <strong>{fmt0(annualB)}</strong> (today's $).
            {' '}Survivor benefit payable to {aName}: <strong>{fmt0(survivorFromB)} / year</strong> from {bName}'s age {personB.planningEndAge}.
          </InfoPanel>
        </div>
      </SectionCard>

      {/* OAS Person A */}
      <SectionCard title={`OAS — ${personA.name || 'Person A'}`} width="half" personColor={personA.color}
        onReset={() => update('oasA', { ...DEFAULT_STATE.oasA, startDate: dateAtAge(personA.birthDate, 65) })}
        info={oasInfoModal}>
        <div className="space-y-3">
          <SelectInput
            label="Estimation Method"
            value={oasA.inputMode}
            onChange={v => switchOasMode('oasA', oasA, v as typeof oasA.inputMode)}
            options={[
              { value: 'direct',           label: 'Direct Entry' },
              { value: 'yearsOfResidency', label: 'Years of Residency' },
            ]}
          />
          {oasA.inputMode === 'direct' && (
            <NumberInput
              label="Estimated Monthly OAS at Age 65"
              value={oasA.estimatedMonthlyAt65}
              onChange={v => update('oasA', { ...oasA, estimatedMonthlyAt65: v })}
              prefix="$" min={0} max={1000} step={1} decimals={0} size="sm"
              tooltip="From your My Service Canada account. 2024 maximum is $713/month."
            />
          )}
          {oasA.inputMode === 'yearsOfResidency' && (
            <>
              <NumberInput
                label="Maximum Monthly Benefit"
                value={oasA.maxMonthlyBenefit}
                onChange={v => update('oasA', { ...oasA, maxMonthlyBenefit: v, estimatedMonthlyAt65: oasMonthlyFromYears(oasA.yearsOfResidency, v) })}
                prefix="$" min={0} max={1000} step={1} decimals={0} size="sm"
                tooltip="Full OAS at 40 years residency. 2024 maximum is $713/month."
              />
              <NumberInput
                label="Years of Canadian Residency (after age 18)"
                value={oasA.yearsOfResidency}
                onChange={v => update('oasA', { ...oasA, yearsOfResidency: v, estimatedMonthlyAt65: oasMonthlyFromYears(v, oasA.maxMonthlyBenefit) })}
                min={10} max={40} step={1} decimals={0} size="sm"
                tooltip="Minimum 10 years to receive any OAS. 40 years for the full benefit."
              />
            </>
          )}
          <div className="grid grid-cols-2 gap-2 items-end">
            <NumberInput
              label="Start Age"
              value={oasAgeA}
              onChange={v => update('oasA', { ...oasA, startDate: dateAtAge(personA.birthDate, Math.max(65, Math.min(70, Math.round(v)))) })}
              min={65} max={70} step={1} decimals={1} size="sm"
            />
            <DateInput
              label="Start Date"
              value={oasA.startDate}
              onChange={v => update('oasA', { ...oasA, startDate: clampOasDate(v, personA.birthDate) })}
            />
          </div>
          <ToggleInput
            label="GIS Eligible (Guaranteed Income Supplement)"
            value={oasA.gisEligible}
            onChange={v => update('oasA', { ...oasA, gisEligible: v })}
          />
          {oasA.gisEligible && (
            <NumberInput
              label="GIS Monthly Amount"
              value={oasA.gisMonthlyAmount}
              onChange={v => update('oasA', { ...oasA, gisMonthlyAmount: v })}
              prefix="$" min={0} max={1200} step={1} decimals={0} size="sm"
              tooltip="2024 maximum for a coupled recipient is ~$641/month. Non-taxable. Income test not applied."
            />
          )}
        </div>
        <div className="mt-3">
          <InfoPanel>
            OAS starts at age <strong>{oasAgeA.toFixed(1)}</strong> with a deferral factor of{' '}
            <strong className={oasFactA > 1 ? 'text-green-700' : 'text-slate-700'}>{(oasFactA * 100).toFixed(1)}%</strong>.
            {' '}Annual benefit: <strong>{fmt0(annualOasA)}</strong> (today's $)
            {oasA.gisEligible && <>, including <strong>{fmt0((oasA.gisMonthlyAmount ?? 0) * 12)}</strong> GIS — income test not applied</>}.
            {' '}<em>Clawback not applied in base model.</em>
          </InfoPanel>
        </div>
      </SectionCard>

      {/* OAS Person B */}
      <SectionCard title={`OAS — ${personB.name || 'Person B'}`} width="half" personColor={personB.color}
        onReset={() => update('oasB', { ...DEFAULT_STATE.oasB, startDate: dateAtAge(personB.birthDate, 65) })}
        info={oasInfoModal}>
        <div className="space-y-3">
          <SelectInput
            label="Estimation Method"
            value={oasB.inputMode}
            onChange={v => switchOasMode('oasB', oasB, v as typeof oasB.inputMode)}
            options={[
              { value: 'direct',           label: 'Direct Entry' },
              { value: 'yearsOfResidency', label: 'Years of Residency' },
            ]}
          />
          {oasB.inputMode === 'direct' && (
            <NumberInput
              label="Estimated Monthly OAS at Age 65"
              value={oasB.estimatedMonthlyAt65}
              onChange={v => update('oasB', { ...oasB, estimatedMonthlyAt65: v })}
              prefix="$" min={0} max={1000} step={1} decimals={0} size="sm"
            />
          )}
          {oasB.inputMode === 'yearsOfResidency' && (
            <>
              <NumberInput
                label="Maximum Monthly Benefit"
                value={oasB.maxMonthlyBenefit}
                onChange={v => update('oasB', { ...oasB, maxMonthlyBenefit: v, estimatedMonthlyAt65: oasMonthlyFromYears(oasB.yearsOfResidency, v) })}
                prefix="$" min={0} max={1000} step={1} decimals={0} size="sm"
                tooltip="Full OAS at 40 years residency. 2024 maximum is $713/month."
              />
              <NumberInput
                label="Years of Canadian Residency (after age 18)"
                value={oasB.yearsOfResidency}
                onChange={v => update('oasB', { ...oasB, yearsOfResidency: v, estimatedMonthlyAt65: oasMonthlyFromYears(v, oasB.maxMonthlyBenefit) })}
                min={10} max={40} step={1} decimals={0} size="sm"
              />
            </>
          )}
          <div className="grid grid-cols-2 gap-2 items-end">
            <NumberInput
              label="Start Age"
              value={oasAgeB}
              onChange={v => update('oasB', { ...oasB, startDate: dateAtAge(personB.birthDate, Math.max(65, Math.min(70, Math.round(v)))) })}
              min={65} max={70} step={1} decimals={1} size="sm"
            />
            <DateInput
              label="Start Date"
              value={oasB.startDate}
              onChange={v => update('oasB', { ...oasB, startDate: clampOasDate(v, personB.birthDate) })}
            />
          </div>
          <ToggleInput
            label="GIS Eligible (Guaranteed Income Supplement)"
            value={oasB.gisEligible}
            onChange={v => update('oasB', { ...oasB, gisEligible: v })}
          />
          {oasB.gisEligible && (
            <NumberInput
              label="GIS Monthly Amount"
              value={oasB.gisMonthlyAmount}
              onChange={v => update('oasB', { ...oasB, gisMonthlyAmount: v })}
              prefix="$" min={0} max={1200} step={1} decimals={0} size="sm"
              tooltip="2024 maximum for a coupled recipient is ~$641/month. Non-taxable. Income test not applied."
            />
          )}
        </div>
        <div className="mt-3">
          <InfoPanel>
            OAS starts at age <strong>{oasAgeB.toFixed(1)}</strong> with a deferral factor of{' '}
            <strong className={oasFactB > 1 ? 'text-green-700' : 'text-slate-700'}>{(oasFactB * 100).toFixed(1)}%</strong>.
            {' '}Annual benefit: <strong>{fmt0(annualOasB)}</strong> (today's $)
            {oasB.gisEligible && <>, including <strong>{fmt0((oasB.gisMonthlyAmount ?? 0) * 12)}</strong> GIS — income test not applied</>}.
            {' '}<em>Clawback not applied in base model.</em>
          </InfoPanel>
        </div>
      </SectionCard>

      {/* Government Benefits chart */}
      <SectionCard title="Government Benefits" width="full"
        info={<p className="text-sm">Combined CPP and OAS payments for both people in present-day dollars. OAS is shown without clawback applied.</p>}>
        <PlotlyChart
          data={govChartData}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: ',.0f', title: { text: 'Annual Benefit ($)', font: { size: 11 } } },
            xaxis: { ...buildXAxis(projYears, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge) },
          }}
          style={{ height: 280 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>

    </CardGrid>
  )
}
