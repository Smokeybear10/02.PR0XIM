type Props = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'url' | 'tel' | 'number'
  multiline?: boolean
  rows?: number
  required?: boolean
  className?: string
}

export default function MinimalInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  multiline,
  rows = 4,
  required,
  className,
}: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      {label && (
        <label className="exam-input-label">
          {label}
          {required && <span style={{ color: '#B91C1C', marginLeft: 4 }}>*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className="exam-input resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="exam-input"
        />
      )}
    </div>
  )
}
