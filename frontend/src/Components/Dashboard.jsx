import { useEffect, useState } from 'react'
import { getStudentSkills, getCertifications, getInternships, getReadinessScore, getAllJobs } from '../utills/api'
import { getUser, saveUser } from '../utills/auth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const user     = getUser()
  const navigate = useNavigate()
  const [student, setStudent] = useState(user)
  const [skills,  setSkills]  = useState([])
  const [certs,   setCerts]   = useState([])
  const [ints,    setInts]    = useState([])
  const [jobs,    setJobs]    = useState([])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    load()
  }, [])

  const load = async () => {
    try { const s = await getReadinessScore(user.id); setStudent(s.data); saveUser(s.data) } catch(e) {}
    try { const sk = await getStudentSkills(user.id); setSkills(sk.data || []) } catch(e) {}
    try { const c = await getCertifications(user.id); setCerts(c.data || []) } catch(e) {}
    try { const i = await getInternships(user.id);    setInts(i.data || []) } catch(e) {}
    try { const j = await getAllJobs();                setJobs(j.data || []) } catch(e) {}
  }

  const score = student?.readinessScore || 0
  const level = student?.readinessLevel || 'BEGINNER'
  const levelColor = { HIGHLY_COMPETITIVE:'var(--green)', JOB_READY:'var(--blue2)', INTERMEDIATE:'var(--orange)', BEGINNER:'var(--red)' }
  const neededFor60 = Math.max(0, Math.ceil((60 - score) / 4))
  const neededFor80 = Math.max(0, Math.ceil((80 - score) / 4))

  return (
    <div className="page">
      <h1 className="page-title">👋 Welcome, {student?.fullName}!</h1>
      <p className="page-subtitle">{student?.branch} · CGPA: {student?.cgpa} · Passout: {student?.passoutYear}</p>

      <div className="card" style={{ marginBottom:'24px', background:'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'16px' }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Your Placement Readiness Score</div>
            <div style={{ fontSize:'3rem', fontWeight:900, color: levelColor[level], lineHeight:1 }}>{score}<span style={{ fontSize:'1.2rem', color:'#64748b' }}>/100</span></div>
            <div style={{ marginTop:'12px' }}>
              <div className="match-bar-bg" style={{ width:'300px', height:'12px' }}>
                <div className="match-bar-fill" style={{ width:`${score}%`, background:`linear-gradient(90deg, ${levelColor[level]}, #06b6d4)` }} />
              </div>
            </div>
            <div style={{ marginTop:'10px' }}>
              <span style={{ padding:'4px 14px', borderRadius:'999px', fontWeight:700, fontSize:'0.85rem', background:`${levelColor[level]}22`, color:levelColor[level], border:`1px solid ${levelColor[level]}55` }}>
                {level.replace('_',' ')}
              </span>
            </div>
          </div>
          <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:'12px', padding:'16px', minWidth:'220px' }}>
            <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#fff', marginBottom:'10px' }}>🎯 To Improve Your Score:</div>
            {neededFor60 > 0 && <div style={{ fontSize:'0.8rem', color:'var(--orange)', marginBottom:'6px' }}>→ Add {neededFor60} more skill{neededFor60>1?'s':''} to reach JOB READY</div>}
            {neededFor80 > 0 && score >= 60 && <div style={{ fontSize:'0.8rem', color:'var(--cyan)', marginBottom:'6px' }}>→ Add {neededFor80} more skill{neededFor80>1?'s':''} for HIGHLY COMPETITIVE</div>}
            {score >= 80 && <div style={{ fontSize:'0.8rem', color:'var(--green)' }}>🏆 You are highly competitive!</div>}
            <div style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'8px' }}>Each skill = +4 pts · Each cert = +5 pts</div>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom:'24px' }}>
        {[
          { icon:'🔧', label:'Skills Added',   value:skills.length, hint:'Need 10 for max' },
          { icon:'🏅', label:'Certifications', value:certs.length,  hint:'Each cert +5 pts' },
          { icon:'🏭', label:'Internships',    value:ints.length,   hint:'Each intern +5 pts' },
          { icon:'💼', label:'Jobs Available', value:jobs.length,   hint:'Apply now' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span style={{ fontSize:'1.5rem' }}>{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
            <span style={{ fontSize:'0.72rem', color:'#64748b' }}>{s.hint}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>🔧 My Skills</div>
          {skills.length === 0
            ? <div><p style={{ color:'#64748b', fontSize:'0.88rem', marginBottom:'12px' }}>No skills added yet.</p><button className="btn btn-primary btn-sm" onClick={() => navigate('/attendance')}>+ Add Skills</button></div>
            : <div className="skill-chips">{skills.map(ss => <span key={ss.id} className="chip chip-green">{ss.skill?.name} · {ss.proficiencyLevel}</span>)}</div>
          }
        </div>
        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>🏅 My Certifications</div>
          {certs.length === 0
            ? <div><p style={{ color:'#64748b', fontSize:'0.88rem', marginBottom:'12px' }}>No certifications yet.</p><button className="btn btn-primary btn-sm" onClick={() => navigate('/attendance')}>+ Add Certification</button></div>
            : certs.map(c => <div key={c.id} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'8px 12px', marginBottom:'8px', fontSize:'0.85rem' }}>🏅 <strong>{c.certName}</strong> — {c.issuedBy} ({c.issueYear})</div>)
          }
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom:'14px' }}>💼 Available Job Roles — Check Your Eligibility</div>
        {jobs.length === 0
          ? <p style={{ color:'#64748b' }}>No job roles available yet.</p>
          : (
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Job Title</th><th>Company</th><th>Salary</th><th>Min CGPA</th><th>CGPA Status</th><th>Action</th></tr></thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.company?.name}</td>
                      <td style={{ color:'var(--green)', fontWeight:700 }}>₹{j.salaryLpa} LPA</td>
                      <td>{j.minCgpa}</td>
                      <td>
                        <span className={`badge ${student?.cgpa >= j.minCgpa ? 'badge-green' : 'badge-red'}`}>
                          {student?.cgpa >= j.minCgpa ? '✅ Eligible' : '❌ Low CGPA'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/subject')}>
                          Check Skill Gap
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  )
}
