import React from 'react'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function parseISO(s: string): { y: number; m: number; d: number } {
  const [ys, ms, ds] = s.split('-')
  const y = parseInt(ys ?? '2000')
  const m = parseInt(ms ?? '1')
  const d = parseInt(ds ?? '1')
  return {
    y: isNaN(y) ? 2000 : y,
    m: isNaN(m) ? 1 : Math.max(1, Math.min(12, m)),
    d: isNaN(d) ? 1 : Math.max(1, Math.min(31, d)),
  }
}

function toISO(y: number, m: number, d: number): string {
  const maxD = daysInMonth(y, m)
  const safeD = Math.min(Math.max(1, d), maxD)
  return `${y}-${String(m).padStart(2, '0')}-${String(safeD).padStart(2, '0')}`
}

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  tooltip?: string
  disabled?: boolean
  className?: string
  minYear?: number
  maxYear?: number
}

export function DateInput({
  label, value, onChange,
  tooltip, disabled = false, className = '',
  minYear = 1920, maxYear = 2100,
}: Props) {
  const parsed = parseISO(value)

  const [dayStr,  setDayStr]  = React.useState(String(parsed.d))
  const [yearStr, setYearStr] = React.useState(String(parsed.y))
  const [dayFocused,  setDayFocused]  = React.useState(false)
  const [yearFocused, setYearFocused] = React.useState(false)

  React.useEffect(() => {
    const p = parseISO(value)
    if (!dayFocused)  setDayStr(String(p.d))
    if (!yearFocused) setYearStr(String(p.y))
  }, [value, dayFocused, yearFocused])

  const { y, m, d } = parseISO(value)

  function setMonth(newM: number) { onChange(toISO(y, newM, d)) }

  function commitDay(raw: string) {
    setDayFocused(false)
    const n = parseInt(raw)
    const safe = isNaN(n) ? d : Math.max(1, Math.min(n, daysInMonth(y, m)))
    setDayStr(String(safe))
    onChange(toISO(y, m, safe))
  }

  function commitYear(raw: string) {
    setYearFocused(false)
    const n = parseInt(raw)
    const safe = isNaN(n) ? y : Math.max(minYear, Math.min(maxYear, n))
    setYearStr(String(safe))
    onChange(toISO(safe, m, d))
  }

  return (
    <div className={className} title={tooltip}>
      <label className="label-text">{label}</label>
      <div className="flex items-stretch">
        <select
          className="input-field rounded-r-none border-r-0 w-[68px] px-2 shrink-0 cursor-pointer"
          value={m}
          disabled={disabled}
          onChange={e => setMonth(parseInt(e.target.value))}
        >
          {MONTHS.map((name, i) => (
            <option key={i + 1} value={i + 1}>{name}</option>
          ))}
        </select>

        <input
          type="number"
          inputMode="numeric"
          className="input-field rounded-none border-r-0 w-[48px] px-1 text-center
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={dayFocused ? dayStr : d}
          placeholder="DD"
          min={1}
          max={daysInMonth(y, m)}
          disabled={disabled}
          onChange={e => setDayStr(e.target.value)}
          onFocus={() => { setDayFocused(true); setDayStr(String(d)) }}
          onBlur={e => commitDay(e.target.value)}
        />

        <input
          type="number"
          inputMode="numeric"
          className="input-field rounded-l-none w-[70px] px-1 text-center
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={yearFocused ? yearStr : y}
          placeholder="YYYY"
          min={minYear}
          max={maxYear}
          disabled={disabled}
          onChange={e => setYearStr(e.target.value)}
          onFocus={() => { setYearFocused(true); setYearStr(String(y)) }}
          onBlur={e => commitYear(e.target.value)}
        />
      </div>
    </div>
  )
}
