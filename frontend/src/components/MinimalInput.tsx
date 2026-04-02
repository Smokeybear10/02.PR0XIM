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
    <div className={`space-y-2 ${className ?? ''}`}>
      {label && (
        <label className="label block">
          {label}
          {required && <span className="text-text-primary ml-1">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className="input-minimal resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="input-minimal"
        />
      )}
    </div>
  )
}
