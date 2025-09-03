import { useState } from 'react'
import './Header.css'

const Header = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogoClick = () => {
    setActiveTab('dashboard')
    setIsMenuOpen(false)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setIsMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        <h1>ApplyGOAT</h1>
        <span>Job Application Assistant</span>
      </div>

      <button 
        className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`tabs ${isMenuOpen ? 'active' : ''}`}>
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => handleTabClick('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'cv' ? 'active' : ''} 
          onClick={() => handleTabClick('cv')}
        >
          📄 CV Generator
        </button>
        <button 
          className={activeTab === 'cover-letter' ? 'active' : ''} 
          onClick={() => handleTabClick('cover-letter')}
        >
          ✉️ Cover Letter
        </button>
        <button 
          className={activeTab === 'jobs' ? 'active' : ''} 
          onClick={() => handleTabClick('jobs')}
        >
          🔍 Job Board
        </button>
      </nav>
    </header>
  )
}

export default Header