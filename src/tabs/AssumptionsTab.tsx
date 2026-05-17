import { HouseholdTab }    from './input/HouseholdTab'
import { AssumptionsTab as AssumptionsInputs } from './input/AssumptionsTab'
import { SpendingTab }      from './input/SpendingTab'
import { TaxSettingsTab }   from './input/TaxSettingsTab'
import { SectionDivider }   from '../components/SectionDivider'

export function AssumptionsTab() {
  return (
    <div className="space-y-2">
      <SectionDivider title="Household" />
      <HouseholdTab />
      <SectionDivider title="Return Rates & Inflation" />
      <AssumptionsInputs />
      <SectionDivider title="Spending" />
      <SpendingTab />
      <SectionDivider title="Tax Settings" />
      <TaxSettingsTab />
    </div>
  )
}
