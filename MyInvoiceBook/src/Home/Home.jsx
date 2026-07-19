import Header from '../header/Header.jsx'
import './Home.css'

export default function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <Header onNavigate={onNavigate} />

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Best GST Billing Software for</p>
          <h1>Small Businesses in India</h1>
          <ul className="hero-features">
            <li>Create GST bill in <strong>8 seconds</strong></li>
            <li>Increase stock rotation by <strong>2.8x</strong> faster</li>
            <li>Collect <strong>97% payments</strong> on time</li>
          </ul>
          <div className="hero-buttons">
            <button className="button-primary" onClick={() => onNavigate('signup')}>Sign up for free</button>
            <button className="button-primary" onClick={() => onNavigate('demo')}>Book Free Demo</button>
          </div>
          <p className="trusted-copy">Trusted by 1 Crore+ Businesses</p>
        </div>

        <div className="hero-media">
          <div className="video-card">
            <div className="video-player">
              <div className="video-topbar">
                <span>myBillBook Product Tour 2026</span>
              </div>
              <div className="video-preview">
                <div className="video-play">▶</div>
                <div className="video-time">0:03 / 2:35</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-column footer-contact">
            <h2>Get in touch</h2>
            <div className="contact-item">
              <span className="icon">📞</span>
              <div>
                <p className="label">Phone/Whatsapp</p>
                <p className="value">+91 8882125306</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <div>
                <p className="label">Email</p>
                <p className="value">support@myinvoicebook.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon">📍</span>
              <div>
                <p className="label">Office Address</p>
                <p className="value">1st Floor, C96 prem nagar 3rd, kirari suleman nagar, New Delhi, Delhi 110086</p>
              </div>
            </div>
            <p className="follow-title">Follow us</p>
            <div className="social-links">
              <span>YT</span>
              <span>FB</span>
              <span>IG</span>
            </div>
            <p className="office-name">Valorem Stack Private Limited</p>
          </div>

          <div className="footer-column">
            <h2>Information</h2>
            <a href="#">About Us</a>
            <a href="#">Pricing Plans</a>
            <a href="#">Careers</a>
            <a href="#">Refund Policy</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Blog</a>
            <a href="#">Service Pages</a>
            <a href="#">HTML Sitemap</a>
          </div>

          <div className="footer-column">
            <h2>Resources</h2>
            <a href="#">Quotation Format</a>
            <a href="#">Cash Memo Format</a>
            <a href="#">Debit Note Format</a>
            <a href="#">Proforma Invoice Format</a>
            <a href="#">Hotel Bill Format</a>
            <a href="#">Mobile Shop Bill Format</a>
            <a href="#">Restaurant Bill Format</a>
            <a href="#">Medical Bill Format</a>
            <a href="#">Purchase Order Format</a>
          </div>

          <div className="footer-column">
            <h2>Software</h2>
            <a href="#">Accounting Software</a>
            <a href="#">Inventory Management Software</a>
            <a href="#">POS Billing Software</a>
            <a href="#">E-Invoicing Software</a>
            <a href="#">e-Way Bill Software</a>
            <a href="#">Restaurant Billing Software</a>
            <a href="#">Billing Software For Retail Shop</a>
            <a href="#">Medical Billing Software</a>
            <a href="#">Hotel Billing Software</a>
          </div>

          <div className="footer-column">
            <h2>GST Articles</h2>
            <a href="#">GST Invoice</a>
            <a href="#">All About GST</a>
            <a href="#">Know About HSN Code</a>
            <a href="#">Delivery Challan</a>
            <a href="#">Credit Note</a>
            <a href="#">e Invoice</a>
            <a href="#">eWay Bill</a>
            <a href="#">Close The Financial Year in myBillBook</a>
            <a href="#">Create e-invoice Using myBillBook</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
