import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, sheetsAPI } from '../services/api';
import './JobView.css';

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  dateApplied: string;
  notes?: string;
}

interface Sheet {
  id: string;
  name: string;
  createdAt: string;
}

interface JobViewProps {
  userEmail: string;
  onLogout: () => void;
}

export default function JobView({ userEmail, onLogout }: JobViewProps) {
  const { sheetId } = useParams<{ sheetId: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (sheetId) {
      loadSheetAndJobs();
    }
  }, [sheetId]);

  const loadSheetAndJobs = async () => {
    try {
      // Load sheet details
      const { data: sheetData } = await sheetsAPI.get('/');
      const currentSheet = sheetData.find((s: Sheet) => s.id === sheetId);
      
      if (!currentSheet) {
        navigate('/');
        return;
      }
      
      setSheet(currentSheet);

      // Load jobs
      const { data: jobsData } = await jobsAPI.get(`/${sheetId}`);
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data } = await jobsAPI.post('/', {
        ...formData,
        sheetId
      });
      
      setJobs([...jobs, data]);
      setFormData({
        company: '',
        position: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowForm(false);
    } catch (err: any) {
      console.error('Failed to create job:', err);
      alert(err.response?.data?.error || 'Failed to create job');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await jobsAPI.delete(`/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to delete job');
    }
  };

  if (loading || !sheet) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="job-view-container">
      <div className="job-view-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-btn">← Back to Sheets</button>
          <div className="header-title">
            <h2>{sheet.name}</h2>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="add-job-btn">
          {showForm ? 'Cancel' : '+ Add Job'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-job-form">
          <h3>Add New Job Application</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
            </div>
            <div className="form-field">
              <label>Position *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-field">
              <label>Date Applied</label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => setFormData({...formData, dateApplied: e.target.value})}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Optional notes..."
            />
          </div>
          <button type="submit" className="form-submit-btn">Submit</button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          No jobs yet. Add your first application!
        </div>
      ) : (
        <div className="jobs-table">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="company-cell">{job.company}</td>
                  <td>{job.position}</td>
                  <td><span className="status-badge">{job.status}</span></td>
                  <td>{new Date(job.dateApplied).toLocaleDateString()}</td>
                  <td className="notes-cell">{job.notes || '-'}</td>
                  <td>
                    <button onClick={() => handleDelete(job.id)} className="delete-job-btn">
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
  );
}