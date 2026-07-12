import { useState } from 'react'
import './Login.css'

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    onNavigate('dashboard')
  }

  return (
    <main className="login-page">
      <div className="page-top-right">
        Contact us
        <svg className="call-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99" />
        </svg>
        <span className="contact-number">+91-8882125306</span>
      </div>
      <div className="login-layout">
        <aside className="login-side">
          <div className="login-side-copy">
            <p className="eyebrow">Welcome back</p>
            <h1>Welcome to MyInvoiceBook</h1>
            <p className="login-side-text">
              Thank you for choosing us. Sign in to access your dashboard, manage GST billing, and
              grow your business with MyInvoiceBook.
            </p>
            <div className="login-side-meta">
              <div>
                <strong> Trusted by businesses across India</strong>
              </div>
              <div>Fast GST billing, inventory tracking, and reports in one place.</div>
            </div>
          </div>
          <div className="login-side-graphic">
            <div className="login-image-block" />
          </div>
        </aside>

        <section className="login-card">
          <div className="login-card-header">
            <p className="eyebrow">Login</p>
            <h2>Enter your credentials to continue.</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Email or Phone Number
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <div className="password-field-group">
              <div className="password-field-header">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <label className="password-toggle">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
              Show password
            </label>
            {error && <p className="login-error">{error}</p>}
            <div className="login-actions">
              <button type="submit" className="button-primary">
                Sign In
              </button>
              <button type="button" className="button-secondary" onClick={() => onNavigate('signup')}>
                Signup
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
