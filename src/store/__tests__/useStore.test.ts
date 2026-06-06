import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../useStore'

describe('useStore update clamping', () => {
  beforeEach(() => {
    useStore.getState().resetToDefaults()
  })

  it('clamps CPP and OAS dates when birthDate changes', () => {
    const store = useStore.getState()
    
    // Set birthDate to 1961-06-15, CPP start at 2026-06-15 (age 65)
    store.update('personA', { ...store.personA, birthDate: '1961-06-15' })
    store.update('cppA', { ...store.cppA, startDate: '2026-06-15' })
    store.update('oasA', { ...store.oasA, startDate: '2026-06-15' })

    // Change birthDate to 1967-06-15 (age at 2026-06-15 becomes 59, which is <60 for CPP and <65 for OAS)
    useStore.getState().update('personA', { ...useStore.getState().personA, birthDate: '1967-06-15' })

    // CPP should clamp to age 60 (2027-06-15)
    expect(useStore.getState().cppA.startDate).toBe('2027-06-15')
    // OAS should clamp to age 65 (2032-06-15)
    expect(useStore.getState().oasA.startDate).toBe('2032-06-15')
  })

  it('clamps CPP and OAS dates when start dates are set out of bounds directly', () => {
    const store = useStore.getState()
    store.update('personA', { ...store.personA, birthDate: '1961-06-15' })

    // Set CPP start to 2019-06-15 (age 58, which is <60)
    store.update('cppA', { ...store.cppA, startDate: '2019-06-15' })
    expect(useStore.getState().cppA.startDate).toBe('2021-06-15') // age 60

    // Set OAS start to 2033-06-15 (age 72, which is >70)
    store.update('oasA', { ...store.oasA, startDate: '2033-06-15' })
    expect(useStore.getState().oasA.startDate).toBe('2031-06-15') // age 70
  })
})
