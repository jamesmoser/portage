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
        <p>The HISA represents your liquid cash savings — money in a high-interest savings account, money market fund, or similar low-risk, instantly accessible account. It plays two roles in the plan:</p>
        <ul className="mt-1 ml-3 list-disc list-outside space-y-0.5">
          <li><strong>Spending buffer</strong> — In the spending gap drawdown strategy, the HISA is available as a deficit account to draw from when income falls short of spending. Having 1–2 years of living expenses in the HISA is a common rule of thumb to avoid selling investments in a downturn.</li>
          <li><strong>Surplus target</strong> — The surplus routing in the Dashboard's drawdown strategy can direct excess income (e.g. when RRIF minimums exceed spending needs) into the HISA to build the cash cushion back up.</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold mb-1">Interest Rate</p>
        <p>Enter the nominal (advertised) rate. Interest earned is fully taxable at your marginal rate each year — this makes the HISA the least tax-efficient growth vehicle. In retirement, it's best used as a buffer rather than a long-term investment.</p>
      </div>
      <div>
        <p className="font-semibold mb-1">Minimum Balance</p>
        <p>A warning floor. The plan highlights years where the HISA drops below this amount, helping you see when your liquidity cushion is gone. A reasonable target is 1–2 years of planned spending. This is informational only — the engine will still draw below it if needed.</p>
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
