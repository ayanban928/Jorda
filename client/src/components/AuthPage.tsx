import { useState } from 'react'
import Snowfall from 'react-snowfall'
import { authAPI } from '../services/api'
import './AuthPage.css'

interface AuthPageProps {
  onLogin: (email: string) => void
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match for signup
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    setLoading(true)
    
    try {
      if (isLogin) {
        const response = await authAPI.login(email, password)
        console.log('Login successful:', response.data)
        onLogin(email)
      } else {
        const response = await authAPI.signup(email, password)
        console.log('Signup successful:', response.data)
        onLogin(email)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <Snowfall 
        snowflakeCount={600}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />
      
      <div className="auth-card">
        <h1 className="title">Jorda</h1>
        <p className="subtitle">Track your job applications</p>

        <div className="toggle-buttons">
          <button
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
            className={isLogin ? 'active' : ''}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
            className={!isLogin ? 'active' : ''}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Retype Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage