import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import type { RRSPAccount } from '../../engine/types'

function RRSPSection({ label, account, otherPersonName, onChange, personColor }: {
  label: string
  account: RRSPAccount
  personBirthDate: string
  otherPersonName: string
  onChange: (v: RRSPAccount) => void
  personColor?: string
}) {
  return (
    <SectionCard title={label} width="half" personColor={personColor}>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Current RRSP Balance" value={account.balance}
          onChange={v => onChange({ ...account, balance: v })}
          prefix="$" min={0} step={1000} decimals={0} />
        <NumberInput label="Annual Contribution" value={account.annualContribution}
          onChange={v => onChange({ ...account, annualContribution: v })}
          prefix="$" min={0} step={500} decimals={0} />
        <NumberInput label="Remaining Contribution Room" value={account.contributionRoomRemaining}
          onChange={v => onChange({ ...account, contributionRoomRemaining: v })}
          prefix="$" min={0} step={500} decimals={0}
          tooltip="From your CRA My Account Notice of Assessment" />
        <NumberInput label="Return Rate Override (0 = blended)" value={account.returnRateOverridePct}
          onChange={v => onChange({ ...account, returnRateOverridePct: v })}
          suffix="%" min={0} max={30} step={0.1} decimals={1} size="sm" />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="label-text mb-2">Spousal RRSP</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Spousal RRSP Balance" value={account.spousalBalance}
            onChange={v => onChange({ ...account, spousalBalance: v })}
            prefix="$" min={0} step={1000} decimals={0} className="col-span-2"
            tooltip="In your spouse's name but using your contribution room." />
          <NumberInput label="Last Contribution Year" value={account.spousalLastContributionYear}
            onChange={v => onChange({ ...account, spousalLastContributionYear: v })}
            min={2000} max={2050} step={1} decimals={0} size="sm"
            tooltip="Withdrawals within 3 calendar years of last contribution are attributed back to contributor" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="label-text mb-2">RRIF Conversion</p>
        <div className="grid grid-cols-2 gap-3">
          <DateInput label="RRIF Conversion Date" value={account.rrifConversionDate}
            onChange={v => onChange({ ...account, rrifConversionDate: v })}
            tooltip="Must convert by Dec 31 of the year you turn 71. Earlier is allowed." />
          <NumberInput label="Additional Withdrawal Above Minimum" value={account.additionalWithdrawalAboveMinimum}
            onChange={v => onChange({ ...account, additionalWithdrawalAboveMinimum: v })}
            prefix="$" min={0} step={500} decimals={0}
            tooltip="Annual extra withdrawal above CRA minimum — useful for RRSP meltdown strategy" />
        </div>
        <div className="mt-2">
          <ToggleInput label={`Use ${otherPersonName}'s age for RRIF minimums`}
            value={account.useSpouseAgeForMinimums}
            onChange={v => onChange({ ...account, useSpouseAgeForMinimums: v })}
            tooltip="If your spouse is younger, this reduces annual minimum withdrawals" />
        </div>
      </div>
    </SectionCard>
  )
}

export function RRSPTab() {
  const { rrspA, rrspB, personA, personB, update } = useStore()

  const RRIF_TABLE = [
    [65,4.00],[66,4.17],[67,4.35],[68,4.53],[69,4.73],
    [70,5.00],[71,5.28],[72,5.40],[73,5.53],[74,5.67],
    [75,5.82],[76,5.98],[77,6.17],[78,6.36],[79,6.58],
    [80,6.82],[85,8.51],[90,11.92],[95,20.00],
  ]

  return (
    <CardGrid>
      <RRSPSection label={`RRSP / RRIF — ${personA.name || 'Person A'}`}
        account={rrspA} personBirthDate={personA.birthDate}
        otherPersonName={personB.name || 'Person B'}
        onChange={v => update('rrspA', v)} personColor={personA.color} />
      <RRSPSection label={`RRSP / RRIF — ${personB.name || 'Person B'}`}
        account={rrspB} personBirthDate={personB.birthDate}
        otherPersonName={personA.name || 'Person A'}
        onChange={v => update('rrspB', v)} personColor={personB.color} />

      <SectionCard title="RRIF Minimum Withdrawal Reference" width="full">
        <p className="text-xs text-slate-400 mb-3">CRA mandated minimum withdrawals as % of Jan 1 balance — all amounts fully taxable.</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {RRIF_TABLE.map(([age, pct]) => (
            <div key={age} className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-center">
              <div className="text-[10px] font-medium text-slate-500">Age {age}</div>
              <div className="text-xs font-semibold text-blue-700 mt-0.5">{(pct as number).toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </CardGrid>
  )
}
