import { useEffect, useState } from 'react'
import { getAllJobs, analyzeSkillGap, getReportsByStudent } from '../utills/api'
import { getUser } from '../utills/auth'
import { useNavigate } from 'react-router-dom'

export default function Subject() {
  const user     = getUser()
  const navigate = useNavigate()
  const [jobs,    setJobs]    = useState([])
  const [reports, setReports] = useState([])
  const [form,    setForm]    = useState({ jobRoleId:'' })
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg,     setMsg]     = useState({ text:'', type:'' })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    load()
  }, [])

  const load = async () => {
    try { const j = await getAllJobs(); setJobs(j.data || []) } catch(e) { console.error(e) }
    try { const r = await getReportsByStudent(user.id); setReports(r.data || []) } catch(e) { console.error(e) }
  }

  const runAnalysis = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null); setMsg({ text:'', type:'' })
    try {
      const res = await analyzeSkillGap(user.id, form.jobRoleId)
      setResult(res.data)
      setMsg({ text:'✅ Analysis complete!', type:'success' })
      load()
    } catch(err) {
      const errData = err.response?.data
      const errMsg = typeof errData === 'string' ? errData : errData?.message || 'Make sure you have added skills to this student AND added required skills to the job role.'
      setMsg({ text:'❌ ' + errMsg, type:'error' })
    } finally { setLoading(false) }
  }

  const color = (pct) => pct >= 75 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)'

  return (
    <div className="page">
      <h1 className="page-title">🔍 My Skill Gap Analysis</h1>
      <p className="page-subtitle">See how well you match for each job role, {user?.fullName}</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'20px' }}>
        <div>
          <div className="card" style={{ marginBottom:'20px' }}>
            <div className="section-title" style={{ marginBottom:'16px' }}>Select a Job to Analyze</div>
            {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
            <form onSubmit={runAnalysis} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div className="form-group">
                <label>Select Job Role * ({jobs.length} available)</label>
                <select value={form.jobRoleId} onChange={e => setForm({ jobRoleId: e.target.value })} required>
                  <option value="">-- Select Job --</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} — {j.company?.name} (₹{j.salaryLpa} LPA)</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading || jobs.length === 0} style={{ justifyContent:'center' }}>
                {loading ? '⏳ Analyzing…' : '🔍 Check My Skill Gap'}
              </button>
            </form>
            {jobs.length === 0 && <p style={{ color:'var(--red)', fontSize:'0.82rem', marginTop:'12px' }}>⚠️ No jobs available. Ask admin to add job roles.</p>}
          </div>

          {result && (
            <div className="card">
              <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#fff', marginBottom:'12px' }}>
                📊 Your Match for: <span style={{ color:'var(--cyan)' }}>{result.jobRole?.title}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ color:'#64748b' }}>Skill Match</span>
                <span style={{ fontSize:'1.8rem', fontWeight:900, color:color(result.matchPercentage) }}>{result.matchPercentage}%</span>
              </div>
              <div className="match-bar-bg" style={{ marginBottom:'16px', height:'14px' }}>
                <div className="match-bar-fill" style={{ width:`${result.matchPercentage}%`, background:`linear-gradient(90deg, ${color(result.matchPercentage)}, #06b6d4)` }} />
              </div>
              <div style={{ background: result.matchPercentage >= 75 ? 'rgba(16,185,129,0.1)' : result.matchPercentage >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border:`1px solid ${color(result.matchPercentage)}44`, borderRadius:'10px', padding:'12px', marginBottom:'16px', textAlign:'center' }}>
                <div style={{ fontWeight:800, color:color(result.matchPercentage), fontSize:'1rem' }}>
                  {result.matchPercentage >= 75 ? '🎉 Strong Match! You are eligible.' : result.matchPercentage >= 50 ? '⚠️ Partial Match. Learn missing skills.' : '❌ Low Match. You need more skills.'}
                </div>
              </div>
              <div style={{ marginBottom:'12px' }}>
                <div style={{ fontSize:'0.78rem', color:'#64748b', marginBottom:'6px', fontWeight:600 }}>✅ SKILLS YOU HAVE</div>
                <div className="skill-chips">
                  {(result.matchedSkills || '').split(', ').filter(Boolean).map(s => <span key={s} className="chip chip-green">{s}</span>)}
                  {!result.matchedSkills && <span style={{ color:'var(--slate)', fontSize:'0.8rem' }}>None matched</span>}
                </div>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontSize:'0.78rem', color:'#64748b', marginBottom:'6px', fontWeight:600 }}>❌ SKILLS YOU NEED TO LEARN</div>
                <div className="skill-chips">
                  {(result.missingSkills || '').split(', ').filter(Boolean).map(s => <span key={s} className="chip chip-red">{s}</span>)}
                  {!result.missingSkills && <span style={{ color:'var(--green)', fontSize:'0.85rem', fontWeight:700 }}>🎉 You have all required skills!</span>}
                </div>
              </div>
              {result.recommendations?.length > 0 && (
                <div>
                  <div style={{ fontSize:'0.78rem', color:'#64748b', marginBottom:'8px', fontWeight:600 }}>📚 COURSES TO LEARN MISSING SKILLS</div>
                  {result.recommendations.map((r, i) => (
                    <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'12px', marginBottom:'8px', border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                        <span style={{ fontWeight:700, color:'#fff', fontSize:'0.92rem' }}>📌 {r.missingSkillName}</span>
                        <span className={`badge ${r.priority==='HIGH'?'badge-red':r.priority==='MEDIUM'?'badge-orange':'badge-slate'}`}>{r.priority} Priority</span>
                      </div>
                      <a href={r.courseUrl} target="_blank" rel="noreferrer" style={{ fontSize:'0.82rem', color:'#3b82f6', textDecoration:'underline' }}>🎓 {r.courseName}</a>
                      <div style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'3px' }}>{r.trainingType}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <span className="section-title">📋 My Analysis History ({reports.length})</span>
          </div>
          <div style={{ maxHeight:'75vh', overflowY:'auto' }}>
            {reports.length === 0
              ? <div style={{ padding:'32px', textAlign:'center' }}><div style={{ fontSize:'2rem', marginBottom:'8px' }}>🔍</div><p style={{ color:'#64748b' }}>No analysis done yet.</p><p style={{ color:'#64748b', fontSize:'0.82rem' }}>Select a job above and run your first analysis!</p></div>
              : reports.map(r => (
                <div key={r.id} style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#fff', fontSize:'0.95rem' }}>{r.jobRole?.title}</div>
                    <div style={{ fontSize:'0.8rem', color:'#64748b', marginBottom:'6px' }}>{r.jobRole?.company?.name}</div>
                    {r.matchedSkills && <div style={{ fontSize:'0.75rem', color:'var(--green)', marginBottom:'3px' }}>✅ Have: {r.matchedSkills}</div>}
                    {r.missingSkills && <div style={{ fontSize:'0.75rem', color:'var(--red)' }}>❌ Need: {r.missingSkills}</div>}
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'1.6rem', fontWeight:900, color:color(r.matchPercentage) }}>{r.matchPercentage}%</div>
                    <div className="match-bar-bg" style={{ width:'80px', marginTop:'4px' }}>
                      <div className="match-bar-fill" style={{ width:`${r.matchPercentage}%`, background:`linear-gradient(90deg, ${color(r.matchPercentage)}, #06b6d4)` }} />
                    </div>
                    <div style={{ fontSize:'0.7rem', color:'#64748b', marginTop:'4px' }}>
                      {r.matchPercentage >= 75 ? '🎉 Eligible' : r.matchPercentage >= 50 ? '⚠️ Partial' : '❌ Not Eligible'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
