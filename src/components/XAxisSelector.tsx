import { useEffect } from 'react'
import { exactAgeAt } from '../engine/dates'
import { useStore } from '../store/useStore'

export type XAxisMode = 'year' | 'ageA' | 'ageB'

export function buildXAxis(
  years: number[], mode: XAxisMode,
  aBirth: string, bBirth: string,
  aEndAge: number, bEndAge: number,
) {
  return {
    tickmode: 'array' as const,
    tickvals: years,
    range: years.length > 0 ? [years[0] - 0.5, years[years.length - 1] + 0.5] : undefined,
    ticktext: years.map(y => {
      const d = `${y}-12-31`
      if (mode === 'ageA') {
        const age = Math.floor(exactAgeAt(aBirth, d))
        return age > aEndAge ? `(${age})` : String(age)
      }
      if (mode === 'ageB') {
        const age = Math.floor(exactAgeAt(bBirth, d))
        return age > bEndAge ? `(${age})` : String(age)
      }
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
  const personBName = useStore(s => s.personB.name)
  const hasPersonB = !!personBName

  useEffect(() => {
    if (value === 'ageB' && !hasPersonB) {
      onChange('year')
    }
  }, [value, hasPersonB, onChange])

  const options: { value: XAxisMode; label: string }[] = [
    { value: 'year', label: 'Year' },
    { value: 'ageA', label: `${aName}'s Age` },
  ]

  if (hasPersonB) {
    options.push({ value: 'ageB', label: `${bName}'s Age` })
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded border text-sm transition-colors ${
            value === o.value
              ? 'text-white border-[#7B1515]'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
          }`}
          style={value === o.value ? { backgroundColor: '#7B1515' } : {}}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

