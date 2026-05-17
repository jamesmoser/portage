import { EmploymentTab }  from './input/EmploymentTab'
import { DBPensionTab }   from './input/DBPensionTab'
import { CPPOASTab }      from './input/CPPOASTab'
import { OtherIncomeTab } from './input/OtherIncomeTab'
import { SectionDivider } from '../components/SectionDivider'

export function IncomeTab() {
  return (
    <div className="space-y-2">
      <SectionDivider title="Employment" />
      <EmploymentTab />
      <SectionDivider title="DB Pension" />
      <DBPensionTab />
      <SectionDivider title="CPP & OAS" />
      <CPPOASTab />
      <SectionDivider title="Other Income" />
      <OtherIncomeTab />
    </div>
  )
}
