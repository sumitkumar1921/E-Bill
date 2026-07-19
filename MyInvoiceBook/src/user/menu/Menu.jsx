import { useRef, useState, useEffect } from 'react'
import {
  MdDashboard, MdPeople, MdInventory, MdPointOfSale,
  MdShoppingCart, MdBarChart,
  MdAccountBalance, MdReceipt, MdAutorenew, MdMoneyOff, MdStorefront,
  MdManageAccounts, MdDeliveryDining, MdSms,
  MdAccountCircle, MdBusiness, MdTune, MdSupervisorAccount,
  MdNotificationsActive, MdShare, MdLocalOffer, MdCardGiftcard, MdHelpOutline,
} from 'react-icons/md'
import './Menu.css'

const menuSections = [
  {
    title: 'General',
    items: [
      { key: 'dashboard',  label: 'Dashboard',  Icon: MdDashboard },
      { key: 'parties',    label: 'Parties',    Icon: MdPeople },
      { key: 'items',      label: 'Items',      Icon: MdInventory },
      { key: 'sales',      label: 'Sales',      Icon: MdPointOfSale },
      { key: 'purchases',  label: 'Purchases',  Icon: MdShoppingCart },
      { key: 'reports',    label: 'Reports',    Icon: MdBarChart },
    ],
  },
  {
    title: 'Accounting Solutions',
    items: [
      { key: 'cash-bank',       label: 'Cash & Bank',     Icon: MdAccountBalance },
      { key: 'e-invoicing',     label: 'E-Invoicing',     Icon: MdReceipt },
      { key: 'automated-bills', label: 'Automated Bills', Icon: MdAutorenew },
      { key: 'expenses',        label: 'Expenses',        Icon: MdMoneyOff },
      { key: 'pos-billing',     label: 'POS Billing',     Icon: MdStorefront },
    ],
  },
  {
    title: 'Business Tools',
    items: [
      { key: 'manage-users',   label: 'Manage Users',   Icon: MdManageAccounts },
      { key: 'online-orders',  label: 'Online Orders',  Icon: MdDeliveryDining },
      { key: 'sms-marketing',  label: 'SMS Marketing',  Icon: MdSms },
    ],
  },
]

const settingsItems = [
  { key: 'account',           label: 'Account',           Icon: MdAccountCircle },
  { key: 'manage-business',   label: 'Manage Business',   Icon: MdBusiness },
  { key: 'invoice-settings',  label: 'Invoice Settings',  Icon: MdTune },
  { key: 'manage-users',      label: 'Manage Users',      Icon: MdSupervisorAccount },
  { key: 'reminders',         label: 'Reminders',         Icon: MdNotificationsActive },
  { key: 'ca-report-sharing', label: 'CA Report Sharing', Icon: MdShare },
  { key: 'pricing',           label: 'Pricing',           Icon: MdLocalOffer },
  { key: 'refer-earn',        label: 'Refer & Earn',      Icon: MdCardGiftcard },
  { key: 'help-support',      label: 'Help And Support',  Icon: MdHelpOutline },
]

const SETTINGS_KEYS = new Set(settingsItems.map(i => i.key))

export default function Menu({ activeTab, onSelect, onLogout, userName = 'Sumit Kumar', userPhone = '8882125306' }) {
  const initial = userName.trim().charAt(0).toUpperCase()
  const navRef = useRef(null)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const [inSettings, setInSettings] = useState(() => SETTINGS_KEYS.has(activeTab))

  const checkScroll = () => {
    const el = navRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 4
    setShowScrollHint(!atBottom)
  }

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    // reset scroll and re-check whenever the panel switches
    el.scrollTop = 0
    checkScroll()
    el.addEventListener('scroll', checkScroll)
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      ro.disconnect()
    }
  }, [inSettings])

  const openSettings = () => {
    setInSettings(true)
    onSelect('account')
  }

  const backToDashboard = () => {
    setInSettings(false)
    onSelect('dashboard')
  }

  return (
    <aside className="menu-main">

      {/* ── Div 1 : Profile + action button (swaps on settings) ── */}
      <div className="menu-profile-div">
        <div className="menu-profile-row">
          <div className="menu-avatar">{initial}</div>
          <div className="menu-profile-info">
            <span className="menu-username">{userName}</span>
            <span className="menu-phone">{userPhone}</span>
          </div>
        </div>

        {inSettings ? (
          <button type="button" className="menu-back-btn" onClick={backToDashboard}>
            <span className="menu-back-arrow">←</span>
            <span>Back to Dashboard</span>
          </button>
        ) : (
          <button type="button" className="menu-create-invoice" onClick={() => onSelect('create-sales-invoice')}>
            <span className="menu-create-plus">+</span>
            <span>Create Sales Invoice</span>
          </button>
        )}
      </div>

      {/* ── Nav wrapper (content swaps based on inSettings) ── */}
      <div className="menu-nav-wrapper">
        <nav className="menu-nav" ref={navRef}>

          {inSettings ? (
            /* ── Settings panel – flat list, no sub-headings ── */
            <div className="menu-section">
              {settingsItems.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`menu-item${activeTab === key ? ' active' : ''}`}
                  onClick={() => onSelect(key)}
                >
                  <Icon className="menu-item-icon" />
                  {label}
                </button>
              ))}
            </div>
          ) : (
            /* ── Main menu – 3 grouped sub-divs ── */
            <>
              <div className="menu-section">
                <p className="menu-section-title">General</p>
                {menuSections[0].items.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`menu-item${activeTab === key ? ' active' : ''}`}
                    onClick={() => onSelect(key)}
                  >
                    <Icon className="menu-item-icon" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="menu-section">
                <p className="menu-section-title">Accounting Solutions</p>
                {menuSections[1].items.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`menu-item${activeTab === key ? ' active' : ''}`}
                    onClick={() => onSelect(key)}
                  >
                    <Icon className="menu-item-icon" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="menu-section">
                <p className="menu-section-title">Business Tools</p>
                {menuSections[2].items.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`menu-item${activeTab === key ? ' active' : ''}`}
                    onClick={() => onSelect(key)}
                  >
                    <Icon className="menu-item-icon" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

        </nav>

        {showScrollHint && (
          <div className="menu-scroll-hint">↓ Scroll for more Options</div>
        )}
      </div>

      {/* ── Footer buttons ── */}
      <div className="menu-footer">
        <button
          type="button"
          className={`menu-settings-btn${inSettings ? ' active' : ''}`}
          onClick={openSettings}
        >
          <MdTune className="menu-item-icon" />
          Settings
        </button>
        <button type="button" className="menu-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

    </aside>
  )
}
