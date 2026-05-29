import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { InfoPanel } from '../../components/InfoPanel'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { SelectInput } from '../../components/SelectInput'
import { exactAgeAt, todayStr } from '../../engine/dates'
import type { Person } from '../../engine/types'
import { DEFAULT_STATE } from '../../engine/defaults'

function PersonCard({
  defaultLabel, person, onChange, onReset,
}: {
  defaultLabel: string
  person: Person
  onChange: (updated: Person) => void
  onReset: () => void
}) {
  const today = todayStr()
  const displayName = person.name || defaultLabel
  const ageNow   = exactAgeAt(person.birthDate, today)
  const retAge   = exactAgeAt(person.birthDate, person.retirementDate)
  const yearsToRetire = retAge - ageNow

  return (
    <SectionCard title={`Personal Data - ${displayName}`} width="half" personColor={person.color} onReset={onReset}
      info={
        <div className="space-y-2 text-sm">
          <p>This card defines the fundamental parameters the engine uses to frame this person's working life and retirement. Get these right first — everything else in the plan is anchored to these dates.</p>
          <p><strong>Retirement Date</strong> — The first full day this person is retired. Employment income stops the day before. If you're already retired, use today's date (or your actual retirement date). The retirement-year income is automatically pro-rated to the number of months worked.</p>
          <p><strong>Age at Death</strong> — The planning horizon end, not a prediction. Use a conservatively long estimate (90–95) to stress-test longevity risk — running out of money at 88 when you live to 95 is the risk you're planning against. The plan stops modelling income and spending after this age. Decimals are supported: 92.5 means six months after the 92nd birthday.</p>
          <p><strong>Gender</strong> — Currently informational; used for display purposes. Future versions may use actuarial mortality tables for probability-weighted analysis.</p>
          <p>The stats panel at the bottom shows your current age, retirement age, and years in retirement — a quick sanity check that dates are entered correctly.</p>
        </div>
      }>
      <div className="grid grid-cols-2 gap-3">
        {/* Name + colour picker on one row */}
        <div className="col-span-2 flex items-end gap-2">
          <div className="flex-1">
            <label className="label-text">Name</label>
            <input className="input-field" value={person.name}
              onChange={e => onChange({ ...person, name: e.target.value })}
              placeholder={defaultLabel} />
          </div>
          <div className="shrink-0">
            <label className="label-text">Colour</label>
            <input
              type="color"
              value={person.color}
              onChange={e => onChange({ ...person, color: e.target.value })}
              className="h-9 w-10 rounded border border-slate-200 cursor-pointer bg-white p-0.5 block"
              title="Choose card colour for this person"
            />
          </div>
        </div>

        <DateInput label="Birth Date" value={person.birthDate}
          onChange={v => onChange({ ...person, birthDate: v })} />
        <SelectInput label="Gender" value={person.gender}
          onChange={v => onChange({ ...person, gender: v as Person['gender'] })}
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
        <DateInput label="Retirement Date" value={person.retirementDate}
          onChange={v => onChange({ ...person, retirementDate: v })}
          tooltip="First full day of retirement" />
        <NumberInput label="Age at Death" value={person.planningEndAge}
          onChange={v => onChange({ ...person, planningEndAge: v })}
          suffix="years" min={60} max={110} step={0.5} decimals={1} size="sm"
          tooltip="88.0 = dies on 88th birthday · 88.9 = near end of age 88. Use a conservative (longer) estimate to stress-test longevity risk." />
      </div>

      {/* Stats row */}
      <div className="mt-4">
        <InfoPanel>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Current Age',        value: ageNow.toFixed(1) },
              { label: 'Retirement Age',     value: retAge.toFixed(1) },
              {
                label: 'Years to Retire',
                value: yearsToRetire <= 0 ? 'Retired' : yearsToRetire.toFixed(1),
                highlight: yearsToRetire <= 0,
              },
              { label: 'Years in Retirement',  value: (person.planningEndAge - retAge).toFixed(1) },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-sm text-slate-500">{s.label}</div>
                <div className={`text-base font-bold mt-0.5 ${s.highlight ? 'text-emerald-600' : 'text-slate-800'}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </InfoPanel>
      </div>
    </SectionCard>
  )
}

export function HouseholdTab() {
  const { personA, personB, ageReferencePerson, update } = useStore()

  const nameA = personA.name || 'Person A'
  const nameB = personB.name || 'Person B'

  const options = [
    { value: 'personA', label: nameA, color: personA.color },
    { value: 'personB', label: nameB, color: personB.color },
  ]

  return (
    <CardGrid>
      <PersonCard defaultLabel="Person A" person={personA}
        onChange={v => update('personA', v)}
        onReset={() => update('personA', DEFAULT_STATE.personA)} />
      <PersonCard defaultLabel="Person B" person={personB}
        onChange={v => update('personB', v)}
        onReset={() => update('personB', DEFAULT_STATE.personB)} />

      <SectionCard title="Age Reference" width="full"
        onReset={() => update('ageReferencePerson', DEFAULT_STATE.ageReferencePerson)}
        info={
          <div className="space-y-2 text-sm">
            <p>The age reference person provides the "clock" for age-based thresholds throughout the plan: portfolio return rate tier transitions (e.g. shifting to conservative returns at 65), spending phase start ages, and ages for one-time additional spending items all measure against this person's birthday.</p>
            <p>Typically set to the <strong>older spouse</strong>, so the return rate glide path reflects the couple's overall portfolio risk profile advancing with the older person's age. This is the most conservative assumption.</p>
            <p>Ages that are person-specific — Age at Death, CPP start age, OAS start age — always use that individual's own birth date regardless of this setting.</p>
            <p>All age inputs throughout the tool use a decimal convention: 55.0 = exact 55th birthday, 55.5 = six months after the 55th birthday. This applies to spending phase starts, one-time item ages, and any other age-based input.</p>
          </div>
        }>
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500 shrink-0">Use age of</p>
          <div className="flex gap-3">
            {options.map(o => {
              const active = ageReferencePerson === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => update('ageReferencePerson', o.value as 'personA' | 'personB')}
                  className={`flex items-center gap-3 px-5 py-3 rounded border-2 text-sm font-semibold transition-all duration-150
                    ${active ? 'shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:shadow-sm'}`}
                  style={active ? {
                    backgroundColor: `${o.color}12`,
                    borderColor: o.color,
                    color: o.color,
                  } : undefined}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 shrink-0 transition-all"
                    style={active
                      ? { backgroundColor: o.color, borderColor: o.color }
                      : { borderColor: '#cbd5e1' }
                    }
                  />
                  {o.label}
                </button>
              )
            })}
          </div>
          <p className="text-sm text-slate-500">for age-based inputs</p>
        </div>
      </SectionCard>

      <SectionCard title="Jurisdiction" width="full">
        <div className="flex items-center gap-4">
          <div>
            <label className="label-text">Province</label>
            <div className="input-field bg-slate-50 text-slate-400 w-40 flex items-center">Ontario</div>
          </div>
          <p className="text-xs text-slate-400">
            Tax calculations use Ontario provincial rates. Multi-province support is planned for a future version.
          </p>
        </div>
      </SectionCard>
    </CardGrid>
  )
}
