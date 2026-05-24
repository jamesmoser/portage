import { RRSPTab }        from './input/RRSPTab'
import { TFSATab }        from './input/TFSATab'
import { NonRegTab }      from './input/NonRegTab'
import { CashTab }        from './input/CashTab'
import { SectionDivider } from '../components/SectionDivider'

export function InvestmentsTab() {
  return (
    <div className="space-y-2">
      <SectionDivider title="RRSP / RRIF" />
      <RRSPTab />
      <SectionDivider title="TFSA" />
      <TFSATab />
      <SectionDivider title="Non-Registered" />
      <NonRegTab />
      <SectionDivider title="Cash" />
      <CashTab />
    </div>
  )
}
