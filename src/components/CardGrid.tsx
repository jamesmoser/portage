/** 6-column responsive grid that SectionCard slots into via the `width` prop. */
export function CardGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-6 gap-4 items-stretch ${className}`}>
      {children}
    </div>
  )
}
