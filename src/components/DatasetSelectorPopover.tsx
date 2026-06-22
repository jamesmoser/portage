import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { DATASETS, getDatasetById } from '../engine/datasets'

export function DatasetSelectorPopover() {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  const activeDatasetId = useStore(state => state.activeDatasetId) || 'us_shiller'
  const setActiveDatasetId = useStore(state => state.setActiveDatasetId)
  
  const activeDataset = getDatasetById(activeDatasetId)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all select-none
          ${open ? 'bg-white/20 shadow-inner' : 'bg-white/10 hover:bg-white/15'}`}
      >
        <span className="text-base leading-none select-none">{activeDataset.flag}</span>
        <span className="text-white tracking-tight leading-none">{activeDataset.shortName}</span>
        <svg
          className={`w-3.5 h-3.5 text-red-200 transition-transform duration-200 select-none ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="px-4 py-2 border-b border-slate-100 mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Market Dataset</span>
          </div>
          
          <div className="max-h-[360px] overflow-y-auto">
            {DATASETS.map(ds => {
              const isSelected = ds.id === activeDatasetId
              return (
                <button
                  key={ds.id}
                  onClick={() => {
                    setActiveDatasetId(ds.id)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-colors flex items-start gap-3 hover:bg-slate-50
                    ${isSelected ? 'bg-red-50/30' : ''}`}
                >
                  <span className="text-xl mt-0.5 select-none">{ds.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold text-slate-800 ${isSelected ? 'text-brand-red' : ''}`}>
                        {ds.name}
                      </span>
                      {isSelected && (
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                      <span>{ds.geographicFocus}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-1 py-0.25 rounded">
                        {ds.startYear}–{ds.endYear}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{ds.resolution}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
