import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import type { TaxBracket } from '../../engine/types'
import { DEFAULT_TAX_SETTINGS } from '../../engine/defaults'
import { InfoPanel } from '../../components/InfoPanel'

function BracketTable({ title, brackets, onChange }: {
  title: string
  brackets: TaxBracket[]
  onChange: (updated: TaxBracket[]) => void
}) {
  function updateBracket(i: number, field: keyof TaxBracket, value: number) {
    onChange(brackets.map((b, idx) => idx === i ? { ...b, [field]: value } : b))
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">{title}</th>
          </tr>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
            <th className="px-3 py-2 text-left font-medium">Income Up To ($)</th>
            <th className="px-3 py-2 font-medium">Rate %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {brackets.map((b, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-2 py-1.5 w-1/2">
                {b.upTo === Infinity || b.upTo == null
                  ? <span className="px-1 text-slate-400 italic">No limit</span>
                  : <NumberInput label="" value={b.upTo} onChange={v => updateBracket(i, 'upTo', v)}
                      min={0} step={1000} decimals={0} size="full" />
                }
              </td>
              <td className="px-2 py-1.5 w-1/2">
                <NumberInput label="" value={b.rate * 100} onChange={v => updateBracket(i, 'rate', v / 100)}
                  min={0} max={60} step={0.01} decimals={2} size="full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TaxSettingsTab() {
  const { taxSettings, update } = useStore()
  const s = taxSettings

  function update2<K extends keyof typeof s>(key: K, value: (typeof s)[K]) {
    update('taxSettings', { ...s, [key]: value })
  }

  return (
    <CardGrid>
      <SectionCard title="Federal Tax Brackets" width="half"
        onReset={() => update2('federalBrackets', DEFAULT_TAX_SETTINGS.federalBrackets)}>
        <BracketTable title="Federal Tax Brackets" brackets={s.federalBrackets} onChange={v => update2('federalBrackets', v)} />
      </SectionCard>

      <SectionCard title="Ontario Tax Brackets" width="half"
        onReset={() => update2('ontarioBrackets', DEFAULT_TAX_SETTINGS.ontarioBrackets)}>
        <BracketTable title="Ontario Tax Brackets" brackets={s.ontarioBrackets} onChange={v => update2('ontarioBrackets', v)} />
      </SectionCard>

      <SectionCard title="Federal Non-Refundable Credits & Thresholds" width="full"
        onReset={() => update('taxSettings', { ...s, federalBPA: DEFAULT_TAX_SETTINGS.federalBPA, federalAgeAmount: DEFAULT_TAX_SETTINGS.federalAgeAmount, federalAgeAmountThreshold: DEFAULT_TAX_SETTINGS.federalAgeAmountThreshold, federalAgeAmountReductionRate: DEFAULT_TAX_SETTINGS.federalAgeAmountReductionRate, federalPensionIncomeAmount: DEFAULT_TAX_SETTINGS.federalPensionIncomeAmount, oasClawbackThreshold: DEFAULT_TAX_SETTINGS.oasClawbackThreshold })}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Personal Credits</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600 w-1/2">Basic Personal Amount ($)</td><td className="px-2 py-1.5 w-1/2"><NumberInput label="" value={s.federalBPA} onChange={v => update2('federalBPA', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Pension Income Amount ($)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.federalPensionIncomeAmount} onChange={v => update2('federalPensionIncomeAmount', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Age Amount</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600 w-1/2">Age Amount, 65+ ($)</td><td className="px-2 py-1.5 w-1/2"><NumberInput label="" value={s.federalAgeAmount} onChange={v => update2('federalAgeAmount', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Phase-Out Starts ($)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.federalAgeAmountThreshold} onChange={v => update2('federalAgeAmountThreshold', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Reduction Rate (%)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.federalAgeAmountReductionRate * 100} onChange={v => update2('federalAgeAmountReductionRate', v / 100)} min={0} max={50} step={0.01} decimals={2} size="full" /></td></tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">OAS Clawback</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600 w-1/2">Threshold ($)</td><td className="px-2 py-1.5 w-1/2"><NumberInput label="" value={s.oasClawbackThreshold} onChange={v => update2('oasClawbackThreshold', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Ontario Credits & Surtax" width="full"
        onReset={() => update('taxSettings', { ...s, ontarioBPA: DEFAULT_TAX_SETTINGS.ontarioBPA, ontarioAgeAmount: DEFAULT_TAX_SETTINGS.ontarioAgeAmount, ontarioAgeAmountThreshold: DEFAULT_TAX_SETTINGS.ontarioAgeAmountThreshold, ontarioPensionIncomeAmount: DEFAULT_TAX_SETTINGS.ontarioPensionIncomeAmount, ontarioSurtax1Threshold: DEFAULT_TAX_SETTINGS.ontarioSurtax1Threshold, ontarioSurtax1Rate: DEFAULT_TAX_SETTINGS.ontarioSurtax1Rate, ontarioSurtax2Threshold: DEFAULT_TAX_SETTINGS.ontarioSurtax2Threshold, ontarioSurtax2Rate: DEFAULT_TAX_SETTINGS.ontarioSurtax2Rate })}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Personal Credits</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600 w-1/2">Basic Personal Amount ($)</td><td className="px-2 py-1.5 w-1/2"><NumberInput label="" value={s.ontarioBPA} onChange={v => update2('ontarioBPA', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Pension Income Amount ($)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.ontarioPensionIncomeAmount} onChange={v => update2('ontarioPensionIncomeAmount', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Age Amount</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600 w-1/2">Age Amount, 65+ ($)</td><td className="px-2 py-1.5 w-1/2"><NumberInput label="" value={s.ontarioAgeAmount} onChange={v => update2('ontarioAgeAmount', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Phase-Out Starts ($)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.ontarioAgeAmountThreshold} onChange={v => update2('ontarioAgeAmountThreshold', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Surtax</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600 w-1/2">Tier 1 Threshold ($)</td><td className="px-2 py-1.5 w-1/2"><NumberInput label="" value={s.ontarioSurtax1Threshold} onChange={v => update2('ontarioSurtax1Threshold', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Tier 1 Rate (%)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.ontarioSurtax1Rate * 100} onChange={v => update2('ontarioSurtax1Rate', v / 100)} min={0} max={100} step={0.01} decimals={2} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Tier 2 Threshold ($)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.ontarioSurtax2Threshold} onChange={v => update2('ontarioSurtax2Threshold', v)} min={0} step={100} decimals={0} size="full" /></td></tr>
                <tr className="hover:bg-slate-50/50"><td className="px-3 py-2 text-slate-600">Tier 2 Rate (%)</td><td className="px-2 py-1.5"><NumberInput label="" value={s.ontarioSurtax2Rate * 100} onChange={v => update2('ontarioSurtax2Rate', v / 100)} min={0} max={100} step={0.01} decimals={2} size="full" /></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Dividend & Capital Gains Settings" width="full"
        onReset={() => update('taxSettings', { ...s, federalEligibleDivGrossUp: DEFAULT_TAX_SETTINGS.federalEligibleDivGrossUp, federalEligibleDivCredit: DEFAULT_TAX_SETTINGS.federalEligibleDivCredit, ontarioEligibleDivCredit: DEFAULT_TAX_SETTINGS.ontarioEligibleDivCredit, capitalGainsInclusionRate: DEFAULT_TAX_SETTINGS.capitalGainsInclusionRate, capitalGainsHighRate: DEFAULT_TAX_SETTINGS.capitalGainsHighRate, capitalGainsHighThreshold: DEFAULT_TAX_SETTINGS.capitalGainsHighThreshold, federalNonEligibleDivGrossUp: DEFAULT_TAX_SETTINGS.federalNonEligibleDivGrossUp, federalNonEligibleDivCredit: DEFAULT_TAX_SETTINGS.federalNonEligibleDivCredit })}>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Eligible Dividends */}
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Eligible Dividends</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Gross-Up (%)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.federalEligibleDivGrossUp * 100} onChange={v => update2('federalEligibleDivGrossUp', v / 100)} min={0} max={100} step={0.01} decimals={2} size="full" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Federal Credit (% of grossed-up)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.federalEligibleDivCredit * 100} onChange={v => update2('federalEligibleDivCredit', v / 100)} min={0} max={50} step={0.01} decimals={2} size="full" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Ontario Credit (% of grossed-up)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.ontarioEligibleDivCredit * 100} onChange={v => update2('ontarioEligibleDivCredit', v / 100)} min={0} max={50} step={0.01} decimals={2} size="full" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Non-Eligible Dividends */}
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Non-Eligible Dividends</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Gross-Up (%)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.federalNonEligibleDivGrossUp * 100} onChange={v => update2('federalNonEligibleDivGrossUp', v / 100)} min={0} max={100} step={0.01} decimals={2} size="full" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Federal Credit (% of grossed-up)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.federalNonEligibleDivCredit * 100} onChange={v => update2('federalNonEligibleDivCredit', v / 100)} min={0} max={50} step={0.01} decimals={2} size="full" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Capital Gains */}
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Capital Gains</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">Standard Rate (%)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.capitalGainsInclusionRate * 100} onChange={v => update2('capitalGainsInclusionRate', v / 100)} min={0} max={100} step={0.01} decimals={2} tooltip="Standard rate applied below the threshold. 50% as of 2025." /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">High Rate (%)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.capitalGainsHighRate * 100} onChange={v => update2('capitalGainsHighRate', v / 100)} min={0} max={100} step={0.01} decimals={2} size="full" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">High Rate Threshold ($)</td>
                  <td className="px-2 py-1.5"><NumberInput label="" value={s.capitalGainsHighThreshold} onChange={v => update2('capitalGainsHighThreshold', v)} min={0} step={10000} decimals={0} size="full" /></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        <div className="mt-4">
          <InfoPanel>
            <div className="space-y-1">
              <p><strong>Two-tier capital gains:</strong> The engine applies the standard inclusion rate up to the threshold, then the high rate above it. With the default threshold of $10,000,000, the high rate is effectively never triggered.</p>
              <p><strong>2024 Federal Budget proposal</strong> — a 66.67% inclusion rate above $250,000 — was <strong>cancelled</strong>. The Liberal government announced in January 2025 it would not proceed, and the Conservative government elected in 2025 has confirmed the rate remains at 50% for all capital gains. To model the proposed scenario, set High Rate to 66.67% and Threshold to $250,000.</p>
            </div>
          </InfoPanel>
        </div>
      </SectionCard>
    </CardGrid>
  )
}
