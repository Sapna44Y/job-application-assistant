import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import CvGenerator from './components/CvGenerator/CvGenerator'
import CoverLetterGenerator from './components/CoverLetterGenerator/CoverLetterGenerator'
import JobBoard from './components/JobBoard/JobBoard'
import Header from './components/Common/Header'
import Footer from './components/Common/Footer'
import LoadingSpinner from './components/Common/LoadingSpinner'
import { getStats } from './utils/storage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    applications: 0,
    successRate: 0,
    jobsScanned: 0
  })

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const statsData = await getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Failed to initialize app:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

   const handleNavigation = (tab) => {
    setActiveTab(tab)
  }

  const updateStats = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }))
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-fullpage">
          <LoadingSpinner 
            size="large" 
            text="Initializing ApplyGOAT..." 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            updateStats={updateStats} 
            onNavigate={handleNavigation}
          />
        )}
        {activeTab === 'cv' && <CvGenerator />}
        {activeTab === 'cover-letter' && <CoverLetterGenerator />}
        {activeTab === 'jobs' && <JobBoard updateStats={updateStats} />}
      </main>
      <Footer />
    </div>
  )
}

export default App