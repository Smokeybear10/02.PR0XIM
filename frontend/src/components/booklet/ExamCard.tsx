type Props = {
  title?: string
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

export default function ExamCard({ title, children, className, interactive }: Props) {
  return (
    <div className={`exam-card ${interactive ? 'transition-colors duration-300 hover:bg-[#F5F2EA]' : ''} ${className ?? ''}`}>
      {title && <div className="exam-card-title">{title}</div>}
      {children}
    </div>
  )
}
