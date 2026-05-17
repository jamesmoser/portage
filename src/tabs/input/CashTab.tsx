import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { InfoPanel } from '../../components/InfoPanel'
import { DEFAULT_STATE } from '../../engine/defaults'

export function CashTab() {
  const { cash, update } = useStore()

  const infoModal = (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold mb-1">Role in the Plan</p>
        <p>The HISA is the first account drawn from when income falls short of spending. It earns interest at the nominal rate you specify — fully taxable at your marginal rate each year. Once depleted, the engine draws from investment accounts in the order set in the withdrawal strategy.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Minimum Balance</p>
        <p>A warning threshold in today's dollars. The plan will flag any year where the projected HISA balance falls below this amount, helping you identify when your liquidity cushion is gone. It does not change withdrawal behaviour — that will be handled in the withdrawal strategy. A common target is 1–2 years of planned spending.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Interest Rate</p>
        <p>Enter the nominal (advertised) rate. The engine applies this gross before tax — actual purchasing power growth depends on your marginal tax rate and inflation, both of which are accounted for elsewhere in the plan.</p>
      </div>
    </div>
  )

  return (
    <CardGrid>
      <SectionCard title="High-Interest Savings Account" width="half"
        onReset={() => update('cash', DEFAULT_STATE.cash)}
        info={infoModal}>
        <div className="space-y-3">
          <NumberInput label="Current Balance" value={cash.hisaBalance}
            onChange={v => update('cash', { ...cash, hisaBalance: v })}
            prefix="$" min={0} step={1000} decimals={0} />
          <NumberInput label="Interest Rate (nominal)" value={cash.hisaRatePct}
            onChange={v => update('cash', { ...cash, hisaRatePct: v })}
            suffix="% / year" min={0} max={15} step={0.1} decimals={1} size="sm" />
          <NumberInput label="Minimum Balance" value={cash.hisaMinBalance}
            onChange={v => update('cash', { ...cash, hisaMinBalance: v })}
            prefix="$" min={0} step={1000} decimals={0}
            tooltip="Warning threshold in today's dollars. The plan flags years where the HISA falls below this level." />
        </div>
        <div className="mt-4">
          <InfoPanel>
            The HISA is drawn first to cover spending shortfalls. Interest is taxable at your marginal rate each year.
          </InfoPanel>
        </div>
      </SectionCard>
    </CardGrid>
  )
}
