interface Props {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  tooltip?: string
  disabled?: boolean
  className?: string
}

export function ToggleInput({ label, value, onChange, tooltip, disabled = false, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} title={tooltip}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full
          transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#7B1515]/30
          ${value ? 'bg-[#7B1515]' : 'bg-slate-300'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm
            transition-transform duration-150
            ${value ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
        />
      </button>
      <span className="text-sm text-slate-700 select-none">{label}</span>
    </div>
  )
}
