import { WithdrawalStrategyTab } from './input/WithdrawalStrategyTab'
import { IncomeOverviewTab }     from './output/IncomeOverviewTab'
import { SectionDivider }        from '../components/SectionDivider'

export function DashboardTab() {
  return (
    <div className="space-y-2">
      <SectionDivider title="Drawdown Strategy" />
      <WithdrawalStrategyTab />
      <SectionDivider title="Projection" />
      <IncomeOverviewTab />
    </div>
  )
}
