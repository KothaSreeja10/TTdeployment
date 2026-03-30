import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAllStudents } from '../utills/api'
import { saveUser } from '../utills/auth'

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await getAllStudents()
      const students = res.data || []
      const found = students.find(s => s.email.toLowerCase() === form.email.toLowerCase())
      if (found) {
        saveUser(found)
        navigate('/dashboard')
      } else {
        setError('No student found with this email. Please register first.')
      }
    } catch(err) {
      setError('Cannot connect to backend. Make sure Spring Boot is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 60% 0%, #1e3a5f 0%, #0f172a 70%)' }}>
      <div style={{ background:'rgba(30,41,59,0.9)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'40px 36px', width:'100%', maxWidth:'420px', backdropFilter:'blur(20px)' }}>
        <div style={{ fontSize:'2.5rem', textAlign:'center', marginBottom:'12px' }}>🎓</div>
        <h1 style={{ textAlign:'center', fontSize:'1.6rem', fontWeight:800, color:'#fff' }}>Campus Placement</h1>
        <p style={{ textAlign:'center', color:'#64748b', fontSize:'0.88rem', marginBottom:'28px' }}>Login with your registered email</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div className="form-group">
            <label>Registered Email</label>
            <input name="email" type="email" placeholder="yourname@college.edu" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password (any value)</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:'8px' }}>
            {loading ? 'Logging in…' : 'Sign In →'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'0.85rem', color:'#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color:'#3b82f6' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
