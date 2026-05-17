export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#7B1515' }}>{title}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: '#6B1010' }} />
    </div>
  )
}
