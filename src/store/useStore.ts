import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { AppState, WhatIfs, HeadlineMetrics, Scenario } from '../engine/types'
import { DEFAULT_STATE, DEFAULT_WHATIFS } from '../engine/defaults'

// ─── Main plan storage (base plan + scenarios → exported in JSON) ─────────────

const STORAGE_KEY = 'retirement-planner-v1'

// JSON doesn't support Infinity — use a sentinel string so tax brackets survive round-trips
const replacer = (_: string, v: unknown) => v === Infinity ? '__Infinity__' : v
const reviver  = (_: string, v: unknown) => v === '__Infinity__' ? Infinity : v

function saveToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state, replacer))
  } catch { /* localStorage may be unavailable */ }
}

// Simple deep merge: defaults provide the shape, stored values override leaf values.
// Array types are taken as-is from stored (no element-level merging).
function deepMerge(defaults: unknown, stored: unknown): unknown {
  if (stored === null || stored === undefined) return defaults
  if (typeof defaults !== 'object' || Array.isArray(defaults)) return stored ?? defaults
  const result = { ...(defaults as Record<string, unknown>) }
  for (const key of Object.keys(result)) {
    const storedVal = (stored as Record<string, unknown>)[key]
    if (storedVal !== undefined) {
      result[key] = deepMerge(result[key], storedVal)
    }
  }
  return result
}

function loadFromStorage(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw, reviver) as Partial<AppState>
    const merged = deepMerge(DEFAULT_STATE, parsed) as unknown as AppState
    // Migrate: clear scenarios from the old format (they had returnRateOffsetPct instead of whatIfs)
    if (merged.scenarios.length > 0 && !('whatIfs' in merged.scenarios[0])) {
      merged.scenarios = []
    }
    return merged
  } catch {
    return DEFAULT_STATE
  }
}

// ─── What-if + freeze storage (session state → NOT exported in JSON) ──────────

const WHATIF_KEY = 'retirement-whatifs-v1'

function saveWhatIfStorage(
  whatIfs: WhatIfs,
  frozenMetrics: HeadlineMetrics | null,
  activeScenarioId: string | null,
): void {
  try {
    localStorage.setItem(WHATIF_KEY, JSON.stringify({ whatIfs, frozenMetrics, activeScenarioId }))
  } catch { /* ignore */ }
}

function loadWhatIfStorage(): { whatIfs: WhatIfs; frozenMetrics: HeadlineMetrics | null; activeScenarioId: string | null } {
  try {
    const raw = localStorage.getItem(WHATIF_KEY)
    if (!raw) return { whatIfs: DEFAULT_WHATIFS, frozenMetrics: null, activeScenarioId: null }
    const parsed = JSON.parse(raw)
    return {
      whatIfs:          deepMerge(DEFAULT_WHATIFS, parsed.whatIfs ?? {}) as WhatIfs,
      frozenMetrics:    parsed.frozenMetrics ?? null,
      activeScenarioId: parsed.activeScenarioId ?? null,
    }
  } catch {
    return { whatIfs: DEFAULT_WHATIFS, frozenMetrics: null, activeScenarioId: null }
  }
}

// ─── Store types ──────────────────────────────────────────────────────────────

interface StoreActions {
  update: <K extends keyof AppState>(key: K, value: AppState[K]) => void
  updateNested: <K extends keyof AppState, NK extends keyof AppState[K]>(
    key: K, nestedKey: NK, value: AppState[K][NK],
  ) => void
  exportJSON: () => void
  importJSON: (file: File) => Promise<void>
  resetToDefaults: () => void

  // What-if state (localStorage only, not in JSON export)
  whatIfs: WhatIfs
  frozenMetrics: HeadlineMetrics | null
  activeScenarioId: string | null
  updateWhatIf: <K extends keyof WhatIfs>(key: K, patch: Partial<WhatIfs[K]>) => void
  resetWhatIfs: () => void
  resetWhatIfsExceptDrawdown: () => void
  freezeMetrics: (metrics: HeadlineMetrics) => void
  clearFreeze: () => void
  saveScenario: (name: string) => void
  loadScenario: (id: string) => void
  deleteScenario: (id: string) => void

  // UI state (not persisted)
  activeInputTab: string
  activeOutputTab: string
  setActiveInputTab: (tab: string) => void
  setActiveOutputTab: (tab: string) => void
  lastSaved: Date | null
}

type Store = AppState & StoreActions

// ─── Store ────────────────────────────────────────────────────────────────────

const wiInit = loadWhatIfStorage()

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    ...loadFromStorage(),

    // What-if state
    whatIfs:          wiInit.whatIfs,
    frozenMetrics:    wiInit.frozenMetrics,
    activeScenarioId: wiInit.activeScenarioId,

    // UI state (not persisted)
    activeInputTab:  'household',
    activeOutputTab: 'income',
    lastSaved:       null,

    // ── Base plan mutations ───────────────────────────────────────────────────

    update: (key, value) => {
      set(s => ({ ...s, [key]: value }))
      setTimeout(() => {
        const full = get()
        const appState = Object.fromEntries(
          (Object.keys(DEFAULT_STATE) as Array<keyof AppState>).map(k => [k, full[k]])
        ) as unknown as AppState
        saveToStorage(appState)
        set(s => ({ ...s, lastSaved: new Date() }))
      }, 100)
    },

    updateNested: (key, nestedKey, value) => {
      set(s => ({ ...s, [key]: { ...(s[key] as object), [nestedKey]: value } }))
      setTimeout(() => {
        const full = get()
        const appState = Object.fromEntries(
          (Object.keys(DEFAULT_STATE) as Array<keyof AppState>).map(k => [k, full[k]])
        ) as unknown as AppState
        saveToStorage(appState)
        set(s => ({ ...s, lastSaved: new Date() }))
      }, 100)
    },

    exportJSON: () => {
      const full = get()
      const appState = Object.fromEntries(
        (Object.keys(DEFAULT_STATE) as Array<keyof AppState>).map(k => [k, full[k]])
      ) as unknown as AppState
      const json = JSON.stringify(appState, replacer, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `retirement-plan-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    },

    importJSON: async (file: File) => {
      const text   = await file.text()
      const parsed = JSON.parse(text, reviver) as Partial<AppState>
      const merged = deepMerge(DEFAULT_STATE, parsed) as unknown as AppState
      // Clear old-format scenarios
      if (merged.scenarios.length > 0 && !('whatIfs' in merged.scenarios[0])) {
        merged.scenarios = []
      }
      set(() => ({ ...merged }))
      saveToStorage(merged)
      // Reset what-if state on import
      set(s => ({ ...s, whatIfs: DEFAULT_WHATIFS, frozenMetrics: null, activeScenarioId: null, lastSaved: new Date() }))
      saveWhatIfStorage(DEFAULT_WHATIFS, null, null)
    },

    resetToDefaults: () => {
      set(() => ({ ...DEFAULT_STATE }))
      saveToStorage(DEFAULT_STATE)
      set(s => ({ ...s, whatIfs: DEFAULT_WHATIFS, frozenMetrics: null, activeScenarioId: null }))
      saveWhatIfStorage(DEFAULT_WHATIFS, null, null)
    },

    // ── What-if mutations ─────────────────────────────────────────────────────

    updateWhatIf: (key, patch) => {
      const current  = get().whatIfs
      const updated  = { ...current, [key]: { ...current[key], ...patch } } as WhatIfs
      set(s => ({ ...s, whatIfs: updated }))
      saveWhatIfStorage(updated, get().frozenMetrics, get().activeScenarioId)
    },

    resetWhatIfs: () => {
      set(s => ({ ...s, whatIfs: DEFAULT_WHATIFS, activeScenarioId: null }))
      saveWhatIfStorage(DEFAULT_WHATIFS, get().frozenMetrics, null)
    },

    resetWhatIfsExceptDrawdown: () => {
      const updated = { ...DEFAULT_WHATIFS, drawdownStrategy: get().whatIfs.drawdownStrategy }
      set(s => ({ ...s, whatIfs: updated, activeScenarioId: null }))
      saveWhatIfStorage(updated, get().frozenMetrics, null)
    },

    freezeMetrics: (metrics: HeadlineMetrics) => {
      set(s => ({ ...s, frozenMetrics: metrics }))
      saveWhatIfStorage(get().whatIfs, metrics, get().activeScenarioId)
    },

    clearFreeze: () => {
      set(s => ({ ...s, frozenMetrics: null }))
      saveWhatIfStorage(get().whatIfs, null, get().activeScenarioId)
    },

    // ── Scenario management ───────────────────────────────────────────────────

    saveScenario: (name: string) => {
      const currentWhatIfs = get().whatIfs
      const existingIdx    = get().scenarios.findIndex(s => s.name === name)
      let scenarios: Scenario[]
      let id: string

      if (existingIdx >= 0) {
        id        = get().scenarios[existingIdx].id
        scenarios = get().scenarios.map((s, i) =>
          i === existingIdx ? { ...s, whatIfs: currentWhatIfs, savedAt: new Date().toISOString() } : s)
      } else {
        id        = crypto.randomUUID()
        scenarios = [...get().scenarios, { id, name, whatIfs: currentWhatIfs, savedAt: new Date().toISOString() }]
      }

      set(s => ({ ...s, scenarios, activeScenarioId: id }))
      const full = get()
      const appState = Object.fromEntries(
        (Object.keys(DEFAULT_STATE) as Array<keyof AppState>).map(k => [k, full[k]])
      ) as unknown as AppState
      saveToStorage(appState)
      saveWhatIfStorage(currentWhatIfs, get().frozenMetrics, id)
    },

    loadScenario: (id: string) => {
      const scenario = get().scenarios.find(s => s.id === id)
      if (!scenario) return
      set(s => ({ ...s, whatIfs: scenario.whatIfs, activeScenarioId: id }))
      saveWhatIfStorage(scenario.whatIfs, get().frozenMetrics, id)
    },

    deleteScenario: (id: string) => {
      const scenarios      = get().scenarios.filter(s => s.id !== id)
      const activeScenarioId = get().activeScenarioId === id ? null : get().activeScenarioId
      set(s => ({ ...s, scenarios, activeScenarioId }))
      const full = get()
      const appState = Object.fromEntries(
        (Object.keys(DEFAULT_STATE) as Array<keyof AppState>).map(k => [k, full[k]])
      ) as unknown as AppState
      saveToStorage(appState)
      saveWhatIfStorage(get().whatIfs, get().frozenMetrics, activeScenarioId)
    },

    setActiveInputTab:  (tab) => set(s => ({ ...s, activeInputTab:  tab })),
    setActiveOutputTab: (tab) => set(s => ({ ...s, activeOutputTab: tab })),
  })),
)
