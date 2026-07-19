import { useState } from 'react'
import './Invoices.css'

// ── Sample data ──────────────────────────────────────────────────────────────
const SAMPLE_PARTIES = [
  { id: 1, name: 'Rajesh Traders',    phone: '98765 43210', gstin: '24AAACR5055K1ZU', address: 'Ahmedabad', state: 'Gujarat' },
  { id: 2, name: 'Amit Enterprise',   phone: '98456 78901', gstin: '27AABCA0000A1Z2', address: 'Mumbai',    state: 'Maharashtra' },
  { id: 3, name: 'Suresh Industries', phone: '97567 89012', gstin: '29ABCDE1234F1Z5', address: 'Bengaluru', state: 'Karnataka' },
  { id: 4, name: 'Priya Shop',        phone: '96678 90123', gstin: '',                address: 'Delhi',     state: 'Delhi' },
  { id: 5, name: 'Kumar Electronics', phone: '95789 01234', gstin: '09AABCK1234A1Z8', address: 'Noida',    state: 'Uttar Pradesh' },
  { id: 6, name: 'Sumit Mehto',       phone: '79058 84731', gstin: 'UP29SM5678B1Z3', address: 'Hazratganj, Lucknow', state: 'Uttar Pradesh' },
]

const SAMPLE_ITEMS = [
  { id: 1, name: 'Laptop Stand',   hsn: '8473', price: 1200, defaultTax: '18%' },
  { id: 2, name: 'Wireless Mouse', hsn: '8471', price:  450, defaultTax: '18%' },
  { id: 3, name: 'USB Cable',      hsn: '8544', price:  180, defaultTax: '12%' },
  { id: 4, name: 'Keyboard',       hsn: '8471', price:  900, defaultTax: '18%' },
  { id: 5, name: 'HDMI Cable',     hsn: '8544', price:  350, defaultTax: '12%' },
  { id: 6, name: 'Monitor Stand',  hsn: '9403', price: 2200, defaultTax: '18%' },
  { id: 7, name: 'Speaker System', hsn: '8518', price: 3500, defaultTax: '28%' },
]

const TAX_OPTIONS = ['None', '0%', '5%', '12%', '18%', '28%']

// ── Helpers ──────────────────────────────────────────────────────────────────
const parseTax   = (t) => (!t || t === 'None' ? 0 : parseFloat(t) / 100)
const todayISO   = () => new Date().toISOString().slice(0, 10)
let _uid = 0
const uid = () => `r${++_uid}_${Date.now()}`

const itemBase   = (it) => Math.max(it.qty * it.price - (Number(it.discount) || 0), 0)
const itemTaxAmt = (it) => itemBase(it) * parseTax(it.tax)
const itemTotal  = (it) => itemBase(it) + itemTaxAmt(it)

function readSellerProfile() {
  try { return JSON.parse(localStorage.getItem('sellerProfile') || '{}') } catch { return {} }
}

// ── Number to words ──────────────────────────────────────────────────────────
function numberToWords(amount) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  function w(n) {
    if (n === 0) return ''
    if (n < 20) return ones[n] + ' '
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '') + ' '
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + w(n % 100)
    if (n < 100000) return w(Math.floor(n / 1000)) + 'Thousand ' + w(n % 1000)
    if (n < 10000000) return w(Math.floor(n / 100000)) + 'Lakh ' + w(n % 100000)
    return w(Math.floor(n / 10000000)) + 'Crore ' + w(n % 10000000)
  }
  const rupees = Math.floor(amount)
  const paise  = Math.round((amount - rupees) * 100)
  let r = w(rupees).trim() || 'Zero'
  r += ' Rupees'
  if (paise > 0) r += ' and ' + w(paise).trim() + ' Paise'
  return r + ' Only'
}

// ── PDF Preview HTML ─────────────────────────────────────────────────────────
function generatePreviewHTML({ seller, party, items, invoiceNo, invoiceDate, dueDate,
  gstEnabled, subtotal, totalTax, invDiscAmt, totalCharges, totalAmount,
  received, balance, payMode, terms, notes }) {

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const totalQty       = items.reduce((s, i) => s + i.qty, 0)
  const totalItemDiscs = items.reduce((s, i) => s + (Number(i.discount) || 0), 0)

  const rows = items.map((item, i) => {
    const tax = gstEnabled ? itemTaxAmt(item) : 0
    const igstCells = gstEnabled
      ? `<td style="text-align:center;">${item.tax === 'None' ? '0%' : item.tax}</td><td>&#x20B9;${tax.toFixed(2)}</td>`
      : ''
    return `<tr>
      <td style="text-align:center;">${i + 1}</td>
      <td><strong>${item.name || '&mdash;'}</strong>${item.hsn ? `<br><span class="sm">HSN: ${item.hsn}</span>` : ''}</td>
      <td>${item.hsn || '&mdash;'}</td>
      <td style="text-align:center;">${item.qty}</td>
      <td>&#x20B9;${item.price.toFixed(2)}</td>
      <td>&#x20B9;${(Number(item.discount) || 0).toFixed(2)}</td>
      ${igstCells}
      <td style="font-weight:600;">&#x20B9;${(gstEnabled ? itemTotal(item) : itemBase(item)).toFixed(2)}</td>
    </tr>`
  }).join('')

  const igstHeaderCols = gstEnabled
    ? `<th colspan="2" style="text-align:center;border-left:1.5px solid #1a202c;">IGST</th>` : ''
  const igstFooterCols = gstEnabled
    ? `<td></td><td style="font-weight:700;">&#x20B9;${totalTax.toFixed(2)}</td>` : ''

  const paymentBlock = received > 0 ? `
    <div style="margin-top:12px;padding-top:10px;border-top:1px solid #e2e8f0;">
      <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#718096;margin-bottom:5px;">Payment</div>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="font-size:12px;padding:3px 0;">Received (${payMode})</td>
            <td style="text-align:right;font-size:12px;font-weight:600;">&#x20B9;${received.toFixed(2)}</td></tr>
        <tr style="color:${balance > 0 ? '#e53e3e' : '#38a169'}">
          <td style="font-size:12px;padding:3px 0;">${balance > 0 ? 'Balance Due' : 'Change Return'}</td>
          <td style="text-align:right;font-size:12px;font-weight:700;">&#x20B9;${Math.abs(balance).toFixed(2)}</td>
        </tr>
      </table>
    </div>` : ''

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"/>
<title>Tax Invoice - ${invoiceNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:13px;color:#1a202c;background:#fff;padding:28px 36px}
  .no-print{margin-bottom:16px;text-align:right}
  .print-btn{background:#6366f1;color:#fff;border:none;border-radius:8px;padding:9px 22px;font-size:14px;font-weight:700;cursor:pointer;margin-right:8px}
  .pdf-btn{background:#f97316;color:#fff;border:none;border-radius:8px;padding:9px 22px;font-size:14px;font-weight:700;cursor:pointer}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #6366f1;margin-bottom:16px}
  .company-name{font-size:26px;font-weight:800;color:#1a202c;margin-bottom:3px}
  .company-sub{font-size:12px;color:#718096;margin-top:3px}
  .inv-meta{text-align:right;min-width:160px}
  .inv-meta .badge{display:inline-block;background:#6366f1;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;letter-spacing:.05em;margin-bottom:8px}
  .inv-meta table{margin-left:auto;border-collapse:collapse}
  .inv-meta td{padding:2px 6px;font-size:12px}
  .inv-meta td:first-child{color:#718096}
  .inv-meta td:last-child{font-weight:700}
  .billing-row{display:flex;gap:16px;margin-bottom:16px}
  .billing-box{flex:1;background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px}
  .billing-box .blabel{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#6366f1;margin-bottom:5px}
  .billing-box h3{font-size:14px;margin-bottom:2px}
  .billing-box p{color:#4a5568;font-size:12px;margin-top:2px}
  .items-table{width:100%;border-collapse:collapse;border:2px solid #1a202c}
  .items-table th{padding:8px 10px;font-size:12px;font-weight:700;text-align:left;border:1.5px solid #1a202c;background:#f7fafc}
  .items-table td{padding:8px 10px;font-size:12.5px;border:1px solid #1a202c}
  .items-table tfoot td{font-weight:700;border:1.5px solid #1a202c;background:#f7fafc}
  .sm{font-size:11px;color:#4a5568}
  .bottom-split{display:flex;gap:0;margin-top:14px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
  .split-left{flex:0 0 55%;padding:16px;border-right:1px solid #e2e8f0}
  .split-right{flex:1;padding:16px;background:#fafafa}
  .words-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#718096;margin-bottom:4px}
  .words-value{font-size:13px;font-weight:600;color:#1a202c;margin-bottom:14px;line-height:1.5}
  .terms-block{margin-top:10px;padding:8px 10px;background:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-size:11.5px;color:#4a5568}
  .terms-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#718096;margin-bottom:4px}
  .notes-block{padding:8px 10px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;font-size:11.5px;color:#4a5568;margin-bottom:8px}
  .summary-lbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#718096;margin-bottom:8px}
  .summary-tbl{width:100%;border-collapse:collapse}
  .summary-tbl td{padding:5px 6px;font-size:13px}
  .summary-tbl td:last-child{text-align:right;font-weight:600}
  .summary-tbl tr.total-row td{font-size:15px;font-weight:800;border-top:2px solid #6366f1;padding-top:8px;color:#6366f1}
  .certification{margin-top:14px;padding:10px 14px;background:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;color:#4a5568;font-style:italic}
  .sig-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0}
  .sig-box{text-align:center}
  .sig-line{height:52px;border-bottom:1.5px solid #aaa;width:160px;margin:0 auto 4px}
  .sig-role{font-size:10px;color:#718096}
  @media print{.no-print{display:none!important}body{padding:14px}}
</style>
</head><body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">&#x1F5A8; Print</button>
    <button class="pdf-btn" onclick="window.print()">&#128190; Save as PDF</button>
  </div>
  <div class="inv-header">
    <div>
      <div class="company-name">${seller.companyName || 'Company Name'}</div>
      ${seller.description ? `<div class="company-sub">${seller.description}</div>` : ''}
      <div class="company-sub">
        ${seller.phone ? `&#128222; ${seller.phone}` : ''}
        ${seller.phone && seller.email ? ' &bull; ' : ''}
        ${seller.email ? `&#9993; ${seller.email}` : ''}
        ${(seller.phone || seller.email) && seller.address ? ' &bull; ' : ''}
        ${seller.address ? seller.address + (seller.state ? ', ' + seller.state : '') : ''}
      </div>
      ${gstEnabled && seller.gstin ? `<div class="company-sub"><strong>GSTIN:</strong> ${seller.gstin}</div>` : ''}
    </div>
    <div class="inv-meta">
      <div class="badge">TAX INVOICE</div>
      <table>
        <tr><td>Invoice No.</td><td>${invoiceNo}</td></tr>
        <tr><td>Date</td><td>${fmtDate(invoiceDate)}</td></tr>
        ${dueDate ? `<tr><td>Due Date</td><td>${fmtDate(dueDate)}</td></tr>` : ''}
      </table>
    </div>
  </div>
  <div class="billing-row">
    <div class="billing-box">
      <div class="blabel">Bill From</div>
      <h3>${seller.companyName || '&mdash;'}</h3>
      ${seller.phone ? `<p>&#128222; ${seller.phone}</p>` : ''}
      ${seller.address ? `<p>${seller.address}${seller.state ? ', ' + seller.state : ''}</p>` : ''}
      ${gstEnabled && seller.gstin ? `<p><strong>GSTIN:</strong> ${seller.gstin}</p>` : ''}
    </div>
    <div class="billing-box">
      <div class="blabel">Bill To</div>
      <h3>${party ? party.name : '&mdash;'}</h3>
      ${party && party.phone ? `<p>&#128222; ${party.phone}</p>` : ''}
      ${party && party.address ? `<p>${party.address}${party.state ? ', ' + party.state : ''}</p>` : ''}
      ${gstEnabled && party && party.gstin ? `<p><strong>GSTIN:</strong> ${party.gstin}</p>` : ''}
    </div>
  </div>
  <table class="items-table">
    <thead>
      <tr>
        <th style="width:36px;text-align:center;">#</th>
        <th>Item / Service</th>
        <th>HSN</th>
        <th style="text-align:center;">Qty</th>
        <th>Rate (&#x20B9;)</th>
        <th>Disc (&#x20B9;)</th>
        ${igstHeaderCols}
        <th>Amount (&#x20B9;)</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td></td>
        <td style="font-weight:700;">Total</td>
        <td></td>
        <td style="text-align:center;">${totalQty}</td>
        <td></td>
        <td>&#x20B9;${totalItemDiscs.toFixed(2)}</td>
        ${igstFooterCols}
        <td>&#x20B9;${totalAmount.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>
  <div class="bottom-split">
    <div class="split-left">
      <div class="words-label">Amount in Words</div>
      <div class="words-value">${numberToWords(totalAmount)}</div>
      ${notes ? `<div class="notes-block"><div class="terms-label">Notes</div>${notes.replace(/\n/g, '<br>')}</div>` : ''}
      ${terms ? `<div class="terms-block"><div class="terms-label">Terms &amp; Conditions</div>${terms.replace(/\n/g, '<br>')}</div>` : ''}
    </div>
    <div class="split-right">
      <div class="summary-lbl">Invoice Summary</div>
      <table class="summary-tbl">
        <tr><td>Sub Total</td><td>&#x20B9;${subtotal.toFixed(2)}</td></tr>
        ${gstEnabled ? `<tr><td>Tax</td><td>&#x20B9;${totalTax.toFixed(2)}</td></tr>` : ''}
        ${totalCharges > 0 ? `<tr><td>Additional Charges</td><td>&#x20B9;${totalCharges.toFixed(2)}</td></tr>` : ''}
        ${invDiscAmt > 0 ? `<tr style="color:#e53e3e"><td>Discount</td><td>&minus;&#x20B9;${invDiscAmt.toFixed(2)}</td></tr>` : ''}
        <tr class="total-row"><td>Total Amount</td><td>&#x20B9;${totalAmount.toFixed(2)}</td></tr>
      </table>
      ${paymentBlock}
    </div>
  </div>
  <div class="certification">I / We hereby certify that the particulars given above are true and correct to the best of my / our knowledge and belief.</div>
  <div class="sig-row">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-role">Customer Signature</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-role">Authorized Signatory &mdash; ${seller.companyName || ''}</div></div>
  </div>
</body></html>`
}

// ── Single Invoice Form (one tab) ─────────────────────────────────────────────
function InvoiceTabForm({ invoiceNoDefault }) {
  const seller = readSellerProfile()

  // Customer (Bill To)
  const [custName, setCustName]             = useState('')
  const [custPhone, setCustPhone]           = useState('')
  const [custEmail, setCustEmail]           = useState('')
  const [custAddress, setCustAddress]       = useState('')
  const [custGstin, setCustGstin]           = useState('')

  // Customer search modal
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchPhone, setSearchPhone]       = useState('')
  const [searchResult, setSearchResult]     = useState(null)
  const [searchTried, setSearchTried]       = useState(false)

  // Invoice meta
  const [invoiceNo, setInvoiceNo]           = useState(invoiceNoDefault)
  const [invoiceDate, setInvoiceDate]       = useState(todayISO())
  const [dueDate, setDueDate]               = useState('')
  const [showDueDate, setShowDueDate]       = useState(false)

  // Items
  const [items, setItems]                   = useState([])
  const [itemDropIdx, setItemDropIdx]       = useState(null)
  const [itemSearch, setItemSearch]         = useState('')

  // Notes & Terms
  const [notes, setNotes]                   = useState('')
  const [showNotes, setShowNotes]           = useState(false)
  const [terms, setTerms]                   = useState(
    '1. Goods once sold will not be taken back or exchanged\n2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only'
  )
  const [showTerms, setShowTerms]           = useState(true)

  // Additional charges
  const [charges, setCharges]               = useState([])
  const [showCharges, setShowCharges]       = useState(false)

  // Invoice-level discount
  const [invDiscount, setInvDiscount]       = useState('')
  const [showInvDiscount, setShowInvDiscount] = useState(false)

  // Round off
  const [autoRoundOff, setAutoRoundOff]     = useState(false)

  // Payment
  const [amtReceived, setAmtReceived]       = useState('')
  const [payMode, setPayMode]               = useState('Cash')
  const [markPaid, setMarkPaid]             = useState(false)

  // Signature
  const [signatureEnabled, setSignatureEnabled] = useState(false)

  // Bank account
  const [showBankForm, setShowBankForm]         = useState(false)
  const [bankHolder, setBankHolder]             = useState('')
  const [bankAccount, setBankAccount]           = useState('')
  const [bankIfsc, setBankIfsc]                 = useState('')
  const [bankBranch, setBankBranch]             = useState('')

  // UPI / Payment QR
  const [showUpiForm, setShowUpiForm]           = useState(false)
  const [upiId, setUpiId]                       = useState('')

  // GST
  const [gstEnabled, setGstEnabled]         = useState(true)

  // ── Computed ───────────────────────────────────────────────────────────────
  const subtotal       = items.reduce((s, it) => s + itemBase(it), 0)
  const totalItemDiscs = items.reduce((s, it) => s + (Number(it.discount) || 0), 0)
  const totalTax       = gstEnabled ? items.reduce((s, it) => s + itemTaxAmt(it), 0) : 0
  const totalCharges   = charges.reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const invDiscAmt     = showInvDiscount ? (Number(invDiscount) || 0) : 0
  const preRound       = subtotal + totalTax - invDiscAmt + totalCharges
  const roundOff       = autoRoundOff ? (Math.round(preRound) - preRound) : 0
  const totalAmount    = preRound + roundOff
  const received       = markPaid ? totalAmount : (Number(amtReceived) || 0)
  const balance        = totalAmount - received

  // ── Item helpers ──────────────────────────────────────────────────────────
  const addItem = () =>
    setItems(prev => [...prev, { _k: uid(), name: '', hsn: '', qty: 1, price: 0, discount: '', tax: 'None' }])

  const updateItem = (idx, field, val) =>
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, [field]: val } : it)))

  const selectCatalogItem = (idx, s) =>
    setItems(prev => prev.map((it, i) =>
      i === idx ? { ...it, name: s.name, hsn: s.hsn, price: s.price, tax: gstEnabled ? s.defaultTax : 'None' } : it
    ))

  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

  const filteredCatalog = SAMPLE_ITEMS.filter(s =>
    s.name.toLowerCase().includes(itemSearch.toLowerCase()) || s.hsn.includes(itemSearch)
  )

  // ── Customer search ────────────────────────────────────────────────────────
  const handleSearchCustomer = () => {
    const q = searchPhone.replace(/\s/g, '')
    const found = SAMPLE_PARTIES.find(p => p.phone.replace(/\s/g, '') === q)
    setSearchResult(found || null)
    setSearchTried(true)
  }

  const applySearchResult = (p) => {
    setCustName(p.name); setCustPhone(p.phone)
    setCustEmail(p.email || ''); setCustAddress(p.address || '')
    setCustGstin(p.gstin || '')
    setShowSearchModal(false); setSearchPhone(''); setSearchResult(null); setSearchTried(false)
  }

  // ── PDF Preview ───────────────────────────────────────────────────────────
  const handlePreview = () => {
    const party = { name: custName, phone: custPhone, email: custEmail, address: custAddress, gstin: custGstin }
    const html = generatePreviewHTML({
      seller, party, items, invoiceNo, invoiceDate, dueDate,
      gstEnabled, subtotal, totalTax, invDiscAmt, totalCharges,
      totalAmount, received, balance, payMode, terms, notes,
    })
    const win = window.open('', '_blank')
    if (win) { win.document.write(html); win.document.close() }
  }

  const handleSave = () => alert('Invoice saved successfully!')

  const resetForm = () => {
    setCustName(''); setCustPhone(''); setCustEmail(''); setCustAddress(''); setCustGstin('')
    setInvoiceNo(invoiceNoDefault)
    setInvoiceDate(todayISO()); setDueDate(''); setShowDueDate(false)
    setItems([])
    setNotes(''); setShowNotes(false)
    setCharges([]); setShowCharges(false)
    setInvDiscount(''); setShowInvDiscount(false)
    setAutoRoundOff(false)
    setAmtReceived(''); setMarkPaid(false)
    setSignatureEnabled(false)
    setShowBankForm(false); setBankHolder(''); setBankAccount(''); setBankIfsc(''); setBankBranch('')
    setShowUpiForm(false); setUpiId('')
  }

  const handleSaveAndNew = () => { handleSave(); resetForm() }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="inv-tab-form">

      {/* ── Sub-bar (per-tab controls) ── */}
      <div className="inv-sub-bar">
        <div className="inv-sub-bar-left">
          <label className="inv-gst-toggle" title="Toggle GST">
            <input type="checkbox" checked={gstEnabled} onChange={e => setGstEnabled(e.target.checked)} />
            <span className="inv-toggle-track" />
            <span className="inv-toggle-lbl">GST</span>
          </label>
          <button className="inv-icon-btn" title="Keyboard Shortcuts">&#9000;</button>
          <button className="inv-settings-btn">
            &#9881; Settings <span className="inv-red-dot" />
          </button>
        </div>
        <div className="inv-sub-bar-right">
          <button className="inv-btn-reset" onClick={resetForm} title="Clear all fields">&#8635; Reset</button>
          <button className="inv-btn-outline" onClick={handlePreview}>Preview PDF</button>
          <button className="inv-btn-outline" onClick={handleSaveAndNew}>Save &amp; New</button>
          <button className="inv-btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="inv-body">

        {/* ══ LEFT COLUMN ══ */}
        <div className="inv-left">

          {/* Bill To */}
          <div className="inv-bill-to-section">
            <div className="inv-bill-to-hd">
              <div className="inv-section-label">Bill To</div>
              <button
                className="inv-search-cust-btn"
                type="button"
                onClick={() => { setShowSearchModal(true); setSearchPhone(''); setSearchResult(null); setSearchTried(false) }}
              >
                &#128269; Search Customer
              </button>
            </div>
            <div className="inv-cust-grid">
              <div className="inv-cust-field inv-cust-full">
                <label className="inv-cust-label">Full Name</label>
                <input
                  className="inv-cust-input"
                  placeholder="Customer full name"
                  value={custName}
                  onChange={e => setCustName(e.target.value)}
                />
              </div>
              <div className="inv-cust-field">
                <label className="inv-cust-label">Mobile Number</label>
                <input
                  className="inv-cust-input"
                  placeholder="e.g. 98765 43210"
                  value={custPhone}
                  onChange={e => setCustPhone(e.target.value)}
                  maxLength={15}
                />
              </div>
              <div className="inv-cust-field">
                <label className="inv-cust-label">Email ID</label>
                <input
                  className="inv-cust-input"
                  type="email"
                  placeholder="customer@email.com"
                  value={custEmail}
                  onChange={e => setCustEmail(e.target.value)}
                />
              </div>
              <div className="inv-cust-field inv-cust-full">
                <label className="inv-cust-label">Address</label>
                <input
                  className="inv-cust-input"
                  placeholder="Street, City, State, PIN"
                  value={custAddress}
                  onChange={e => setCustAddress(e.target.value)}
                />
              </div>
              {gstEnabled && (
                <div className="inv-cust-field">
                  <label className="inv-cust-label">GST Number</label>
                  <input
                    className="inv-cust-input"
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    value={custGstin}
                    onChange={e => setCustGstin(e.target.value.toUpperCase())}
                    maxLength={15}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th className="th-no">NO</th>
                  <th className="th-name">ITEMS / SERVICES</th>
                  <th className="th-hsn">HSN / SAC</th>
                  <th className="th-qty">QTY</th>
                  <th className="th-price">PRICE/ITEM (&#8377;)</th>
                  <th className="th-disc">DISCOUNT</th>
                  <th className="th-tax">TAX</th>
                  <th className="th-amount">AMOUNT (&#8377;)</th>
                  <th className="th-del">
                    <button className="inv-add-items-hdr-btn" onClick={addItem}>+ Add Items</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item._k} className="inv-item-row">
                    <td className="td-no">{idx + 1}</td>
                    <td className="td-name">
                      <div className="inv-name-wrap">
                        <input
                          className="inv-cell-input"
                          value={item.name}
                          placeholder="Search or type item..."
                          onChange={e => {
                            updateItem(idx, 'name', e.target.value)
                            setItemDropIdx(idx)
                            setItemSearch(e.target.value)
                          }}
                          onFocus={() => { setItemDropIdx(idx); setItemSearch(item.name || '') }}
                          onBlur={() => setTimeout(() => setItemDropIdx(null), 160)}
                        />
                        {itemDropIdx === idx && filteredCatalog.length > 0 && (
                          <div className="inv-item-drop">
                            {filteredCatalog.map(s => (
                              <div key={s.id} className="inv-item-opt"
                                onMouseDown={() => { selectCatalogItem(idx, s); setItemDropIdx(null) }}>
                                <span className="inv-item-opt-name">{s.name}</span>
                                <span className="inv-item-opt-meta">HSN {s.hsn} &middot; &#8377;{s.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <input className="inv-cell-input" value={item.hsn} placeholder="HSN"
                        onChange={e => updateItem(idx, 'hsn', e.target.value)} />
                    </td>
                    <td>
                      <input className="inv-cell-input inv-num" type="number" min="0.01" step="any"
                        value={item.qty}
                        onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value) || 1)} />
                    </td>
                    <td>
                      <input className="inv-cell-input inv-num" type="number" min="0" step="any"
                        value={item.price}
                        onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)} />
                    </td>
                    <td>
                      <input className="inv-cell-input inv-num" type="number" min="0" step="any"
                        value={item.discount} placeholder="0"
                        onChange={e => updateItem(idx, 'discount', e.target.value)} />
                    </td>
                    <td>
                      <select className="inv-cell-select" value={item.tax}
                        onChange={e => updateItem(idx, 'tax', e.target.value)}>
                        {TAX_OPTIONS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="td-amount">
                      &#8377;{(gstEnabled ? itemTotal(item) : itemBase(item)).toFixed(2)}
                    </td>
                    <td className="td-del">
                      <button className="inv-del-row-btn" onClick={() => removeItem(idx)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="inv-addrow">
                  <td colSpan={9}>
                    <button className="inv-add-item-btn" onClick={addItem}>+ Add Item</button>
                  </td>
                </tr>
                {items.length > 0 && (
                  <tr className="inv-subtotal-row">
                    <td colSpan={4} className="subtotal-label">SUBTOTAL</td>
                    <td />
                    <td className="subtotal-val">&#8377;{totalItemDiscs.toFixed(2)}</td>
                    <td className="subtotal-val">&#8377;{totalTax.toFixed(2)}</td>
                    <td className="subtotal-val subtotal-bold">&#8377;{(subtotal + totalTax).toFixed(2)}</td>
                    <td />
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Notes & Terms */}
          <div className="inv-bottom-left">
            {!showNotes
              ? <button className="inv-link-btn" onClick={() => setShowNotes(true)}>+ Add Notes</button>
              : (
                <div className="inv-text-block">
                  <div className="inv-text-block-hd">
                    Notes
                    <button className="inv-close-sec" onClick={() => setShowNotes(false)}>&#8855;</button>
                  </div>
                  <textarea className="inv-textarea" rows={3} value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Notes visible to customer..." />
                </div>
              )}
            {showTerms
              ? (
                <div className="inv-text-block">
                  <div className="inv-text-block-hd">
                    Terms and Conditions
                    <button className="inv-close-sec" onClick={() => setShowTerms(false)}>&#8855;</button>
                  </div>
                  <textarea className="inv-textarea" rows={3} value={terms}
                    onChange={e => setTerms(e.target.value)} />
                </div>
              )
              : <button className="inv-link-btn" onClick={() => setShowTerms(true)}>+ Add Terms and Conditions</button>
            }
            <div className="inv-extra-two-col">

              {/* Left: Add New Account */}
              <div className="inv-extra-col">
                <button className="inv-link-btn" onClick={() => setShowBankForm(v => !v)}>
                  + Add Bank Account Details
                </button>
                {showBankForm && (
                  <div className="inv-bank-form">
                    <div className="inv-bank-field">
                      <label className="inv-bank-label">Account Holder Name</label>
                      <input className="inv-bank-input" placeholder="e.g. Rajesh Kumar" value={bankHolder} onChange={e => setBankHolder(e.target.value)} />
                    </div>
                    <div className="inv-bank-field">
                      <label className="inv-bank-label">Account Number</label>
                      <input className="inv-bank-input" placeholder="e.g. 0123456789" value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
                    </div>
                    <div className="inv-bank-field">
                      <label className="inv-bank-label">IFSC Code</label>
                      <input className="inv-bank-input" placeholder="e.g. SBIN0001234" value={bankIfsc} onChange={e => setBankIfsc(e.target.value.toUpperCase())} maxLength={11} />
                    </div>
                    <div className="inv-bank-field">
                      <label className="inv-bank-label">Branch Name</label>
                      <input className="inv-bank-input" placeholder="e.g. Ahmedabad Main" value={bankBranch} onChange={e => setBankBranch(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Add Payment QR */}
              <div className="inv-extra-col">
                <button className="inv-link-btn" onClick={() => setShowUpiForm(v => !v)}>
                  + Add Payment QR
                </button>
                {showUpiForm && (
                  <div className="inv-upi-form">
                    <div className="inv-bank-field">
                      <label className="inv-bank-label">UPI ID</label>
                      <input className="inv-bank-input" placeholder="e.g. yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                    </div>
                    {upiId && (
                      <div className="inv-qr-preview">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent('upi://pay?pa=' + upiId)}&size=110x110&bgcolor=ffffff`}
                          alt="UPI QR"
                          className="inv-qr-img"
                        />
                        <span className="inv-qr-label">Scan to pay via UPI</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="inv-right">

          {/* Invoice Meta */}
          <div className="inv-meta-card">
            <div className="inv-meta-field">
              <span className="inv-meta-lbl">Sales Invoice No:</span>
              <input className="inv-meta-input" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
            </div>
            <div className="inv-meta-field">
              <span className="inv-meta-lbl">Sales Invoice Date:</span>
              <div className="inv-date-wrap">
                <span className="inv-cal-icon">&#128197;</span>
                <input className="inv-date-input" type="date" value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)} />
              </div>
            </div>
            {!showDueDate
              ? <button className="inv-add-due-btn" onClick={() => setShowDueDate(true)}>+ Add Due Date</button>
              : (
                <div className="inv-meta-field">
                  <span className="inv-meta-lbl">Due Date:</span>
                  <input className="inv-date-input" type="date" value={dueDate}
                    onChange={e => setDueDate(e.target.value)} />
                </div>
              )}
          </div>

          {/* Summary */}
          <div className="inv-summary-card">

            {/* Additional Charges */}
            <div className="inv-sum-row">
              <button className="inv-link-btn" onClick={() => setShowCharges(v => !v)}>+ Add Additional Charges</button>
              <span>&#8377;{totalCharges.toFixed(2)}</span>
            </div>
            {showCharges && (
              <div className="inv-charges-list">
                {charges.map((c, i) => (
                  <div key={i} className="inv-charge-row">
                    <input className="inv-charge-lbl-inp" value={c.name} placeholder="Charge name"
                      onChange={e => setCharges(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <input className="inv-charge-amt-inp" type="number" min="0" value={c.amount} placeholder="0"
                      onChange={e => setCharges(prev => prev.map((x, j) => j === i ? { ...x, amount: e.target.value } : x))} />
                    <button className="inv-del-btn" onClick={() => setCharges(prev => prev.filter((_, j) => j !== i))}>&times;</button>
                  </div>
                ))}
                <button className="inv-link-btn inv-link-sm"
                  onClick={() => setCharges(prev => [...prev, { name: '', amount: '' }])}>+ Add Charge</button>
              </div>
            )}

            {/* Amount */}
            <div className="inv-sum-row">
              <span className="inv-sum-lbl">Amount</span>
              <span>&#8377;{subtotal.toFixed(2)}</span>
            </div>

            {/* GST */}
            {gstEnabled && (
              <div className="inv-sum-row">
                <span className="inv-sum-lbl">GST</span>
                <span className="inv-gst-amt">&#8377;{totalTax.toFixed(2)}</span>
              </div>
            )}

            {/* Invoice Discount */}
            <div className="inv-sum-row">
              <button className="inv-link-btn" onClick={() => setShowInvDiscount(v => !v)}>+ Add Discount</button>
              <span className="inv-disc-amt">- &#8377;{invDiscAmt.toFixed(2)}</span>
            </div>
            {showInvDiscount && (
              <input className="inv-full-input" type="number" min="0" step="any"
                value={invDiscount} placeholder="Discount amount (&#8377;)"
                onChange={e => setInvDiscount(e.target.value)} />
            )}

            {/* Round Off */}
            <div className="inv-sum-row inv-roundoff-row">
              <label className="inv-check-lbl">
                <input type="checkbox" className="inv-checkbox inv-checkbox-light" checked={autoRoundOff}
                  onChange={e => setAutoRoundOff(e.target.checked)} />
                Round Off
              </label>
              <span className="inv-roundoff-right">
                &nbsp;&#8377;&nbsp;{roundOff.toFixed(2)}
              </span>
            </div>

            <div className="inv-divider" />

            {/* Total Amount */}
            <div className="inv-total-row">
              <span className="inv-total-lbl">Total Amount</span>
              <div className="inv-total-val-wrap">
                <span className="inv-total-currency">&#8377;</span>
                <span className="inv-total-value">{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="inv-divider" />

            {/* Amount Received */}
            <div className="inv-received-section">
              <span className="inv-sum-lbl">Amount Received</span>
              <div className="inv-received-group">
                <span className="inv-currency-sym">&#8377;</span>
                <input className="inv-received-input" type="number" min="0" step="any"
                  value={markPaid ? totalAmount.toFixed(2) : amtReceived}
                  placeholder="0"
                  onChange={e => setAmtReceived(e.target.value)}
                  disabled={markPaid} />
                <select className="inv-pay-select" value={payMode} onChange={e => setPayMode(e.target.value)}>
                  <option>Cash</option>
                  <option>Online</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Mark as fully paid */}
            <div className="inv-mark-paid-row">
              <span className="inv-mark-paid-lbl">Mark as fully paid</span>
              <input type="checkbox" className="inv-checkbox"
                checked={markPaid}
                onChange={e => { setMarkPaid(e.target.checked); if (!e.target.checked) setAmtReceived('') }} />
            </div>

            {/* Balance */}
            <div className={`inv-balance-row ${balance <= 0 ? 'inv-paid' : 'inv-due'}`}>
              <span>Balance Amount</span>
              <span className="inv-balance-value">&#8377; {Math.abs(balance).toFixed(2)}</span>
            </div>

            {/* Signature */}
            <div className="inv-signature-section">
              <label className="inv-check-lbl inv-sig-toggle">
                <input
                  type="checkbox"
                  className="inv-checkbox inv-checkbox-light"
                  checked={signatureEnabled}
                  onChange={e => setSignatureEnabled(e.target.checked)}
                />
                Add Authorized Signature
              </label>
              {signatureEnabled && (
                <div className="inv-sig-preview">
                  <div className="inv-sig-box">
                    <div className="inv-sig-placeholder">&#9998; Signature</div>
                    <div className="inv-sig-name">{seller.companyName || 'Authorized Signatory'}</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Search Customer Modal */}
      {showSearchModal && (
        <div className="inv-search-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="inv-search-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-search-modal-hd">
              <span>Search Customer by Mobile</span>
              <button className="inv-close-sec" onClick={() => setShowSearchModal(false)}>&#8855;</button>
            </div>
            <div className="inv-search-modal-body">
              <div className="inv-search-input-row">
                <input
                  className="inv-search-phone-inp"
                  placeholder="Enter mobile number..."
                  value={searchPhone}
                  onChange={e => { setSearchPhone(e.target.value); setSearchTried(false); setSearchResult(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleSearchCustomer()}
                  autoFocus
                  maxLength={15}
                />
                <button className="inv-search-go-btn" onClick={handleSearchCustomer}>Search</button>
              </div>
              {searchTried && !searchResult && (
                <div className="inv-search-no-result">&#9888; No customer found with this mobile number.</div>
              )}
              {searchResult && (
                <div className="inv-search-result-card">
                  <div className="inv-search-result-av">{searchResult.name[0].toUpperCase()}</div>
                  <div className="inv-search-result-info">
                    <div className="inv-search-result-name">{searchResult.name}</div>
                    <div className="inv-search-result-meta">
                      {searchResult.phone}{searchResult.address ? ` \u00b7 ${searchResult.address}` : ''}
                    </div>
                    {searchResult.gstin && (
                      <div className="inv-search-result-gstin">GSTIN: {searchResult.gstin}</div>
                    )}
                  </div>
                  <button className="inv-use-btn" onClick={() => applySearchResult(searchResult)}>Use</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab manager (top-level component) ────────────────────────────────────────
let _tabCounter = 0
const newTab = () => ({ id: uid(), num: ++_tabCounter, label: `Invoice #${_tabCounter}` })

export default function Invoices({ onBack }) {
  const [tabs, setTabs]       = useState(() => [newTab()])
  const [activeId, setActiveId] = useState(() => tabs[0]?.id)

  const addTab = () => {
    const tab = newTab()
    setTabs(prev => [...prev, tab])
    setActiveId(tab.id)
  }

  const closeTab = (id) => {
    setTabs(prev => {
      if (prev.length === 1) return prev
      const idx = prev.findIndex(t => t.id === id)
      const next = prev.filter(t => t.id !== id)
      if (id === activeId) setActiveId(next[Math.max(0, idx - 1)].id)
      return next
    })
  }

  return (
    <div className="inv-page">

      {/* ── Global Top Bar ── */}
      <div className="inv-topbar">
        <button className="inv-back-btn" onClick={onBack}>
          &#8592; Create Sales Invoice
        </button>

        {/* Tab Strip */}
        <div className="inv-tabs-strip">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`inv-tab-pill${activeId === tab.id ? ' inv-tab-pill-active' : ''}`}
              onClick={() => setActiveId(tab.id)}
            >
              <span className="inv-tab-pill-lbl">{tab.label}</span>
              {tabs.length > 1 && (
                <span
                  className="inv-tab-pill-close"
                  onClick={e => { e.stopPropagation(); closeTab(tab.id) }}
                  title="Close tab"
                >
                  &times;
                </span>
              )}
            </button>
          ))}
          <button className="inv-new-tab-btn" onClick={addTab} title="New Invoice">
            + New Invoice
          </button>
        </div>
      </div>

      {/* ── Tab Contents (all mounted; inactive hidden via CSS) ── */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={activeId === tab.id ? 'inv-tab-active' : 'inv-tab-hidden'}
        >
          <InvoiceTabForm invoiceNoDefault={String(tab.num)} />
        </div>
      ))}
    </div>
  )
}
