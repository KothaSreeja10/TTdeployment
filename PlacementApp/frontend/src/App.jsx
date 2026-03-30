import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Users, Lightbulb, LineChart, BarChart2, ShieldCheck } from 'lucide-react'
import AICoach from './components/AICoach'

/* ── Admin pages ─────────────────────────────────────────── */
import AdminLogin     from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

/* ── Admin panel pages (sidebar layout) ─────────────────── */
import AdminStats       from './pages/Dashboard'          // original admin dashboard
import CompanyManagement from './pages/CompanyManagement'
import StudentManagement from './pages/StudentManagement'
import SkillMaster       from './pages/SkillMaster'
import SkillGapAnalysis  from './pages/SkillGapAnalysis'
import Analytics         from './pages/Analytics'

/* ── Student-facing pages ────────────────────────────────── */
import Login           from './pages/Login'
import Register        from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import Navbar          from './components/Navbar'
import { getUser }     from './utills/auth'

/* ════════════════════════════════════════════════════════════
   ADMIN SIDEBAR LAYOUT
   ════════════════════════════════════════════════════════════ */
function AdminShell() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isActive
      ? 'bg-primary-600/30 text-primary-400 border border-primary-500/20'
      : 'hover:bg-dark-surface hover:text-slate-100 border border-transparent'}`

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 glass-panel m-4 flex flex-col items-center py-8 z-10 hidden md:flex">
        <div className="text-3xl font-extrabold text-glow mb-12 tracking-wide font-sans">
          Edu<span className="text-primary-500">Track</span>
        </div>
        <nav className="flex flex-col gap-4 w-full px-6 flex-1">
          <NavLink to="/admin/panel"          className={linkClass}><LayoutDashboard size={20} /> Dashboard</NavLink>
          <NavLink to="/admin/panel/companies" className={linkClass}><Building2 size={20} /> Companies &amp; Jobs</NavLink>
          <NavLink to="/admin/panel/students"  className={linkClass}><Users size={20} /> Students</NavLink>
          <NavLink to="/admin/panel/skills"    className={linkClass}><Lightbulb size={20} /> Skill Catalog</NavLink>
          <NavLink to="/admin/panel/skill-gap" className={linkClass}><LineChart size={20} /> Gap Analysis</NavLink>
          <NavLink to="/admin/panel/analytics" className={linkClass}><BarChart2 size={20} /> Analytics</NavLink>
        </nav>
        <div className="mt-auto px-6 w-full">
          <NavLink to="/login" className="flex items-center gap-2 p-3 rounded-lg text-xs text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700/40 transition-all">
            <ShieldCheck size={14} /> Student Portal
          </NavLink>
          <div className="text-center text-xs text-slate-600 mt-2">Placement App © 2026</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 md:pl-4 relative">
        <Routes>
          <Route index                  element={<AdminStats />} />
          <Route path="companies"       element={<CompanyManagement />} />
          <Route path="students"        element={<StudentManagement />} />
          <Route path="skills"          element={<SkillMaster />} />
          <Route path="skill-gap"       element={<SkillGapAnalysis />} />
          <Route path="analytics"       element={<Analytics />} />
        </Routes>
      </main>
      <AICoach />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   STUDENT LAYOUT  (Navbar + padded page area)
   ════════════════════════════════════════════════════════════ */
function StudentShell({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop:'72px', minHeight:'100vh', background:'radial-gradient(ellipse at 50% 0%, #1e3a5f 0%, #0f172a 80%)', padding:'72px 24px 40px' }}>
        {children}
      </div>
      <AICoach />
    </>
  )
}

/* ════════════════════════════════════════════════════════════
   PROTECTED ROUTE (student must be logged in)
   ════════════════════════════════════════════════════════════ */
function ProtectedRoute({ children }) {
  return getUser() ? children : <Navigate to="/login" replace />
}

/* ════════════════════════════════════════════════════════════
   ROOT APP
   ════════════════════════════════════════════════════════════ */
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        {/* ── Public student auth pages ─────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected student pages (with Navbar) ─────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <StudentShell><StudentDashboard /></StudentShell>
          </ProtectedRoute>
        } />

        {/* /subject  → reuse SkillGapAnalysis page for student */}
        <Route path="/subject" element={
          <ProtectedRoute>
            <StudentShell><SkillGapAnalysis /></StudentShell>
          </ProtectedRoute>
        } />

        {/* /gpa  → reuse Analytics page for student */}
        <Route path="/gpa" element={
          <ProtectedRoute>
            <StudentShell><Analytics /></StudentShell>
          </ProtectedRoute>
        } />

        {/* /course → company management (admin-facing, accessible from student nav) */}
        <Route path="/course" element={
          <ProtectedRoute>
            <StudentShell><CompanyManagement /></StudentShell>
          </ProtectedRoute>
        } />

        {/* /attendance → student management */}
        <Route path="/attendance" element={
          <ProtectedRoute>
            <StudentShell><StudentManagement /></StudentShell>
          </ProtectedRoute>
        } />

        {/* ── Admin auth pages ───────────────────────────────── */}
        <Route path="/admin"           element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* ── Admin panel with sidebar ───────────────────────── */}
        <Route path="/admin/panel/*"   element={<AdminShell />} />

        {/* ── Default redirect ───────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  )
}

export default App
