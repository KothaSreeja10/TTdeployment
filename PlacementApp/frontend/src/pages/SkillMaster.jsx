import { useEffect, useState } from 'react'
import { getAllSkills, addSkill } from '../utills/api'

export default function SkillMaster() {
  const [skills, setSkills] = useState([])
  const [form,   setForm]   = useState({ name:'', category:'' })
  const [msg,    setMsg]    = useState({ text:'', type:'' })

  useEffect(() => { load() }, [])
  const load = async () => { const res = await getAllSkills(); setSkills(res.data||[]) }

  const submit = async (e) => {
    e.preventDefault()
    try {
      await addSkill(form)
      setMsg({ text:'✅ Skill added!', type:'success' }); setForm({ name:'', category:'' }); load()
    } catch(err) { setMsg({ text:'❌ Skill already exists', type:'error' }) }
  }

  return (
    <div className="page">
      <h1 className="page-title">🔧 Skill Master</h1>
      <p className="page-subtitle">Manage the global skills library</p>
      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:'20px' }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom:'16px' }}>Add New Skill</div>
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div className="form-group"><label>Skill Name *</label><input placeholder="e.g. Java, SQL" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-group"><label>Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                <option value="">Select</option>
                <option>Programming</option><option>Database</option><option>Framework</option>
                <option>Soft Skill</option><option>Cloud</option><option>DevOps</option><option>Other</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }}>+ Add Skill</button>
          </form>
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <span className="section-title">All Skills ({skills.length})</span>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', padding:'16px' }}>
            {skills.length===0
              ?<p style={{ color:'#64748b' }}>No skills yet.</p>
              :skills.map(s=>(
                <div key={s.id} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',borderRadius:'10px',padding:'10px 16px' }}>
                  <div style={{ fontWeight:700,color:'#fff' }}>{s.name}</div>
                  {s.category&&<span className="badge badge-blue" style={{ fontSize:'0.7rem',marginTop:'4px',display:'inline-block' }}>{s.category}</span>}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
