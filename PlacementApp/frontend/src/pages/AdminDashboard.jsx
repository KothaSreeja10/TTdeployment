import { useEffect, useState } from 'react'
import {
  getAllCompanies, addCompany,
  getAllJobs, addJobRole,
  getAllSkills, addSkill, addSkillToJob,
  getAllStudents, deleteStudent,
  addSkillToStudent, getStudentSkills,
  addCertification, getCertifications,
  addInternship, getInternships,
} from '../utills/api'
import { getAdmin, removeAdmin } from '../utills/auth'
import { useNavigate } from 'react-router-dom'

/* ── tiny helpers ─────────────────────────────────────────── */
const Pill = ({ children, color = '#7c3aed' }) => (
  <span style={{ display:'inline-block',padding:'3px 10px',borderRadius:'999px',fontSize:'0.72rem',fontWeight:700,background:`${color}22`,color,border:`1px solid ${color}44` }}>{children}</span>
)

const StatCard = ({ icon, label, value, accent }) => (
  <div style={{ background:'rgba(30,20,50,0.7)',border:`1px solid ${accent}33`,borderTop:`3px solid ${accent}`,borderRadius:'14px',padding:'20px',display:'flex',flexDirection:'column',gap:'6px' }}>
    <span style={{ fontSize:'1.6rem' }}>{icon}</span>
    <span style={{ fontSize:'2rem',fontWeight:900,color:accent,fontFamily:"'Syne',sans-serif" }}>{value}</span>
    <span style={{ fontSize:'0.75rem',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em' }}>{label}</span>
  </div>
)

const SectionHeader = ({ title, children }) => (
  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'10px' }}>
    <h2 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,color:'#fff',fontSize:'1.3rem' }}>{title}</h2>
    <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>{children}</div>
  </div>
)

const AdminBtn = ({ onClick, children, variant = 'primary', disabled }) => {
  const styles = {
    primary: { background:'linear-gradient(135deg,#7c3aed,#a855f7)',color:'#fff',boxShadow:'0 4px 14px rgba(124,58,237,0.35)' },
    success: { background:'linear-gradient(135deg,#059669,#10b981)',color:'#fff',boxShadow:'0 4px 14px rgba(16,185,129,0.25)' },
    outline: { background:'transparent',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.12)' },
    danger:  { background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.25)' },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...styles[variant],padding:'9px 18px',borderRadius:'9px',fontWeight:700,fontSize:'0.83rem',border:'none',cursor:disabled?'not-allowed':'pointer',transition:'all 0.18s',opacity:disabled?0.5:1,fontFamily:'inherit' }}>{children}</button>
  )
}

const FInput = ({ label, ...props }) => (
  <div style={{ display:'flex',flexDirection:'column',gap:'5px' }}>
    {label && <label style={{ fontSize:'0.78rem',color:'#a78bfa',fontWeight:600,letterSpacing:'0.04em' }}>{label}</label>}
    <input {...props} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',width:'100%',outline:'none',fontFamily:'inherit',fontSize:'0.88rem',...props.style }} />
  </div>
)

const FSelect = ({ label, children, ...props }) => (
  <div style={{ display:'flex',flexDirection:'column',gap:'5px' }}>
    {label && <label style={{ fontSize:'0.78rem',color:'#a78bfa',fontWeight:600,letterSpacing:'0.04em' }}>{label}</label>}
    <select {...props} style={{ background:'rgba(20,12,40,0.9)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',width:'100%',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }}>{children}</select>
  </div>
)

const FAlert = ({ type, children }) => (
  <div style={{ padding:'11px 16px',borderRadius:'8px',fontSize:'0.85rem',marginBottom:'16px',background:type==='success'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',border:`1px solid ${type==='success'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,color:type==='success'?'#34d399':'#f87171' }}>{children}</div>
)

const FModal = ({ title, onClose, children }) => (
  <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }} onClick={onClose}>
    <div style={{ background:'#1a0e2e',border:'1px solid rgba(139,92,246,0.25)',borderRadius:'20px',padding:'32px',width:'90%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px' }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,color:'#fff',fontSize:'1.2rem' }}>{title}</h3>
        <button type="button" onClick={onClose} style={{ background:'rgba(255,255,255,0.06)',border:'none',color:'#94a3b8',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
      </div>
      {children}
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const admin    = getAdmin()
  const navigate = useNavigate()
  const [tab,        setTab]        = useState('overview')
  const [companies,  setCompanies]  = useState([])
  const [jobs,       setJobs]       = useState([])
  const [skills,     setSkills]     = useState([])
  const [students,   setStudents]   = useState([])
  const [modal,      setModal]      = useState(null)
  const [selStudent, setSelStudent] = useState(null)
  const [stuSkills,  setStuSkills]  = useState([])
  const [stuCerts,   setStuCerts]   = useState([])
  const [stuInts,    setStuInts]    = useState([])
  const [stuTab,     setStuTab]     = useState('skills')
  const [msg,        setMsg]        = useState({ text:'',type:'' })
  const [loading,    setLoading]    = useState(false)

  const [coForm, setCoForm] = useState({ name:'',industry:'',website:'',location:'',hrEmail:'' })
  const [jbForm, setJbForm] = useState({ companyId:'',title:'',salaryLpa:'',minCgpa:'',minPassoutYear:'',description:'' })
  const [jsForm, setJsForm] = useState({ jobId:'',skillId:'',weightage:'' })
  const [skForm, setSkForm] = useState({ name:'',category:'' })
  const [skillForm, setSkillForm] = useState({ skillId:'',proficiency:'INTERMEDIATE' })
  const [certForm,  setCertForm]  = useState({ certName:'',issuedBy:'',issueYear:'' })
  const [intForm,   setIntForm]   = useState({ companyName:'',role:'',duration:'' })

  useEffect(() => {
    if (!admin) { navigate('/admin'); return }
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [c,j,s,st] = await Promise.all([getAllCompanies(),getAllJobs(),getAllSkills(),getAllStudents()])
      setCompanies(c.data||[]); setJobs(j.data||[]); setSkills(s.data||[]); setStudents(st.data||[])
    } catch(e) { console.error(e) }
  }

  const flash = (text,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3500) }
  const closeModal = () => { setModal(null); setMsg({text:'',type:''}) }

  /* ── CRUD ── */
  const submitCompany = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await addCompany(coForm); flash('✅ Company added!'); closeModal(); setCoForm({name:'',industry:'',website:'',location:'',hrEmail:''}); loadAll() }
    catch(err) { flash('❌ '+(err.response?.data?.message||'Failed'),'error') }
    setLoading(false)
  }

  const submitJob = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await addJobRole(jbForm.companyId, jbForm)
      flash('✅ Job role added!'); closeModal(); setJbForm({companyId:'',title:'',salaryLpa:'',minCgpa:'',minPassoutYear:'',description:''}); loadAll()
    } catch(err) { flash('❌ '+(err.response?.data?.message||'Failed'),'error') }
    setLoading(false)
  }

  const submitJobSkill = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await addSkillToJob(jsForm.jobId,jsForm.skillId,parseFloat(jsForm.weightage)); flash('✅ Skill added to job!'); closeModal(); setJsForm({jobId:'',skillId:'',weightage:''}); loadAll() }
    catch(err) { flash('❌ '+(err.response?.data?.message||'Failed'),'error') }
    setLoading(false)
  }

  const submitSkill = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await addSkill(skForm); flash(`✅ Skill "${skForm.name}" added!`); setSkForm({name:'',category:''}); loadAll(); if(modal==='addSkill') closeModal() }
    catch(err) { flash('❌ '+(err.response?.data||'Skill may already exist'),'error') }
    setLoading(false)
  }

  const quickAddSkill = async (name) => {
    try { await addSkill({name,category:'Programming'}); loadAll(); flash(`✅ "${name}" added!`) }
    catch { flash(`ℹ️ "${name}" already exists`,'error') }
  }

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return
    await deleteStudent(id); loadAll()
    if (selStudent?.id===id) { setSelStudent(null); setModal(null) }
    flash('✅ Student deleted')
  }

  const openStudent = async (s) => {
    setSelStudent(s); setStuTab('skills'); setModal('viewStudent')
    try {
      const [sk,c,i] = await Promise.all([getStudentSkills(s.id),getCertifications(s.id),getInternships(s.id)])
      setStuSkills(sk.data||[]); setStuCerts(c.data||[]); setStuInts(i.data||[])
    } catch(e) {}
  }

  const addStudentSkill = async (e) => {
    e.preventDefault()
    try { await addSkillToStudent(selStudent.id,skillForm.skillId,skillForm.proficiency); const res=await getStudentSkills(selStudent.id); setStuSkills(res.data); flash('✅ Skill added!') }
    catch(err) { flash('❌ '+(err.response?.data||'Error'),'error') }
  }
  const addStudentCert = async (e) => {
    e.preventDefault()
    try { await addCertification(selStudent.id,certForm); const res=await getCertifications(selStudent.id); setStuCerts(res.data); setCertForm({certName:'',issuedBy:'',issueYear:''}); flash('✅ Certification added!') }
    catch(err) { flash('❌ '+(err.response?.data||'Error'),'error') }
  }
  const addStudentInt = async (e) => {
    e.preventDefault()
    try { await addInternship(selStudent.id,intForm); const res=await getInternships(selStudent.id); setStuInts(res.data); setIntForm({companyName:'',role:'',duration:''}); flash('✅ Internship added!') }
    catch(err) { flash('❌ '+(err.response?.data||'Error'),'error') }
  }

  /* ── derived stats (uses HIGH/MEDIUM/LOW from backend) ── */
  const readyCount = students.filter(s=>['HIGH','MEDIUM'].includes(s.readinessLevel)).length
  const topCount   = students.filter(s=>s.readinessLevel==='HIGH').length
  const avgScore   = students.length ? Math.round(students.reduce((a,s)=>a+(s.readinessScore||0),0)/students.length) : 0
  const levelColor = { HIGH:'#10b981', MEDIUM:'#f59e0b', LOW:'#ef4444' }

  const NAV_TABS = [
    {id:'overview',label:'📊 Overview'},{id:'companies',label:'🏢 Companies'},
    {id:'jobs',label:'💼 Job Roles'},{id:'skills',label:'🔧 Skills'},{id:'students',label:'👨‍🎓 Students'},
  ]

  return (
    <div style={{ minHeight:'100vh',background:'radial-gradient(ellipse at 20% 0%, #1a0533 0%, #0f172a 55%)',color:'#f1f5f9' }}>
      {/* Navbar */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:999,height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',background:'rgba(15,10,30,0.92)',borderBottom:'1px solid rgba(139,92,246,0.15)',backdropFilter:'blur(20px)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <span style={{ fontSize:'1.4rem' }}>🛡️</span>
          <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.1rem',color:'#fff' }}>PlacementPro <span style={{ color:'#a78bfa',fontSize:'0.75rem',fontWeight:600 }}>ADMIN</span></span>
        </div>
        <div style={{ display:'flex',gap:'4px' }}>
          {NAV_TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'6px 14px',borderRadius:'8px',fontSize:'0.82rem',fontWeight:600,border:'none',cursor:'pointer',color:tab===t.id?'#a78bfa':'#64748b',background:tab===t.id?'rgba(124,58,237,0.18)':'transparent',transition:'all 0.2s' }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
          <button onClick={()=>navigate('/')} style={{ padding:'7px 14px',borderRadius:'8px',fontSize:'0.8rem',fontWeight:600,background:'rgba(59,130,246,0.12)',color:'#60a5fa',border:'1px solid rgba(59,130,246,0.2)',cursor:'pointer' }}>← App</button>
          <button onClick={()=>{removeAdmin();navigate('/admin')}} style={{ padding:'7px 14px',borderRadius:'8px',fontSize:'0.8rem',fontWeight:600,background:'rgba(239,68,68,0.12)',color:'#f87171',border:'1px solid rgba(239,68,68,0.2)',cursor:'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ paddingTop:'80px',padding:'80px 32px 40px',maxWidth:'1280px',margin:'0 auto' }}>
        {msg.text && <FAlert type={msg.type}>{msg.text}</FAlert>}

        {/* OVERVIEW */}
        {tab==='overview' && (
          <>
            <div style={{ marginBottom:'28px' }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:'2rem',fontWeight:800,color:'#fff' }}>Good day, Admin 👋</h1>
              <p style={{ color:'#94a3b8',marginTop:'4px' }}>Here's a snapshot of your placement system</p>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:'16px',marginBottom:'32px' }}>
              <StatCard icon="👨‍🎓" label="Total Students" value={students.length} accent="#3b82f6" />
              <StatCard icon="✅" label="Job Ready" value={readyCount} accent="#10b981" />
              <StatCard icon="🏆" label="Top Performers" value={topCount} accent="#a78bfa" />
              <StatCard icon="⭐" label="Avg Score" value={`${avgScore}/100`} accent="#f59e0b" />
              <StatCard icon="🏢" label="Companies" value={companies.length} accent="#06b6d4" />
              <StatCard icon="💼" label="Job Roles" value={jobs.length} accent="#ec4899" />
              <StatCard icon="🔧" label="Skills" value={skills.length} accent="#84cc16" />
            </div>
            <div style={{ background:'rgba(124,58,237,0.07)',border:'1px solid rgba(139,92,246,0.18)',borderRadius:'18px',padding:'28px',marginBottom:'28px' }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'18px' }}>⚡ Quick Actions</h3>
              <div style={{ display:'flex',gap:'12px',flexWrap:'wrap' }}>
                <AdminBtn onClick={()=>{setTab('companies');setModal('addCompany')}}>+ Add Company</AdminBtn>
                <AdminBtn onClick={()=>{setTab('jobs');setModal('addJob')}} variant="success">+ Add Job Role</AdminBtn>
                <AdminBtn onClick={()=>{setTab('jobs');setModal('addJobSkill')}} variant="outline">+ Skill to Job</AdminBtn>
                <AdminBtn onClick={()=>{setTab('skills');setModal('addSkill')}} variant="outline">+ Add Skill</AdminBtn>
              </div>
            </div>
            <div style={{ background:'rgba(30,20,50,0.7)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'18px',overflow:'hidden' }}>
              <div style={{ padding:'18px 24px',borderBottom:'1px solid rgba(139,92,246,0.12)' }}>
                <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff' }}>👨‍🎓 Recent Students</span>
              </div>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'rgba(124,58,237,0.08)' }}>
                  {['Name','Branch','CGPA','Score','Status'].map(h=><th key={h} style={{ padding:'11px 16px',textAlign:'left',fontSize:'0.75rem',color:'#a78bfa',textTransform:'uppercase',letterSpacing:'0.07em' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {students.slice(0,6).map(s=>(
                    <tr key={s.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding:'11px 16px',fontWeight:600,color:'#fff' }}>{s.name}</td>
                      <td style={{ padding:'11px 16px',color:'#94a3b8',fontSize:'0.85rem' }}>{s.branch}</td>
                      <td style={{ padding:'11px 16px',color:'#06b6d4',fontWeight:700 }}>{s.cgpa}</td>
                      <td style={{ padding:'11px 16px',fontWeight:700,color:levelColor[s.readinessLevel]||'#94a3b8' }}>{s.readinessScore||0}/100</td>
                      <td style={{ padding:'11px 16px' }}><Pill color={levelColor[s.readinessLevel]||'#64748b'}>{s.readinessLevel||'N/A'}</Pill></td>
                    </tr>
                  ))}
                  {students.length===0&&<tr><td colSpan={5} style={{ textAlign:'center',color:'#64748b',padding:'28px' }}>No students registered yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* COMPANIES */}
        {tab==='companies' && (
          <>
            <SectionHeader title="🏢 Companies"><AdminBtn onClick={()=>setModal('addCompany')}>+ Add Company</AdminBtn></SectionHeader>
            <div style={{ background:'rgba(30,20,50,0.7)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'16px',overflow:'hidden' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'rgba(124,58,237,0.1)' }}>
                  {['Company','Industry','Location','HR Email','Website'].map(h=><th key={h} style={{ padding:'12px 16px',textAlign:'left',fontSize:'0.75rem',color:'#a78bfa',textTransform:'uppercase',letterSpacing:'0.07em' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {companies.map(c=>(
                    <tr key={c.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding:'13px 16px',fontWeight:700,color:'#fff' }}>{c.name}</td>
                      <td style={{ padding:'13px 16px' }}><Pill color="#06b6d4">{c.industry||'—'}</Pill></td>
                      <td style={{ padding:'13px 16px',color:'#94a3b8',fontSize:'0.85rem' }}>{c.location||'—'}</td>
                      <td style={{ padding:'13px 16px',color:'#94a3b8',fontSize:'0.85rem' }}>{c.hrEmail||'—'}</td>
                      <td style={{ padding:'13px 16px',fontSize:'0.82rem' }}>{c.website?<a href={c.website} target="_blank" rel="noreferrer" style={{ color:'#a78bfa' }}>🔗 Link</a>:'—'}</td>
                    </tr>
                  ))}
                  {companies.length===0&&<tr><td colSpan={5} style={{ textAlign:'center',color:'#64748b',padding:'32px' }}>No companies yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* JOBS */}
        {tab==='jobs' && (
          <>
            <SectionHeader title="💼 Job Roles">
              <AdminBtn onClick={()=>setModal('addJobSkill')} variant="outline">+ Skill to Job</AdminBtn>
              <AdminBtn onClick={()=>setModal('addJob')} variant="success">+ Add Job Role</AdminBtn>
            </SectionHeader>
            <div style={{ background:'rgba(30,20,50,0.7)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'16px',overflow:'hidden' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'rgba(124,58,237,0.1)' }}>
                  {['Job Title','Company','Salary','Min CGPA','Batch Year','Required Skills'].map(h=><th key={h} style={{ padding:'12px 16px',textAlign:'left',fontSize:'0.75rem',color:'#a78bfa',textTransform:'uppercase',letterSpacing:'0.07em' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {jobs.map(j=>(
                    <tr key={j.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding:'13px 16px',fontWeight:700,color:'#fff' }}>{j.title}</td>
                      <td style={{ padding:'13px 16px',color:'#94a3b8',fontSize:'0.85rem' }}>{j.company?.name||'—'}</td>
                      <td style={{ padding:'13px 16px',color:'#10b981',fontWeight:700 }}>₹{j.ctc||j.salaryLpa||0} LPA</td>
                      <td style={{ padding:'13px 16px',color:'#f1f5f9' }}>{j.minCgpa}</td>
                      <td style={{ padding:'13px 16px',color:'#f1f5f9' }}>{j.targetBatchYear||j.minPassoutYear}</td>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex',flexWrap:'wrap',gap:'5px' }}>
                          {(j.requiredSkills||[]).map(rs=><Pill key={rs.id} color="#10b981">{rs.skill?.name} ({rs.weightage}%)</Pill>)}
                          {(!j.requiredSkills||j.requiredSkills.length===0)&&<span style={{ color:'#64748b',fontSize:'0.8rem' }}>None</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {jobs.length===0&&<tr><td colSpan={6} style={{ textAlign:'center',color:'#64748b',padding:'32px' }}>No job roles yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SKILLS */}
        {tab==='skills' && (
          <>
            <SectionHeader title="🔧 Skills Library"><AdminBtn onClick={()=>setModal('addSkill')}>+ Add Skill</AdminBtn></SectionHeader>
            <div style={{ display:'grid',gridTemplateColumns:'320px 1fr',gap:'20px' }}>
              <div style={{ background:'rgba(30,20,50,0.8)',border:'1px solid rgba(139,92,246,0.18)',borderRadius:'16px',padding:'24px' }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'18px',fontSize:'1rem' }}>➕ Add Skill</h3>
                <form onSubmit={submitSkill} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
                  <FInput label="SKILL NAME *" placeholder="e.g. Java, SQL" value={skForm.name} onChange={e=>setSkForm({...skForm,name:e.target.value})} required />
                  <FSelect label="CATEGORY" value={skForm.category} onChange={e=>setSkForm({...skForm,category:e.target.value})}>
                    <option value="">Select Category</option>
                    {['Programming','Database','Framework','Soft Skill','Cloud','DevOps','Other'].map(c=><option key={c}>{c}</option>)}
                  </FSelect>
                  <AdminBtn disabled={loading}>{loading?'Adding…':'+ Add Skill'}</AdminBtn>
                </form>
                <div style={{ marginTop:'20px' }}>
                  <div style={{ fontSize:'0.75rem',color:'#64748b',marginBottom:'10px' }}>⚡ Quick Add:</div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:'6px' }}>
                    {['Java','SQL','DSA','Spring Boot','Python','React','Docker','AWS','Communication','Microservices'].map(sk=>(
                      <button key={sk} type="button" onClick={()=>quickAddSkill(sk)} style={{ padding:'4px 10px',borderRadius:'6px',fontSize:'0.73rem',fontWeight:600,background:'rgba(124,58,237,0.12)',color:'#a78bfa',border:'1px solid rgba(124,58,237,0.25)',cursor:'pointer' }}>+ {sk}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background:'rgba(30,20,50,0.7)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'16px',overflow:'hidden' }}>
                <div style={{ padding:'16px 22px',borderBottom:'1px solid rgba(139,92,246,0.12)' }}><span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff' }}>All Skills ({skills.length})</span></div>
                <div style={{ display:'flex',flexWrap:'wrap',gap:'10px',padding:'18px' }}>
                  {skills.length===0?<p style={{ color:'#64748b' }}>No skills yet.</p>:skills.map(s=>(
                    <div key={s.id} style={{ background:'rgba(124,58,237,0.08)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'10px',padding:'10px 16px' }}>
                      <div style={{ fontWeight:700,color:'#fff',fontSize:'0.9rem' }}>{s.name}</div>
                      {s.category&&<Pill color="#a78bfa">{s.category}</Pill>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* STUDENTS */}
        {tab==='students' && (
          <>
            <SectionHeader title="👨‍🎓 All Students">
              <div style={{ display:'flex',gap:'8px' }}>
                <Pill color="#10b981">High: {topCount}</Pill>
                <Pill color="#f59e0b">Mid: {students.filter(s=>s.readinessLevel==='MEDIUM').length}</Pill>
                <Pill color="#ef4444">Low: {students.filter(s=>s.readinessLevel==='LOW').length}</Pill>
                <Pill color="#64748b">N/A: {students.filter(s=>!s.readinessLevel).length}</Pill>
              </div>
            </SectionHeader>
            <div style={{ background:'rgba(30,20,50,0.7)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:'16px',overflow:'hidden' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'rgba(124,58,237,0.1)' }}>
                  {['Name','Email','Branch','CGPA','Score','Readiness','Actions'].map(h=><th key={h} style={{ padding:'12px 16px',textAlign:'left',fontSize:'0.75rem',color:'#a78bfa',textTransform:'uppercase',letterSpacing:'0.07em' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {students.map(s=>(
                    <tr key={s.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)',transition:'background 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(124,58,237,0.05)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px 16px',fontWeight:700,color:'#fff' }}>{s.name}</td>
                      <td style={{ padding:'12px 16px',color:'#94a3b8',fontSize:'0.83rem' }}>{s.email}</td>
                      <td style={{ padding:'12px 16px',color:'#94a3b8',fontSize:'0.83rem' }}>{s.branch}</td>
                      <td style={{ padding:'12px 16px',color:'#06b6d4',fontWeight:700 }}>{s.cgpa}</td>
                      <td style={{ padding:'12px 16px',fontWeight:800,color:levelColor[s.readinessLevel]||'#94a3b8' }}>{s.readinessScore||0}/100</td>
                      <td style={{ padding:'12px 16px' }}><Pill color={levelColor[s.readinessLevel]||'#64748b'}>{s.readinessLevel||'N/A'}</Pill></td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex',gap:'6px' }}>
                          <button type="button" onClick={()=>openStudent(s)} style={{ padding:'5px 11px',borderRadius:'7px',fontSize:'0.75rem',fontWeight:600,background:'rgba(124,58,237,0.15)',color:'#a78bfa',border:'1px solid rgba(139,92,246,0.2)',cursor:'pointer' }}>View</button>
                          <button type="button" onClick={()=>handleDeleteStudent(s.id)} style={{ padding:'5px 11px',borderRadius:'7px',fontSize:'0.75rem',fontWeight:600,background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.2)',cursor:'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length===0&&<tr><td colSpan={7} style={{ textAlign:'center',color:'#64748b',padding:'32px' }}>No students yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ═══ MODALS ═══ */}
      {modal==='addCompany' && (
        <FModal title="🏢 Add New Company" onClose={closeModal}>
          {msg.text&&<FAlert type={msg.type}>{msg.text}</FAlert>}
          <form onSubmit={submitCompany} style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
            <FInput label="COMPANY NAME *" placeholder="Infosys" value={coForm.name} onChange={e=>setCoForm({...coForm,name:e.target.value})} required />
            <FSelect label="INDUSTRY" value={coForm.industry} onChange={e=>setCoForm({...coForm,industry:e.target.value})}>
              <option value="">Select</option>
              {['IT','Finance','Healthcare','Manufacturing','Consulting'].map(i=><option key={i}>{i}</option>)}
            </FSelect>
            <FInput label="LOCATION" placeholder="Bangalore" value={coForm.location} onChange={e=>setCoForm({...coForm,location:e.target.value})} />
            <FInput label="HR EMAIL" type="email" placeholder="hr@co.com" value={coForm.hrEmail} onChange={e=>setCoForm({...coForm,hrEmail:e.target.value})} />
            <div style={{ gridColumn:'1/-1' }}><FInput label="WEBSITE" placeholder="https://company.com" value={coForm.website} onChange={e=>setCoForm({...coForm,website:e.target.value})} /></div>
            <div style={{ gridColumn:'1/-1',display:'flex',gap:'10px',marginTop:'8px' }}>
              <AdminBtn disabled={loading}>{loading?'Saving…':'Save Company'}</AdminBtn>
              <AdminBtn variant="outline" onClick={closeModal}>Cancel</AdminBtn>
            </div>
          </form>
        </FModal>
      )}

      {modal==='addJob' && (
        <FModal title="💼 Add Job Role" onClose={closeModal}>
          {msg.text&&<FAlert type={msg.type}>{msg.text}</FAlert>}
          {companies.length===0&&<FAlert type="error">⚠️ Add a company first!</FAlert>}
          <form onSubmit={submitJob} style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <FSelect label={`COMPANY * (${companies.length} available)`} value={jbForm.companyId} onChange={e=>setJbForm({...jbForm,companyId:e.target.value})} required>
                <option value="">-- Select Company --</option>
                {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </FSelect>
            </div>
            <FInput label="JOB TITLE *" placeholder="Software Engineer" value={jbForm.title} onChange={e=>setJbForm({...jbForm,title:e.target.value})} required />
            <FInput label="SALARY (LPA)" type="number" placeholder="12" value={jbForm.salaryLpa} onChange={e=>setJbForm({...jbForm,salaryLpa:e.target.value})} />
            <FInput label="MIN CGPA" type="number" step="0.1" placeholder="7.0" value={jbForm.minCgpa} onChange={e=>setJbForm({...jbForm,minCgpa:e.target.value})} />
            <FInput label="MIN PASSOUT YEAR" type="number" placeholder="2025" value={jbForm.minPassoutYear} onChange={e=>setJbForm({...jbForm,minPassoutYear:e.target.value})} />
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ fontSize:'0.78rem',color:'#a78bfa',fontWeight:600 }}>DESCRIPTION</label>
              <textarea rows={3} placeholder="Job description..." value={jbForm.description} onChange={e=>setJbForm({...jbForm,description:e.target.value})}
                style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',width:'100%',outline:'none',fontFamily:'inherit',fontSize:'0.88rem',resize:'vertical',marginTop:'5px' }} />
            </div>
            <div style={{ gridColumn:'1/-1',display:'flex',gap:'10px',marginTop:'4px' }}>
              <AdminBtn disabled={loading||companies.length===0} variant="success">{loading?'Saving…':'Save Job Role'}</AdminBtn>
              <AdminBtn variant="outline" onClick={closeModal}>Cancel</AdminBtn>
            </div>
          </form>
        </FModal>
      )}

      {modal==='addJobSkill' && (
        <FModal title="🔧 Add Required Skill to Job" onClose={closeModal}>
          {msg.text&&<FAlert type={msg.type}>{msg.text}</FAlert>}
          {skills.length===0&&<FAlert type="error">⚠️ Add skills first in the Skills tab!</FAlert>}
          <form onSubmit={submitJobSkill} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
            <FSelect label={`JOB ROLE * (${jobs.length} available)`} value={jsForm.jobId} onChange={e=>setJsForm({...jsForm,jobId:e.target.value})} required>
              <option value="">-- Select Job --</option>
              {jobs.map(j=><option key={j.id} value={j.id}>{j.title} — {j.company?.name}</option>)}
            </FSelect>
            <FSelect label={`SKILL * (${skills.length} available)`} value={jsForm.skillId} onChange={e=>setJsForm({...jsForm,skillId:e.target.value})} required>
              <option value="">-- Select Skill --</option>
              {skills.map(s=><option key={s.id} value={s.id}>{s.name}{s.category?` (${s.category})`:''}</option>)}
            </FSelect>
            <FInput label="WEIGHTAGE % (all skills should total 100)" type="number" min="1" max="100" placeholder="30" value={jsForm.weightage} onChange={e=>setJsForm({...jsForm,weightage:e.target.value})} required />
            <div style={{ display:'flex',gap:'10px',marginTop:'4px' }}>
              <AdminBtn disabled={loading||skills.length===0}>{loading?'Adding…':'Add Skill'}</AdminBtn>
              <AdminBtn variant="outline" onClick={closeModal}>Cancel</AdminBtn>
            </div>
          </form>
        </FModal>
      )}

      {modal==='addSkill' && (
        <FModal title="🔧 Add New Skill" onClose={closeModal}>
          {msg.text&&<FAlert type={msg.type}>{msg.text}</FAlert>}
          <form onSubmit={submitSkill} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
            <FInput label="SKILL NAME *" placeholder="e.g. Java, React" value={skForm.name} onChange={e=>setSkForm({...skForm,name:e.target.value})} required />
            <FSelect label="CATEGORY" value={skForm.category} onChange={e=>setSkForm({...skForm,category:e.target.value})}>
              <option value="">Select Category</option>
              {['Programming','Database','Framework','Soft Skill','Cloud','DevOps','Other'].map(c=><option key={c}>{c}</option>)}
            </FSelect>
            <div style={{ display:'flex',gap:'10px',marginTop:'4px' }}>
              <AdminBtn disabled={loading}>{loading?'Adding…':'+ Add Skill'}</AdminBtn>
              <AdminBtn variant="outline" onClick={closeModal}>Cancel</AdminBtn>
            </div>
          </form>
        </FModal>
      )}

      {modal==='viewStudent' && selStudent && (
        <FModal title={`👨‍🎓 ${selStudent.name}`} onClose={closeModal}>
          {msg.text&&<FAlert type={msg.type}>{msg.text}</FAlert>}
          <div style={{ background:'rgba(124,58,237,0.08)',border:'1px solid rgba(139,92,246,0.18)',borderRadius:'12px',padding:'14px',marginBottom:'18px' }}>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',fontSize:'0.83rem' }}>
              <div><span style={{ color:'#a78bfa' }}>Email:</span> <span style={{ color:'#f1f5f9' }}>{selStudent.email}</span></div>
              <div><span style={{ color:'#a78bfa' }}>Branch:</span> <span style={{ color:'#f1f5f9' }}>{selStudent.branch}</span></div>
              <div><span style={{ color:'#a78bfa' }}>CGPA:</span> <span style={{ color:'#06b6d4',fontWeight:700 }}>{selStudent.cgpa}</span></div>
              <div><span style={{ color:'#a78bfa' }}>Score:</span> <span style={{ color:levelColor[selStudent.readinessLevel]||'#f1f5f9',fontWeight:700 }}>{selStudent.readinessScore||0}/100</span></div>
            </div>
            <div style={{ marginTop:'10px' }}><Pill color={levelColor[selStudent.readinessLevel]||'#64748b'}>{selStudent.readinessLevel||'N/A'}</Pill></div>
          </div>

          <div style={{ display:'flex',gap:'4px',background:'rgba(255,255,255,0.04)',borderRadius:'10px',padding:'4px',marginBottom:'16px' }}>
            {[['skills','🔧 Skills'],['certs','🏅 Certs'],['internships','🏭 Internships']].map(([id,label])=>(
              <button key={id} type="button" onClick={()=>setStuTab(id)} style={{ flex:1,padding:'7px',borderRadius:'7px',fontSize:'0.8rem',fontWeight:700,border:'none',cursor:'pointer',color:stuTab===id?'#fff':'#64748b',background:stuTab===id?'linear-gradient(135deg,#7c3aed,#a855f7)':'transparent' }}>{label}</button>
            ))}
          </div>

          {stuTab==='skills'&&(
            <div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'7px',marginBottom:'14px' }}>
                {stuSkills.map(ss=><Pill key={ss.id} color="#10b981">{ss.skill?.name} · {ss.proficiencyLevel}</Pill>)}
                {stuSkills.length===0&&<span style={{ color:'#64748b',fontSize:'0.83rem' }}>No skills yet</span>}
              </div>
              <form onSubmit={addStudentSkill} style={{ display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'flex-end' }}>
                <div style={{ flex:1,minWidth:'130px' }}>
                  <FSelect label="SKILL" value={skillForm.skillId} onChange={e=>setSkillForm({...skillForm,skillId:e.target.value})} required>
                    <option value="">-- Select --</option>
                    {skills.map(sk=><option key={sk.id} value={sk.id}>{sk.name}</option>)}
                  </FSelect>
                </div>
                <div style={{ flex:1,minWidth:'120px' }}>
                  <FSelect label="PROFICIENCY" value={skillForm.proficiency} onChange={e=>setSkillForm({...skillForm,proficiency:e.target.value})}>
                    <option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option>
                  </FSelect>
                </div>
                <AdminBtn>Add</AdminBtn>
              </form>
            </div>
          )}
          {stuTab==='certs'&&(
            <div>
              {stuCerts.map(c=><div key={c.id} style={{ background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'8px 12px',marginBottom:'8px',fontSize:'0.83rem' }}>🏅 <strong>{c.certName}</strong> — {c.issuedBy} ({c.issueYear})</div>)}
              {stuCerts.length===0&&<p style={{ color:'#64748b',fontSize:'0.83rem',marginBottom:'12px' }}>No certifications yet</p>}
              <form onSubmit={addStudentCert} style={{ display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'flex-end' }}>
                <input placeholder="Cert Name" value={certForm.certName} onChange={e=>setCertForm({...certForm,certName:e.target.value})} required style={{ flex:'1 1 130px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }} />
                <input placeholder="Issued By" value={certForm.issuedBy} onChange={e=>setCertForm({...certForm,issuedBy:e.target.value})} style={{ flex:'1 1 110px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }} />
                <input placeholder="Year" value={certForm.issueYear} onChange={e=>setCertForm({...certForm,issueYear:e.target.value})} style={{ flex:'0 0 70px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }} />
                <AdminBtn>Add</AdminBtn>
              </form>
            </div>
          )}
          {stuTab==='internships'&&(
            <div>
              {stuInts.map(i=><div key={i.id} style={{ background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'8px 12px',marginBottom:'8px',fontSize:'0.83rem' }}>🏭 <strong>{i.role}</strong> at {i.companyName} · {i.duration} months</div>)}
              {stuInts.length===0&&<p style={{ color:'#64748b',fontSize:'0.83rem',marginBottom:'12px' }}>No internships yet</p>}
              <form onSubmit={addStudentInt} style={{ display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'flex-end' }}>
                <input placeholder="Company" value={intForm.companyName} onChange={e=>setIntForm({...intForm,companyName:e.target.value})} required style={{ flex:'1 1 130px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }} />
                <input placeholder="Role" value={intForm.role} onChange={e=>setIntForm({...intForm,role:e.target.value})} style={{ flex:'1 1 100px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }} />
                <input placeholder="Months" value={intForm.duration} onChange={e=>setIntForm({...intForm,duration:e.target.value})} style={{ flex:'0 0 80px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:'8px',color:'#f1f5f9',padding:'10px 14px',outline:'none',fontFamily:'inherit',fontSize:'0.88rem' }} />
                <AdminBtn>Add</AdminBtn>
              </form>
            </div>
          )}
          <div style={{ marginTop:'20px',paddingTop:'16px',borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <button type="button" onClick={()=>handleDeleteStudent(selStudent.id)} style={{ padding:'8px 18px',borderRadius:'8px',fontWeight:700,fontSize:'0.83rem',background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.2)',cursor:'pointer' }}>🗑️ Delete Student</button>
          </div>
        </FModal>
      )}
    </div>
  )
}
