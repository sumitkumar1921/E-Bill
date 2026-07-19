import { useState } from 'react'
import Header from '../header/Header.jsx'
import './Pricing.css'

export default function Pricing({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const isYearly = billingCycle === 'yearly'

  const plans = [
    {
      key: 'diamond',
      label: 'Diamond',
      description: 'Essential plan for small business owners',
      price: isYearly ? 291 : 349,
      currency: '₹',
      period: '/month',
      subtitle: isYearly ? 'Pay ₹4833 ₹3490/year. Billed annually' : 'Billed monthly',
      oldPrice: isYearly ? 403 : null,
      actions: [{ label: 'Sign up for free', style: 'secondary' }],
      features: [
        'Manage 1 Business',
        'Access for 1 User + 1 CA',
        'Auto sync data across unlimited devices',
        'Access on Android, iOS & Web',
      ],
      includeTitle: 'Includes',
      includeClass: 'plan-include-standard',
      extraFeatures: [
        'Custom Invoice Themes',
        'Create your Online Store',
        'Generate, print (A4 printer) & scan barcode',
        '1 Business, 1 User + 1 CA',
      ],
      note: '1 Business, 1 User + 1 CA • Custom Themes • Online Store • Print & Scan Barcodes',
    },
    {
      key: 'platinum',
      label: 'Platinum',
      description: 'More flexibility and a Desktop app',
      price: isYearly ? 333 : 399,
      currency: '₹',
      period: '/month',
      subtitle: isYearly ? 'Pay ₹7982 ₹3990/year. Billed annually' : 'Billed monthly',
      oldPrice: isYearly ? 665 : null,
      actions: [
        { label: 'Sign up for free', style: 'secondary' },
        { label: 'Talk to Sales', style: 'primary' },
      ],
      features: [
        'Manage 1 Business',
        'Access for 1 User + 1 CA',
        'Auto sync data across unlimited devices',
        'Access on Android, iOS, Web & Desktop',
      ],
      includeTitle: 'Includes Diamond, plus',
      includeClass: 'plan-include-diamond',
      extraFeatures: [
        'Desktop App',
        'SMS + Whatsapp marketing (500 messages/Year)',
        'Godowns (Unlimited)',
        'Print Barcode (Label printer)',
        'Bulk Download & Bulk Print Invoices',
      ],
      note: '1 Business, 1 User + 1 CA • Diamond features + Desktop App • Godowns • SMS & Whatsapp Marketing',
    },
    {
      key: 'enterprise',
      label: 'Enterprise',
      description: 'Fully customizable for bigger businesses',
      price: 570,
      currency: '₹',
      period: '/month',
      subtitle: isYearly ? 'Billed annually' : 'Starts at ₹1026 /month',
      oldPrice: null,
      actions: [{ label: 'Talk to Sales', style: 'primary' }],
      features: [
        'Manage 2 Businesses (Upgrade to add more)',
        'Access for 3 Users (Upgrade to add more) + 1 CA',
        'Auto sync data across unlimited devices',
        'Access on Android, iOS, Web & Desktop',
      ],
      includeTitle: 'Includes Platinum, plus',
      includeClass: 'plan-include-platinum',
      extraFeatures: [
        'E-Way Bills (Unlimited)',
        'Generate e-Invoicing',
        'Loyalty & Rewards',
        'Automate Recurring Billing',
        'POS Billing (Desktop App, Web app)',
        'Data Export to tally (on request)',
        'User Activity Tracker',
      ],
      note: '2 Businesses, 3 Users (Upgrade to add more) + 1 CA • Platinum features + E-Invoices • POS • Recurring Billing + Tally Export',
    },
  ]

  return (
    <div className="pricing-page">
      <Header onNavigate={onNavigate} />

      <section className="pricing-hero">
        <div className="pricing-copy">
          <p className="eyebrow">All plans with</p>
          <h1>7 days money back guarantee</h1>
          <p className="pricing-intro">
            Choose the right plan for your business and get full access to GST billing, inventory management,
            and reports from day one.
          </p>
          <div className="pricing-toggle">
            <button
              type="button"
              className={`toggle-button ${!isYearly ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`toggle-button ${isYearly ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={`plan-card ${plan.key === 'platinum' ? 'featured' : ''}`}
            >
              {plan.key === 'platinum' && <div className="plan-tag">Most Popular</div>}
              <div className="plan-header">
                <span className={`plan-label ${plan.key}`}>{plan.label}</span>
                <p>{plan.description}</p>
              </div>
              <div className="plan-price">
                <span>{plan.currency}{plan.price}</span>
                <small>{plan.period}</small>
              </div>
              {plan.oldPrice && (
                <p className="plan-old-price">
                  <span className="price-strike">{plan.currency}{plan.oldPrice}</span>
                </p>
              )}
              <p className="plan-subtitle">{plan.subtitle}</p>
              <div className="plan-actions">
                {plan.actions.map((action) => (
                  <button
                    key={action.label}
                    className={action.style === 'primary' ? 'button-primary' : 'button-secondary'}
                    onClick={() => action.label === 'Sign up for free' && onNavigate('signup')}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="plan-divider" />
              <div className={`plan-include ${plan.includeClass}`}>{plan.includeTitle}</div>
              <ul className="plan-extra-features">
                {plan.extraFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="plan-note">{plan.note}</p>
            </article>
          ))}
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
                <p className="value">+91 740041 7400</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <div>
                <p className="label">Email</p>
                <p className="value">support@flobiz.in</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon">📍</span>
              <div>
                <p className="label">Office Address</p>
                <p className="value">11/3, Service Rd, Popular Colony, Bengaluru, Karnataka 560068</p>
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
