import { useEffect, useState } from 'react'
import { getStudentSkills, getCertifications, getInternships, getReportsByStudent, getAllJobs, getReadinessScore } from '../utills/api'
import { getUser, saveUser } from '../utills/auth'

export default function Analytics() {
  const user = getUser()
  const [student,  setStudent]  = useState(user)
  const [skills,   setSkills]   = useState([])
  const [certs,    setCerts]    = useState([])
  const [ints,     setInts]     = useState([])
  const [reports,  setReports]  = useState([])
  const [jobs,     setJobs]     = useState([])

  useEffect(() => {
    if (!user?.id) return
    loadAll(user.id)
  }, [])

  const loadAll = async (id) => {
    const [scoreRes, skillsRes, certsRes, intsRes, reportsRes, jobsRes] = await Promise.allSettled([
      getReadinessScore(id),
      getStudentSkills(id),
      getCertifications(id),
      getInternships(id),
      getReportsByStudent(id),
      getAllJobs(),
    ])
    if (scoreRes.status   === 'fulfilled') { setStudent(scoreRes.value.data); saveUser(scoreRes.value.data) }
    if (skillsRes.status  === 'fulfilled') setSkills(skillsRes.value.data   || [])
    if (certsRes.status   === 'fulfilled') setCerts(certsRes.value.data     || [])
    if (intsRes.status    === 'fulfilled') setInts(intsRes.value.data       || [])
    if (reportsRes.status === 'fulfilled') setReports(reportsRes.value.data || [])
    if (jobsRes.status    === 'fulfilled') setJobs(jobsRes.value.data       || [])
  }

  const score       = student?.readinessScore || 0
  const matchData   = reports.map(r => ({ name: r.jobRole?.title || 'Job', match: r.matchPercentage || 0 }))
  const levelColor  = { HIGHLY_COMPETITIVE:'#10b981', JOB_READY:'#3b82f6', INTERMEDIATE:'#f59e0b', BEGINNER:'#ef4444' }
  const color       = (pct) => pct >= 75 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)'
  const eligibleJobs = jobs.filter(j => (j.minCgpa || 0) <= (student?.cgpa || 0))

  if (!user) {
    return (
      <div className="page">
        <div style={{ textAlign:'center', padding:'60px', color:'#64748b' }}>
          <div style={{ fontSize:'3rem', marginBottom:'12px' }}>🔒</div>
          <p>Please login to view your analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">📈 My Placement Analytics</h1>
      <p className="page-subtitle">
        {student?.fullName} · {student?.branch} · CGPA: {student?.cgpa} · Passout: {student?.passoutYear}
      </p>

      {/* Score summary cards */}
      <div className="stat-grid" style={{ marginBottom:'24px' }}>
        {[
          { icon:'⭐', label:'Readiness Score', value:`${score}/100`, color: levelColor[student?.readinessLevel] || '#94a3b8' },
          { icon:'🔧', label:'Skills',          value:skills.length,  color:'#3b82f6' },
          { icon:'🏅', label:'Certifications',  value:certs.length,   color:'#10b981' },
          { icon:'🏭', label:'Internships',     value:ints.length,    color:'#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
            <span style={{ fontSize:'1.5rem' }}>{s.icon}</span>
            <span className="stat-value" style={{ color:s.color }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>

        {/* Score breakdown */}
        <div className="card">
          <div className="section-title" style={{ marginBottom:'16px' }}>📊 Score Breakdown</div>
          {[
            { label:'Skills (max 40)',        score: Math.min(skills.length * 4, 40),                         max:40, color:'#3b82f6' },
            { label:'Certifications (max 20)', score: Math.min(certs.length * 5, 20),                         max:20, color:'#10b981' },
            { label:'Internships (max 10)',   score: Math.min(ints.length * 5, 10),                           max:10, color:'#06b6d4' },
            { label:'CGPA Bonus (max 30)',    score: Math.min(Math.round((student?.cgpa || 0) * 3), 30),      max:30, color:'#f59e0b' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontSize:'0.82rem', color:'#fff' }}>{item.label}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color:item.color }}>{item.score}/{item.max}</span>
              </div>
              <div className="match-bar-bg">
                <div style={{ height:'100%', borderRadius:'999px', width:`${(item.score / item.max) * 100}%`, background:item.color, transition:'width 0.8s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Job match history */}
        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>💼 Job Match History</div>
          {reports.length === 0
            ? <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No analysis done yet. Go to <strong style={{ color:'#3b82f6' }}>My Skill Gap</strong> page to check jobs.</p>
            : <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {matchData.map((m, i) => (
                  <div key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                      <span style={{ fontSize:'0.82rem', color:'#fff' }}>{m.name}</span>
                      <span style={{ fontSize:'0.82rem', fontWeight:700, color:color(m.match) }}>{Math.round(m.match)}%</span>
                    </div>
                    <div className="match-bar-bg">
                      <div className="match-bar-fill" style={{ width:`${m.match}%`, background:color(m.match) }} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Skills */}
        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>🔧 My Skills</div>
          {skills.length === 0
            ? <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No skills added yet.</p>
            : <div className="skill-chips">
                {skills.map(ss => (
                  <div key={ss.id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:'10px', padding:'8px 14px' }}>
                    <div style={{ fontWeight:700, color:'#fff', fontSize:'0.88rem' }}>{ss.skill?.name}</div>
                    <span className={`badge ${ss.proficiencyLevel === 'ADVANCED' ? 'badge-green' : ss.proficiencyLevel === 'INTERMEDIATE' ? 'badge-blue' : 'badge-slate'}`}
                      style={{ fontSize:'0.7rem', marginTop:'2px', display:'inline-block' }}>
                      {ss.proficiencyLevel}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* CGPA Eligible Jobs */}
        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>🎯 CGPA-Eligible Jobs</div>
          {eligibleJobs.length === 0
            ? <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No jobs eligible based on your current CGPA.</p>
            : eligibleJobs.map(j => (
                <div key={j.id} style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'10px', padding:'12px', marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontWeight:700, color:'#fff' }}>{j.title}</div>
                      <div style={{ fontSize:'0.8rem', color:'#64748b' }}>{j.company?.name}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color:'var(--green)', fontWeight:700 }}>₹{j.salaryLpa} LPA</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--green)' }}>✅ CGPA OK</div>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>

      </div>
    </div>
  )
}
