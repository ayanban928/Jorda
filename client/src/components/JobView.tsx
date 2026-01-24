import { useState, useEffect } from 'react'
import { jobsAPI } from '../services/api'
import './JobView.css'

interface Job {
  id: string
  company: string
  position: string
  status: string
  appliedDate: string
  notes?: string
}

interface JobViewProps {
  sheetId: string
  sheetName: string
  onBack: () => void
}

const JobView = ({ sheetId, sheetName, onBack }: JobViewProps) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    status: 'Applied',
    notes: ''
  })

  useEffect(() => {
    loadJobs()
  }, [sheetId])

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getBySheet(sheetId)
      setJobs(response.data)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newJob.company.trim() || !newJob.position.trim()) return

    try {
      await jobsAPI.create({ ...newJob, sheetId })
      setNewJob({ company: '', position: '', status: 'Applied', notes: '' })
      setShowAddForm(false)
      loadJobs()
    } catch (error) {
      console.error('Failed to add job:', error)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      await jobsAPI.delete(id)
      loadJobs()
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const statusColors: { [key: string]: string } = {
    Applied: '#3b82f6',
    Interview: '#f59e0b',
    Offer: '#10b981',
    Rejected: '#ef4444',
  }

  return (
    <div className="job-view-container">
      <div className="job-view-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h2>{sheetName}</h2>
        <button onClick={() => setShowAddForm(true)} className="add-job-btn">
          + Add Job
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddJob} className="add-job-form">
          <h3>Add New Job</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Company</label>
              <input
                type="text"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                placeholder="Google"
                required
              />
            </div>
            <div className="form-field">
              <label>Position</label>
              <input
                type="text"
                value={newJob.position}
                onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                placeholder="Software Engineer Intern"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select
                value={newJob.status}
                onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-field">
              <label>Notes (optional)</label>
              <input
                type="text"
                value={newJob.notes}
                onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                placeholder="Referred by John"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Add Job</button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewJob({ company: '', position: '', status: 'Applied', notes: '' })
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs yet. Add your first application!</p>
        </div>
      ) : (
        <div className="jobs-table">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="company-cell">{job.company}</td>
                  <td>{job.position}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors[job.status] || '#6b7280' }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.appliedDate).toLocaleDateString()}</td>
                  <td className="notes-cell">{job.notes || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="delete-job-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default JobView