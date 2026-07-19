import { useState, useRef, useEffect } from 'react'
import {
  MdKeyboard, MdChat, MdCalendarToday, MdSave,
  MdAddPhotoAlternate, MdMoreHoriz, MdAdd, MdSearch,
  MdKeyboardArrowDown,
} from 'react-icons/md'
import './ManageBusiness.css'

const BUSINESS_TYPES = ['Retail', 'Wholesale', 'Manufacturing', 'Services', 'Trading', 'Other']
const INDUSTRY_TYPES = ['Apparel & Fashion', 'Electronics', 'Food & Beverage', 'Healthcare', 'IT Services', 'Real Estate', 'Other']
const REG_TYPES      = ['Private Limited Company', 'Sole Proprietorship', 'Partnership', 'LLP', 'Public Limited Company', 'Other']
const STATES         = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal']

const DEFAULT_FORM = {
  businessName: 'Sumit Kumar', phone: '8882125306', email: '', address: '',
  state: '', pincode: '', city: '', gstRegistered: false, gstNumber: '',
  eInvoicing: false, panNumber: '', businessTypes: [], industryType: '',
  regType: 'Private Limited Company', website: 'www.website.com',
  enableTDS: false, enableTCS: false,
}

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled}
      className={`mb-toggle ${checked ? 'mb-toggle-on' : ''} ${disabled ? 'mb-toggle-disabled' : ''}`}
      onClick={() => !disabled && onChange(!checked)}>
      <span className="mb-toggle-thumb" />
    </button>
  )
}

export default function ManageBusiness() {
  const [savedForm, setSavedForm] = useState(DEFAULT_FORM)
  const [form, setForm]           = useState(DEFAULT_FORM)
  const [logo, setLogo]           = useState(null)
  const [signature, setSignature] = useState(null)
  const [showBizTypeDrop,  setShowBizTypeDrop]  = useState(false)
  const [showIndustryDrop, setShowIndustryDrop] = useState(false)
  const [showRegDrop,   setShowRegDrop]   = useState(false)
  const [showStateDrop, setShowStateDrop] = useState(false)
  const [stateSearch,   setStateSearch]   = useState('')

  const logoRef = useRef(null); const sigRef = useRef(null)
  const bizTypeRef = useRef(null); const industryRef = useRef(null)
  const regRef = useRef(null);  const stateRef = useRef(null)

  useOutsideClick(bizTypeRef,  () => setShowBizTypeDrop(false))
  useOutsideClick(industryRef, () => setShowIndustryDrop(false))
  useOutsideClick(regRef,      () => setShowRegDrop(false))
  useOutsideClick(stateRef,    () => { setShowStateDrop(false); setStateSearch('') })

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm)

  const set = (key, val) => setForm(f => {
    const next = { ...f, [key]: val }
    if (key === 'gstRegistered' && !val) next.eInvoicing = false
    return next
  })

  const toggleBizType = (t) => setForm(f => ({
    ...f, businessTypes: f.businessTypes.includes(t)
      ? f.businessTypes.filter(x => x !== t) : [...f.businessTypes, t],
  }))

  const handleLogoChange = (e) => { const f = e.target.files[0]; if (f) setLogo(URL.createObjectURL(f)) }
  const handleSigChange  = (e) => { const f = e.target.files[0]; if (f) setSignature(URL.createObjectURL(f)) }
  const handleSave   = () => setSavedForm(form)
  const handleCancel = () => setForm(savedForm)
  const filteredStates = STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()))

  return (
    <div className="mb-page">
      <div className="mb-header">
        <div className="mb-header-left">
          <div><h2 className="mb-title">Business Settings</h2><p className="mb-subtitle">Edit Your Company Settings And Information</p></div>
          <button className="mb-btn-new-biz">Create new business</button>
        </div>
        <div className="mb-header-actions">
          <button className="mb-icon-btn" title="Keyboard"><MdKeyboard size={20} /></button>
          <button className="mb-btn-outline mb-chat-btn"><MdChat size={15} /> Chat Support</button>
          <button className="mb-btn-outline"><MdCalendarToday size={14} /> Close Financial Year</button>
          <button className="mb-btn-outline" onClick={handleCancel} disabled={!isDirty}>Cancel</button>
          <button className={`mb-btn-save ${isDirty ? 'mb-btn-save-active' : ''}`} onClick={handleSave} disabled={!isDirty}>
            <MdSave size={14} /> Save Changes
          </button>
        </div>
      </div>

      <div className="mb-body">
        <div className="mb-col-left">
          <div className="mb-logo-name-row">
            <div className="mb-logo-upload" onClick={() => logoRef.current.click()}>
              {logo ? <img src={logo} alt="logo" className="mb-logo-preview" /> : <>
                <MdAddPhotoAlternate size={28} className="mb-logo-icon" />
                <span className="mb-logo-label">Upload Logo</span>
                <span className="mb-logo-hint">PNG/JPG, max 5 MB.</span></>}
              <input ref={logoRef} type="file" accept="image/*" hidden onChange={handleLogoChange} />
            </div>
            <label className="mb-field mb-flex1">
              <span className="mb-field-label">Business Name <span className="mb-req">*</span></span>
              <input className="mb-input" value={form.businessName} onChange={e => set('businessName', e.target.value)} />
            </label>
          </div>
          <div className="mb-row-2">
            <label className="mb-field">
              <span className="mb-field-label">Company Phone Number</span>
              <div className="mb-input-action">
                <input className="mb-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
                <button className="mb-input-action-btn"><MdMoreHoriz size={18} /></button>
              </div>
            </label>
            <label className="mb-field">
              <span className="mb-field-label">Company E-Mail</span>
              <input className="mb-input" type="email" placeholder="Enter company e-mail" value={form.email} onChange={e => set('email', e.target.value)} />
            </label>
          </div>
          <label className="mb-field">
            <span className="mb-field-label">Billing Address</span>
            <textarea className="mb-textarea" placeholder="Enter Billing Address" value={form.address} onChange={e => set('address', e.target.value)} />
          </label>
          <div className="mb-row-2">
            <div className="mb-field">
              <span className="mb-field-label">State</span>
              <div className="mb-drop-wrap" ref={stateRef}>
                <button className="mb-select-btn" onClick={() => setShowStateDrop(v => !v)}>
                  <MdSearch size={14} /><span>{form.state || 'Enter State'}</span><MdKeyboardArrowDown size={16} />
                </button>
                {showStateDrop && (
                  <div className="mb-drop-menu">
                    <input className="mb-drop-search" placeholder="Search state..." value={stateSearch} onChange={e => setStateSearch(e.target.value)} autoFocus />
                    {filteredStates.map(s => (
                      <button key={s} className="mb-drop-item" onClick={() => { set('state', s); setShowStateDrop(false); setStateSearch('') }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <label className="mb-field">
              <span className="mb-field-label">Pincode</span>
              <input className="mb-input" placeholder="Enter Pincode" value={form.pincode} onChange={e => set('pincode', e.target.value)} />
            </label>
          </div>
          <label className="mb-field">
            <span className="mb-field-label">City</span>
            <input className="mb-input" placeholder="Enter City" value={form.city} onChange={e => set('city', e.target.value)} />
          </label>
          <div className="mb-field">
            <span className="mb-field-label">Are you GST Registered?</span>
            <div className="mb-radio-row">
              <label className="mb-radio-label"><input type="radio" name="gst" checked={form.gstRegistered} onChange={() => set('gstRegistered', true)} /> Yes</label>
              <label className="mb-radio-label"><input type="radio" name="gst" checked={!form.gstRegistered} onChange={() => set('gstRegistered', false)} /> No</label>
            </div>
          </div>
          {form.gstRegistered && (
            <label className="mb-field">
              <span className="mb-field-label">GST Number <span className="mb-req">*</span></span>
              <input className="mb-input" placeholder="Enter GST Number" value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)} />
            </label>
          )}
          <div className={`mb-einvoice-row ${!form.gstRegistered ? 'mb-einvoice-disabled' : ''}`}>
            <span className="mb-einvoice-label">Enable e-Invoicing</span>
            <span className="mb-new-badge">New</span>
            <Toggle checked={form.eInvoicing} onChange={v => set('eInvoicing', v)} disabled={!form.gstRegistered} />
          </div>
          <label className="mb-field">
            <span className="mb-field-label">PAN Number</span>
            <input className="mb-input" placeholder="Enter your PAN Number" value={form.panNumber} onChange={e => set('panNumber', e.target.value)} />
          </label>
          <div className="mb-toggle-row"><span>Enable TDS</span><Toggle checked={form.enableTDS} onChange={v => set('enableTDS', v)} /></div>
          <div className="mb-toggle-row"><span>Enable TCS</span><Toggle checked={form.enableTCS} onChange={v => set('enableTCS', v)} /></div>
        </div>

        <div className="mb-col-right">
          <div className="mb-row-2">
            <div className="mb-field">
              <span className="mb-field-label">Business Type <span className="mb-hint-sm">(Select multiple, if applicable)</span></span>
              <div className="mb-drop-wrap" ref={bizTypeRef}>
                <button className="mb-select-btn" onClick={() => setShowBizTypeDrop(v => !v)}>
                  <span>{form.businessTypes.length ? form.businessTypes.join(', ') : 'Select'}</span><MdKeyboardArrowDown size={16} />
                </button>
                {showBizTypeDrop && (
                  <div className="mb-drop-menu">
                    {BUSINESS_TYPES.map(t => (
                      <label key={t} className="mb-drop-check">
                        <input type="checkbox" checked={form.businessTypes.includes(t)} onChange={() => toggleBizType(t)} />{t}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-field">
              <span className="mb-field-label">Industry Type</span>
              <div className="mb-drop-wrap" ref={industryRef}>
                <button className="mb-select-btn" onClick={() => setShowIndustryDrop(v => !v)}>
                  <MdSearch size={14} /><span>{form.industryType || 'Select Industry Type'}</span><MdKeyboardArrowDown size={16} />
                </button>
                {showIndustryDrop && (
                  <div className="mb-drop-menu">
                    {INDUSTRY_TYPES.map(t => (
                      <button key={t} className="mb-drop-item" onClick={() => { set('industryType', t); setShowIndustryDrop(false) }}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-field">
            <span className="mb-field-label">Business Registration Type</span>
            <div className="mb-drop-wrap" ref={regRef}>
              <button className="mb-select-btn" onClick={() => setShowRegDrop(v => !v)}>
                <span>{form.regType}</span><MdKeyboardArrowDown size={16} />
              </button>
              {showRegDrop && (
                <div className="mb-drop-menu">
                  {REG_TYPES.map(t => (
                    <button key={t} className="mb-drop-item" onClick={() => { set('regType', t); setShowRegDrop(false) }}>{t}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mb-note">
            <strong>Note:</strong> Terms &amp; Conditions and Signature added below will be shown on your Invoices
          </div>
          <div className="mb-field">
            <span className="mb-field-label">Signature</span>
            <div className="mb-signature-box" onClick={() => sigRef.current.click()}>
              {signature ? <img src={signature} alt="signature" className="mb-sig-preview" /> : <span className="mb-sig-placeholder">+ Add Signature</span>}
              <input ref={sigRef} type="file" accept="image/*" hidden onChange={handleSigChange} />
            </div>
          </div>
          <div className="mb-biz-details">
            <p className="mb-biz-details-title">Add Business Details</p>
            <p className="mb-biz-details-sub">Add additional business information such as MSME number, Website etc.</p>
            <div className="mb-website-row">
              <input className="mb-input mb-website-key" value="Website" readOnly />
              <span className="mb-eq">=</span>
              <input className="mb-input mb-flex1" value={form.website} onChange={e => set('website', e.target.value)} />
              <button className="mb-btn-add"><MdAdd size={16} /> Add</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-divider-section"><span className="mb-divider-label">Company Settings</span></div>
      <div className="mb-company-settings">
        <div className="mb-tally-card">
          <div className="mb-tally-logo">Tally</div>
          <div>
            <p className="mb-tally-title">Data Export to Tally <span className="mb-new-badge">New</span></p>
            <p className="mb-tally-sub">Transfer vouchers, items and parties to Tally</p>
          </div>
        </div>
      </div>

      <div className="mb-divider-section"><span className="mb-divider-label">Add New Business</span></div>
      <div className="mb-new-biz-section">
        <div className="mb-stores-illo">
          <svg width="280" height="120" viewBox="0 0 280 120" fill="none">
            <rect x="10" y="30" width="80" height="70" rx="3" fill="#f97316"/>
            <rect x="10" y="20" width="80" height="14" rx="2" fill="#ea580c"/>
            <rect x="30" y="55" width="40" height="45" rx="2" fill="#bfdbfe"/>
            <text x="38" y="48" fontSize="6" fill="#ea580c" fontWeight="bold" fontFamily="sans-serif">STORE 1</text>
            <rect x="20" y="75" width="18" height="25" rx="1" fill="#93c5fd"/>
            <rect x="42" y="75" width="18" height="25" rx="1" fill="#93c5fd"/>
            <rect x="62" y="75" width="18" height="25" rx="1" fill="#93c5fd"/>
            <text x="22" y="88" fontSize="8" fill="#dc2626" fontWeight="bold" fontFamily="sans-serif">SALE</text>
            <line x1="100" y1="65" x2="130" y2="65" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 2"/>
            <polygon points="130,61 138,65 130,69" fill="#9ca3af"/>
            <rect x="118" y="50" width="44" height="34" rx="3" fill="#1e293b"/>
            <rect x="122" y="54" width="36" height="24" rx="1" fill="#38bdf8"/>
            <rect x="148" y="56" width="14" height="24" rx="2" fill="#1e293b"/>
            <rect x="150" y="59" width="10" height="18" rx="1" fill="#38bdf8"/>
            <line x1="150" y1="65" x2="180" y2="65" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 2"/>
            <polygon points="170,61 162,65 170,69" fill="#9ca3af"/>
            <rect x="185" y="30" width="82" height="70" rx="3" fill="#92400e"/>
            <rect x="185" y="18" width="82" height="16" rx="2" fill="#f59e0b"/>
            <text x="198" y="30" fontSize="7" fill="#fff" fontWeight="bold" fontFamily="sans-serif">STORE 2</text>
            <rect x="205" y="55" width="42" height="45" rx="2" fill="#bfdbfe"/>
            <rect x="195" y="55" width="16" height="25" rx="1" fill="#7dd3fc"/>
            <rect x="245" y="55" width="16" height="25" rx="1" fill="#7dd3fc"/>
          </svg>
        </div>
        <p className="mb-new-biz-text">Easily Manage all your businesses in one place on myBillBook app</p>
        <button className="mb-btn-create-biz">Create New Business</button>
      </div>
    </div>
  )
}
