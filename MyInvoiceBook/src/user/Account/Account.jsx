import { useState } from 'react'
import {
  MdKeyboard, MdChat, MdClose, MdSave,
  MdPeople, MdDownload, MdMoreHoriz,
} from 'react-icons/md'
import './Account.css'

const INITIAL_BILLING = [
  { id: 1, date: '15 Jul 2026', plan: 'Platinum', ref: 'MBB/26-27/103962', status: 'Success', amount: 2 },
]

export default function Account() {
  const [form, setForm] = useState({ name: '', mobile: '8882125306', email: '' })
  const [referral, setReferral]     = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [saved, setSaved]           = useState(false)
  const billing                     = INITIAL_BILLING

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const planEndDate = '22 Jul 2026'

  return (
    <div className="ac-page">

      {/* ── header ── */}
      <div className="ac-header">
        <div>
          <h2 className="ac-title">Account Settings</h2>
          <p className="ac-subtitle">Manage Your Account And Subscription</p>
        </div>
        <div className="ac-header-actions">
          <button className="ac-icon-btn" title="Keyboard shortcuts"><MdKeyboard size={20} /></button>
          <button className="ac-btn-outline ac-chat-btn">
            <MdChat size={15} /> Chat Support
          </button>
          <button className="ac-btn-outline" onClick={() => setForm({ name: '', mobile: '8882125306', email: '' })}>
            Cancel
          </button>
          <button className="ac-btn-save" onClick={handleSave}>
            <MdSave size={15} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── suggestion banner ── */}
      <div className="ac-banner">
        <span className="ac-banner-text">Help us make myBillBook better</span>
        <button className="ac-suggest-btn">
          <MdPeople size={16} /> Share Suggestion
        </button>
      </div>

      {/* ── general information ── */}
      <section className="ac-section">
        <div className="ac-section-header">General Information</div>
        <div className="ac-section-body">
          <div className="ac-fields-row">
            <label className="ac-field">
              <span className="ac-field-label">NAME <span className="ac-required">*</span></span>
              <input
                className="ac-input"
                placeholder="Enter name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="ac-field">
              <span className="ac-field-label">MOBILE NUMBER</span>
              <div className="ac-input-with-action">
                <input
                  className="ac-input"
                  value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                />
                <button className="ac-input-action-btn" title="More options">
                  <MdMoreHoriz size={18} />
                </button>
              </div>
            </label>
            <label className="ac-field">
              <span className="ac-field-label">EMAIL</span>
              <input
                className="ac-input"
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </label>
          </div>
        </div>
      </section>

      {/* ── referral code ── */}
      <section className="ac-section">
        <div className="ac-section-header">Referral code for subscription discount</div>
        <div className="ac-section-body">
          <div className="ac-referral-row">
            <input
              className="ac-input ac-referral-input"
              placeholder="Referral Code"
              value={referral}
              onChange={e => { setReferral(e.target.value); setReferralApplied(false) }}
            />
            <button
              className="ac-btn-apply"
              onClick={() => { if (referral.trim()) setReferralApplied(true) }}
            >
              {referralApplied ? '✓ Applied' : 'Apply'}
            </button>
          </div>
        </div>
      </section>

      {/* ── subscription plan ── */}
      <section className="ac-section">
        <div className="ac-section-header">Subscription Plan</div>
        <div className="ac-section-body">
          <div className="ac-plan-card">
            <div className="ac-plan-left">
              <svg width="44" height="36" viewBox="0 0 44 36" fill="none" className="ac-crown">
                <path d="M4 28 L8 12 L16 22 L22 6 L28 22 L36 12 L40 28 Z" fill="#6366f1" opacity="0.9"/>
                <rect x="4" y="28" width="36" height="5" rx="2" fill="#6366f1" opacity="0.7"/>
                <circle cx="4"  cy="12" r="3" fill="#a5b4fc"/>
                <circle cx="22" cy="6"  r="3" fill="#a5b4fc"/>
                <circle cx="40" cy="12" r="3" fill="#a5b4fc"/>
              </svg>
              <div>
                <p className="ac-plan-name">Platinum Plan</p>
              </div>
            </div>
            <div className="ac-plan-right">
              <p className="ac-plan-ends-label">Your Plan ends on:</p>
              <p className="ac-plan-ends-date">{planEndDate}</p>
              <button className="ac-btn-upgrade">Upgrade Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── billing history ── */}
      <section className="ac-section">
        <div className="ac-section-header">Billing History</div>
        <div className="ac-billing-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>PLAN</th>
                <th>REFERENCE #</th>
                <th>PAYMENT STATUS</th>
                <th>AMOUNT</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {billing.map(row => (
                <tr key={row.id} className="ac-row">
                  <td>{row.date}</td>
                  <td>{row.plan}</td>
                  <td className="ac-ref">{row.ref}</td>
                  <td>
                    <span className={`ac-status-badge ${
                      row.status === 'Success' ? 'ac-status-success' : 'ac-status-fail'
                    }`}>{row.status}</span>
                  </td>
                  <td>{row.amount}</td>
                  <td>
                    <button className="ac-download-btn">
                      <MdDownload size={16} /> Download Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

