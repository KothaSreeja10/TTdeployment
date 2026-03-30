import { useEffect, useState } from 'react'
import { getStudentSkills, getCertifications, getInternships, getReportsByStudent, getAllJobs } from '../utills/api'
import { getUser } from '../utills/auth'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { background:'#1e293b', border:'none', borderRadius:'8px', color:'#f1f5f9', fontSize:'12px' }

export default function GPA() {
  const user     = getUser()
  const navigate = useNavigate()
  const [skills,  setSkills]  = useState([])
  const [certs,   setCerts]   = useState([])
  const [ints,    setInts]    = useState([])
  const [reports, setReports] = useState([])
  const [jobs,    setJobs]    = useState([])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    load()
  }, [])

  const load = async () => {
    try { const s = await getStudentSkills(user.id);    setSkills(s.data || [])  } catch(e) {}
    try { const c = await getCertifications(user.id);   setCerts(c.data || [])   } catch(e) {}
    try { const i = await getInternships(user.id);      setInts(i.data || [])    } catch(e) {}
    try { const r = await getReportsByStudent(user.id); setReports(r.data || []) } catch(e) {}
    try { const j = await getAllJobs();                  setJobs(j.data || [])    } catch(e) {}
  }

  const score = user?.readinessScore || 0
  const matchData = reports.map(r => ({ name: r.jobRole?.title || 'Job', match: r.matchPercentage }))

  return (
    <div className="page">
      <h1 className="page-title">📈 My Analytics</h1>
      <p className="page-subtitle">Your personal placement readiness report, {user?.fullName}</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'16px', marginBottom:'24px' }}>
        {[
          { icon:'⭐', label:'Readiness Score', value:`${score}/100`, color:'var(--cyan)' },
          { icon:'🔧', label:'Skills',          value:skills.length,  color:'var(--blue2)' },
          { icon:'🏅', label:'Certifications',  value:certs.length,   color:'var(--green)' },
          { icon:'🏭', label:'Internships',     value:ints.length,    color:'var(--orange)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
            <span style={{ fontSize:'1.5rem' }}>{s.icon}</span>
            <span className="stat-value" style={{ color:s.color }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom:'16px' }}>📊 Score Breakdown</div>
          {[
            { label:'Skills',        score:Math.min(skills.length*4, 40),              max:40, color:'var(--blue2)' },
            { label:'Certifications',score:Math.min(certs.length*5, 20),               max:20, color:'var(--green)' },
            { label:'Projects',      score:Math.min((user?.projectCount||0)*5, 20),    max:20, color:'var(--orange)' },
            { label:'Internships',   score:Math.min(ints.length*5, 10),                max:10, color:'var(--cyan)' },
            { label:'Communication', score:user?.communicationRating||0,               max:10, color:'var(--red)' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontSize:'0.82rem', color:'#fff' }}>{item.label}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color:item.color }}>{item.score}/{item.max}</span>
              </div>
              <div className="match-bar-bg">
                <div style={{ height:'100%', borderRadius:'999px', width:`${(item.score/item.max)*100}%`, background:item.color, transition:'width 0.8s' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>💼 My Job Match History</div>
          {matchData.length === 0
            ? <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No analysis done yet. Go to Skill Gap page.</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={matchData}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} />
                  <YAxis domain={[0,100]} tick={{ fill:'#64748b', fontSize:10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="match" fill="#2563eb" radius={[4,4,0,0]} name="Match %" />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>🔧 My Skills</div>
          {skills.length === 0
            ? <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No skills added. Go to Students page.</p>
            : <div className="skill-chips">
                {skills.map(ss => (
                  <div key={ss.id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:'10px', padding:'8px 14px' }}>
                    <div style={{ fontWeight:700, color:'#fff', fontSize:'0.88rem' }}>{ss.skill?.name}</div>
                    <span className={`badge ${ss.proficiencyLevel==='ADVANCED'?'badge-green':ss.proficiencyLevel==='INTERMEDIATE'?'badge-blue':'badge-slate'}`} style={{ fontSize:'0.7rem', marginTop:'2px', display:'inline-block' }}>{ss.proficiencyLevel}</span>
                  </div>
                ))}
              </div>
          }
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom:'14px' }}>🎯 Jobs You Can Apply For</div>
          {jobs.filter(j => j.minCgpa <= (user?.cgpa || 0)).length === 0
            ? <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No eligible jobs based on your CGPA.</p>
            : jobs.filter(j => j.minCgpa <= (user?.cgpa || 0)).map(j => (
              <div key={j.id} style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'10px', padding:'12px', marginBottom:'10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'#fff' }}>{j.title}</div>
                    <div style={{ fontSize:'0.8rem', color:'#64748b' }}>{j.company?.name}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'var(--green)', fontWeight:700 }}>₹{j.salaryLpa} LPA</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--green)' }}>✅ CGPA Eligible</div>
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
