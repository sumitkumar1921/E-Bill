import { useState } from 'react'
import './Invoices.css'

const sampleItems = [
  {
    id: 1,
    productId: 'P-1001',
    name: 'Laptop Stand',
    hsn: '8473',
    purchasePrice: 850,
    salesPrice: 1200,
    stock: 40,
  },
  {
    id: 2,
    productId: 'P-1002',
    name: 'Wireless Mouse',
    hsn: '8471',
    purchasePrice: 320,
    salesPrice: 450,
    stock: 120,
  },
  {
    id: 3,
    productId: 'P-1003',
    name: 'USB Cable',
    hsn: '8544',
    purchasePrice: 120,
    salesPrice: 180,
    stock: 300,
  },
  {
    id: 4,
    productId: 'P-1004',
    name: 'Keyboard',
    hsn: '8471',
    purchasePrice: 650,
    salesPrice: 900,
    stock: 70,
  },
]

export default function Invoices({ onBack }) {
  const [customerName, setCustomerName] = useState('')
  const [customerNumber, setCustomerNumber] = useState('')
  const [email, setEmail] = useState('')
  const [invoiceItems, setInvoiceItems] = useState([])
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [itemQuantities, setItemQuantities] = useState(() => Object.fromEntries(sampleItems.map((item) => [item.id, 1])))
  const [showDiscountInput, setShowDiscountInput] = useState(false)
  const [discountValue, setDiscountValue] = useState('')
  const [amountReceived, setAmountReceived] = useState('')
  const [paymentMode, setPaymentMode] = useState('cash')

  const subtotal = invoiceItems.reduce((total, item) => total + item.salesPrice * item.quantity, 0)
  const cgst = subtotal * 0.09
  const sgst = subtotal * 0.09
  const discount = Number(discountValue || 0)
  const finalAmount = Math.max(subtotal + cgst + sgst - discount, 0)

  const handleAddItem = (item) => {
    const quantity = Number(itemQuantities[item.id] || 1)

    if (!quantity || quantity < 1) {
      return
    }

    setInvoiceItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id)
      if (existing) {
        return prev.map((entry) => (entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry))
      }
      return [...prev, { ...item, quantity }]
    })
    setShowItemsModal(false)
  }

  const handleRemoveItem = (itemId) => {
    setInvoiceItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Sales invoice created successfully')
  }

  return (
    <section className="dashboard-card invoice-card">
      <div className="invoice-header">
        <div>
          <p className="dashboard-description">Create a new sales invoice with customer information, items, taxes, and payment mode.</p>
        </div>
        <button type="button" className="button-secondary" onClick={onBack}>
          Cancel
        </button>
      </div>

      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="invoice-grid">
          <label className="input-group">
            <span>Customer Name</span>
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Enter customer name" required />
          </label>
          <label className="input-group">
            <span>Customer Number</span>
            <input value={customerNumber} onChange={(event) => setCustomerNumber(event.target.value)} placeholder="Enter phone number" required />
          </label>
          <label className="input-group">
            <span>Email (Optional)</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter email" />
          </label>
        </div>

        <div className="invoice-action-row">
          <button type="button" className="button-primary" onClick={() => setShowItemsModal(true)}>
            Add Item
          </button>
        </div>

        <div className="invoice-items-box">
          <h3>Added Items</h3>
          {invoiceItems.length === 0 ? (
            <p className="invoice-empty-state">No items added yet. Select products to build your invoice.</p>
          ) : (
            <div className="invoice-items-list">
              {invoiceItems.map((item) => (
                <div key={item.id} className="invoice-item-card">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.productId} • HSN {item.hsn}</p>
                  </div>
                  <div className="invoice-item-meta">
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.salesPrice * item.quantity}</span>
                  </div>
                  <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="invoice-summary-box">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>CGST @ 9%</span>
            <strong>₹{cgst.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>SGST @ 9%</span>
            <strong>₹{sgst.toFixed(2)}</strong>
          </div>
          <div className="summary-row summary-actions">
            <button type="button" className="button-secondary" onClick={() => setShowDiscountInput((value) => !value)}>
              + Add Discount
            </button>
            {showDiscountInput && (
              <input
                className="discount-input"
                type="number"
                min="0"
                value={discountValue}
                onChange={(event) => setDiscountValue(event.target.value)}
                placeholder="Discount"
              />
            )}
          </div>
          <div className="summary-row final-row">
            <span>Final Amount</span>
            <strong>₹{finalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-row">
          <label className="input-group payment-input">
            <span>Amount Received</span>
            <input type="number" min="0" value={amountReceived} onChange={(event) => setAmountReceived(event.target.value)} placeholder="Enter amount" />
          </label>
          <label className="input-group payment-input">
            <span>Payment Mode</span>
            <select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)}>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </label>
        </div>

        <div className="invoice-submit-row">
          <button type="submit" className="button-primary">
            Submit
          </button>
        </div>
      </form>

      {showItemsModal && (
        <div className="invoice-modal-backdrop" onClick={() => setShowItemsModal(false)}>
          <div className="invoice-modal" onClick={(event) => event.stopPropagation()}>
            <div className="invoice-modal-header">
              <h3>Select Items</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowItemsModal(false)}>
                ×
              </button>
            </div>

            <div className="invoice-modal-list">
              {sampleItems.map((item) => (
                <div key={item.id} className="invoice-modal-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.productId} • HSN {item.hsn} • Stock {item.stock}
                    </p>
                    <p>Purchase: ₹{item.purchasePrice} • Sales: ₹{item.salesPrice}</p>
                  </div>
                  <div className="invoice-modal-item-actions">
                    <input
                      type="number"
                      min="1"
                      value={itemQuantities[item.id] || 1}
                      onChange={(event) =>
                        setItemQuantities((prev) => ({ ...prev, [item.id]: Number(event.target.value) || 1 }))
                      }
                    />
                    <button type="button" className="button-primary" onClick={() => handleAddItem(item)}>
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
