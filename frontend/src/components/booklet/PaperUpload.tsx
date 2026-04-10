'use client'

import { useState, useCallback, useRef } from 'react'

type Props = {
  onFileSelect: (file: File) => void
  accept?: string
}

export default function PaperUpload({ onFileSelect, accept = '.pdf,.docx' }: Props) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setFileName(file.name)
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      role="button"
      tabIndex={0}
      aria-label={fileName ? `Submitted: ${fileName}. Click to replace` : 'Submit your resume. Accepts PDF and DOCX'}
      className={`exam-upload ${isDragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
      {fileName ? (
        <>
          <div className="exam-upload-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#166534', marginBottom: 2 }}>{fileName}</p>
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'rgba(0,0,0,0.3)' }}>Click to replace</p>
          </div>
        </>
      ) : (
        <>
          <div className="exam-upload-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>
            Submit your paper — PDF or DOCX
          </p>
        </>
      )}
    </div>
  )
}
