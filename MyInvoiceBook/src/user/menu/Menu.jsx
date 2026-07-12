import './Menu.css'

const menuSections = [
  {
    title: 'General',
    items: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'parties', label: 'Parties' },
      { key: 'items', label: 'Items' },
      { key: 'sales', label: 'Sales' },
      { key: 'purchases', label: 'Purchases' },
      { key: 'report', label: 'Report' },
    ],
  },
  {
    title: 'Accounting Solutions',
    items: [
      { key: 'cash-bank', label: 'Cash & Bank' },
      { key: 'expenses', label: 'Expenses' },
      { key: 'e-invoicing', label: 'e-Invoicing' },
    ],
  },
  {
    title: 'Business Tools',
    items: [
      { key: 'staff-attendance-payroll', label: 'Staff Attendance & Payroll' },
      { key: 'manage-users', label: 'Manage Users' },
      { key: 'online-orders', label: 'Online Orders' },
    ],
  },
]

export default function Menu({ activeTab, onSelect, onLogout }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand-row">
        <div className="sidebar-logo">MB</div>
        <div>
          <div className="sidebar-brand">MyInvoiceBook</div>
          <div className="sidebar-phone">+91-8882125306</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className="sidebar-create-invoice"
          onClick={() => onSelect('create-sales-invoice')}
        >
          Create sales invoice
        </button>

        {menuSections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <p className="section-title">{section.title}</p>
            {section.items.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => onSelect(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-settings" onClick={() => onSelect('settings')}>
          Settings
        </button>
        <button className="sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}
