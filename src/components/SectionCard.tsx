import { useState } from 'react'

/** Width in the 6-column CardGrid:
 *  - "full"  → spans all 6 columns (100%)
 *  - "half"  → spans 3 columns (50%)   — default
 *  - "third" → spans 2 columns (33%)
 */
export type CardWidth = 'full' | 'half' | 'third'

const COL_SPAN: Record<CardWidth, string> = {
  full:  'col-span-1 md:col-span-6',
  half:  'col-span-1 md:col-span-3',
  third: 'col-span-1 md:col-span-2',
}

/** Single system colour used for all non-person cards. */
const SYSTEM_COLOR = '#166534'

function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!m) return 'transparent'
  return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${alpha})`
}

interface Props {
  title: string
  children: React.ReactNode
  width?: CardWidth
  /** Hex color from a person's profile — overrides system color for accent bar + card background */
  personColor?: string
  /** Extra classes applied to the outer col-span wrapper */
  className?: string
  /** Content shown in the info modal — replaces the default "coming soon" placeholder */
  info?: React.ReactNode
  /** Extra content rendered to the right of the title (e.g. axis selector) */
  headerRight?: React.ReactNode
  /** When provided, shows a reset button that calls this after confirmation */
  onReset?: () => void
}

export function SectionCard({
  title,
  children,
  width = 'half',
  personColor,
  className = '',
  info,
  headerRight,
  onReset,
}: Props) {
  const cardStyle = personColor
    ? { backgroundColor: hexToRgba(personColor, 0.06) }
    : undefined

  const [modalOpen, setModalOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <div className={`${COL_SPAN[width]} ${className}`}>
      <div className="card h-full" style={cardStyle}>
        {/* Header */}
        <div className="card-header">
          <div className="flex items-center min-w-0 flex-1 gap-3">
            <div className="min-w-0">
              <div className="card-title truncate">{title}</div>
            </div>
            {headerRight && <div className="shrink-0">{headerRight}</div>}
          </div>
          {onReset && (
            <button
              onClick={() => setResetOpen(true)}
              className="shrink-0 ml-2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-500 transition-colors"
              aria-label="Reset to defaults"
              title="Reset to defaults"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M2.5 8a5.5 5.5 0 1 1 .994 3.161l-1.33.886A7 7 0 1 0 1 8H.5a.5.5 0 0 0 0 1H2a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-1 0v.5H1A7 7 0 0 0 2.5 8Z"/>
                <path d="M1 1.5A.5.5 0 0 1 1.5 1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2H1.5a.5.5 0 0 1-.5-.5Z"/>
              </svg>
            </button>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 ml-2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-500 transition-colors"
            aria-label="More info"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"/>
              <path d="M7 6.5a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4ZM8 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="card-body">
          {children}
        </div>
      </div>

      {/* Info modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 flex flex-col"
            style={{ maxHeight: 'calc(100dvh - 3rem)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-4 shrink-0">
              <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-6 text-sm text-slate-700">
              {info
                ? info
                : <p className="text-slate-400 italic">More information coming soon.</p>
              }
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {resetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setResetOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm mx-4 p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-bold text-slate-900 mb-2">Reset {title}?</h2>
            <p className="text-sm text-slate-600 mb-6">This will restore all fields in this card to their default values. Other cards will not be affected.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setResetOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => { onReset!(); setResetOpen(false) }}
                className="btn-danger"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
