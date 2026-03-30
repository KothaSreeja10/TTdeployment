import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerStudent } from '../utills/api'

export default function Register() {
  const [form, setForm] = useState({
    fullName:'', email:'', branch:'', cgpa:'',
    passoutYear:'', phone:'', communicationRating:'', projectCount:''
  })
  const [msg,     setMsg]     = useState({ text:'', type:'' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerStudent({
        ...form,
        cgpa:                parseFloat(form.cgpa),
        passoutYear:         parseInt(form.passoutYear),
        communicationRating: parseInt(form.communicationRating),
        projectCount:        parseInt(form.projectCount) || 0
      })
      setMsg({ text:'Registration successful! You can now login.', type:'success' })
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setMsg({ text: err.response?.data || 'Registration failed. Make sure backend is running.', type:'error' })
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', background:'radial-gradient(ellipse at 40% 100%, #1e3a5f 0%, #0f172a 70%)' }}>
      <div style={{ background:'rgba(30,41,59,0.95)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'36px 32px', width:'100%', maxWidth:'620px', backdropFilter:'blur(20px)' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#fff', marginBottom:'4px' }}>🎓 Create Account</h1>
        <p style={{ color:'#64748b', fontSize:'0.88rem', marginBottom:'24px' }}>Register as a student in the placement system</p>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="fullName" placeholder="Ravi Kumar" value={form.fullName} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" placeholder="ravi@college.edu" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Branch *</label>
              <select name="branch" value={form.branch} onChange={handle} required>
                <option value="">Select Branch</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </select>
            </div>
            <div className="form-group">
              <label>CGPA *</label>
              <input name="cgpa" type="number" step="0.01" min="0" max="10" placeholder="8.5" value={form.cgpa} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Passout Year *</label>
              <input name="passoutYear" type="number" placeholder="2025" value={form.passoutYear} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" placeholder="9876543210" value={form.phone} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Communication Rating (1-10) *</label>
              <input name="communicationRating" type="number" min="1" max="10" placeholder="7" value={form.communicationRating} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Project Count</label>
              <input name="projectCount" type="number" min="0" placeholder="2" value={form.projectCount} onChange={handle} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:'20px' }}>
            {loading ? 'Registering…' : 'Register →'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'0.85rem', color:'#64748b' }}>
          Already registered? <Link to="/login" style={{ color:'#3b82f6' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
