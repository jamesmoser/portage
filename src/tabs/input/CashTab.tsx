import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { InfoPanel } from '../../components/InfoPanel'

export function CashTab() {
  const { cash, personalInflationRatePct, update } = useStore()

  return (
    <CardGrid>
      <SectionCard title="High-Interest Savings Account" width="half">
        <div className="space-y-3">
          <NumberInput label="HISA Balance" value={cash.hisaBalance}
            onChange={v => update('cash', { ...cash, hisaBalance: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Interest Rate (nominal)" value={cash.hisaRatePct}
            onChange={v => update('cash', { ...cash, hisaRatePct: v })}
            suffix="% / year" min={0} max={15} step={0.1} decimals={1} size="sm"
            tooltip="HISA interest is fully taxable at your marginal rate." />
        </div>
        <div className="mt-4">
          <InfoPanel>
            Real rate after personal inflation: <strong>{(cash.hisaRatePct - personalInflationRatePct).toFixed(2)}%</strong>
          </InfoPanel>
        </div>
      </SectionCard>

      <SectionCard title="Chequing & Cash Buffer" width="half">
        <div className="space-y-3">
          <NumberInput label="Chequing Account Balance" value={cash.chequingBalance}
            onChange={v => update('cash', { ...cash, chequingBalance: v })}
            prefix="$" min={0} step={500} decimals={0}
            tooltip="Operating cash — earns no return in the model" />
          <NumberInput label="Target Minimum Cash Buffer" value={cash.targetCashBuffer}
            onChange={v => update('cash', { ...cash, targetCashBuffer: v })}
            prefix="$" min={0} step={500} decimals={0}
            tooltip="The tool will flag years where total cash falls below this amount" />
        </div>
        <InfoPanel>
          The projection draws from HISA first to cover shortfalls before touching investment accounts.
          Keep at least 1–2 years of spending as a buffer.
        </InfoPanel>
      </SectionCard>
    </CardGrid>
  )
}
