import { useState, useRef, useEffect } from 'react'
import {
  MdSearch, MdSettings, MdMonitor, MdAdd, MdMoreVert,
  MdUnfoldMore, MdKeyboardArrowDown, MdClose, MdTableChart,
  MdLink, MdBarChart, MdUpload,
} from 'react-icons/md'
import './Parties.css'

const CATEGORIES = ['All', 'Customer', 'Supplier']
const PARTY_TYPES = ['Customer', 'Supplier']

const INITIAL_PARTIES = [
  { id: 1, name: 'Cash Sale', category: '-', mobile: '8882125306', type: 'Customer', balance: 0 },
]

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

export default function Parties() {
  const [parties, setParties] = useState(INITIAL_PARTIES)
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [filterType, setFilterType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCatDrop, setShowCatDrop] = useState(false)
  const [showReportsDrop, setShowReportsDrop] = useState(false)
  const [showBulkDrop, setShowBulkDrop] = useState(false)
  const [openRowMenu, setOpenRowMenu] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editParty, setEditParty] = useState(null)
  const [form, setForm] = useState({ name: '', mobile: '', type: 'Customer', category: '' })

  const catRef = useRef(null)
  const reportsRef = useRef(null)
  const bulkRef = useRef(null)
  const rowMenuRef = useRef(null)

  useOutsideClick(catRef, () => setShowCatDrop(false))
  useOutsideClick(reportsRef, () => setShowReportsDrop(false))
  useOutsideClick(bulkRef, () => setShowBulkDrop(false))
  useOutsideClick(rowMenuRef, () => setOpenRowMenu(null))

  /* ── stats ── */
  const toCollect = parties.filter(p => p.balance > 0).reduce((s, p) => s + p.balance, 0)
  const toPay     = parties.filter(p => p.balance < 0).reduce((s, p) => s + Math.abs(p.balance), 0)

  /* ── filtered + sorted list ── */
  const displayed = parties
    .filter(p => filterType === 'All' || p.type === filterType)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0
      const va = sortField === 'balance' ? a.balance : a.name.toLowerCase()
      const vb = sortField === 'balance' ? b.balance : b.name.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ?  1 : -1
      return 0
    })

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  /* ── modal helpers ── */
  const openCreate = () => {
    setEditParty(null)
    setForm({ name: '', mobile: '', type: 'Customer', category: '' })
    setShowModal(true)
  }
  const openEdit = (p) => {
    setEditParty(p)
    setForm({ name: p.name, mobile: p.mobile, type: p.type, category: p.category === '-' ? '' : p.category })
    setShowModal(true)
    setOpenRowMenu(null)
  }
  const saveParty = () => {
    if (!form.name.trim()) return
    if (editParty) {
      setParties(ps => ps.map(p => p.id === editParty.id
        ? { ...p, name: form.name, mobile: form.mobile, type: form.type, category: form.category || '-' }
        : p))
    } else {
      setParties(ps => [...ps, {
        id: Date.now(), name: form.name, mobile: form.mobile,
        type: form.type, category: form.category || '-', balance: 0,
      }])
    }
    setShowModal(false)
  }
  const deleteParty = (id) => { setParties(ps => ps.filter(p => p.id !== id)); setOpenRowMenu(null) }

  const fmt = (n) => `₹ ${Math.abs(n).toLocaleString('en-IN')}`

  return (
    <div className="pt-page">

      {/* ── header ── */}
      <div className="pt-header">
        <h2 className="pt-title">Parties</h2>
        <div className="pt-header-actions">
          <button className="pt-btn-outline pt-shared-btn">
            <MdLink size={16} /> SharedLedger Portal
          </button>

          <div className="pt-dropdown-wrap" ref={reportsRef}>
            <button className="pt-btn-outline pt-reports-btn" onClick={() => setShowReportsDrop(v => !v)}>
              <MdBarChart size={16} className="pt-reports-icon" /> Reports <MdKeyboardArrowDown size={16} />
            </button>
            {showReportsDrop && (
              <div className="pt-drop-menu">
                <button className="pt-drop-item">Party Statement</button>
                <button className="pt-drop-item">Outstanding Report</button>
                <button className="pt-drop-item">Party-wise Profit</button>
              </div>
            )}
          </div>

          <button className="pt-icon-btn" title="Settings"><MdSettings size={20} /></button>
          <button className="pt-icon-btn" title="View"><MdMonitor size={20} /></button>
        </div>
      </div>

      {/* ── stats row ── */}
      <div className="pt-stats-row">
        <button
          className={`pt-stat-card pt-stat-all ${filterType === 'All' ? 'pt-stat-active' : ''}`}
          onClick={() => setFilterType('All')}
        >
          <span className="pt-stat-label"><MdTableChart size={15} /> All Parties</span>
          <span className="pt-stat-value">{parties.length}</span>
        </button>

        <button
          className={`pt-stat-card pt-stat-collect ${filterType === 'Customer' ? 'pt-stat-active-green' : ''}`}
          onClick={() => setFilterType('Customer')}
        >
          <span className="pt-stat-label">
            <span className="pt-collect-icon">₹</span> To Collect
          </span>
          <span className="pt-stat-value">{fmt(toCollect)}</span>
        </button>

        <button
          className={`pt-stat-card pt-stat-pay ${filterType === 'Supplier' ? 'pt-stat-active-red' : ''}`}
          onClick={() => setFilterType('Supplier')}
        >
          <span className="pt-stat-label">
            <span className="pt-pay-icon">₹</span> To Pay
          </span>
          <span className="pt-stat-value">{fmt(toPay)}</span>
        </button>
      </div>

      {/* ── toolbar ── */}
      <div className="pt-toolbar">
        <div className="pt-toolbar-left">
          <button className="pt-icon-btn" title="Search"><MdSearch size={20} /></button>
          <div className="pt-dropdown-wrap" ref={catRef}>
            <button className="pt-cat-select" onClick={() => setShowCatDrop(v => !v)}>
              {filterType === 'All' ? 'Search Categories' : filterType}
              <MdKeyboardArrowDown size={16} />
            </button>
            {showCatDrop && (
              <div className="pt-drop-menu">
                {CATEGORIES.map(c => (
                  <button key={c} className="pt-drop-item" onClick={() => { setFilterType(c); setShowCatDrop(false) }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            className="pt-search-input"
            placeholder="Search parties..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="pt-toolbar-right">
          <div className="pt-dropdown-wrap" ref={bulkRef}>
            <button className="pt-btn-outline" onClick={() => setShowBulkDrop(v => !v)}>
              <MdTableChart size={15} /> Bulk Action <MdKeyboardArrowDown size={15} />
            </button>
            {showBulkDrop && (
              <div className="pt-drop-menu pt-drop-right">
                <button className="pt-drop-item">Export CSV</button>
                <button className="pt-drop-item">Delete Selected</button>
              </div>
            )}
          </div>
          <button className="pt-btn-create" onClick={openCreate}>
            <MdAdd size={18} /> Create Party
          </button>
        </div>
      </div>

      {/* ── table ── */}
      <div className="pt-table-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              <th className="pt-th-sort" onClick={() => handleSort('name')}>
                Party Name <MdUnfoldMore size={14} />
              </th>
              <th>Category</th>
              <th>Mobile Number</th>
              <th>Party type</th>
              <th className="pt-th-sort" onClick={() => handleSort('balance')}>
                Balance <MdUnfoldMore size={14} />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="pt-empty-td">No parties found.</td>
              </tr>
            ) : displayed.map(p => (
              <tr key={p.id} className="pt-row">
                <td className="pt-party-name">{p.name}</td>
                <td>{p.category}</td>
                <td>{p.mobile || '-'}</td>
                <td>{p.type}</td>
                <td className={p.balance < 0 ? 'pt-bal-red' : ''}>{fmt(p.balance)}</td>
                <td className="pt-row-action">
                  <div className="pt-row-menu-wrap" ref={openRowMenu === p.id ? rowMenuRef : null}>
                    <button className="pt-icon-btn" onClick={() => setOpenRowMenu(id => id === p.id ? null : p.id)}>
                      <MdMoreVert size={18} />
                    </button>
                    {openRowMenu === p.id && (
                      <div className="pt-drop-menu pt-drop-right">
                        <button className="pt-drop-item" onClick={() => openEdit(p)}>Edit</button>
                        <button className="pt-drop-item pt-drop-danger" onClick={() => deleteParty(p.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── bulk upload banner ── */}
      <div className="pt-banner">
        <div className="pt-banner-illo">
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
            <rect x="10" y="18" width="70" height="52" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
            <rect x="16" y="24" width="58" height="40" rx="2" fill="#eff6ff"/>
            <rect x="20" y="30" width="28" height="4" rx="2" fill="#93c5fd"/>
            <rect x="20" y="38" width="40" height="4" rx="2" fill="#bfdbfe"/>
            <rect x="20" y="46" width="32" height="4" rx="2" fill="#bfdbfe"/>
            <circle cx="88" cy="52" r="18" fill="#fde68a"/>
            <path d="M82 52 L88 44 L94 52 L90 52 L90 60 L86 60 L86 52 Z" fill="#f59e0b"/>
            <circle cx="100" cy="30" r="10" fill="#f97316"/>
            <path d="M96 30 L100 24 L104 30 L101 30 L101 36 L99 36 L99 30 Z" fill="white"/>
          </svg>
        </div>
        <div className="pt-banner-text">
          <p className="pt-banner-heading">Add Multiple Parties at once</p>
          <p className="pt-banner-sub">Bulk upload all your parties to myBillBook using excel</p>
        </div>
        <button className="pt-upload-btn">
          <MdUpload size={16} /> Upload Excel
        </button>
      </div>

      {/* ── create / edit modal ── */}
      {showModal && (
        <div className="pt-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="pt-modal" onClick={e => e.stopPropagation()}>
            <div className="pt-modal-header">
              <h3>{editParty ? 'Edit Party' : 'Create Party'}</h3>
              <button className="pt-icon-btn" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
            </div>
            <div className="pt-modal-body">
              <label className="pt-field">
                <span>Party Name *</span>
                <input placeholder="Enter party name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="pt-field">
                <span>Mobile Number</span>
                <input placeholder="Enter mobile number" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
              </label>
              <label className="pt-field">
                <span>Party Type</span>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {PARTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="pt-field">
                <span>Category</span>
                <input placeholder="Optional" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </label>
            </div>
            <div className="pt-modal-footer">
              <button className="pt-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="pt-btn-create" onClick={saveParty}>{editParty ? 'Save Changes' : 'Create Party'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

