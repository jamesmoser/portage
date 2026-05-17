import { useState, useRef, useEffect } from 'react'
import { useStore } from './store/useStore'
import portageIcon from './assets/portage-icon.png'

import { DashboardTab }   from './tabs/DashboardTab'
import { AssumptionsTab } from './tabs/AssumptionsTab'
import { IncomeTab }      from './tabs/IncomeTab'
import { InvestmentsTab } from './tabs/InvestmentsTab'
import { ScenariosTab }   from './tabs/input/ScenariosTab'

const TABS = [
  { id: 'dashboard',   label: 'Dashboard',   Component: DashboardTab   },
  { id: 'assumptions', label: 'Assumptions', Component: AssumptionsTab },
  { id: 'income',      label: 'Income',      Component: IncomeTab      },
  { id: 'investments', label: 'Investments', Component: InvestmentsTab },
  { id: 'scenarios',   label: 'Scenarios',   Component: ScenariosTab   },
]

export default function App() {
  const { saveManual, exportJSON, importJSON, lastSaved } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component ?? (() => null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header ── */}
      <header className="px-5 py-3 flex items-center justify-between shrink-0" style={{ backgroundColor: '#7B1515' }}>
        <div className="flex items-center gap-3">
          <img src={portageIcon} alt="Portage" className="h-[50px] w-[50px] rounded-full" />
          <div>
            <h1 className="font-display text-[19px] font-bold text-white tracking-tight">Portage</h1>
            <p className="text-[11px] text-red-200 mt-0.5">Canadian Retirement Wealth Planner</p>
          </div>
        </div>

        {/* Hamburger menu — top right */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex flex-col justify-center items-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors gap-1"
            aria-label="Menu"
          >
            <span className="block w-[18px] h-0.5 bg-white rounded-full" />
            <span className="block w-[18px] h-0.5 bg-white rounded-full" />
            <span className="block w-[18px] h-0.5 bg-white rounded-full" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
              <button
                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => { saveManual(); setMenuOpen(false) }}
              >
                Save
              </button>
              <button
                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => { exportJSON(); setMenuOpen(false) }}
              >
                Export JSON
              </button>
              <label className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center">
                Import JSON
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async e => {
                    const f = e.target.files?.[0]
                    if (f) await importJSON(f)
                    if (fileRef.current) fileRef.current.value = ''
                    setMenuOpen(false)
                  }}
                />
              </label>
              {lastSaved && (
                <>
                  <div className="border-t border-slate-100 my-1" />
                  <p className="px-4 py-1.5 text-[10px] text-slate-400">
                    Saved {lastSaved.toLocaleTimeString()}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Tab strip ── */}
      <nav className="px-5 shrink-0" style={{ backgroundColor: '#6B1010' }}>
        <div className="flex items-end gap-0.5 pt-2.5 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all duration-100
                ${activeTab === t.id
                  ? 'text-slate-900 shadow-sm'
                  : 'text-red-200 hover:text-white hover:bg-white/10'
                }`}
              style={activeTab === t.id ? { backgroundColor: '#f2f3f5' } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Tab content ── */}
      <main className="flex-1 overflow-auto p-5">
        <ActiveComponent />
      </main>
    </div>
  )
}
