'use client'

import { useState } from 'react'
import GlassCard from '@/components/GlassCard'
import PillButton from '@/components/PillButton'
import MinimalInput from '@/components/MinimalInput'

type WorkExperience = {
  id: string
  company: string
  title: string
  startDate: string
  endDate: string
  description: string
}

type Education = {
  id: string
  school: string
  degree: string
  field: string
  year: string
}

type Project = {
  id: string
  name: string
  description: string
  link: string
}

const TEMPLATES = ['Modern', 'Classic', 'Minimal', 'Technical', 'Executive']

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function BuilderPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [summary, setSummary] = useState('')
  const [skills, setSkills] = useState('')
  const [template, setTemplate] = useState('Modern')
  const [generating, setGenerating] = useState(false)

  const [experiences, setExperiences] = useState<WorkExperience[]>([
    { id: generateId(), company: '', title: '', startDate: '', endDate: '', description: '' },
  ])

  const [education, setEducation] = useState<Education[]>([
    { id: generateId(), school: '', degree: '', field: '', year: '' },
  ])

  const [projects, setProjects] = useState<Project[]>([
    { id: generateId(), name: '', description: '', link: '' },
  ])

  const addExperience = () => {
    setExperiences([...experiences, { id: generateId(), company: '', title: '', startDate: '', endDate: '', description: '' }])
  }

  const removeExperience = (id: string) => {
    if (experiences.length <= 1) return
    setExperiences(experiences.filter((e) => e.id !== id))
  }

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const addEducation = () => {
    setEducation([...education, { id: generateId(), school: '', degree: '', field: '', year: '' }])
  }

  const removeEducation = (id: string) => {
    if (education.length <= 1) return
    setEducation(education.filter((e) => e.id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const addProject = () => {
    setProjects([...projects, { id: generateId(), name: '', description: '', link: '' }])
  }

  const removeProject = (id: string) => {
    if (projects.length <= 1) return
    setProjects(projects.filter((p) => p.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGenerating(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="label">Construct Your Resume</p>
        <h1 className="font-display text-3xl font-semibold tracking-wider text-text-primary uppercase">
          Builder
        </h1>
      </div>

      {/* Template */}
      <GlassCard title="Template">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`
                pill-btn px-5 py-2 text-xs
                ${template === t
                  ? 'border-text-primary text-text-primary bg-accent'
                  : 'text-text-muted'
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Personal Info */}
      <GlassCard title="Personal Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MinimalInput label="Full Name" value={name} onChange={setName} placeholder="John Doe" required />
          <MinimalInput label="Email" value={email} onChange={setEmail} placeholder="john@example.com" type="email" required />
          <MinimalInput label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" type="tel" />
          <MinimalInput label="Location" value={location} onChange={setLocation} placeholder="San Francisco, CA" />
          <MinimalInput label="Website" value={website} onChange={setWebsite} placeholder="https://..." type="url" className="md:col-span-2" />
        </div>
      </GlassCard>

      {/* Summary */}
      <GlassCard title="Professional Summary">
        <MinimalInput
          value={summary}
          onChange={setSummary}
          multiline
          rows={4}
          placeholder="Brief overview of your experience and goals..."
        />
      </GlassCard>

      {/* Work Experience */}
      <GlassCard title="Work Experience">
        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="space-y-4 border-l border-border-subtle pl-5">
              <div className="flex items-center justify-between">
                <span className="label">{String(idx + 1).padStart(2, '0')}</span>
                {experiences.length > 1 && (
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-text-muted text-xs font-body hover:text-text-secondary transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MinimalInput label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} placeholder="Company name" />
                <MinimalInput label="Title" value={exp.title} onChange={(v) => updateExperience(exp.id, 'title', v)} placeholder="Job title" />
                <MinimalInput label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} placeholder="Jan 2023" />
                <MinimalInput label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, 'endDate', v)} placeholder="Present" />
              </div>
              <MinimalInput
                label="Description"
                value={exp.description}
                onChange={(v) => updateExperience(exp.id, 'description', v)}
                multiline
                rows={3}
                placeholder="Key responsibilities and achievements..."
              />
            </div>
          ))}
          <PillButton onClick={addExperience}>+ Add Experience</PillButton>
        </div>
      </GlassCard>

      {/* Education */}
      <GlassCard title="Education">
        <div className="space-y-8">
          {education.map((edu, idx) => (
            <div key={edu.id} className="space-y-4 border-l border-border-subtle pl-5">
              <div className="flex items-center justify-between">
                <span className="label">{String(idx + 1).padStart(2, '0')}</span>
                {education.length > 1 && (
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-text-muted text-xs font-body hover:text-text-secondary transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MinimalInput label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} placeholder="University name" />
                <MinimalInput label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} placeholder="B.S." />
                <MinimalInput label="Field" value={edu.field} onChange={(v) => updateEducation(edu.id, 'field', v)} placeholder="Computer Science" />
                <MinimalInput label="Year" value={edu.year} onChange={(v) => updateEducation(edu.id, 'year', v)} placeholder="2023" />
              </div>
            </div>
          ))}
          <PillButton onClick={addEducation}>+ Add Education</PillButton>
        </div>
      </GlassCard>

      {/* Projects */}
      <GlassCard title="Projects">
        <div className="space-y-8">
          {projects.map((proj, idx) => (
            <div key={proj.id} className="space-y-4 border-l border-border-subtle pl-5">
              <div className="flex items-center justify-between">
                <span className="label">{String(idx + 1).padStart(2, '0')}</span>
                {projects.length > 1 && (
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="text-text-muted text-xs font-body hover:text-text-secondary transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MinimalInput label="Name" value={proj.name} onChange={(v) => updateProject(proj.id, 'name', v)} placeholder="Project name" />
                <MinimalInput label="Link" value={proj.link} onChange={(v) => updateProject(proj.id, 'link', v)} placeholder="https://..." type="url" />
              </div>
              <MinimalInput
                label="Description"
                value={proj.description}
                onChange={(v) => updateProject(proj.id, 'description', v)}
                multiline
                rows={2}
                placeholder="What you built and the impact..."
              />
            </div>
          ))}
          <PillButton onClick={addProject}>+ Add Project</PillButton>
        </div>
      </GlassCard>

      {/* Skills */}
      <GlassCard title="Skills">
        <MinimalInput
          value={skills}
          onChange={setSkills}
          multiline
          rows={3}
          placeholder="TypeScript, React, Node.js, Python, AWS..."
        />
      </GlassCard>

      {/* Generate */}
      <PillButton onClick={handleGenerate} disabled={!name || !email || generating} variant="filled" fullWidth>
        {generating ? 'Generating...' : 'Generate Resume'}
      </PillButton>
    </div>
  )
}
