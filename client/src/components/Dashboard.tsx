import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sheetsAPI } from '../services/api';
import './Dashboard.css';

interface Sheet {
  id: string;
  name: string;
  createdAt: string;
}

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export default function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [newSheetName, setNewSheetName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    try {
      const { data } = await sheetsAPI.get('/');
      setSheets(data);
    } catch (err) {
      console.error('Failed to load sheets:', err);
      setError('Failed to load sheets');
    }
  };

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSheetName.trim()) return;

    try {
      const { data } = await sheetsAPI.post('/', { name: newSheetName });
      setSheets([data, ...sheets]);
      setNewSheetName('');
      setError('');
    } catch (err: any) {
      console.error('Failed to create sheet:', err);
      setError(err.response?.data?.error || 'Failed to create sheet');
    }
  };

  const handleDeleteSheet = async (sheetId: string) => {
    if (!confirm('Are you sure you want to delete this sheet? All associated jobs will be deleted.')) return;

    try {
      await sheetsAPI.delete(`/${sheetId}`);
      setSheets(sheets.filter(s => s.id !== sheetId));
    } catch (err) {
      console.error('Failed to delete sheet:', err);
      setError('Failed to delete sheet');
    }
  };

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
        <h2>Your Recruitment Cycles</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleCreateSheet} className="create-sheet-form">
          <input
            type="text"
            placeholder="New cycle name (e.g., Summer 2025)"
            value={newSheetName}
            onChange={(e) => setNewSheetName(e.target.value)}
          />
          <button type="submit">Create Sheet</button>
        </form>

        {sheets.length === 0 ? (
          <div className="empty-state">
            <p>No recruitment cycles yet. Create your first one!</p>
          </div>
        ) : (
          <div className="sheets-grid">
            {sheets.map((sheet) => (
              <div key={sheet.id} className="sheet-card">
                <h3>{sheet.name}</h3>
                <p>Created: {new Date(sheet.createdAt).toLocaleDateString()}</p>
                <div className="sheet-actions">
                  <button onClick={() => navigate(`/sheet/${sheet.id}`)}>View Jobs</button>
                  <button onClick={() => handleDeleteSheet(sheet.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}