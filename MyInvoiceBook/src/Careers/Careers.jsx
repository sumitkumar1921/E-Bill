import Header from '../header/Header.jsx'
import './Careers.css'

export default function Careers({ onNavigate }) {
  return (
    <div className="careers-page">
      <Header onNavigate={onNavigate} />

      <main className="careers-main">
        <section className="careers-hero">
          <p className="eyebrow">Careers</p>
          <h1>Build the future of billing with MyInvoiceBook</h1>
          <p className="careers-intro">
            We are creating simple, powerful tools for modern businesses. Right now, we are
            focusing on product growth and customer experience.
          </p>
          <div className="hero-buttons">
            <button className="button-primary" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </section>

        <section className="careers-card">
          <p className="eyebrow">Current Openings</p>
          <h2>There are no openings right now</h2>
          <p>
            We are not hiring at the moment. We will update this page as soon as new roles open up.
          </p>
          <ul className="careers-list">
            <li>Product and engineering innovation</li>
            <li>Customer-first support and onboarding</li>
            <li>Growth and partnerships</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
