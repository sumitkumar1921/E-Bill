import { useState } from 'react'
import {
  MdMonitor, MdCampaign, MdCardGiftcard, MdPersonAdd,
  MdChat, MdGridView, MdRefresh, MdArrowDownward, MdArrowUpward,
  MdAccountBalance, MdCallMade,
} from 'react-icons/md'
import './DashboardHome.css'

/* ── helpers ── */
function formatDateTime() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).toUpperCase()
  return `${dateStr} | ${timeStr}`
}

function getWeekRange() {
  const now = new Date()
  const end = new Date(now)
  const start = new Date(now)
  start.setDate(now.getDate() - 6)
  const fmt = (d) =>
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  return `${fmt(start)} to ${fmt(end)}`
}

/* ── tiny SVG bar chart ── */
function SalesBarChart({ period }) {
  const labels =
    period === 'Daily'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : period === 'Weekly'
      ? ['W1', 'W2', 'W3', 'W4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  // static zero-data (matches screenshot)
  const data = labels.map(() => 0)
  const maxVal = Math.max(...data, 1)

  const W = 600
  const H = 180
  const padL = 36
  const padR = 16
  const padT = 12
  const padB = 36
  const barW = Math.floor((W - padL - padR) / labels.length) - 6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sales-chart-svg" preserveAspectRatio="none">
      {/* y-axis lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const y = padT + (H - padT - padB) * (1 - r)
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
              {r === 0 ? '₹0' : ''}
            </text>
          </g>
        )
      })}

      {/* bars */}
      {labels.map((lbl, i) => {
        const slotW = (W - padL - padR) / labels.length
        const x = padL + i * slotW + (slotW - barW) / 2
        const barH = Math.max(((data[i] / maxVal) * (H - padT - padB)), 2)
        const y = H - padB - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#6366f1" opacity="0.8" />
            <text
              x={x + barW / 2}
              y={H - padB + 14}
              textAnchor="middle"
              fontSize="9"
              fill="#6b7280"
            >
              {lbl}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── main component ── */
export default function DashboardHome() {
  const [lastUpdate] = useState(formatDateTime)
  const [chartPeriod, setChartPeriod] = useState('Daily')

  const headerIcons = [
    { Icon: MdMonitor,     title: 'Switch Business' },
    { Icon: MdCampaign,    title: 'Announcements' },
    { Icon: MdCardGiftcard,title: 'Offers' },
    { Icon: MdPersonAdd,   title: 'Invite' },
    { Icon: MdChat,        title: 'Chat Support' },
    { Icon: MdGridView,    title: 'More' },
  ]

  return (
    <div className="dh-root">
      {/* ── top header bar ── */}
      <header className="dh-header">
        <h2 className="dh-header-title">Dashboard</h2>
        <div className="dh-header-icons">
          {headerIcons.map(({ Icon, title }) => (
            <button key={title} className="dh-icon-btn" title={title}>
              <Icon size={20} />
            </button>
          ))}
        </div>
      </header>

      <div className="dh-body">
        {/* ── Business Overview ── */}
        <section className="dh-section">
          <div className="dh-section-row">
            <h3 className="dh-section-title">Business Overview</h3>
            <span className="dh-last-update">
              Last Update:&nbsp;<strong>{lastUpdate}</strong>
              <button className="dh-refresh-btn" title="Refresh">
                <MdRefresh size={16} />
              </button>
            </span>
          </div>

          <div className="dh-overview-cards">
            {/* To Collect */}
            <div className="dh-ov-card dh-ov-collect">
              <div className="dh-ov-card-top">
                <span className="dh-ov-label">
                  <MdArrowDownward size={14} className="dh-arrow-collect" />
                  To Collect
                </span>
                <button className="dh-ov-link-btn" title="View"><MdCallMade size={15} /></button>
              </div>
              <div className="dh-ov-amount">₹ 0</div>
            </div>

            {/* To Pay */}
            <div className="dh-ov-card dh-ov-pay">
              <div className="dh-ov-card-top">
                <span className="dh-ov-label">
                  <MdArrowUpward size={14} className="dh-arrow-pay" />
                  To Pay
                </span>
                <button className="dh-ov-link-btn" title="View"><MdCallMade size={15} /></button>
              </div>
              <div className="dh-ov-amount">₹ 0</div>
            </div>

            {/* Total Cash + Bank */}
            <div className="dh-ov-card dh-ov-bank">
              <div className="dh-ov-card-top">
                <span className="dh-ov-label">
                  <MdAccountBalance size={14} />
                  &nbsp;Total Cash + Bank Balance
                </span>
                <button className="dh-ov-link-btn" title="View"><MdCallMade size={15} /></button>
              </div>
              <div className="dh-ov-amount">₹ 0</div>
            </div>
          </div>
        </section>

        {/* ── middle row: Transactions + Checklist ── */}
        <div className="dh-mid-row">
          {/* Latest Transactions */}
          <section className="dh-section dh-transactions">
            <h3 className="dh-section-title">Latest Transactions</h3>
            <table className="dh-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TYPE</th>
                  <th>TXN NO</th>
                  <th>PARTY NAME</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="dh-empty-td">
                    <div className="dh-empty-state">
                      <div className="dh-empty-icon">
                        <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
                          <rect x="6" y="6" width="38" height="48" rx="4" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="1.5"/>
                          <line x1="14" y1="20" x2="36" y2="20" stroke="#a5b4fc" strokeWidth="2"/>
                          <line x1="14" y1="28" x2="36" y2="28" stroke="#a5b4fc" strokeWidth="2"/>
                          <line x1="14" y1="36" x2="28" y2="36" stroke="#a5b4fc" strokeWidth="2"/>
                          <circle cx="30" cy="14" r="2" fill="#6366f1"/>
                          <rect x="40" y="28" width="26" height="30" rx="3" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5"/>
                          <path d="M53 36 L53 50 M47 43 L59 43" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="dh-empty-heading">No transactions made yet!</p>
                      <p className="dh-empty-sub">
                        Create your first transaction to start seeing your data
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Today's Checklist */}
          <section className="dh-section dh-checklist">
            <h3 className="dh-section-title">Today&apos;s Checklist</h3>
            <div className="dh-empty-state dh-checklist-empty">
              <div className="dh-cone-icon">
                <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
                  {/* cone base ellipse */}
                  <ellipse cx="32" cy="60" rx="22" ry="7" fill="#e5e7eb"/>
                  {/* cone body */}
                  <path d="M10 60 L32 10 L54 60 Z" fill="#f97316"/>
                  <path d="M17 47 L47 47" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M22 36 L42 36" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M27 25 L37 25" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  {/* top ball */}
                  <circle cx="32" cy="10" r="5" fill="#fbbf24"/>
                </svg>
              </div>
              <p className="dh-empty-heading">Coming Soon...</p>
              <p className="dh-empty-sub">
                Smarter daily checklist for overdue and follow-ups
              </p>
            </div>
          </section>
        </div>

        {/* ── Sales Report ── */}
        <section className="dh-section dh-sales-report">
          <div className="dh-section-row">
            <h3 className="dh-section-title">
              Sales Report &ndash; <span className="dh-date-range">{getWeekRange()}</span>
            </h3>
            <select
              className="dh-period-select"
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="dh-chart-wrap">
            <SalesBarChart period={chartPeriod} />
          </div>
        </section>
      </div>
    </div>
  )
}
