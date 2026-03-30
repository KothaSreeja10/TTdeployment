import { useEffect, useState } from 'react'
import { getAllStudents, deleteStudent, getAllSkills, addSkillToStudent, getStudentSkills, addCertification, getCertifications, addInternship, getInternships, getReadinessScore } from '../utills/api'

export default function Attendance() {
  const [students, setStudents] = useState([])
  const [skills,   setSkills]   = useState([])
  const [selected, setSelected] = useState(null)
  const [tab,      setTab]      = useState('skills')
  const [stuSkills,setStuSkills]= useState([])
  const [certs,    setCerts]    = useState([])
  const [ints,     setInts]     = useState([])
  const [msg,      setMsg]      = useState('')
  const [skillForm,setSkillForm]= useState({ skillId:'', proficiency:'INTERMEDIATE' })
  const [certForm, setCertForm] = useState({ certName:'', issuedBy:'', issueYear:'' })
  const [intForm,  setIntForm]  = useState({ companyName:'', role:'', duration:'' })

  useEffect(() => { load() }, [])

  const load = async () => {
    try { const [s, sk] = await Promise.all([getAllStudents(), getAllSkills()]); setStudents(s.data||[]); setSkills(sk.data||[]) } catch(e) {}
  }

  const selectStudent = async (s) => {
    setSelected(s); setTab('skills'); setMsg('')
    try {
      const [sk,c,i] = await Promise.all([getStudentSkills(s.id), getCertifications(s.id), getInternships(s.id)])
      setStuSkills(sk.data||[]); setCerts(c.data||[]); setInts(i.data||[])
    } catch(e) {}
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    await deleteStudent(id)
    setStudents(students.filter(s=>s.id!==id))
    if (selected?.id===id) setSelected(null)
  }

  const addSkill = async (e) => {
    e.preventDefault()
    try { await addSkillToStudent(selected.id, skillForm.skillId, skillForm.proficiency); const res = await getStudentSkills(selected.id); setStuSkills(res.data); setMsg('✅ Skill added!') }
    catch(err) { setMsg('❌ '+(err.response?.data||'Error')) }
  }

  const addCert = async (e) => {
    e.preventDefault()
    try { await addCertification(selected.id, certForm); const res = await getCertifications(selected.id); setCerts(res.data); setCertForm({certName:'',issuedBy:'',issueYear:''}); setMsg('✅ Certification added!') }
    catch(err) { setMsg('❌ '+(err.response?.data||'Error')) }
  }

  const addInt = async (e) => {
    e.preventDefault()
    try { await addInternship(selected.id, intForm); const res = await getInternships(selected.id); setInts(res.data); setIntForm({companyName:'',role:'',duration:''}); setMsg('✅ Internship added!') }
    catch(err) { setMsg('❌ '+(err.response?.data||'Error')) }
  }

  const badge = (level) => {
    const map = {HIGHLY_COMPETITIVE:'badge-green',JOB_READY:'badge-blue',INTERMEDIATE:'badge-orange',BEGINNER:'badge-red'}
    return <span className={`badge ${map[level]||'badge-slate'}`}>{level?.replace('_',' ')||'N/A'}</span>
  }

  return (
    <div className="page">
      <h1 className="page-title">👨‍🎓 Student Management</h1>
      <p className="page-subtitle">Admin view — all registered students</p>
      <div style={{display:'grid',gridTemplateColumns:selected?'1fr 1.2fr':'1fr',gap:'20px'}}>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span className="section-title">All Students ({students.length})</span>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              <span className="badge badge-green">Top: {students.filter(s=>s.readinessLevel==='HIGHLY_COMPETITIVE').length}</span>
              <span className="badge badge-blue">Ready: {students.filter(s=>s.readinessLevel==='JOB_READY').length}</span>
              <span className="badge badge-orange">Mid: {students.filter(s=>s.readinessLevel==='INTERMEDIATE').length}</span>
              <span className="badge badge-red">Begin: {students.filter(s=>s.readinessLevel==='BEGINNER').length}</span>
            </div>
          </div>
          <div style={{maxHeight:'70vh',overflowY:'auto'}}>
            {students.map(s=>(
              <div key={s.id} onClick={()=>selectStudent(s)} style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',cursor:'pointer',display:'flex',justifyContent:'space-between',background:selected?.id===s.id?'rgba(37,99,235,0.1)':'transparent',borderLeft:selected?.id===s.id?'3px solid var(--blue)':'3px solid transparent'}}>
                <div>
                  <div style={{fontWeight:600,color:'#fff'}}>{s.fullName}</div>
                  <div style={{fontSize:'0.8rem',color:'#64748b'}}>{s.email} · {s.branch}</div>
                  <div style={{marginTop:'6px',display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
                    {badge(s.readinessLevel)}
                    <span style={{fontSize:'0.72rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',background:['JOB_READY','HIGHLY_COMPETITIVE'].includes(s.readinessLevel)?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.15)',color:['JOB_READY','HIGHLY_COMPETITIVE'].includes(s.readinessLevel)?'var(--green)':'var(--red)',border:['JOB_READY','HIGHLY_COMPETITIVE'].includes(s.readinessLevel)?'1px solid rgba(16,185,129,0.4)':'1px solid rgba(239,68,68,0.3)'}}>
                      {['JOB_READY','HIGHLY_COMPETITIVE'].includes(s.readinessLevel)?'✅ Job Ready':'❌ Not Ready'}
                    </span>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
                  <span style={{color:'#06b6d4',fontWeight:700}}>CGPA: {s.cgpa}</span>
                  <span style={{fontSize:'0.78rem',color:'var(--slate)'}}>Score: {s.readinessScore||0}/100</span>
                  <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();handleDelete(s.id)}}>Delete</button>
                </div>
              </div>
            ))}
            {students.length===0 && <p style={{padding:'20px',color:'#64748b'}}>No students yet.</p>}
          </div>
        </div>

        {selected && (
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
              <div><h2 style={{color:'#fff',fontWeight:800}}>{selected.fullName}</h2><p style={{color:'#64748b',fontSize:'0.83rem'}}>{selected.email}</p></div>
              <button className="btn btn-outline btn-sm" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'10px',padding:'14px',marginBottom:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontSize:'0.83rem',color:'#64748b'}}>Readiness Score</span>
                <span style={{fontWeight:800,color:'#06b6d4'}}>{selected.readinessScore||0}/100</span>
              </div>
              <div className="match-bar-bg"><div className="match-bar-fill" style={{width:`${selected.readinessScore||0}%`}}/></div>
              <div style={{marginTop:'8px'}}>{badge(selected.readinessLevel)}</div>
            </div>
            {msg && <div className={`alert alert-${msg.startsWith('✅')?'success':'error'}`}>{msg}</div>}
            <div style={{display:'flex',gap:'6px',marginBottom:'16px',background:'rgba(255,255,255,0.04)',borderRadius:'10px',padding:'4px'}}>
              {['skills','certs','internships'].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'7px',borderRadius:'7px',fontSize:'0.8rem',fontWeight:600,color:tab===t?'#fff':'#64748b',background:tab===t?'var(--blue)':'transparent'}}>
                  {t==='skills'?'🔧 Skills':t==='certs'?'🏅 Certs':'🏭 Internships'}
                </button>
              ))}
            </div>
            {tab==='skills' && (
              <div>
                <div className="skill-chips" style={{marginBottom:'14px'}}>
                  {stuSkills.map(ss=><span key={ss.id} className="chip chip-green">{ss.skill?.name} · {ss.proficiencyLevel}</span>)}
                  {stuSkills.length===0 && <span style={{color:'#64748b',fontSize:'0.83rem'}}>No skills yet</span>}
                </div>
                <form onSubmit={addSkill} style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
                  <div className="form-group" style={{flex:1}}><label>Skill</label>
                    <select value={skillForm.skillId} onChange={e=>setSkillForm({...skillForm,skillId:e.target.value})} required>
                      <option value="">-- Select --</option>
                      {skills.map(sk=><option key={sk.id} value={sk.id}>{sk.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{flex:1}}><label>Proficiency</label>
                    <select value={skillForm.proficiency} onChange={e=>setSkillForm({...skillForm,proficiency:e.target.value})}>
                      <option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
              </div>
            )}
            {tab==='certs' && (
              <div>
                {certs.map(c=><div key={c.id} style={{background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'8px 12px',marginBottom:'8px',fontSize:'0.85rem'}}>🏅 <strong>{c.certName}</strong> — {c.issuedBy} ({c.issueYear})</div>)}
                {certs.length===0 && <p style={{color:'#64748b',fontSize:'0.83rem',marginBottom:'12px'}}>No certifications yet</p>}
                <form onSubmit={addCert} style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <input placeholder="Cert Name" value={certForm.certName} onChange={e=>setCertForm({...certForm,certName:e.target.value})} required style={{flex:'1 1 140px'}}/>
                  <input placeholder="Issued By" value={certForm.issuedBy} onChange={e=>setCertForm({...certForm,issuedBy:e.target.value})} style={{flex:'1 1 120px'}}/>
                  <input placeholder="Year" value={certForm.issueYear} onChange={e=>setCertForm({...certForm,issueYear:e.target.value})} style={{flex:'0 0 80px'}}/>
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
              </div>
            )}
            {tab==='internships' && (
              <div>
                {ints.map(i=><div key={i.id} style={{background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'8px 12px',marginBottom:'8px',fontSize:'0.85rem'}}>🏭 <strong>{i.role}</strong> at {i.companyName} · {i.duration}</div>)}
                {ints.length===0 && <p style={{color:'#64748b',fontSize:'0.83rem',marginBottom:'12px'}}>No internships yet</p>}
                <form onSubmit={addInt} style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <input placeholder="Company" value={intForm.companyName} onChange={e=>setIntForm({...intForm,companyName:e.target.value})} required style={{flex:'1 1 140px'}}/>
                  <input placeholder="Role" value={intForm.role} onChange={e=>setIntForm({...intForm,role:e.target.value})} style={{flex:'1 1 100px'}}/>
                  <input placeholder="Duration" value={intForm.duration} onChange={e=>setIntForm({...intForm,duration:e.target.value})} style={{flex:'0 0 90px'}}/>
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
