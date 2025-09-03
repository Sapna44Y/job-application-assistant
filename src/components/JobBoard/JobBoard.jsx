import { useState, useEffect } from 'react'
import { findJobs, saveJobPreferences } from '../../utils/api'
import { incrementApplications } from '../../utils/storage'
import LoadingSpinner from '../Common/LoadingSpinner'
import './JobBoard.css'

const JobBoard = ({ updateStats }) => {
  const [jobs, setJobs] = useState([])
  const [preferences, setPreferences] = useState({
    keywords: '',
    location: '',
    remote: true,
    salaryMin: 50000,
    experienceLevel: 'mid'
  })
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadDefaultJobs()
  }, [])

  const loadDefaultJobs = async () => {
    setSearching(true)
    try {
      const jobData = await findJobs({})
      setJobs(jobData)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
    setSearching(false)
  }

  const handleSearch = async () => {
    setSearching(true)
    try {
      const jobData = await findJobs(preferences)
      setJobs(jobData)
    } catch (error) {
      console.error('Job search failed:', error)
    }
    setSearching(false)
  }

  const handleSavePreferences = async () => {
    await saveJobPreferences(preferences)
    alert('Preferences saved!')
  }

  const handleAutoApply = async (jobId) => {
    try {
      console.log('Auto-applying to job:', jobId)
      const newAppCount = await incrementApplications()
      updateStats({ applications: newAppCount })
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Application failed:', error)
      alert('Application failed. Please try again.')
    }
  }

  return (
    <div className="job-board">
      <h2>Smart Job Board</h2>
      
      {/* Search Panel */}
      <div className="search-panel">
        <h3>Job Preferences</h3>
        <div className="preferences-form">
          <div className="form-row">
            <div className="form-group">
              <label>Keywords</label>
              <input 
                type="text" 
                value={preferences.keywords} 
                onChange={(e) => setPreferences({...preferences, keywords: e.target.value})}
                placeholder="e.g. React Developer, UX Designer"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={preferences.location} 
                onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                placeholder="e.g. San Francisco, Remote"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Minimum Salary</label>
              <input 
                type="number" 
                value={preferences.salaryMin} 
                onChange={(e) => setPreferences({...preferences, salaryMin: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select 
                value={preferences.experienceLevel} 
                onChange={(e) => setPreferences({...preferences, experienceLevel: e.target.value})}
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                checked={preferences.remote} 
                onChange={(e) => setPreferences({...preferences, remote: e.target.checked})}
                id="remote-work"
              />
              <label htmlFor="remote-work">Remote Jobs Only</label>
            </div>
          </div>
        </div>
        
        <div className="search-actions">
          <button onClick={handleSearch} disabled={searching} className="search-btn">
            {searching ? <LoadingSpinner variant="inline" size="small" text="Searching..." /> : 'Find Jobs'}
          </button>
          <button onClick={handleSavePreferences} className="save-prefs-btn">
            Save Preferences
          </button>
        </div>
      </div>

      {/* Job Results */}
      <div className="job-results">
        <h3>Recommended Jobs ({jobs.length})</h3>
        {searching ? (
          <LoadingSpinner text="Finding matching jobs..." />
        ) : (
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h4>{job.title}</h4>
                  <span className="company">{job.company}</span>
                </div>
                <div className="job-details">
                  <span className="location">{job.location}</span>
                  <span className="salary">${job.salaryMin} - ${job.salaryMax}</span>
                  <span className="posted">{job.posted}</span>
                </div>
                <div className="job-description">
                  {job.description.substring(0, 150)}...
                </div>
                <div className="job-actions">
                  <button onClick={() => handleAutoApply(job.id)} className="apply-btn">
                    Auto Apply
                  </button>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="view-btn">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobBoard

