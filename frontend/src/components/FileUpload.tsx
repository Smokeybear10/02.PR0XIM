'use client'

import { useState, useCallback, useRef } from 'react'

type Props = {
  onFileSelect: (file: File) => void
  accept?: string
}

export default function FileUpload({ onFileSelect, accept = '.pdf,.docx' }: Props) {
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        glass cursor-pointer transition-all duration-200 p-10 text-center
        ${isDragging ? 'border-border-focus bg-accent' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {fileName ? (
        <div>
          <p className="font-display text-sm text-text-primary tracking-wider uppercase">{fileName}</p>
          <p className="text-text-muted text-xs mt-1 font-body">Click to replace</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full border border-border-subtle mx-auto flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <p className="text-text-secondary text-sm font-body">Drop your resume here or click to upload</p>
          <p className="text-text-muted text-xs font-body">PDF, DOCX</p>
        </div>
      )}
    </div>
  )
}
