import { useState } from 'react'
import Snowfall from 'react-snowfall'
import './AuthPage.css'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match for signup
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    console.log(isLogin ? 'Login' : 'Signup', { email, password })
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
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage