// ─── Admin Auth ────────────────────────────────────────────
export const saveAdmin = (admin) => localStorage.setItem('admin', JSON.stringify(admin));
export const getAdmin  = ()      => { try { return JSON.parse(localStorage.getItem('admin')); } catch { return null; } };
export const removeAdmin = ()    => localStorage.removeItem('admin');

// ─── Student "User" context (set by admin when viewing a student) ──
export const saveUser   = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser    = ()     => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
export const removeUser = ()     => localStorage.removeItem('user');
