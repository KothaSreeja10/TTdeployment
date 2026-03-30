import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login         from './Components/Login.jsx'
import Register      from './Components/Register.jsx'
import Dashboard     from './Components/Dashboard.jsx'
import Navbar        from './Components/Navbar.jsx'
import Course        from './Components/Course.jsx'
import Attendance    from './Components/Attendance.jsx'
import GPA           from './Components/GPA.jsx'
import Subject       from './Components/Subject.jsx'
import AdminLogin    from './Components/AdminLogin.jsx'
import AdminDashboard from './Components/AdminDashboard.jsx'
import { getUser, getAdmin } from './utills/auth'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '70px' }}>{children}</div>
    </>
  )
}

function PrivateRoute({ children }) {
  return getUser() ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  return getAdmin() ? children : <Navigate to="/admin" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"           element={<Navigate to="/login" />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />

        {/* Student (protected) */}
        <Route path="/dashboard"  element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/course"     element={<PrivateRoute><Layout><Course /></Layout></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><Layout><Attendance /></Layout></PrivateRoute>} />
        <Route path="/gpa"        element={<PrivateRoute><Layout><GPA /></Layout></PrivateRoute>} />
        <Route path="/subject"    element={<PrivateRoute><Layout><Subject /></Layout></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin"            element={<AdminLogin />} />
        <Route path="/AdminLogin"       element={<Navigate to="/admin" />} />
        <Route path="/admin/dashboard"  element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*"                 element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}