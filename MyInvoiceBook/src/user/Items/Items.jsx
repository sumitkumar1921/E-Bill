import { useState, useRef, useEffect } from 'react'
import {
  MdSearch, MdSettings, MdMonitor, MdAdd, MdMoreVert,
  MdUnfoldMore, MdKeyboardArrowDown, MdClose,
  MdBarChart, MdLocalOffer, MdQrCodeScanner,
  MdInventory2, MdTableChart, MdOpenInNew, MdInfoOutline,
} from 'react-icons/md'
import './Items.css'

const UNITS = ['PCS', 'KG', 'LTR', 'MTR', 'BOX', 'DOZEN']
const INITIAL_ITEMS = [
  { id: 1, name: 'Pant',    category: 'Clothes', code: '',  qty: 20, unit: 'PCS', sellPrice: 400, purchasePrice: null },
  { id: 2, name: 'Trouser', category: 'Clothes', code: '',  qty: 10, unit: 'PCS', sellPrice: 250, purchasePrice: null },
  { id: 3, name: 'Tshirt',  category: 'Clothes', code: '',  qty: 10, unit: 'PCS', sellPrice: 200, purchasePrice: null },
]

const LOW_STOCK_THRESHOLD = 5

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

export default function Items() {
  const [items, setItems]           = useState(INITIAL_ITEMS)
  const [selected, setSelected]     = useState([])
  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('All')
  const [showLowStock, setShowLowStock] = useState(false)
  const [sortField, setSortField]   = useState(null)
  const [sortDir, setSortDir]       = useState('asc')
  const [showCatDrop, setShowCatDrop]     = useState(false)
  const [showReportsDrop, setShowReportsDrop] = useState(false)
  const [showBulkDrop, setShowBulkDrop]   = useState(false)
  const [openRowMenu, setOpenRowMenu]     = useState(null)
  const [showModal, setShowModal]   = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const [form, setForm] = useState({ name: '', category: '', code: '', qty: '', unit: 'PCS', sellPrice: '', purchasePrice: '' })

  const catRef     = useRef(null)
  const reportsRef = useRef(null)
  const bulkRef    = useRef(null)
  const rowRef     = useRef(null)

  useOutsideClick(catRef,     () => setShowCatDrop(false))
  useOutsideClick(reportsRef, () => setShowReportsDrop(false))
  useOutsideClick(bulkRef,    () => setShowBulkDrop(false))
  useOutsideClick(rowRef,     () => setOpenRowMenu(null))

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))]
  const stockValue = items.reduce((s, i) => s + (i.qty || 0) * (i.sellPrice || 0), 0)
  const lowStockCount = items.filter(i => (i.qty || 0) <= LOW_STOCK_THRESHOLD).length

  const displayed = items
    .filter(i => filterCat === 'All' || i.category === filterCat)
    .filter(i => !showLowStock || (i.qty || 0) <= LOW_STOCK_THRESHOLD)
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0
      const va = sortField === 'qty' ? (a.qty || 0) : a.name.toLowerCase()
      const vb = sortField === 'qty' ? (b.qty || 0) : b.name.toLowerCase()
      return sortDir === 'asc' ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0)
    })

  const handleSort = (f) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('asc') }
  }

  const allChecked = displayed.length > 0 && displayed.every(i => selected.includes(i.id))
  const toggleAll  = () => setSelected(allChecked ? [] : displayed.map(i => i.id))
  const toggleOne  = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const openCreate = () => {
    setEditItem(null)
    setForm({ name: '', category: '', code: '', qty: '', unit: 'PCS', sellPrice: '', purchasePrice: '' })
    setShowModal(true)
  }
  const openEdit = (item) => {
    setEditItem(item)
    setForm({ name: item.name, category: item.category, code: item.code, qty: item.qty, unit: item.unit, sellPrice: item.sellPrice ?? '', purchasePrice: item.purchasePrice ?? '' })
    setShowModal(true)
    setOpenRowMenu(null)
  }
  const saveItem = () => {
    if (!form.name.trim()) return
    const payload = {
      name: form.name, category: form.category, code: form.code,
      qty: Number(form.qty) || 0, unit: form.unit,
      sellPrice: form.sellPrice !== '' ? Number(form.sellPrice) : null,
      purchasePrice: form.purchasePrice !== '' ? Number(form.purchasePrice) : null,
    }
    if (editItem) {
      setItems(ps => ps.map(i => i.id === editItem.id ? { ...i, ...payload } : i))
    } else {
      setItems(ps => [...ps, { id: Date.now(), ...payload }])
    }
    setShowModal(false)
  }
  const deleteItem = (id) => { setItems(ps => ps.filter(i => i.id !== id)); setOpenRowMenu(null) }
  const deleteSelected = () => { setItems(ps => ps.filter(i => !selected.includes(i.id))); setSelected([]); setShowBulkDrop(false) }

  const fmt = (n) => n != null ? `₹ ${Number(n).toLocaleString('en-IN')}` : '-'

  return (
    <div className="it-page">

      {/* header */}
      <div className="it-header">
        <h2 className="it-title">Items</h2>
        <div className="it-header-actions">
          <button className="it-btn-outline it-offer-btn">
            <MdLocalOffer size={16} /> Manage Offer
          </button>
          <div className="it-drop-wrap" ref={reportsRef}>
            <button className="it-btn-outline" onClick={() => setShowReportsDrop(v => !v)}>
              <MdBarChart size={16} className="it-reports-icon" /> Reports <MdKeyboardArrowDown size={16} />
            </button>
            {showReportsDrop && (
              <div className="it-drop-menu">
                <button className="it-drop-item">Stock Summary</button>
                <button className="it-drop-item">Item-wise Sales</button>
                <button className="it-drop-item">Low Stock Report</button>
              </div>
            )}
          </div>
          <button className="it-icon-btn" title="Settings"><MdSettings size={20} /></button>
          <button className="it-icon-btn" title="View"><MdMonitor size={20} /></button>
        </div>
      </div>

      {/* stats */}
      <div className="it-stats-row">
        <div className="it-stat-card">
          <div className="it-stat-top">
            <span className="it-stat-label"><MdUnfoldMore size={14} className="it-trend-icon" /> Stock Value <MdInfoOutline size={13} /></span>
            <button className="it-stat-link"><MdOpenInNew size={14} /></button>
          </div>
          <div className="it-stat-value">₹ {stockValue.toLocaleString('en-IN')}</div>
        </div>
        <div className="it-stat-card">
          <div className="it-stat-top">
            <span className="it-stat-label it-low-label"><MdInventory2 size={14} className="it-low-icon" /> Low Stock</span>
            <button className="it-stat-link"><MdOpenInNew size={14} /></button>
          </div>
          <div className="it-stat-value">{lowStockCount}</div>
        </div>
      </div>

      {/* toolbar */}
      <div className="it-toolbar">
        <div className="it-toolbar-left">
          <div className="it-search-box">
            <MdSearch size={17} className="it-search-icon" />
            <input
              className="it-search-input"
              placeholder="Search by Item Name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="it-barcode-btn" title="Scan barcode"><MdQrCodeScanner size={17} /></button>
          </div>

          <div className="it-drop-wrap" ref={catRef}>
            <button className="it-btn-outline" onClick={() => setShowCatDrop(v => !v)}>
              {filterCat === 'All' ? 'Search Categories' : filterCat} <MdKeyboardArrowDown size={16} />
            </button>
            {showCatDrop && (
              <div className="it-drop-menu">
                {categories.map(c => (
                  <button key={c} className="it-drop-item" onClick={() => { setFilterCat(c); setShowCatDrop(false) }}>{c}</button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`it-btn-outline it-lowstock-btn ${showLowStock ? 'it-lowstock-active' : ''}`}
            onClick={() => setShowLowStock(v => !v)}
          >
            <MdInventory2 size={15} /> Low Stock
          </button>
        </div>

        <div className="it-toolbar-right">
          <div className="it-drop-wrap" ref={bulkRef}>
            <button className="it-btn-outline" onClick={() => setShowBulkDrop(v => !v)}>
              <MdTableChart size={15} /> Bulk Actions <MdKeyboardArrowDown size={15} />
            </button>
            {showBulkDrop && (
              <div className="it-drop-menu it-drop-right">
                <button className="it-drop-item">Export CSV</button>
                <button className="it-drop-item it-drop-danger" onClick={deleteSelected} disabled={selected.length === 0}>
                  Delete Selected {selected.length > 0 ? `(${selected.length})` : ''}
                </button>
              </div>
            )}
          </div>
          <button className="it-btn-create" onClick={openCreate}>
            <MdAdd size={18} /> Create Item
          </button>
        </div>
      </div>

      {/* table */}
      <div className="it-table-wrap">
        <table className="it-table">
          <thead>
            <tr>
              <th className="it-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </th>
              <th className="it-th-sort" onClick={() => handleSort('name')}>
                Item Name <MdUnfoldMore size={14} />
              </th>
              <th>Item Code</th>
              <th className="it-th-sort" onClick={() => handleSort('qty')}>
                Stock QTY <MdUnfoldMore size={14} />
              </th>
              <th>Selling Price</th>
              <th>Purchase Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={7} className="it-empty-td">No items found.</td></tr>
            ) : displayed.map(item => (
              <tr key={item.id} className="it-row">
                <td className="it-td-check">
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleOne(item.id)} />
                </td>
                <td>
                  <div className="it-item-name">{item.name}</div>
                  {item.category && <span className="it-cat-badge">{item.category}</span>}
                </td>
                <td>{item.code || '-'}</td>
                <td>{item.qty} {item.unit}</td>
                <td>{fmt(item.sellPrice)}</td>
                <td>{fmt(item.purchasePrice)}</td>
                <td className="it-td-action">
                  <div className="it-row-menu-wrap" ref={openRowMenu === item.id ? rowRef : null}>
                    <button className="it-icon-btn" onClick={() => setOpenRowMenu(id => id === item.id ? null : item.id)}>
                      <MdMoreVert size={18} />
                    </button>
                    {openRowMenu === item.id && (
                      <div className="it-drop-menu it-drop-right">
                        <button className="it-drop-item" onClick={() => openEdit(item)}>Edit</button>
                        <button className="it-drop-item it-drop-danger" onClick={() => deleteItem(item.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* create/edit modal */}
      {showModal && (
        <div className="it-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="it-modal" onClick={e => e.stopPropagation()}>
            <div className="it-modal-header">
              <h3>{editItem ? 'Edit Item' : 'Create Item'}</h3>
              <button className="it-icon-btn" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
            </div>
            <div className="it-modal-body">
              <label className="it-field">
                <span>Item Name *</span>
                <input placeholder="e.g. Pant" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="it-field">
                <span>Category</span>
                <input placeholder="e.g. Clothes" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </label>
              <label className="it-field">
                <span>Item Code</span>
                <input placeholder="Optional" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </label>
              <div className="it-field-row">
                <label className="it-field">
                  <span>Stock QTY</span>
                  <input type="number" min="0" placeholder="0" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
                </label>
                <label className="it-field">
                  <span>Unit</span>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </label>
              </div>
              <div className="it-field-row">
                <label className="it-field">
                  <span>Selling Price (₹)</span>
                  <input type="number" min="0" placeholder="0" value={form.sellPrice} onChange={e => setForm(f => ({ ...f, sellPrice: e.target.value }))} />
                </label>
                <label className="it-field">
                  <span>Purchase Price (₹)</span>
                  <input type="number" min="0" placeholder="0" value={form.purchasePrice} onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))} />
                </label>
              </div>
            </div>
            <div className="it-modal-footer">
              <button className="it-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="it-btn-create" onClick={saveItem}>{editItem ? 'Save Changes' : 'Create Item'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

