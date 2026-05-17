export function InfoPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded bg-amber-50 border border-amber-200 px-3 py-2.5">
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"/>
        <path d="M7 6.5a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4ZM8 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
      </svg>
      <div className="text-sm text-slate-700 min-w-0">{children}</div>
    </div>
  )
}
