import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { InfoPanel } from '../../components/InfoPanel'
import { NumberInput } from '../../components/NumberInput'

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
      <SectionCard title={`Employment — ${aName}`} width="half" personColor={personA.color}>
        <p className="text-xs text-slate-400 mb-3">Income ceases at {aName}'s retirement date ({personA.retirementDate}).</p>
        <div className="space-y-3">
          <NumberInput label="Current Annual Employment Income" value={employmentA.annualAmount}
            onChange={v => update('employmentA', { ...employmentA, annualAmount: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Annual Income Growth Rate" value={employmentA.growthRatePct}
            onChange={v => update('employmentA', { ...employmentA, growthRatePct: v })}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1} />
        </div>
        <div className="mt-4">
          <InfoPanel>
            At retirement (nominal): <strong>${retirementNominal(employmentA.annualAmount, employmentA.growthRatePct, personA.retirementDate).toLocaleString()}</strong>
          </InfoPanel>
        </div>
      </SectionCard>

      <SectionCard title={`Employment — ${bName}`} width="half" personColor={personB.color}>
        <p className="text-xs text-slate-400 mb-3">Income ceases at {bName}'s retirement date ({personB.retirementDate}).</p>
        <div className="space-y-3">
          <NumberInput label="Current Annual Employment Income" value={employmentB.annualAmount}
            onChange={v => update('employmentB', { ...employmentB, annualAmount: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Annual Income Growth Rate" value={employmentB.growthRatePct}
            onChange={v => update('employmentB', { ...employmentB, growthRatePct: v })}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1} />
        </div>
        <div className="mt-4">
          <InfoPanel>
            At retirement (nominal): <strong>${retirementNominal(employmentB.annualAmount, employmentB.growthRatePct, personB.retirementDate).toLocaleString()}</strong>
          </InfoPanel>
        </div>
      </SectionCard>
    </CardGrid>
  )
}
