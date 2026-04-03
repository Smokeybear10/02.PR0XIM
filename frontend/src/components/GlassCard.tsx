type Props = {
  title?: string
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

export default function GlassCard({ title, children, className, interactive }: Props) {
  return (
    <div className={`glass ${interactive ? 'glass-interactive' : ''} p-6 ${className ?? ''}`}>
      {title && (
        <h3 className="label mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}
