import React from 'react'

interface Props {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
  decimals?: number
  tooltip?: string
  disabled?: boolean
  className?: string
}

export function NumberInput({
  label, value: valueProp, onChange,
  prefix, suffix, min, max, step = 1, decimals = 0,
  tooltip, disabled = false, className = '',
}: Props) {
  const value = valueProp ?? 0
  const [localValue, setLocalValue] = React.useState<string>(
    value === 0 ? '' : value.toFixed(decimals),
  )
  const [focused, setFocused] = React.useState(false)

  function formatDisplay(n: number): string {
    if (n === 0) return ''
    if (decimals === 0) return n.toLocaleString('en-CA', { maximumFractionDigits: 0 })
    return n.toFixed(decimals)
  }

  React.useEffect(() => {
    if (!focused) setLocalValue(value === 0 ? '' : value.toFixed(decimals))
  }, [value, focused, decimals])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalValue(e.target.value)
    const n = parseFloat(e.target.value.replace(/,/g, ''))
    if (!isNaN(n)) onChange(n)
    else if (e.target.value === '' || e.target.value === '-') onChange(0)
  }

  function handleBlur() {
    setFocused(false)
    const n = parseFloat(localValue.replace(/,/g, ''))
    const clamped = isNaN(n) ? 0 : (min !== undefined ? Math.max(min, n) : n)
    const final = max !== undefined ? Math.min(max, clamped) : clamped
    onChange(final)
    setLocalValue(final === 0 ? '' : final.toFixed(decimals))
  }

  const unit = prefix ? `(${prefix})` : suffix ? `(${suffix})` : ''
  const fullLabel = unit ? `${label} ${unit}` : label

  return (
    <div className={className} title={tooltip}>
      <label className="label-text">{fullLabel}</label>
      <input
        type="text"
        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
        className="input-field"
        value={focused ? localValue : formatDisplay(value)}
        onChange={handleChange}
        onFocus={() => { setFocused(true); setLocalValue(value === 0 ? '' : value.toFixed(decimals)) }}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="0"
      />
    </div>
  )
}
