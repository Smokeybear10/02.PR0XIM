'use client'

import { useState } from 'react'
import ExamButton from '@/components/booklet/ExamButton'
import ExamInput from '@/components/booklet/ExamInput'

type WorkExperience = { id: string; company: string; title: string; startDate: string; endDate: string; description: string }
type Education = { id: string; school: string; degree: string; field: string; year: string }
type Project = { id: string; name: string; description: string; link: string }

const TEMPLATES = ['Modern', 'Classic', 'Minimal', 'Technical', 'Executive']
function gid() { return Math.random().toString(36).slice(2, 9) }

export default function BuilderPage() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [phone, setPhone] = useState('')
  const [location, setLocation] = useState(''); const [website, setWebsite] = useState('')
  const [summary, setSummary] = useState(''); const [skills, setSkills] = useState('')
  const [template, setTemplate] = useState('Modern'); const [generating, setGenerating] = useState(false)
  const [experiences, setExperiences] = useState<WorkExperience[]>([{ id: gid(), company: '', title: '', startDate: '', endDate: '', description: '' }])
  const [education, setEducation] = useState<Education[]>([{ id: gid(), school: '', degree: '', field: '', year: '' }])
  const [projects, setProjects] = useState<Project[]>([{ id: gid(), name: '', description: '', link: '' }])

  const addExp = () => setExperiences([...experiences, { id: gid(), company: '', title: '', startDate: '', endDate: '', description: '' }])
  const rmExp = (id: string) => { if (experiences.length > 1) setExperiences(experiences.filter((e) => e.id !== id)) }
  const upExp = (id: string, f: keyof WorkExperience, v: string) => setExperiences(experiences.map((e) => e.id === id ? { ...e, [f]: v } : e))
  const addEdu = () => setEducation([...education, { id: gid(), school: '', degree: '', field: '', year: '' }])
  const rmEdu = (id: string) => { if (education.length > 1) setEducation(education.filter((e) => e.id !== id)) }
  const upEdu = (id: string, f: keyof Education, v: string) => setEducation(education.map((e) => e.id === id ? { ...e, [f]: v } : e))
  const addProj = () => setProjects([...projects, { id: gid(), name: '', description: '', link: '' }])
  const rmProj = (id: string) => { if (projects.length > 1) setProjects(projects.filter((p) => p.id !== id)) }
  const upProj = (id: string, f: keyof Project, v: string) => setProjects(projects.map((p) => p.id === id ? { ...p, [f]: v } : p))

  const handleGenerate = async () => { setGenerating(true); await new Promise((r) => setTimeout(r, 2000)); setGenerating(false) }

  const SectionHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <div className="exam-form-header">
      <span className="exam-form-header-label">{title}</span>
      {action}
    </div>
  )

  return (
    <div className="tool-wrapper">
      <div className="tool-paper">
        <div className="tool-binding" aria-hidden />

        <div className="tool-running-head">
          <span>DR4FT · Composition</span>
          <span>Section B · Draft</span>
        </div>

        <div className="tool-header">
          <div className="tool-header-kicker">Examination Booklet</div>
          <h1 className="tool-header-title">Resume builder.</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="exam-form-section">
            <SectionHeader title="Template" />
            <div className="exam-form-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TEMPLATES.map((t) => (
                <button key={t} onClick={() => setTemplate(t)} className={template === t ? 'btn-exam' : 'btn-exam-outline'} style={{ padding: '8px 16px', fontSize: 11 }}>{t}</button>
              ))}
            </div>
          </div>

          <div className="exam-form-section">
            <SectionHeader title="Personal Info" />
            <div className="exam-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <ExamInput label="Full Name" value={name} onChange={setName} placeholder="John Doe" required />
                <ExamInput label="Email" value={email} onChange={setEmail} placeholder="john@example.com" type="email" required />
                <ExamInput label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" type="tel" />
                <ExamInput label="Location" value={location} onChange={setLocation} placeholder="San Francisco, CA" />
                <ExamInput label="Website" value={website} onChange={setWebsite} placeholder="https://..." type="url" className="col-span-2" />
              </div>
            </div>
          </div>

          <div className="exam-form-section">
            <SectionHeader title="Professional Summary" />
            <div className="exam-form-body">
              <ExamInput value={summary} onChange={setSummary} multiline rows={4} placeholder="Brief overview..." />
            </div>
          </div>

          <div className="exam-form-section">
            <SectionHeader title="Work Experience" action={<button onClick={addExp} className="btn-exam-outline" style={{ padding: '6px 14px', fontSize: 10 }}>+ Add</button>} />
            <div className="exam-form-body" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {experiences.map((exp, i) => (
                <div key={exp.id} className="exam-form-entry">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>{String(i + 1).padStart(2, '0')}</span>
                    {experiences.length > 1 && <button onClick={() => rmExp(exp.id)} style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ibm-plex-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Remove</button>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <ExamInput label="Company" value={exp.company} onChange={(v) => upExp(exp.id, 'company', v)} placeholder="Company" />
                    <ExamInput label="Title" value={exp.title} onChange={(v) => upExp(exp.id, 'title', v)} placeholder="Job title" />
                    <ExamInput label="Start" value={exp.startDate} onChange={(v) => upExp(exp.id, 'startDate', v)} placeholder="Jan 2023" />
                    <ExamInput label="End" value={exp.endDate} onChange={(v) => upExp(exp.id, 'endDate', v)} placeholder="Present" />
                  </div>
                  <div style={{ marginTop: 16 }}><ExamInput label="Description" value={exp.description} onChange={(v) => upExp(exp.id, 'description', v)} multiline rows={3} placeholder="Key achievements..." /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="exam-form-section">
            <SectionHeader title="Education" action={<button onClick={addEdu} className="btn-exam-outline" style={{ padding: '6px 14px', fontSize: 10 }}>+ Add</button>} />
            <div className="exam-form-body" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {education.map((edu, i) => (
                <div key={edu.id} className="exam-form-entry">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>{String(i + 1).padStart(2, '0')}</span>
                    {education.length > 1 && <button onClick={() => rmEdu(edu.id)} style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ibm-plex-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Remove</button>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <ExamInput label="School" value={edu.school} onChange={(v) => upEdu(edu.id, 'school', v)} placeholder="University" />
                    <ExamInput label="Degree" value={edu.degree} onChange={(v) => upEdu(edu.id, 'degree', v)} placeholder="B.S." />
                    <ExamInput label="Field" value={edu.field} onChange={(v) => upEdu(edu.id, 'field', v)} placeholder="Computer Science" />
                    <ExamInput label="Year" value={edu.year} onChange={(v) => upEdu(edu.id, 'year', v)} placeholder="2023" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="exam-form-section">
            <SectionHeader title="Projects" action={<button onClick={addProj} className="btn-exam-outline" style={{ padding: '6px 14px', fontSize: 10 }}>+ Add</button>} />
            <div className="exam-form-body" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {projects.map((p, i) => (
                <div key={p.id} className="exam-form-entry">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'rgba(0,0,0,0.25)' }}>{String(i + 1).padStart(2, '0')}</span>
                    {projects.length > 1 && <button onClick={() => rmProj(p.id)} style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ibm-plex-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Remove</button>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <ExamInput label="Name" value={p.name} onChange={(v) => upProj(p.id, 'name', v)} placeholder="Project" />
                    <ExamInput label="Link" value={p.link} onChange={(v) => upProj(p.id, 'link', v)} placeholder="https://..." type="url" />
                  </div>
                  <div style={{ marginTop: 16 }}><ExamInput label="Description" value={p.description} onChange={(v) => upProj(p.id, 'description', v)} multiline rows={2} placeholder="What you built..." /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="exam-form-section">
            <SectionHeader title="Skills" />
            <div className="exam-form-body">
              <ExamInput value={skills} onChange={setSkills} multiline rows={3} placeholder="TypeScript, React, Python, AWS..." />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <ExamButton onClick={handleGenerate} disabled={!name || !email || generating} variant="filled" fullWidth>
            {generating ? 'Generating...' : 'Generate Resume'}
          </ExamButton>
        </div>
      </div>
    </div>
  )
}
