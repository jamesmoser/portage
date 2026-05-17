import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { InfoPanel } from '../../components/InfoPanel'

export function AssumptionsTab() {
  const { personalInflationRatePct, cpiRatePct, returnRates,
          personA, personB, ageReferencePerson, update } = useStore()

  const refPerson = ageReferencePerson === 'personB' ? personB : personA
  const refName = refPerson.name || (ageReferencePerson === 'personB' ? 'Person B' : 'Person A')

  const realReturns = {
    upTo55:     returnRates.upTo55 - personalInflationRatePct,
    from55to65: returnRates.from55to65 - personalInflationRatePct,
    from65to70: returnRates.from65to70 - personalInflationRatePct,
    from70plus: returnRates.from70plus - personalInflationRatePct,
  }
  // Positive = indexed income grows faster than personal inflation (real purchasing power rises)
  // Negative = indexed income grows slower (real purchasing power erodes)
  const cpiEffect = cpiRatePct - personalInflationRatePct
  const cpiEffectStr = Math.abs(cpiEffect).toFixed(2)

  return (
    <CardGrid>
      {/* Inflation */}
      <SectionCard title="Inflation" width="half">
        <div className="space-y-3">
          <NumberInput label="Personal / Real Inflation Rate" value={personalInflationRatePct}
            onChange={v => update('personalInflationRatePct', v)}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1}
            tooltip="Your assumed true cost-of-living increase. Used to deflate all future values to today's dollars." />
          <NumberInput label="CPI Rate (Statistics Canada)" value={cpiRatePct}
            onChange={v => update('cpiRatePct', v)}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1}
            tooltip="Used to index DB pension, CPP, OAS, and tax brackets forward." />
        </div>

        <div className="mt-4">
        <InfoPanel>
          Inflation-adjusted income sources (e.g. CPP and OAS) increase by <strong>{cpiRatePct}% / year</strong>,
          but your personal inflation rate is <strong>{personalInflationRatePct}% / year</strong>.
          In present-day dollars, indexed payments effectively{' '}
          {Math.abs(cpiEffect) < 0.005
            ? <strong>stay flat</strong>
            : cpiEffect > 0
              ? <strong>increase by {cpiEffectStr}% / year</strong>
              : <strong>decrease by {cpiEffectStr}% / year</strong>
          }.
        </InfoPanel>
        </div>
      </SectionCard>

      {/* Return rates */}
      <SectionCard title="Portfolio Return Rates (Nominal)" width="half"
        info="Nominal returns for each life stage. Applies to all accounts unless overridden per account.">

        {(() => {
          const rows = [
            { period: 'Up to 55',  key: 'upTo55'     as const },
            { period: '55 – 65',   key: 'from55to65' as const },
            { period: '65 – 70',   key: 'from65to70' as const },
            { period: '70+',       key: 'from70plus' as const },
          ]
          return (
            <>
              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Portfolio Return Rates</th>
                    </tr>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                      <th className="px-3 py-2 text-left font-medium">Age</th>
                      <th className="px-3 py-2 font-medium">Nominal %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map(row => (
                      <tr key={row.key} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-left text-slate-600 font-medium w-1/2">{row.period}</td>
                        <td className="px-2 py-1.5 w-1/2">
                          <NumberInput
                            label=""
                            value={returnRates[row.key]}
                            onChange={v => update('returnRates', { ...returnRates, [row.key]: v })}
                            min={0} max={30} step={0.1} decimals={1}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <InfoPanel>
                  <div className="grid grid-cols-4 gap-2">
                    {rows.map(row => {
                      const real = returnRates[row.key] - personalInflationRatePct
                      return (
                        <div key={row.key} className="text-center">
                          <div className="text-sm text-slate-500">{row.period}</div>
                          <div className={`text-base font-bold mt-0.5 ${real >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                            {real >= 0 ? '+' : ''}{real.toFixed(2)}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Approximate real returns (nominal minus personal inflation)</p>
                </InfoPanel>
              </div>
            </>
          )
        })()}
      </SectionCard>
    </CardGrid>
  )
}
