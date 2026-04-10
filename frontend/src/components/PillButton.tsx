type Props = {
  children: React.ReactNode
  variant?: 'ghost' | 'filled'
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

export default function PillButton({
  children,
  variant = 'ghost',
  onClick,
  disabled,
  fullWidth,
  type = 'button',
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variant === 'filled' ? 'btn-exam' : 'btn-exam-outline'} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  )
}
