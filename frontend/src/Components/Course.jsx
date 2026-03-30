import { useEffect, useState } from 'react'
import { getAllCompanies, addCompany, addJobRole, getAllSkills, addSkill, addSkillToJob, getAllJobs } from '../utills/api'

export default function Course() {
  const [companies, setCompanies] = useState([])
  const [jobs,      setJobs]      = useState([])
  const [skills,    setSkills]    = useState([])
  const [view,      setView]      = useState('companies')
  const [msg,       setMsg]       = useState({ text:'', type:'' })
  const [showModal, setShowModal] = useState(null)
  const [coForm, setCoForm] = useState({ name:'', industry:'', website:'', location:'', hrEmail:'' })
  const [jbForm, setJbForm] = useState({ companyId:'', title:'', salaryLpa:'', minCgpa:'', minPassoutYear:'', description:'' })
  const [jsForm, setJsForm] = useState({ jobId:'', skillId:'', weightage:'' })
  const [skForm, setSkForm] = useState({ name:'', category:'' })

  useEffect(() => { load() }, [])

  const load = async () => {
    try { const [c,j,s] = await Promise.all([getAllCompanies(), getAllJobs(), getAllSkills()]); setCompanies(c.data||[]); setJobs(j.data||[]); setSkills(s.data||[]); setMsg({text:'',type:''}) } catch(err) { console.error(err) }
  }

  const openModal = async (type) => {
    setShowModal(type)
    try { const [c,j,s] = await Promise.all([getAllCompanies(), getAllJobs(), getAllSkills()]); setCompanies(c.data||[]); setJobs(j.data||[]); setSkills(s.data||[]) } catch(err) {}
  }

  const submitCompany = async (e) => {
    e.preventDefault()
    try { await addCompany(coForm); setMsg({text:'✅ Company added!',type:'success'}); setShowModal(null); setCoForm({name:'',industry:'',website:'',location:'',hrEmail:''}); load() }
    catch(err) { setMsg({text:'❌ '+(err.response?.data?.message||err.response?.data||'Failed'),type:'error'}) }
  }

  const submitJob = async (e) => {
    e.preventDefault()
    if (!jbForm.companyId) { setMsg({text:'❌ Please select a company!',type:'error'}); return }
    try { await addJobRole(jbForm.companyId, {title:jbForm.title,salaryLpa:parseFloat(jbForm.salaryLpa),minCgpa:parseFloat(jbForm.minCgpa),minPassoutYear:parseInt(jbForm.minPassoutYear),description:jbForm.description}); setMsg({text:'✅ Job role added!',type:'success'}); setShowModal(null); setJbForm({companyId:'',title:'',salaryLpa:'',minCgpa:'',minPassoutYear:'',description:''}); load() }
    catch(err) { setMsg({text:'❌ '+(err.response?.data?.message||err.response?.data||'Failed'),type:'error'}) }
  }

  const submitJobSkill = async (e) => {
    e.preventDefault()
    try { await addSkillToJob(jsForm.jobId, jsForm.skillId, parseFloat(jsForm.weightage)); setMsg({text:'✅ Skill added to job!',type:'success'}); setShowModal(null); setJsForm({jobId:'',skillId:'',weightage:''}); load() }
    catch(err) { setMsg({text:'❌ '+(err.response?.data?.message||err.response?.data||'Failed'),type:'error'}) }
  }

  const submitSkill = async (e) => {
    e.preventDefault()
    try { await addSkill(skForm); setMsg({text:'✅ Skill "'+skForm.name+'" added!',type:'success'}); setSkForm({name:'',category:''}); const s = await getAllSkills(); setSkills(s.data||[]) }
    catch(err) { setMsg({text:'❌ '+(err.response?.data||'Skill already exists'),type:'error'}) }
  }

  return (
    <div className="page">
      <h1 className="page-title">🏢 Company & Job Management</h1>
      <p className="page-subtitle">Manage companies, job roles and required skills</p>
      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',gap:'8px',background:'rgba(255,255,255,0.04)',borderRadius:'10px',padding:'4px'}}>
          {['companies','jobs','skills'].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:'8px 18px',borderRadius:'8px',fontWeight:600,fontSize:'0.85rem',background:view===v?'var(--blue)':'transparent',color:view===v?'#fff':'#64748b',transition:'all 0.2s'}}>
              {v==='companies'?'🏢 Companies':v==='jobs'?'💼 Job Roles':'🔧 Skills'}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={()=>openModal('company')}>+ Add Company</button>
          <button className="btn btn-success" onClick={()=>openModal('job')}>+ Add Job Role</button>
          <button className="btn btn-outline" onClick={()=>openModal('jobskill')}>+ Skill to Job</button>
        </div>
      </div>

      {view==='companies' && (
        <div className="tbl-wrap"><table>
          <thead><tr><th>Company</th><th>Industry</th><th>Location</th><th>HR Email</th></tr></thead>
          <tbody>
            {companies.map(c=><tr key={c.id}><td><strong>{c.name}</strong></td><td><span className="badge badge-blue">{c.industry}</span></td><td>{c.location||'—'}</td><td>{c.hrEmail||'—'}</td></tr>)}
            {companies.length===0 && <tr><td colSpan={4} style={{textAlign:'center',color:'#64748b',padding:'28px'}}>No companies yet.</td></tr>}
          </tbody>
        </table></div>
      )}

      {view==='jobs' && (
        <div className="tbl-wrap"><table>
          <thead><tr><th>Title</th><th>Company</th><th>Salary</th><th>Min CGPA</th><th>Required Skills</th></tr></thead>
          <tbody>
            {jobs.map(j=><tr key={j.id}><td><strong>{j.title}</strong></td><td>{j.company?.name||'—'}</td><td style={{color:'var(--green)',fontWeight:700}}>₹{j.salaryLpa} LPA</td><td>{j.minCgpa}</td><td><div className="skill-chips">{(j.requiredSkills||[]).map(rs=><span key={rs.id} className="chip chip-green">{rs.skill?.name} ({rs.weightage}%)</span>)}{(!j.requiredSkills||j.requiredSkills.length===0)&&<span style={{color:'#64748b',fontSize:'0.8rem'}}>None</span>}</div></td></tr>)}
            {jobs.length===0 && <tr><td colSpan={5} style={{textAlign:'center',color:'#64748b',padding:'28px'}}>No job roles yet.</td></tr>}
          </tbody>
        </table></div>
      )}

      {view==='skills' && (
        <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:'20px'}}>
          <div className="card">
            <div className="section-title" style={{marginBottom:'16px'}}>➕ Add New Skill</div>
            <form onSubmit={submitSkill} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div className="form-group"><label>Skill Name *</label><input placeholder="e.g. Java, SQL, DSA" value={skForm.name} onChange={e=>setSkForm({...skForm,name:e.target.value})} required /></div>
              <div className="form-group"><label>Category</label>
                <select value={skForm.category} onChange={e=>setSkForm({...skForm,category:e.target.value})}>
                  <option value="">Select Category</option>
                  <option>Programming</option><option>Database</option><option>Framework</option>
                  <option>Soft Skill</option><option>Cloud</option><option>DevOps</option><option>Other</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{justifyContent:'center'}}>+ Add Skill</button>
            </form>
            <div style={{marginTop:'20px'}}>
              <div style={{fontSize:'0.78rem',color:'#64748b',marginBottom:'10px'}}>⚡ Quick Add Common Skills:</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {['Java','SQL','DSA','Spring Boot','Python','React','Docker','AWS','Communication','HTML','Microservices','System Design'].map(sk=>(
                  <button key={sk} onClick={async()=>{
                    try { await addSkill({name:sk,category:'Programming'}); const s=await getAllSkills(); setSkills(s.data||[]); setMsg({text:`✅ "${sk}" added!`,type:'success'}) }
                    catch(e) { setMsg({text:`ℹ️ "${sk}" already exists`,type:'error'}) }
                  }} style={{padding:'4px 10px',borderRadius:'6px',fontSize:'0.75rem',fontWeight:600,background:'rgba(37,99,235,0.15)',color:'#3b82f6',border:'1px solid rgba(37,99,235,0.3)',cursor:'pointer'}}>
                    + {sk}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}><span className="section-title">All Skills ({skills.length})</span></div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'10px',padding:'16px'}}>
              {skills.length===0 ? <p style={{color:'#64748b'}}>No skills yet. Add using the form.</p>
                : skills.map(s=><div key={s.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',borderRadius:'10px',padding:'10px 16px'}}><div style={{fontWeight:700,color:'#fff',fontSize:'0.92rem'}}>{s.name}</div>{s.category&&<span className="badge badge-blue" style={{fontSize:'0.7rem',marginTop:'4px',display:'inline-block'}}>{s.category}</span>}</div>)}
            </div>
          </div>
        </div>
      )}

      {showModal==='company' && (
        <div className="modal-overlay" onClick={()=>setShowModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">🏢 Add New Company</div>
            <form onSubmit={submitCompany}>
              <div className="form-grid">
                <div className="form-group"><label>Company Name *</label><input placeholder="Infosys" value={coForm.name} onChange={e=>setCoForm({...coForm,name:e.target.value})} required/></div>
                <div className="form-group"><label>Industry</label><select value={coForm.industry} onChange={e=>setCoForm({...coForm,industry:e.target.value})}><option value="">Select</option><option>IT</option><option>Finance</option><option>Healthcare</option><option>Manufacturing</option><option>Consulting</option></select></div>
                <div className="form-group"><label>Location</label><input placeholder="Bangalore" value={coForm.location} onChange={e=>setCoForm({...coForm,location:e.target.value})}/></div>
                <div className="form-group"><label>HR Email</label><input type="email" placeholder="hr@co.com" value={coForm.hrEmail} onChange={e=>setCoForm({...coForm,hrEmail:e.target.value})}/></div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label>Website</label><input placeholder="https://company.com" value={coForm.website} onChange={e=>setCoForm({...coForm,website:e.target.value})}/></div>
              </div>
              <div className="form-actions"><button type="submit" className="btn btn-primary">Save Company</button><button type="button" className="btn btn-outline" onClick={()=>setShowModal(null)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal==='job' && (
        <div className="modal-overlay" onClick={()=>setShowModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">💼 Add Job Role</div>
            {companies.length===0 && <div className="alert alert-error">⚠️ Add a company first!</div>}
            <form onSubmit={submitJob}>
              <div className="form-grid">
                <div className="form-group" style={{gridColumn:'1/-1'}}><label>Company * ({companies.length} available)</label>
                  <select value={jbForm.companyId} onChange={e=>setJbForm({...jbForm,companyId:e.target.value})} required>
                    <option value="">-- Select Company --</option>
                    {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Job Title *</label><input placeholder="Software Engineer" value={jbForm.title} onChange={e=>setJbForm({...jbForm,title:e.target.value})} required/></div>
                <div className="form-group"><label>Salary (LPA)</label><input type="number" placeholder="12" value={jbForm.salaryLpa} onChange={e=>setJbForm({...jbForm,salaryLpa:e.target.value})}/></div>
                <div className="form-group"><label>Min CGPA</label><input type="number" step="0.1" placeholder="7.0" value={jbForm.minCgpa} onChange={e=>setJbForm({...jbForm,minCgpa:e.target.value})}/></div>
                <div className="form-group"><label>Min Passout Year</label><input type="number" placeholder="2025" value={jbForm.minPassoutYear} onChange={e=>setJbForm({...jbForm,minPassoutYear:e.target.value})}/></div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label>Description</label><textarea rows={2} placeholder="Job description..." value={jbForm.description} onChange={e=>setJbForm({...jbForm,description:e.target.value})} style={{resize:'vertical'}}/></div>
              </div>
              <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={companies.length===0}>Save Job Role</button><button type="button" className="btn btn-outline" onClick={()=>setShowModal(null)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {showModal==='jobskill' && (
        <div className="modal-overlay" onClick={()=>setShowModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">🔧 Add Skill to Job</div>
            {skills.length===0 && <div className="alert alert-error">⚠️ No skills found! Go to 🔧 Skills tab first and add skills.</div>}
            <form onSubmit={submitJobSkill}>
              <div className="form-grid one-col">
                <div className="form-group"><label>Job Role * ({jobs.length} available)</label>
                  <select value={jsForm.jobId} onChange={e=>setJsForm({...jsForm,jobId:e.target.value})} required>
                    <option value="">-- Select Job --</option>
                    {jobs.map(j=><option key={j.id} value={j.id}>{j.title} — {j.company?.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Skill * ({skills.length} available)</label>
                  <select value={jsForm.skillId} onChange={e=>setJsForm({...jsForm,skillId:e.target.value})} required>
                    <option value="">-- Select Skill --</option>
                    {skills.map(s=><option key={s.id} value={s.id}>{s.name} {s.category?`(${s.category})`:''}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Weightage % (all skills should total 100)</label><input type="number" min="1" max="100" placeholder="30" value={jsForm.weightage} onChange={e=>setJsForm({...jsForm,weightage:e.target.value})} required/></div>
              </div>
              <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={skills.length===0}>Add Skill</button><button type="button" className="btn btn-outline" onClick={()=>setShowModal(null)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
