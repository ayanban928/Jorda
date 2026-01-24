import { useState, useEffect } from 'react'
import { sheetsAPI } from '../services/api'
import JobView from './JobView'
import './Dashboard.css'

interface Sheet {
  id: string
  name: string
  jobCount: number
}

interface DashboardProps {
  userEmail: string
  onLogout: () => void
}

const Dashboard = ({ userEmail, onLogout }: DashboardProps) => {
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [loading, setLoading] = useState(true)
  const [newSheetName, setNewSheetName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedSheet, setSelectedSheet] = useState<{ id: string; name: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSheets()
  }, [])

  const loadSheets = async () => {
    try {
      const response = await sheetsAPI.getAll()
      console.log('Loaded sheets:', response.data)
      setSheets(response.data)
    } catch (error) {
      console.error('Failed to load sheets:', error)
      setError('Failed to load sheets')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSheetName.trim()) return

    console.log('Creating sheet with name:', newSheetName)
    
    try {
      const response = await sheetsAPI.create(newSheetName)
      console.log('Sheet created:', response.data)
      setNewSheetName('')
      setShowCreateForm(false)
      setError('')
      await loadSheets()
    } catch (error: any) {
      console.error('Failed to create sheet:', error)
      setError(error.response?.data?.error || 'Failed to create sheet')
    }
  }

  const handleDeleteSheet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sheet?')) return

    try {
      await sheetsAPI.delete(id)
      loadSheets()
    } catch (error) {
      console.error('Failed to delete sheet:', error)
      setError('Failed to delete sheet')
    }
  }

  // If a sheet is selected, show JobView
  if (selectedSheet) {
    return (
      <JobView
        sheetId={selectedSheet.id}
        sheetName={selectedSheet.name}
        onBack={() => {
          setSelectedSheet(null)
          loadSheets()
        }}
      />
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Jorda</h1>
        <div className="user-info">
          <span>{userEmail}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="sheets-header">
          <h2>Your Job Sheets</h2>
          <button 
            onClick={() => setShowCreateForm(true)} 
            className="create-btn"
          >
            + New Sheet
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px',
            fontFamily: 'Cute Font, cursive'
          }}>
            {error}
          </div>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateSheet} className="create-form">
            <input
              type="text"
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
              placeholder="Sheet name (e.g., Summer 2025)"
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="save-btn">Create</button>
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false)
                  setNewSheetName('')
                  setError('')
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="loading">Loading sheets...</p>
        ) : sheets.length === 0 ? (
          <div className="empty-state">
            <p>No sheets yet. Create your first job tracking sheet!</p>
          </div>
        ) : (
          <div className="sheets-grid">
            {sheets.map((sheet) => (
              <div key={sheet.id} className="sheet-card">
                <h3>{sheet.name}</h3>
                <p className="job-count">{sheet.jobCount} jobs</p>
                <div className="card-actions">
                  <button
                    onClick={() => setSelectedSheet({ id: sheet.id, name: sheet.name })}
                    className="view-btn"
                  >
                    View Jobs
                  </button>
                  <button 
                    onClick={() => handleDeleteSheet(sheet.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard