

export const saveUser   = (student) => localStorage.setItem('loggedStudent', JSON.stringify(student))
export const getUser    = () => { const u = localStorage.getItem('loggedStudent'); return u ? JSON.parse(u) : null }
export const removeUser = () => { localStorage.removeItem('loggedStudent'); localStorage.removeItem('user') }
export const isLoggedIn = () => !!localStorage.getItem('loggedStudent')

export const saveAdmin   = (admin) => localStorage.setItem('loggedAdmin', JSON.stringify(admin))
export const getAdmin    = () => { const a = localStorage.getItem('loggedAdmin'); return a ? JSON.parse(a) : null }
export const removeAdmin = () => localStorage.removeItem('loggedAdmin')
export const isAdmin     = () => !!localStorage.getItem('loggedAdmin')