import { exactAgeAt } from '../engine/dates'

export type XAxisMode = 'year' | 'ageA' | 'ageB'

export function buildXAxis(years: number[], mode: XAxisMode, aBirth: string, bBirth: string) {
  return {
    tickmode: 'array' as const,
    tickvals: years,
    ticktext: years.map(y => {
      const d = `${y}-12-31`
      if (mode === 'ageA') return String(Math.floor(exactAgeAt(aBirth, d)))
      if (mode === 'ageB') return String(Math.floor(exactAgeAt(bBirth, d)))
      return String(y)
    }),
  }
}

interface Props {
  value: XAxisMode
  onChange: (m: XAxisMode) => void
  aName: string
  bName: string
}

export function XAxisSelector({ value, onChange, aName, bName }: Props) {
  const options: { value: XAxisMode; label: string }[] = [
    { value: 'year', label: 'Year' },
    { value: 'ageA', label: `${aName}'s Age` },
    { value: 'ageB', label: `${bName}'s Age` },
  ]
  return (
    <div className="flex items-center justify-center gap-2 pt-3">
      <span className="text-sm text-slate-500">X-Axis:</span>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded border text-sm transition-colors ${
            value === o.value
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
