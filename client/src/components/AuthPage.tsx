import { useState } from 'react'
import Snowfall from 'react-snowfall'
import './AuthPage.css'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isLogin ? 'Login' : 'Signup', { email, password })
  }

  return (
    <div className="auth-container">
      <Snowfall 
        snowflakeCount={200}
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
            onClick={() => setIsLogin(true)}
            className={isLogin ? 'active' : ''}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={!isLogin ? 'active' : ''}
          >
            Sign Up
          </button>
        </div>

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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage