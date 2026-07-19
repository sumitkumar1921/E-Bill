import { useState } from 'react'
import './Signup.css'

export default function Signup() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    alert(`Thank you for registering, ${prefix} ${firstName} ${lastName}!`)
  }

  return (
    <main className="signup-page">
      <div className="page-top-right">
        Contact us
        <svg className="call-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99" />
        </svg>
        <span className="contact-number">+91-8882125306</span>
      </div>
      <div className="signup-layout">
        <aside className="signup-side">
          <div className="signup-panel">
            <p className="eyebrow">Create your account</p>
            <h1>Register for MyInvoiceBook</h1>
            <p className="signup-intro">
              Start GST billing, inventory, and faster payments with a single powerful platform built for
              Indian businesses.
            </p>
            <ul className="signup-benefits">
              <li>Easy GST invoice generation</li>
              <li>Smart inventory tracking</li>
              <li>Secure business registration</li>
              {/* <li>Trusted by over 1 Crore businesses</li> */}
            </ul>
          </div>
          <div className="signup-image">
            <div className="image-card">
              <span className="image-dot" />
              <span className="image-dot image-dot-2" />
              <div className="image-content">
                <div className="image-box" />
                <div className="image-box image-box-sm" />
              </div>
            </div>
          </div>
        </aside>

        <section className="signup-right">
          <div className="signup-card">
            <div className="signup-card-header">
              <p className="eyebrow">Complete your registration</p>
              <h2>Sign up and get started</h2>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="field-row">
                <label>
                  First name
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First name"
                    required
                  />
                </label>
                <label>
                  Last name
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last name"
                    required
                  />
                </label>
              </div>

              <label>
                Company name
                <input
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Company name"
                  required
                />
              </label>

              <div className="field-row">
                <label>
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Mobile number"
                  />
                </label>
              </div>

              <div className="field-row">
                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create password"
                    required
                  />
                </label>
                <label>
                  Confirm password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </label>
              </div>

              {error && <p className="signup-error">{error}</p>}
              <button type="submit" className="button-primary">
                Create account
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
