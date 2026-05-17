import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import type { Scenario } from '../../engine/types'
import { todayStr } from '../../engine/dates'

function pName(name: string, fallback: string) { return name || fallback }

export function ScenariosTab() {
  const { scenarios, activeScenarioId, personA, personB, update } = useStore()
  const aName = pName(personA.name, 'Person A')
  const bName = pName(personB.name, 'Person B')
  const today = todayStr()

  function addScenario() {
    const s: Scenario = {
      id: crypto.randomUUID(),
      name: `Scenario ${scenarios.length + 1}`,
      returnRateOffsetPct: 0,
      personalInflationOffsetPct: 0,
      planningHorizonOffsetYears: 0,
      cppStartDateOverrideA: '',
      cppStartDateOverrideB: '',
      oasStartDateOverrideA: '',
      oasStartDateOverrideB: '',
      spendingShockAmount: 0,
      spendingShockDate: today,
    }
    update('scenarios', [...scenarios, s])
  }

  function updateScenario(id: string, updates: Partial<Scenario>) {
    update('scenarios', scenarios.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  function removeScenario(id: string) {
    update('scenarios', scenarios.filter(s => s.id !== id))
    if (activeScenarioId === id) update('activeScenarioId', null)
  }

  return (
    <CardGrid>
      <SectionCard title="Scenario Manager" width="full">
        <p className="text-xs text-slate-500 mb-3">
          Scenarios layer offsets on top of the base plan. Compare them side-by-side in the
          Scenario Comparison output tab. The base plan uses all values from the input tabs with no offsets.
        </p>
        <button className="btn-primary mb-4" onClick={addScenario}>+ New Scenario</button>

        {scenarios.length === 0 && (
          <p className="text-xs text-slate-400 italic">No scenarios defined. The base plan is always calculated.</p>
        )}

        {scenarios.map(s => (
          <div key={s.id} className="mb-4 p-4 border border-slate-200 rounded bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  className="input-field w-48"
                  value={s.name}
                  onChange={e => updateScenario(s.id, { name: e.target.value })}
                />
                {activeScenarioId === s.id && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Active</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className={activeScenarioId === s.id ? 'btn-secondary' : 'btn-primary'}
                  onClick={() => update('activeScenarioId', activeScenarioId === s.id ? null : s.id)}
                >
                  {activeScenarioId === s.id ? 'Deactivate' : 'Set Active'}
                </button>
                <button className="btn-danger" onClick={() => removeScenario(s.id)}>Remove</button>
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <NumberInput
                label="Return Rate Offset"
                value={s.returnRateOffsetPct}
                onChange={v => updateScenario(s.id, { returnRateOffsetPct: v })}
                suffix="%" min={-10} max={10} step={0.1} decimals={1} size="sm"
                tooltip="+2% = bull market; -2% = bear market"
              />
              <NumberInput
                label="Inflation Offset"
                value={s.personalInflationOffsetPct}
                onChange={v => updateScenario(s.id, { personalInflationOffsetPct: v })}
                suffix="%" min={-5} max={10} step={0.1} decimals={1} size="sm"
                tooltip="Adjust personal inflation assumption for this scenario"
              />
              <NumberInput
                label="Planning Horizon Offset"
                value={s.planningHorizonOffsetYears}
                onChange={v => updateScenario(s.id, { planningHorizonOffsetYears: v })}
                suffix="years" min={-20} max={20} step={1} decimals={0} size="sm"
                tooltip="Extend or shorten the planning horizon for longevity testing"
              />
              <NumberInput
                label="Spending Shock Amount (today's $)"
                value={s.spendingShockAmount}
                onChange={v => updateScenario(s.id, { spendingShockAmount: v })}
                prefix="$" min={0} step={10000} decimals={0}
                tooltip="One-time additional spending (e.g. medical cost, market downturn adjustment)"
              />
              <DateInput
                label={`CPP Start Override — ${aName}`}
                value={s.cppStartDateOverrideA}
                onChange={v => updateScenario(s.id, { cppStartDateOverrideA: v })}
                tooltip="Leave blank to use base plan CPP start date"
              />
              <DateInput
                label={`CPP Start Override — ${bName}`}
                value={s.cppStartDateOverrideB}
                onChange={v => updateScenario(s.id, { cppStartDateOverrideB: v })}
              />
              <DateInput
                label={`OAS Start Override — ${aName}`}
                value={s.oasStartDateOverrideA}
                onChange={v => updateScenario(s.id, { oasStartDateOverrideA: v })}
              />
              <DateInput
                label={`OAS Start Override — ${bName}`}
                value={s.oasStartDateOverrideB}
                onChange={v => updateScenario(s.id, { oasStartDateOverrideB: v })}
              />
              {s.spendingShockAmount > 0 && (
                <DateInput
                  label="Spending Shock Date"
                  value={s.spendingShockDate}
                  onChange={v => updateScenario(s.id, { spendingShockDate: v })}
                />
              )}
            </div>
          </div>
        ))}
      </SectionCard>
    </CardGrid>
  )
}
