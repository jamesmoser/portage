import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { InfoPanel } from '../../components/InfoPanel'
import { NumberInput } from '../../components/NumberInput'
import { DEFAULT_STATE } from '../../engine/defaults'

export function EmploymentTab() {
  const { employmentA, employmentB, personA, personB, update } = useStore()
  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'

  function retirementNominal(amount: number, growthPct: number, retDate: string) {
    const years = Math.max(0, new Date(retDate).getFullYear() - new Date().getFullYear())
    return Math.round(amount * Math.pow(1 + growthPct / 100, years))
  }

  return (
    <CardGrid>
      <SectionCard title={`Employment — ${aName}`} width="half" personColor={personA.color}
        onReset={() => update('employmentA', DEFAULT_STATE.employmentA)}
        info={
          <div className="space-y-2 text-sm">
            <p>Enter current gross employment income (before tax). The engine taxes it alongside all other income each year. Income stops automatically at the retirement date set in the Household tab — the retirement-year income is pro-rated to the month of retirement.</p>
            <p><strong>Growth Rate</strong> — Expected annual salary increase (nominal). For most salaried employees 2–4% is typical. This rate compounds through to retirement, so it meaningfully affects the projected retirement-year income shown in the panel below.</p>
            <p><strong>Part-time or phased retirement</strong> — If you plan to reduce hours before fully stopping, set the income to your expected part-time amount and use the retirement date as the end of part-time work. For income that overlaps with retirement or starts at a specific date rather than stopping at retirement, use Other Income instead.</p>
            <p>Pre-retirement employment income reduces the need to draw from investment accounts in those years, and also generates RRSP contribution room — relevant if you're still making RRSP contributions.</p>
          </div>
        }>
        <div className="space-y-3">
          <NumberInput label="Current Annual Employment Income" value={employmentA.annualAmount}
            onChange={v => update('employmentA', { ...employmentA, annualAmount: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Annual Income Growth Rate" value={employmentA.growthRatePct}
            onChange={v => update('employmentA', { ...employmentA, growthRatePct: v })}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1} size="sm" />
        </div>
        <div className="mt-4">
          <InfoPanel>
            Income ceases at {aName}'s retirement date ({personA.retirementDate}). The annual income at retirement is estimated to be <strong>${retirementNominal(employmentA.annualAmount, employmentA.growthRatePct, personA.retirementDate).toLocaleString()}</strong> (nominal).
          </InfoPanel>
        </div>
      </SectionCard>

      <SectionCard title={`Employment — ${bName}`} width="half" personColor={personB.color}
        onReset={() => update('employmentB', DEFAULT_STATE.employmentB)}
        info={
          <div className="space-y-2 text-sm">
            <p>Enter current gross employment income (before tax). The engine taxes it alongside all other income each year. Income stops automatically at the retirement date set in the Household tab — the retirement-year income is pro-rated to the month of retirement.</p>
            <p><strong>Growth Rate</strong> — Expected annual salary increase (nominal). For most salaried employees 2–4% is typical. This rate compounds through to retirement, so it meaningfully affects the projected retirement-year income shown in the panel below.</p>
            <p><strong>Part-time or phased retirement</strong> — If you plan to reduce hours before fully stopping, set the income to your expected part-time amount and use the retirement date as the end of part-time work. For income that overlaps with retirement or starts at a specific date rather than stopping at retirement, use Other Income instead.</p>
            <p>Pre-retirement employment income reduces the need to draw from investment accounts in those years, and also generates RRSP contribution room — relevant if you're still making RRSP contributions.</p>
          </div>
        }>
        <div className="space-y-3">
          <NumberInput label="Current Annual Employment Income" value={employmentB.annualAmount}
            onChange={v => update('employmentB', { ...employmentB, annualAmount: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Annual Income Growth Rate" value={employmentB.growthRatePct}
            onChange={v => update('employmentB', { ...employmentB, growthRatePct: v })}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1} size="sm" />
        </div>
        <div className="mt-4">
          <InfoPanel>
            Income ceases at {bName}'s retirement date ({personB.retirementDate}). The annual income at retirement is estimated to be <strong>${retirementNominal(employmentB.annualAmount, employmentB.growthRatePct, personB.retirementDate).toLocaleString()}</strong> (nominal).
          </InfoPanel>
        </div>
      </SectionCard>
    </CardGrid>
  )
}
