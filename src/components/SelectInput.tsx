interface Option { value: string; label: string }

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  tooltip?: string
  disabled?: boolean
  className?: string
}

export function SelectInput({ label, value, onChange, options, tooltip, disabled = false, className = '' }: Props) {
  return (
    <div className={className} title={tooltip}>
      <label className="label-text">{label}</label>
      <select
        className="input-field"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
