
import { useState, useEffect } from 'react'
import { getStats, incrementApplications, incrementJobsScanned } from '../../utils/storage'
import './Dashboard.css'

const Dashboard = ({ stats, updateStats, onNavigate }) => {
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentActivity()
  }, [])

  const loadRecentActivity = async () => {
   
    setTimeout(() => {
      const activity = [
        { id: 1, action: 'Applied to', company: 'Google', position: 'Frontend Developer', time: '2 hours ago', type: 'application' },
        { id: 2, action: 'Generated CV for', company: 'Amazon', position: 'UX Designer', time: '5 hours ago', type: 'cv' },
        
        { id: 4, action: 'Created cover letter for', company: 'Netflix', position: 'Content Strategist', time: '1 day ago', type: 'letter' },
        { id: 5, action: 'Applied to', company: 'Twitter', position: 'Backend Developer', time: '2 days ago', type: 'application' }
      ]
      setRecentActivity(activity)
      setLoading(false)
    }, 800)
  }

  
  
  const handleQuickAction = async (action) => {
  switch (action) {
    case 'jobs':
      
      onNavigate('jobs')
      break
    case 'cv':
      onNavigate('cv')
      break
    case 'letter':
      onNavigate('cover-letter')
      break
    default:
      break
  }
}



  const getActivityIcon = (type) => {
    switch(type) {
      case 'application': return '📨'
      case 'cv': return '📄'
      case 'scan': return '🔍'
      case 'letter': return '✉️'
      default: return '📋'
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Application Dashboard</h2>
        <p className="dashboard-subtitle">Track your job search progress and take quick actions</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Applications Sent</h3>
            <p className="stat-number">{stats.applications}</p>
            <p className="stat-label">Total applications submitted</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p className="stat-number">{stats.successRate}%</p>
            <p className="stat-label">Interview conversion rate</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>Jobs Scanned</h3>
            <p className="stat-number">{stats.jobsScanned}</p>
            <p className="stat-label">ATS optimized jobs</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <p className="section-description">Jump directly to frequently used features</p>
          
          <div className="quick-actions-grid">
            
            <button 
              className="quick-action-card"
              onClick={() => handleQuickAction('cv')}
            >
              <div className="action-icon">📄</div>
              <div className="action-content">
                <h4>Generate CV</h4>
                <p>Create a job-specific resume</p>
              </div>
              <div className="action-arrow">→</div>
            </button>
            
            <button 
              className="quick-action-card"
              onClick={() => handleQuickAction('letter')}
            >
              <div className="action-icon">✉️</div>
              <div className="action-content">
                <h4>Cover Letter</h4>
                <p>Create personalized cover letter</p>
              </div>
              <div className="action-arrow">→</div>
            </button>
            
            <button 
              className="quick-action-card"
              onClick={() => handleQuickAction('jobs')}
            >
              <div className="action-icon">⚡</div>
              <div className="action-content">
                <h4>Quick Apply</h4>
                <p>Apply to recommended jobs</p>
              </div>
              <div className="action-arrow">→</div>
            </button>
          </div>
        </div>
        
        <div className="recent-activity-section">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <button className="view-all-btn">View All</button>
          </div>
          
          {loading ? (
            <div className="loading-activities">
              <div className="loading-spinner"></div>
              <p>Loading activities...</p>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-position">{activity.position}</span>
                      <span className="activity-company">at {activity.company}</span>
                    </p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard