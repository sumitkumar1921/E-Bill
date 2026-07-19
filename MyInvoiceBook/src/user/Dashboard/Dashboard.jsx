import { useState, useEffect } from 'react'
import Menu from '../menu/Menu.jsx'
import DashboardHome from './DashboardHome.jsx'
import Invoices from '../invoices/Invoices.jsx'
import Parties from '../Parties/Parties.jsx'
import Items from '../Items/Items.jsx'
import Sales from '../Sales/Sales.jsx'
import Purchases from '../Purchases/Purchases.jsx'
import Reports from '../Reports/Reports.jsx'
import CashAndBank from '../CashAndBank/CashAndBank.jsx'
import EInvoice from '../EInvoice/EInvoice.jsx'
import AutomatedBills from '../AutomatedBills/AutomatedBills.jsx'
import Expenses from '../Expenses/Expenses.jsx'
import POSBilling from '../POSBilling/POSBilling.jsx'
import ManageUsers from '../ManageUsers/ManageUsers.jsx'
import OnlineOrders from '../OnlineOrders/OnlineOrders.jsx'
import SMSMarketing from '../SMSMarketing/SMSMarketing.jsx'
import Account from '../Account/Account.jsx'
import ManageBusiness from '../ManageBusiness/ManageBusiness.jsx'
import InvoiceSettings from '../InvoiceSettings/InvoiceSettings.jsx'
import CAReportSharing from '../CAReportSharing/CAReportSharing.jsx'
import Pricing from '../Pricing/Pricing.jsx'
import ReferAndEarn from '../ReferAndEarn/ReferAndEarn.jsx'
import HelpAndSupport from '../HelpAndSupport/HelpAndSupport.jsx'
import Reminders from '../Reminders/Reminders.jsx'
import './Dashboard.css'

const pageTitles = {
  dashboard:           'Dashboard Overview',
  parties:             'Parties',
  items:               'Items',
  sales:               'Sales',
  purchases:           'Purchases',
  reports:             'Reports',
  'cash-bank':         'Cash & Bank',
  'e-invoicing':       'E-Invoicing',
  'automated-bills':   'Automated Bills',
  expenses:            'Expenses',
  'pos-billing':       'POS Billing',
  'manage-users':      'Manage Users',
  'online-orders':     'Online Orders',
  'sms-marketing':     'SMS Marketing',
  'create-sales-invoice': 'Create Sales Invoice',
  account:             'Account',
  'manage-business':   'Manage Business',
  'invoice-settings':  'Invoice Settings',
  'ca-report-sharing': 'CA Report Sharing',
  pricing:             'Pricing',
  'refer-earn':        'Refer & Earn',
  'help-support':      'Help And Support',
  reminders:           'Reminders',
  settings:            'Settings',
}

const componentMap = {
  'create-sales-invoice': Invoices,
  parties:             Parties,
  items:               Items,
  sales:               Sales,
  purchases:           Purchases,
  reports:             Reports,
  'cash-bank':         CashAndBank,
  'e-invoicing':       EInvoice,
  'automated-bills':   AutomatedBills,
  expenses:            Expenses,
  'pos-billing':       POSBilling,
  'manage-users':      ManageUsers,
  'online-orders':     OnlineOrders,
  'sms-marketing':     SMSMarketing,
  account:             Account,
  'manage-business':   ManageBusiness,
  'invoice-settings':  InvoiceSettings,
  'ca-report-sharing': CAReportSharing,
  pricing:             Pricing,
  'refer-earn':        ReferAndEarn,
  'help-support':      HelpAndSupport,
  reminders:           Reminders,
}

// 'pricing' tab conflicts with the public /pricing route → use /my-plan
const TAB_TO_PATH = { pricing: 'my-plan' }
const PATH_TO_TAB = { 'my-plan': 'pricing' }

const tabFromUrl = () => {
  const seg = window.location.pathname.replace(/^\//, '') || 'dashboard'
  return PATH_TO_TAB[seg] || seg
}

export default function Dashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(() => {
    const fromUrl = tabFromUrl()
    // Only trust URL segments that are valid tabs; fall back to localStorage or 'dashboard'
    const valid = fromUrl && fromUrl !== 'home' && fromUrl !== 'login' && fromUrl !== 'signup'
    return valid ? fromUrl : (localStorage.getItem('mbb_activeTab') || 'dashboard')
  })

  // Keep URL in sync with activeTab
  useEffect(() => {
    const path = `/${TAB_TO_PATH[activeTab] || activeTab}`
    if (window.location.pathname !== path) {
      window.history.pushState({ tab: activeTab }, '', path)
    }
    localStorage.setItem('mbb_activeTab', activeTab)
  }, [activeTab])

  // Handle browser back / forward
  useEffect(() => {
    const onPop = () => setActiveTab(tabFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const title = pageTitles[activeTab] || 'Dashboard Overview'
  const PageComponent = componentMap[activeTab]

  return (
    <div className="dashboard-page">
      <Menu
        activeTab={activeTab}
        onSelect={setActiveTab}
        onLogout={() => onNavigate('home')}
      />

      <main className="dashboard-main">
        {activeTab === 'dashboard' ? (
          <DashboardHome />
        ) : PageComponent ? (
          activeTab === 'create-sales-invoice' ? (
            <PageComponent onBack={() => setActiveTab('dashboard')} />
          ) : (
            <PageComponent />
          )
        ) : null}
      </main>
    </div>
  )
}
