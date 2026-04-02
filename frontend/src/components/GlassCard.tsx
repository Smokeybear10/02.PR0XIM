type Props = {
  title?: string
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ title, children, className }: Props) {
  return (
    <div className={`glass p-6 ${className ?? ''}`}>
      {title && (
        <div className="label mb-4">{title}</div>
      )}
      {children}
    </div>
  )
}
