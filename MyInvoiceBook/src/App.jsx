import { useEffect, useState } from 'react'
import Home from './Home/Home.jsx'
import Login from './Login/Login.jsx'
import Signup from './Signup/Signup.jsx'
import Pricing from './Pricing/Pricing.jsx'
import Demo from './Demo/Demo.jsx'
import Careers from './Careers/Careers.jsx'
import Dashboard from './user/Dashboard/Dashboard.jsx'

const getPageFromPath = () => {
  const path = window.location.pathname.replace(/^\//, '')
  return ['login', 'signup', 'pricing', 'demo', 'careers', 'dashboard'].includes(path) ? path : 'home'
}

const getUrlForPage = (page) => (page === 'home' ? '/' : `/${page}`)

export default function App() {
  const [page, setPage] = useState(getPageFromPath)

  useEffect(() => {
    const url = getUrlForPage(page)
    if (window.location.pathname !== url) {
      window.history.pushState({ page }, '', url)
    }
  }, [page])

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (page === 'login') return <Login onNavigate={setPage} />
  if (page === 'signup') return <Signup />
  if (page === 'pricing') return <Pricing onNavigate={setPage} />
  if (page === 'demo') return <Demo onNavigate={setPage} />
  if (page === 'careers') return <Careers onNavigate={setPage} />
  if (page === 'dashboard') return <Dashboard onNavigate={setPage} />
  return <Home onNavigate={setPage} />
}
