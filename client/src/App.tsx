import { useState } from 'react'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState<{ email: string } | null>(null)

  const handleLogin = (email: string) => {
    setUser({ email })
  }

  const handleLogout = () => {
    setUser(null)
  }

  return user ? (
    <Dashboard userEmail={user.email} onLogout={handleLogout} />
  ) : (
    <AuthPage onLogin={handleLogin} />
  )
}

export default App