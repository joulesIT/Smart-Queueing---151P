import { useState } from 'react'
import LoginPage from './components/LoginPage'
import UserDashboard from './components/user/UserDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

export type Role = 'user' | 'admin'

export interface AuthUser {
  role: Role
  name: string
  queueNumber?: string
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null)

  const handleLogin = (authUser: AuthUser) => setUser(authUser)
  const handleLogout = () => setUser(null)

  if (!user) return <LoginPage onLogin={handleLogin} />
  if (user.role === 'admin') return <AdminDashboard user={user} onLogout={handleLogout} />
  return <UserDashboard user={user} onLogout={handleLogout} />
}
