interface Props {
  title: string
  description?: string
}

export function PlaceholderTab({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <div className="text-2xl mb-2">📊</div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      {description && <div className="text-xs mt-1 text-slate-400 text-center max-w-xs">{description}</div>}
      <div className="text-xs mt-4 px-3 py-1 bg-slate-100 rounded text-slate-400">Coming soon</div>
    </div>
  )
}
