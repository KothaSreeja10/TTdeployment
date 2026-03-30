import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUser, removeUser } from '../utills/auth'

const links = [
  { path:'/dashboard', label:'📊 Dashboard' },
  { path:'/subject',   label:'🔍 My Skill Gap' },
  { path:'/gpa',       label:'📈 My Analytics' },
]

const adminLinks = [
  { path:'/course',     label:'🏢 Companies' },
  { path:'/attendance', label:'📋 All Students' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = getUser()

  const logout = () => {
    removeUser()
    navigate('/login')
  }

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:999, height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', background:'rgba(15,23,42,0.92)', borderBottom:'1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(16px)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontSize:'1.4rem' }}>🎓</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>PlacementPro</span>
      </div>
      <div style={{ display:'flex', gap:'4px' }}>
        {links.map(l => (
          <Link key={l.path} to={l.path} style={{ padding:'6px 14px', borderRadius:'8px', fontSize:'0.83rem', fontWeight:500, color: pathname===l.path ? '#3b82f6':'#64748b', background: pathname===l.path ? 'rgba(37,99,235,0.2)':'transparent', transition:'all 0.2s' }}>
            {l.label}
          </Link>
        ))}
        {adminLinks.map(l => (
          <Link key={l.path} to={l.path} style={{ padding:'6px 14px', borderRadius:'8px', fontSize:'0.83rem', fontWeight:500, color: pathname===l.path ? '#f59e0b':'#64748b', background: pathname===l.path ? 'rgba(245,158,11,0.15)':'transparent', transition:'all 0.2s' }}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:800, color:'#fff' }}>
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#fff' }}>{user.fullName}</div>
              <div style={{ fontSize:'0.72rem', color:'#64748b' }}>{user.branch}</div>
            </div>
          </div>
        )}
        <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
      </div>
    </nav>
  )
}
