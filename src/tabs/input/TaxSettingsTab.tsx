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
        onReset={() => update2('federalBrackets', DEFAULT_TAX_SETTINGS.federalBrackets)}
        info={
          <div className="space-y-2 text-sm">
            <p>Federal income tax is applied progressively — only the income within each band is taxed at that band's rate. You never pay the higher rate on all your income, only on the slice above each threshold. For example, at $120,000 income in 2024: the first $55,867 is taxed at 15%, the next $55,866 at 20.5%, and only the remaining $8,267 at 26%.</p>
            <p>These default to the 2024 federal brackets. The engine indexes all bracket thresholds forward each year by the CPI rate you set in Assumptions, so bracket creep is automatically accounted for. You only need to change these if federal tax policy changes significantly or you want to model a specific scenario.</p>
            <p>Federal tax applies to both people independently based on each person's net income in each year. Pension income splitting can shift income between spouses to reduce the combined tax burden — this is managed in the Dashboard's drawdown strategy.</p>
          </div>
        }>
        <BracketTable title="Federal Tax Brackets" brackets={s.federalBrackets} onChange={v => update2('federalBrackets', v)} />
      </SectionCard>

      <SectionCard title="Ontario Tax Brackets" width="half"
        onReset={() => update2('ontarioBrackets', DEFAULT_TAX_SETTINGS.ontarioBrackets)}
        info={
          <div className="space-y-2 text-sm">
            <p>Ontario provincial tax brackets, applied on top of federal tax. Ontario also levies an additional surtax on high provincial tax amounts — configured in the Ontario Credits & Surtax card below. This surtax is unique to Ontario and can add several thousand dollars for incomes above $100,000.</p>
            <p>Combined federal + Ontario marginal rates at the top bracket reach approximately 53.5%, making tax-efficient income splitting and account sequencing important for higher-income households.</p>
            <p>Like federal brackets, these defaults are based on 2024 rates and are indexed forward by CPI each year. Only modify these if Ontario tax policy changes or you want to model a scenario.</p>
          </div>
        }>
        <BracketTable title="Ontario Tax Brackets" brackets={s.ontarioBrackets} onChange={v => update2('ontarioBrackets', v)} />
      </SectionCard>

      <SectionCard title="Federal Non-Refundable Credits & Thresholds" width="full"
        onReset={() => update('taxSettings', { ...s, federalBPA: DEFAULT_TAX_SETTINGS.federalBPA, federalAgeAmount: DEFAULT_TAX_SETTINGS.federalAgeAmount, federalAgeAmountThreshold: DEFAULT_TAX_SETTINGS.federalAgeAmountThreshold, federalAgeAmountReductionRate: DEFAULT_TAX_SETTINGS.federalAgeAmountReductionRate, federalPensionIncomeAmount: DEFAULT_TAX_SETTINGS.federalPensionIncomeAmount, oasClawbackThreshold: DEFAULT_TAX_SETTINGS.oasClawbackThreshold })}
        info={
          <div className="space-y-2 text-sm">
            <p>Non-refundable credits reduce the tax you owe. They can reduce your tax to zero but cannot create a refund. The credit value equals the amount times the lowest federal bracket rate (15%).</p>
            <p><strong>Basic Personal Amount (BPA)</strong> — Every Canadian gets this deduction. At $15,705, it provides a ~$2,356 federal credit, effectively making the first $15,705 of income federally tax-free for each person.</p>
            <p><strong>Pension Income Amount</strong> — A $2,000 deduction for eligible pension income: RRIF withdrawals, DB pension payments, and CPP all qualify. Worth ~$300 in federal tax savings per person per year. Pension income splitting (in the Dashboard) helps ensure both spouses can claim it.</p>
            <p><strong>Age Amount</strong> — An additional deduction for Canadians age 65 and older, worth up to $8,790 in 2024. It phases out at 15 cents for every dollar of net income above $42,335, disappearing entirely around $100,000 income. This is one reason to manage RRIF withdrawal levels carefully — keeping net income below $42,335 preserves the full Age Amount credit.</p>
            <p><strong>OAS Clawback Threshold</strong> — OAS is "clawed back" (recovered) at 15% of net income above this threshold. For every $10,000 above ~$90,997, you lose $1,500 of OAS. For high RRIF withdrawal scenarios, this can significantly reduce OAS income — use the Dashboard to model the impact.</p>
          </div>
        }>
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
        onReset={() => update('taxSettings', { ...s, ontarioBPA: DEFAULT_TAX_SETTINGS.ontarioBPA, ontarioAgeAmount: DEFAULT_TAX_SETTINGS.ontarioAgeAmount, ontarioAgeAmountThreshold: DEFAULT_TAX_SETTINGS.ontarioAgeAmountThreshold, ontarioPensionIncomeAmount: DEFAULT_TAX_SETTINGS.ontarioPensionIncomeAmount, ontarioSurtax1Threshold: DEFAULT_TAX_SETTINGS.ontarioSurtax1Threshold, ontarioSurtax1Rate: DEFAULT_TAX_SETTINGS.ontarioSurtax1Rate, ontarioSurtax2Threshold: DEFAULT_TAX_SETTINGS.ontarioSurtax2Threshold, ontarioSurtax2Rate: DEFAULT_TAX_SETTINGS.ontarioSurtax2Rate })}
        info={
          <div className="space-y-2 text-sm">
            <p>Ontario provincial credits mirror the federal structure — each credit amount is multiplied by the lowest Ontario rate (5.05%) to calculate the tax reduction. The Ontario Age Amount also phases out above the same income threshold as the federal one.</p>
            <p><strong>Ontario Surtax</strong> — Unique to Ontario. An extra layer of provincial tax is applied on top of your Ontario tax payable (after credits), not on income directly:</p>
            <ul className="ml-3 list-disc list-outside space-y-0.5">
              <li>Tier 1: 20% surcharge when Ontario tax payable exceeds ~$5,315</li>
              <li>Tier 2: Additional 36% surcharge when Ontario tax payable exceeds ~$6,802</li>
            </ul>
            <p>Both tiers can apply simultaneously. The surtax kicks in at roughly $70,000–$80,000 of income for most retirees and can add $2,000–$5,000+ to provincial taxes for incomes in the $100,000–$150,000 range. This makes Ontario one of the highest-taxed provinces for high earners.</p>
          </div>
        }>
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
        onReset={() => update('taxSettings', { ...s, federalEligibleDivGrossUp: DEFAULT_TAX_SETTINGS.federalEligibleDivGrossUp, federalEligibleDivCredit: DEFAULT_TAX_SETTINGS.federalEligibleDivCredit, ontarioEligibleDivCredit: DEFAULT_TAX_SETTINGS.ontarioEligibleDivCredit, capitalGainsInclusionRate: DEFAULT_TAX_SETTINGS.capitalGainsInclusionRate, capitalGainsHighRate: DEFAULT_TAX_SETTINGS.capitalGainsHighRate, capitalGainsHighThreshold: DEFAULT_TAX_SETTINGS.capitalGainsHighThreshold, federalNonEligibleDivGrossUp: DEFAULT_TAX_SETTINGS.federalNonEligibleDivGrossUp, federalNonEligibleDivCredit: DEFAULT_TAX_SETTINGS.federalNonEligibleDivCredit })}
        info={
          <div className="space-y-2 text-sm">
            <p><strong>Eligible Dividends</strong> — Paid by most Canadian public companies and large private corporations. They receive preferential tax treatment: the dividend is grossed up (increased by 38%) to approximate the pre-tax corporate income, then a dividend tax credit offsets a portion of that grossed-up amount. The net effect is that eligible dividends are taxed at a significantly lower rate than regular income. In low-income retirement years, they can be effectively tax-free due to the credits exceeding the tax on the gross-up. These are the most tax-efficient form of non-registered income.</p>
            <p><strong>Non-Eligible Dividends</strong> — Paid by Canadian-Controlled Private Corporations (CCPCs) on income taxed at the small business rate. Grossed up 15% with a smaller tax credit. More tax-efficient than interest income, but less so than eligible dividends.</p>
            <p><strong>Capital Gains</strong> — Only the inclusion rate fraction of a capital gain is added to taxable income. At 50% inclusion, a $10,000 gain adds $5,000 to taxable income, taxed at your marginal rate. Capital gains in the non-registered account are only triggered in the model when withdrawals are made — unrealized gains grow tax-deferred. The two-tier structure allows modelling a higher inclusion rate above a threshold for large single-year gains, though the default $10,000,000 threshold effectively disables this.</p>
          </div>
        }>

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
