import { useState } from 'react'
import Menu from '../menu/Menu.jsx'
import Invoices from '../invoices/Invoices.jsx'
import './Dashboard.css'

const contentMap = {
  dashboard: {
    title: 'Dashboard Overview',
    description: 'Welcome back! Here is a quick summary of your account activity.',
    stats: ['Total Sales: ₹1,25,000', 'Pending Invoices: 12', 'Active Customers: 84'],
  },
  parties: {
    title: 'Parties',
    description: 'Manage your customer and supplier party records from one place.',
    stats: ['Customers: 84', 'Suppliers: 24', 'Pending follow-ups: 7'],
  },
  items: {
    title: 'Items',
    description: 'Track product details, pricing, stock, and item categories.',
    stats: ['Products in stock: 142', 'Low stock alerts: 6', 'Featured items: 8'],
  },
  sales: {
    title: 'Sales',
    description: 'Monitor sales orders, invoices, and completed transactions.',
    stats: ['Sales this month: ₹82,000', 'Open orders: 5', 'Completed invoices: 31'],
  },
  purchases: {
    title: 'Purchases',
    description: 'Review purchase entries, supplier bills, and payment activity.',
    stats: ['Pending bills: 9', 'Supplier payments: ₹37,500', 'Recent purchase orders: 3'],
  },
  report: {
    title: 'Report',
    description: 'Review business insights and performance trends.',
    stats: ['Revenue trend: +12%', 'Profit margin: 24%', 'Top-selling category: Retail'],
  },
  'cash-bank': {
    title: 'Cash & Bank',
    description: 'Track bank balances, cash movements, and account activity.',
    stats: ['Bank balance: ₹2,18,400', 'Cash in hand: ₹18,600', 'Reconciled accounts: 4'],
  },
  expenses: {
    title: 'Expenses',
    description: 'At a glance of your business expenses and bill payments.',
    stats: ['This month expenses: ₹24,800', 'Pending approvals: 3', 'Recurring costs: 6'],
  },
  'e-invoicing': {
    title: 'e-Invoicing',
    description: 'Manage invoice generation and IRN-related workflow.',
    stats: ['Invoices generated: 57', 'IRNs uploaded: 54', 'Pending uploads: 3'],
  },
  'staff-attendance-payroll': {
    title: 'Staff Attendance & Payroll',
    description: 'Handle attendance, shift records, and payroll processing.',
    stats: ['Present today: 18', 'Payroll processed: 2', 'Pending leaves: 4'],
  },
  'manage-users': {
    title: 'Manage Users',
    description: 'Control system access and manage your team roles.',
    stats: ['Active users: 12', 'Admin users: 3', 'Pending invites: 2'],
  },
  'online-orders': {
    title: 'Online Orders',
    description: 'Review orders coming in from your connected channels.',
    stats: ['New orders: 11', 'Packed orders: 6', 'Cancelled orders: 1'],
  },
  'create-sales-invoice': {
    title: 'Create Sales Invoice',
    description: 'Create a new sales invoice with customer information, items, taxes, and payment mode.',
    stats: [],
  },
  settings: {
    title: 'Settings',
    description: 'Update account preferences and business profile details.',
    stats: ['Business profile: Updated', 'Notifications: Enabled', 'Billing plan: Pro'],
  },
}

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

export default function Dashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const activeContent = contentMap[activeTab] || contentMap.dashboard

  return (
    <div className="dashboard-page">
      <Menu
        activeTab={activeTab}
        onSelect={setActiveTab}
        onLogout={() => onNavigate('home')}
      />

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <p className="eyebrow">Customer Dashboard</p>
            <h1>{activeContent.title}</h1>
          </div>
          <button className="button-primary" onClick={() => onNavigate('home')}>
            Back to Home
          </button>
        </div>

        {activeTab === 'create-sales-invoice' ? (
          <Invoices onBack={() => setActiveTab('dashboard')} />
        ) : (
          <section className="dashboard-card">
            <p className="dashboard-description">{activeContent.description}</p>
            {activeContent.stats.length > 0 && (
              <div className="dashboard-stats">
                {activeContent.stats.map((stat) => (
                  <div key={stat} className="stat-box">
                    {stat}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
