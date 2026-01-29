import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import JobView from './components/JobView'
import { authAPI } from './services/api'

function App() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token')
      const cachedEmail = localStorage.getItem('userEmail')
      
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const { data } = await authAPI.get('/verify')
        setUser({ email: data.email })
        localStorage.setItem('userEmail', data.email)
      } catch (error: any) {
        console.error('Token verification failed:', error)
        
        const status = error.response?.status
        
        if (!status || status === 500) {
          if (cachedEmail) {
            console.log('Using cached email due to server error')
            setUser({ email: cachedEmail })
          }
        } else if (status === 401 || status === 404) {
          console.log('Token invalid, logging out')
          localStorage.removeItem('token')
          localStorage.removeItem('userEmail')
        }
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [])

  const handleLogin = (email: string, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userEmail', email)
    setUser({ email })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setUser(null)
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <Dashboard userEmail={user.email} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/sheet/:sheetId" 
          element={user ? <JobView userEmail={user.email} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App