import './Header.css'

export default function Header({ onNavigate }) {
  return (
    <header className="site-header">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        MyInvoiceBook
      </button>
      <nav className="nav-links">
        <div className="nav-dropdown">
          <a href="#features" className="nav-link-with-icon nav-dropdown-trigger">
            Features <span className="nav-arrow">⌄</span>
          </a>
          <div className="nav-dropdown-menu">
            <div className="nav-dropdown-group">
              <span className="nav-dropdown-title">Industry</span>
              <a href="#retail">Retail</a>
              <a href="#manufacturing">Manufacturing</a>
              <a href="#services">Services</a>
            </div>
            <div className="nav-dropdown-group">
              <span className="nav-dropdown-title">Sector</span>
              <a href="#gst-billing">GST Billing</a>
              <a href="#inventory-management">Inventory Management</a>
              <a href="#automation">Automation</a>
            </div>
          </div>
        </div>
        <div className="nav-dropdown">
          <a href="#solutions" className="nav-link-with-icon nav-dropdown-trigger">
            Solutions <span className="nav-arrow">⌄</span>
          </a>
          <div className="nav-dropdown-menu">
            <div className="nav-dropdown-group">
              <span className="nav-dropdown-title">Industry</span>
              <a href="#retail">Retail</a>
              <a href="#manufacturing">Manufacturing</a>
              <a href="#services">Services</a>
            </div>
            <div className="nav-dropdown-group">
              <span className="nav-dropdown-title">Sector</span>
              <a href="#gst-billing">GST Billing</a>
              <a href="#inventory-management">Inventory Management</a>
              <a href="#automation">Automation</a>
            </div>
          </div>
        </div>
        <button type="button" className="nav-button" onClick={() => onNavigate('careers')}>
          Careers
        </button>
        <button type="button" className="nav-button" onClick={() => onNavigate('pricing')}>
          Pricing
        </button>
      </nav>
      <div className="header-actions">
        <button className="button-primary" onClick={() => onNavigate('login')}>
          Login
        </button>
        <button className="button-primary" onClick={() => onNavigate('demo')}>
          Book Free Demo
        </button>
        <button className="button-primary" onClick={() => onNavigate('signup')}>
          Signup Free
        </button>
      </div>
    </header>
  )
}
