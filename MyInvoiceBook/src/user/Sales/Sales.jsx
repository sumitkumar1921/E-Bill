import { useState, useRef, useEffect } from 'react'
import {
  MdSearch, MdSettings, MdMonitor, MdAdd, MdMoreVert,
  MdUnfoldMore, MdKeyboardArrowDown, MdClose,
  MdBarChart, MdTableChart, MdCalendarToday,
  MdReceiptLong, MdCheckCircle, MdCancel, MdPendingActions,
} from 'react-icons/md'
import './Sales.css'

const DATE_FILTERS = ['Last 365 Days', 'This Month', 'Last Month', 'This Quarter', 'This Year', 'Custom Range']
const STATUS_OPTIONS = ['Paid', 'Unpaid', 'Cancelled']

const INITIAL_INVOICES = []

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

function StatusBadge({ status }) {
  const map = {
    Paid:      { cls: 'sl-badge-paid',      label: 'Paid' },
    Unpaid:    { cls: 'sl-badge-unpaid',    label: 'Unpaid' },
    Cancelled: { cls: 'sl-badge-cancelled', label: 'Cancelled' },
  }
  const { cls, label } = map[status] || {}
  return <span className={`sl-badge ${cls}`}>{label}</span>
}

export default function Sales() {
  const [invoices, setInvoices]       = useState(INITIAL_INVOICES)
  const [dateFilter, setDateFilter]   = useState('Last 365 Days')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch]           = useState('')
  const [sortField, setSortField]     = useState(null)
  const [sortDir, setSortDir]         = useState('asc')
  const [showDateDrop, setShowDateDrop]   = useState(false)
  const [showReportsDrop, setShowReportsDrop] = useState(false)
  const [showBulkDrop, setShowBulkDrop]   = useState(false)
  const [openRowMenu, setOpenRowMenu] = useState(null)
  const [showModal, setShowModal]     = useState(false)
  const [editInvoice, setEditInvoice] = useState(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    partyName: '', amount: '', status: 'Unpaid', dueIn: '',
  })

  const dateRef    = useRef(null)
  const reportsRef = useRef(null)
  const bulkRef    = useRef(null)
  const rowRef     = useRef(null)

  useOutsideClick(dateRef,    () => setShowDateDrop(false))
  useOutsideClick(reportsRef, () => setShowReportsDrop(false))
  useOutsideClick(bulkRef,    () => setShowBulkDrop(false))
  useOutsideClick(rowRef,     () => setOpenRowMenu(null))

  /* ── stats ── */
  const paid      = invoices.filter(i => i.status === 'Paid')
  const unpaid    = invoices.filter(i => i.status === 'Unpaid')
  const cancelled = invoices.filter(i => i.status === 'Cancelled')
  const totalAmt  = invoices.reduce((s, i) => s + Number(i.amount || 0), 0)
  const paidAmt   = paid.reduce((s, i) => s + Number(i.amount || 0), 0)
  const unpaidAmt = unpaid.reduce((s, i) => s + Number(i.amount || 0), 0)
  const fmt = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`

  /* ── filtered + sorted ── */
  const displayed = invoices
    .filter(i => statusFilter === 'All' || i.status === statusFilter)
    .filter(i =>
      i.partyName.toLowerCase().includes(search.toLowerCase()) ||
      i.invoiceNo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const va = sortField === 'amount' ? Number(a.amount) : new Date(a.date)
      const vb = sortField === 'amount' ? Number(b.amount) : new Date(b.date)
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1)
    })

  const handleSort = (f) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('asc') }
  }

  /* ── modal ── */
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
      const num = `INV-${String(invoices.length + 1).padStart(4, '0')}`
      setInvoices(ps => [...ps, { id: Date.now(), invoiceNo: num, ...form }])
    }
    setShowModal(false)
  }
  const deleteInvoice = (id) => { setInvoices(ps => ps.filter(i => i.id !== id)); setOpenRowMenu(null) }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  return (
    <div className="sl-page">

      {/* header */}
      <div className="sl-header">
        <h2 className="sl-title">Sales Invoices</h2>
        <div className="sl-header-actions">
          <div className="sl-drop-wrap" ref={reportsRef}>
            <button className="sl-btn-outline" onClick={() => setShowReportsDrop(v => !v)}>
              <MdBarChart size={16} className="sl-reports-icon" /> Reports <MdKeyboardArrowDown size={16} />
            </button>
            {showReportsDrop && (
              <div className="sl-drop-menu sl-drop-right">
                <button className="sl-drop-item">Sales Summary</button>
                <button className="sl-drop-item">Party-wise Sales</button>
                <button className="sl-drop-item">Item-wise Sales</button>
              </div>
            )}
          </div>
          <button className="sl-icon-btn sl-notif-wrap" title="Settings">
            <MdSettings size={20} />
            <span className="sl-notif-dot" />
          </button>
          <button className="sl-icon-btn" title="View"><MdMonitor size={20} /></button>
        </div>
      </div>

      {/* stats */}
      <div className="sl-stats-row">
        {[
          { key: 'All',       label: 'Total Sales', icon: <MdReceiptLong size={15} className="sl-icon-purple" />, value: fmt(totalAmt) },
          { key: 'Paid',      label: 'Paid',        icon: <MdCheckCircle  size={15} className="sl-icon-green"  />, value: fmt(paidAmt) },
          { key: 'Unpaid',    label: 'Unpaid',      icon: <MdPendingActions size={15} className="sl-icon-red" />, value: fmt(unpaidAmt) },
          { key: 'Cancelled', label: 'Cancelled',   icon: <MdCancel size={15} className="sl-icon-grey"  />, value: cancelled.length === 0 ? '–' : cancelled.length },
        ].map(({ key, label, icon, value }) => (
          <button
            key={key}
            className={`sl-stat-card ${statusFilter === key ? 'sl-stat-active' : ''}`}
            onClick={() => setStatusFilter(key)}
          >
            <span className="sl-stat-label">{icon} {label}</span>
            <span className="sl-stat-value">{value}</span>
          </button>
        ))}
      </div>

      {/* toolbar */}
      <div className="sl-toolbar">
        <div className="sl-toolbar-left">
          <button className="sl-icon-btn" title="Search" onClick={() => setSearch(s => s)}>
            <MdSearch size={20} />
          </button>
          <div className="sl-drop-wrap" ref={dateRef}>
            <button className="sl-btn-outline" onClick={() => setShowDateDrop(v => !v)}>
              <MdCalendarToday size={14} /> {dateFilter} <MdKeyboardArrowDown size={16} />
            </button>
            {showDateDrop && (
              <div className="sl-drop-menu">
                {DATE_FILTERS.map(f => (
                  <button key={f} className="sl-drop-item" onClick={() => { setDateFilter(f); setShowDateDrop(false) }}>{f}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sl-toolbar-right">
          <div className="sl-drop-wrap" ref={bulkRef}>
            <button className="sl-btn-outline" onClick={() => setShowBulkDrop(v => !v)}>
              <MdTableChart size={15} /> Bulk Actions <MdKeyboardArrowDown size={15} />
            </button>
            {showBulkDrop && (
              <div className="sl-drop-menu sl-drop-right">
                <button className="sl-drop-item">Export CSV</button>
                <button className="sl-drop-item">Export PDF</button>
              </div>
            )}
          </div>
          <button className="sl-btn-create" onClick={openCreate}>
            <MdAdd size={18} /> Create Sales Invoice
          </button>
        </div>
      </div>

      {/* table */}
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th className="sl-th-sort" onClick={() => handleSort('date')}>
                Date <MdUnfoldMore size={14} />
              </th>
              <th>Invoice Number</th>
              <th>Party Name</th>
              <th>Due In</th>
              <th className="sl-th-sort" onClick={() => handleSort('amount')}>
                Amount <MdUnfoldMore size={14} />
              </th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="sl-empty-td">
                  <div className="sl-empty-state">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <rect x="8" y="10" width="34" height="40" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
                      <line x1="16" y1="22" x2="34" y2="22" stroke="#94a3b8" strokeWidth="1.5"/>
                      <line x1="16" y1="29" x2="34" y2="29" stroke="#94a3b8" strokeWidth="1.5"/>
                      <line x1="16" y1="36" x2="26" y2="36" stroke="#94a3b8" strokeWidth="1.5"/>
                      <circle cx="40" cy="16" r="10" fill="#fee2e2"/>
                      <line x1="36" y1="12" x2="44" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="44" y1="12" x2="36" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                      <text x="18" y="50" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">₹</text>
                    </svg>
                    <p className="sl-empty-text">No Transactions Matching <span>the current filter</span></p>
                  </div>
                </td>
              </tr>
            ) : displayed.map(inv => (
              <tr key={inv.id} className="sl-row">
                <td>{fmtDate(inv.date)}</td>
                <td className="sl-inv-no">{inv.invoiceNo}</td>
                <td>{inv.partyName}</td>
                <td>{inv.dueIn || '-'}</td>
                <td className="sl-amount">{fmt(inv.amount)}</td>
                <td><StatusBadge status={inv.status} /></td>
                <td className="sl-td-action">
                  <div className="sl-row-menu-wrap" ref={openRowMenu === inv.id ? rowRef : null}>
                    <button className="sl-icon-btn" onClick={() => setOpenRowMenu(id => id === inv.id ? null : inv.id)}>
                      <MdMoreVert size={18} />
                    </button>
                    {openRowMenu === inv.id && (
                      <div className="sl-drop-menu sl-drop-right">
                        <button className="sl-drop-item" onClick={() => openEdit(inv)}>Edit</button>
                        <button className="sl-drop-item sl-drop-danger" onClick={() => deleteInvoice(inv.id)}>Delete</button>
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
        <div className="sl-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="sl-modal" onClick={e => e.stopPropagation()}>
            <div className="sl-modal-header">
              <h3>{editInvoice ? 'Edit Invoice' : 'Create Sales Invoice'}</h3>
              <button className="sl-icon-btn" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
            </div>
            <div className="sl-modal-body">
              <label className="sl-field">
                <span>Party Name *</span>
                <input placeholder="e.g. Cash Sale" value={form.partyName} onChange={e => setForm(f => ({ ...f, partyName: e.target.value }))} />
              </label>
              <label className="sl-field">
                <span>Invoice Date</span>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </label>
              <label className="sl-field">
                <span>Amount (₹)</span>
                <input type="number" min="0" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </label>
              <div className="sl-field-row">
                <label className="sl-field">
                  <span>Status</span>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="sl-field">
                  <span>Due In (days)</span>
                  <input type="number" min="0" placeholder="e.g. 30" value={form.dueIn} onChange={e => setForm(f => ({ ...f, dueIn: e.target.value }))} />
                </label>
              </div>
            </div>
            <div className="sl-modal-footer">
              <button className="sl-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="sl-btn-create" onClick={saveInvoice}>{editInvoice ? 'Save Changes' : 'Create Invoice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

