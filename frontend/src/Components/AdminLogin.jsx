import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { saveAdmin } from '../utills/auth'

const ADMIN_CREDENTIALS = { email: 'admin@placement.com', password: 'admin123' }

export default function AdminLogin() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // simulate auth
    const emailMatch = form.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email
    const passMatch  = form.password.trim() === ADMIN_CREDENTIALS.password
    if (emailMatch && passMatch) {
      saveAdmin({ email: form.email, name: 'Admin', role: 'ADMIN' })
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin credentials. Try admin@placement.com / admin123')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 30% 20%, #1a0533 0%, #0f172a 60%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(30,20,50,0.92)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '440px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Admin badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            fontSize: '2rem', marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          }}>🛡️</div>
          <h1 style={{
            fontSize: '1.7rem', fontWeight: 800, color: '#fff',
            fontFamily: "'Syne', sans-serif", marginBottom: '4px',
          }}>Admin Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>PlacementPro Administration</p>
          <div style={{
            display: 'inline-block', marginTop: '10px',
            padding: '3px 12px', borderRadius: '999px',
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            fontSize: '0.72rem', fontWeight: 700,
            color: '#a78bfa', letterSpacing: '0.08em',
          }}>RESTRICTED ACCESS</div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '18px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', fontSize: '0.85rem',
          }}>{error}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              ADMIN EMAIL
            </label>
            <input
              name="email" type="email"
              placeholder="admin@placement.com"
              value={form.email} onChange={handle} required
              style={{ borderColor: 'rgba(139,92,246,0.3)' }}
            />
          </div>
          <div className="form-group">
            <label style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              PASSWORD
            </label>
            <input
              name="password" type="password"
              placeholder="••••••••"
              value={form.password} onChange={handle} required
              style={{ borderColor: 'rgba(139,92,246,0.3)' }}
            />
          </div>

          <div style={{
            padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem',
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
            color: '#94a3b8',
          }}>
            💡 Demo: <span style={{ color: '#c4b5fd' }}>admin@placement.com</span> / <span style={{ color: '#c4b5fd' }}>admin123</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {loading ? '⏳ Authenticating…' : '🔐 Sign In as Admin'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.83rem', color: '#64748b' }}>
          Student?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Go to Student Login</Link>
        </p>
      </div>
    </div>
  )
}