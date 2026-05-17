import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { InfoPanel } from '../../components/InfoPanel'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { SelectInput } from '../../components/SelectInput'
import { ToggleInput } from '../../components/ToggleInput'

export function WithdrawalStrategyTab() {
  const { withdrawalStrategy, personA, update } = useStore()
  const ws = withdrawalStrategy

  return (
    <CardGrid>
      <SectionCard title="Account Withdrawal Order" width="half">
        <p className="text-xs text-slate-500 mb-3">
          When portfolio withdrawals are needed to meet spending, which accounts are drawn first?
          "Optimized" attempts to minimize lifetime tax by choosing dynamically each year.
        </p>
        <SelectInput
          label="Withdrawal Order"
          value={ws.withdrawalOrder}
          onChange={v => update('withdrawalStrategy', { ...ws, withdrawalOrder: v as typeof ws.withdrawalOrder })}
          options={[
            { value: 'optimized', label: 'Optimized (minimize lifetime tax)' },
            { value: 'tfsa_first', label: 'TFSA First' },
            { value: 'rrsp_first', label: 'RRSP / RRIF First' },
            { value: 'nonreg_first', label: 'Non-Registered First' },
          ]}
          tooltip="TFSA first: preserves tax-deferred growth. RRSP first: reduces future mandatory minimums. Non-reg first: may be optimal before turning 65."
        />
        <InfoPanel>
          <p className="font-medium mb-1">Common strategies:</p>
          <p><span className="font-medium">TFSA first:</span> Best if you expect income to rise (preserves tax-sheltered growth for later)</p>
          <p><span className="font-medium">RRSP first:</span> Reduces mandatory RRIF minimums at 72+; useful for RRSP meltdown</p>
          <p><span className="font-medium">Non-reg first:</span> Lets registered accounts compound longer; capital gains may be at lower rate in early retirement</p>
          <p><span className="font-medium">Optimized:</span> Tool chooses the mix each year to minimize combined household tax</p>
        </InfoPanel>
      </SectionCard>

      <SectionCard title="Pension Income Splitting" width="half">
        <p className="text-xs text-slate-500 mb-3">
          Up to 50% of eligible pension income (defined benefit pension, RRIF income at 65+) can be attributed
          to the lower-income spouse, reducing household tax.
        </p>
        <div className="grid grid-cols-1 gap-3">
          <SelectInput
            label="Splitting Mode"
            value={ws.pensionSplitMode}
            onChange={v => update('withdrawalStrategy', { ...ws, pensionSplitMode: v as typeof ws.pensionSplitMode })}
            options={[
              { value: 'auto', label: 'Auto-optimize (minimize household tax each year)' },
              { value: 'manual', label: 'Manual — fixed percentage' },
            ]}
          />
          {ws.pensionSplitMode === 'manual' && (
            <NumberInput
              label="Percentage of eligible pension attributed to other spouse"
              value={ws.pensionSplitPct}
              onChange={v => update('withdrawalStrategy', { ...ws, pensionSplitPct: v })}
              suffix="%" min={0} max={50} step={1} decimals={0} size="sm"
              tooltip="0% = no splitting; 50% = maximum allowed"
            />
          )}
        </div>
      </SectionCard>

      <SectionCard title="RRSP Meltdown Strategy" width="full">
        <p className="text-xs text-slate-500 mb-3">
          An RRSP meltdown deliberately withdraws from RRSP at an accelerated rate during low-income years
          (typically 50–65) to reduce the balance before mandatory RRIF minimums kick in at 72, and to smooth
          income across all years. The withdrawn amount is invested in a TFSA or non-registered account.
        </p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <ToggleInput
            label="Enable RRSP Meltdown"
            value={ws.rrspMeltdownEnabled}
            onChange={v => update('withdrawalStrategy', { ...ws, rrspMeltdownEnabled: v })}
            className="col-span-2 xl:col-span-1"
          />
          <NumberInput
            label={`Target Annual RRSP Withdrawal — ${personA.name || 'Person A'} (today's $)`}
            value={ws.rrspMeltdownTargetAnnual}
            onChange={v => update('withdrawalStrategy', { ...ws, rrspMeltdownTargetAnnual: v })}
            prefix="$" min={0} step={1000} decimals={0}
            disabled={!ws.rrspMeltdownEnabled}
            tooltip="Amount drawn from RRSP in addition to what's needed for spending — aim to fill up lower tax brackets"
          />
          <DateInput
            label="Meltdown End Date"
            value={ws.rrspMeltdownEndDate}
            onChange={v => update('withdrawalStrategy', { ...ws, rrspMeltdownEndDate: v })}
            disabled={!ws.rrspMeltdownEnabled}
            tooltip="Stop accelerated withdrawals by this date (typically RRIF conversion or CPP/OAS start)"
          />
          <ToggleInput
            label="Re-invest excess in TFSA"
            value={ws.tfsaRebalancingEnabled}
            onChange={v => update('withdrawalStrategy', { ...ws, tfsaRebalancingEnabled: v })}
            disabled={!ws.rrspMeltdownEnabled}
            tooltip="After-tax proceeds from RRSP meltdown are deposited into TFSA if room exists"
          />
        </div>
        {ws.rrspMeltdownEnabled && (
          <InfoPanel>
            <p className="font-medium mb-1">Key considerations for RRSP meltdown:</p>
            <p>• Target withdrawals that keep your income below the OAS clawback threshold (~$91k)</p>
            <p>• Consider filling up to the top of a lower tax bracket (e.g. $55,867 federal) each year</p>
            <p>• Compare total lifetime tax with and without meltdown using the RRSP Strategy output tab</p>
          </InfoPanel>
        )}
      </SectionCard>
    </CardGrid>
  )
}
