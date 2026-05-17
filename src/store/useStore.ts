import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { AppState } from '../engine/types'
import { DEFAULT_STATE } from '../engine/defaults'

const STORAGE_KEY = 'retirement-planner-v1'

function loadFromStorage(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw, reviver) as Partial<AppState>
    // Deep merge with defaults so new fields added in future are populated
    return deepMerge(DEFAULT_STATE, parsed) as AppState
  } catch {
    return DEFAULT_STATE
  }
}

// JSON doesn't support Infinity — use a sentinel string so tax brackets survive round-trips
const replacer = (_: string, v: unknown) => v === Infinity ? '__Infinity__' : v
const reviver  = (_: string, v: unknown) => v === '__Infinity__' ? Infinity : v

function saveToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state, replacer))
  } catch {
    // localStorage may be unavailable
  }
}

// Simple deep merge: defaults provide the shape, stored values override leaf values
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

interface StoreActions {
  // Patch top-level keys or nested paths using Zustand's set
  update: <K extends keyof AppState>(key: K, value: AppState[K]) => void
  updateNested: <K extends keyof AppState, NK extends keyof AppState[K]>(
    key: K,
    nestedKey: NK,
    value: AppState[K][NK],
  ) => void
  saveManual: () => void
  exportJSON: () => void
  importJSON: (file: File) => Promise<void>
  resetToDefaults: () => void
  // UI state
  activeInputTab: string
  activeOutputTab: string
  setActiveInputTab: (tab: string) => void
  setActiveOutputTab: (tab: string) => void
  lastSaved: Date | null
}

type Store = AppState & StoreActions

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    ...loadFromStorage(),

    // UI state (not persisted)
    activeInputTab: 'household',
    activeOutputTab: 'income',
    lastSaved: null,

    update: (key, value) => {
      set(s => ({ ...s, [key]: value }))
      // Auto-save after update
      setTimeout(() => saveToStorage(get() as AppState), 100)
    },

    updateNested: (key, nestedKey, value) => {
      set(s => ({
        ...s,
        [key]: { ...(s[key] as object), [nestedKey]: value },
      }))
      setTimeout(() => saveToStorage(get() as AppState), 100)
    },

    saveManual: () => {
      saveToStorage(get() as AppState)
      set(s => ({ ...s, lastSaved: new Date() }))
    },

    exportJSON: () => {
      const state = get() as AppState
      const json = JSON.stringify(state, replacer, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `retirement-plan-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    },

    importJSON: async (file: File) => {
      const text = await file.text()
      const parsed = JSON.parse(text, reviver) as Partial<AppState>
      const merged = deepMerge(DEFAULT_STATE, parsed) as AppState
      set(() => ({ ...merged }))
      saveToStorage(merged)
      set(s => ({ ...s, lastSaved: new Date() }))
    },

    resetToDefaults: () => {
      set(() => ({ ...DEFAULT_STATE }))
      saveToStorage(DEFAULT_STATE)
    },

    setActiveInputTab: (tab: string) => set(s => ({ ...s, activeInputTab: tab })),
    setActiveOutputTab: (tab: string) => set(s => ({ ...s, activeOutputTab: tab })),
  })),
)
