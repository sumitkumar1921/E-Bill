import { useState, useRef, useEffect } from 'react'
import {
  MdSearch, MdSettings, MdMonitor, MdAdd, MdMoreVert,
  MdUnfoldMore, MdKeyboardArrowDown, MdClose,
  MdBarChart, MdCalendarToday,
  MdShoppingCart, MdCheckCircle, MdPendingActions,
} from 'react-icons/md'
import './Purchases.css'

const DATE_FILTERS = ['Last 365 Days', 'This Month', 'Last Month', 'This Quarter', 'This Year']
const STATUS_OPTIONS = ['Paid', 'Unpaid']

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

function StatusBadge({ status }) {
  const map = {
    Paid:   { cls: 'pu-badge-paid',   label: 'Paid' },
    Unpaid: { cls: 'pu-badge-unpaid', label: 'Unpaid' },
  }
  const { cls, label } = map[status] || {}
  return <span className={`pu-badge ${cls}`}>{label}</span>
}

export default function Purchases() {
  const [invoices, setInvoices]         = useState([])
  const [dateFilter, setDateFilter]     = useState('Last 365 Days')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortDir, setSortDir]           = useState('asc')
  const [showDateDrop, setShowDateDrop]     = useState(false)
  const [showReportsDrop, setShowReportsDrop] = useState(false)
  const [openRowMenu, setOpenRowMenu]   = useState(null)
  const [showModal, setShowModal]       = useState(false)
  const [editInvoice, setEditInvoice]   = useState(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    partyName: '', amount: '', status: 'Unpaid', dueIn: '',
  })

  const dateRef    = useRef(null)
  const reportsRef = useRef(null)
  const rowRef     = useRef(null)

  useOutsideClick(dateRef,    () => setShowDateDrop(false))
  useOutsideClick(reportsRef, () => setShowReportsDrop(false))
  useOutsideClick(rowRef,     () => setOpenRowMenu(null))

  const paid      = invoices.filter(i => i.status === 'Paid')
  const unpaid    = invoices.filter(i => i.status === 'Unpaid')
  const totalAmt  = invoices.reduce((s, i) => s + Number(i.amount || 0), 0)
  const paidAmt   = paid.reduce((s, i)   => s + Number(i.amount || 0), 0)
  const unpaidAmt = unpaid.reduce((s, i) => s + Number(i.amount || 0), 0)
  const fmt = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`

  const displayed = invoices
    .filter(i => statusFilter === 'All' || i.status === statusFilter)
    .sort((a, b) => {
      const va = new Date(a.date), vb = new Date(b.date)
      return sortDir === 'asc' ? va - vb : vb - va
    })

  const openCreate = () => {
    setEditInvoice(null)
    setForm({ date: new Date().toISOString().slice(0, 10), partyName: '', amount: '', status: 'Unpaid', dueIn: '' })
    setShowModal(true)
  }
  const openEdit = (inv) => {
    setEditInvoice(inv)
    setForm({ date: inv.date, partyName: inv.partyName, amount: inv.amount, status: inv.status, dueIn: inv.dueIn })
    setShowModal(true)
    setOpenRowMenu(null)
  }
  const saveInvoice = () => {
    if (!form.partyName.trim()) return
    if (editInvoice) {
      setInvoices(ps => ps.map(i => i.id === editInvoice.id ? { ...i, ...form } : i))
    } else {
      const num = `PINV-${String(invoices.length + 1).padStart(4, '0')}`
      setInvoices(ps => [...ps, { id: Date.now(), invoiceNo: num, ...form }])
    }
    setShowModal(false)
  }
  const deleteInvoice = (id) => { setInvoices(ps => ps.filter(i => i.id !== id)); setOpenRowMenu(null) }
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  return (
    <div className="pu-page">

      {/* header */}
      <div className="pu-header">
        <h2 className="pu-title">Purchase Invoices</h2>
        <div className="pu-header-actions">
          <div className="pu-drop-wrap" ref={reportsRef}>
            <button className="pu-btn-outline" onClick={() => setShowReportsDrop(v => !v)}>
              <MdBarChart size={16} className="pu-reports-icon" /> Reports <MdKeyboardArrowDown size={16} />
            </button>
            {showReportsDrop && (
              <div className="pu-drop-menu pu-drop-right">
                <button className="pu-drop-item">Purchase Summary</button>
                <button className="pu-drop-item">Party-wise Purchase</button>
                <button className="pu-drop-item">Item-wise Purchase</button>
              </div>
            )}
          </div>
          <button className="pu-icon-btn pu-notif-wrap" title="Settings">
            <MdSettings size={20} />
            <span className="pu-notif-dot" />
          </button>
          <button className="pu-icon-btn" title="View"><MdMonitor size={20} /></button>
        </div>
      </div>

      {/* stats */}
      <div className="pu-stats-row">
        {[
          { key: 'All',    label: 'Total Purchases', icon: <MdShoppingCart   size={15} className="pu-icon-purple" />, value: fmt(totalAmt) },
          { key: 'Paid',   label: 'Paid',            icon: <MdCheckCircle    size={15} className="pu-icon-green"  />, value: fmt(paidAmt) },
          { key: 'Unpaid', label: 'Unpaid',          icon: <MdPendingActions size={15} className="pu-icon-red"   />, value: fmt(unpaidAmt) },
        ].map(({ key, label, icon, value }) => (
          <button
            key={key}
            className={`pu-stat-card ${statusFilter === key ? 'pu-stat-active' : ''}`}
            onClick={() => setStatusFilter(key)}
          >
            <span className="pu-stat-label">{icon} {label}</span>
            <span className="pu-stat-value">{value}</span>
          </button>
        ))}
      </div>

      {/* toolbar */}
      <div className="pu-toolbar">
        <div className="pu-toolbar-left">
          <button className="pu-icon-btn" title="Search"><MdSearch size={20} /></button>
          <div className="pu-drop-wrap" ref={dateRef}>
            <button className="pu-btn-outline" onClick={() => setShowDateDrop(v => !v)}>
              <MdCalendarToday size={14} /> {dateFilter} <MdKeyboardArrowDown size={16} />
            </button>
            {showDateDrop && (
              <div className="pu-drop-menu">
                {DATE_FILTERS.map(f => (
                  <button key={f} className="pu-drop-item" onClick={() => { setDateFilter(f); setShowDateDrop(false) }}>{f}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="pu-btn-create" onClick={openCreate}>
          <MdAdd size={18} /> Create Purchase Invoice
        </button>
      </div>

      {/* table */}
      <div className="pu-table-wrap">
        <table className="pu-table">
          <thead>
            <tr>
              <th
                className="pu-th-sort"
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              >
                Date <MdUnfoldMore size={14} />
              </th>
              <th>Purchase Invoice Number</th>
              <th>Party Name</th>
              <th>Due In</th>
              <th>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="pu-empty-td">
                  <div className="pu-empty-state">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <path d="M10 14 L14 14 L18 36 L42 36 L46 20 L18 20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <circle cx="22" cy="41" r="3" fill="#94a3b8"/>
                      <circle cx="38" cy="41" r="3" fill="#94a3b8"/>
                      <line x1="36" y1="10" x2="44" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="44" y1="10" x2="36" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p className="pu-empty-text">No Transactions Matching <span>the current filter</span></p>
                  </div>
                </td>
              </tr>
            ) : displayed.map(inv => (
              <tr key={inv.id} className="pu-row">
                <td>{fmtDate(inv.date)}</td>
                <td className="pu-inv-no">{inv.invoiceNo}</td>
                <td>{inv.partyName}</td>
                <td>{inv.dueIn || '-'}</td>
                <td className="pu-amount">{fmt(inv.amount)}</td>
                <td><StatusBadge status={inv.status} /></td>
                <td className="pu-td-action">
                  <div className="pu-row-menu-wrap" ref={openRowMenu === inv.id ? rowRef : null}>
                    <button className="pu-icon-btn" onClick={() => setOpenRowMenu(id => id === inv.id ? null : inv.id)}>
                      <MdMoreVert size={18} />
                    </button>
                    {openRowMenu === inv.id && (
                      <div className="pu-drop-menu pu-drop-right">
                        <button className="pu-drop-item" onClick={() => openEdit(inv)}>Edit</button>
                        <button className="pu-drop-item pu-drop-danger" onClick={() => deleteInvoice(inv.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {showModal && (
        <div className="pu-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="pu-modal" onClick={e => e.stopPropagation()}>
            <div className="pu-modal-header">
              <h3>{editInvoice ? 'Edit Invoice' : 'Create Purchase Invoice'}</h3>
              <button className="pu-icon-btn" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
            </div>
            <div className="pu-modal-body">
              <label className="pu-field">
                <span>Party Name *</span>
                <input placeholder="Supplier name" value={form.partyName} onChange={e => setForm(f => ({ ...f, partyName: e.target.value }))} />
              </label>
              <label className="pu-field">
                <span>Invoice Date</span>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </label>
              <label className="pu-field">
                <span>Amount (₹)</span>
                <input type="number" min="0" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </label>
              <div className="pu-field-row">
                <label className="pu-field">
                  <span>Status</span>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="pu-field">
                  <span>Due In (days)</span>
                  <input type="number" min="0" placeholder="e.g. 30" value={form.dueIn} onChange={e => setForm(f => ({ ...f, dueIn: e.target.value }))} />
                </label>
              </div>
            </div>
            <div className="pu-modal-footer">
              <button className="pu-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="pu-btn-create" onClick={saveInvoice}>{editInvoice ? 'Save Changes' : 'Create Invoice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

