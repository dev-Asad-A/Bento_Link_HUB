import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Plus, 
  Trash2, 
  BarChart3, 
  Link as LinkIcon, 
  LogOut,
  LayoutGrid,
  Shield,
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New link form fields
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [gridSpanX, setGridSpanX] = useState(1);
  const [gridSpanY, setGridSpanY] = useState(1);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/links`);
      setLinks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch links from the database.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    if (!title || !url) {
      setFormError('Title and URL are required');
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/links`,
        { title, url, gridSpanX, gridSpanY },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormSuccess('Link created successfully!');
      setTitle('');
      setUrl('');
      setGridSpanX(1);
      setGridSpanY(1);
      // Prepend to current list
      setLinks([res.data, ...links]);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create link. Ensure details are valid.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await axios.delete(`${API_URL}/links/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinks(links.filter((link) => link._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete link.');
    }
  };

  // Helper function to transform raw links array for Recharts
  // Sorts records by clickCount descending
  // Returns [{ name: 'Title', clicks: N }]
  const getChartData = () => {
    return [...links]
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .map((link) => ({
        name: link.title,
        clicks: link.clickCount || 0,
        id: link._id
      }));
  };

  const chartData = getChartData();
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);

  // Vibrant HSL colors for Bar/Pie charts
  const colors = ['#00f2fe', '#4facfe', '#7f00ff', '#ff007f', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div>
      {/* Dashboard Top Header */}
      <div className="page-title-section" style={{ textAlign: 'left', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="page-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} /> Admin Dashboard
          </span>
          <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Management Console</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Logged in as: <span style={{ color: 'var(--accent-cyan)' }}>{user.email}</span></p>
        </div>
        <button className="btn btn-secondary btn-danger" onClick={handleLogout} style={{ marginTop: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Left Side: Create New Link Card */}
        <div className="dashboard-panel">
          <h2 className="dashboard-panel-title">
            <Plus size={18} color="var(--accent-cyan)" /> Add Bento Link Card
          </h2>
          
          {formError && <div className="auth-alert error">{formError}</div>}
          {formSuccess && <div className="auth-alert success">{formSuccess}</div>}

          <form onSubmit={handleAddLink}>
            <div className="form-group">
              <label className="form-label">Link Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="GitHub Profile"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://github.com/username"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid-select-group">
              <div className="form-group">
                <label className="form-label">Grid Width (X)</label>
                <select 
                  className="form-input" 
                  value={gridSpanX} 
                  onChange={(e) => setGridSpanX(Number(e.target.value))}
                  disabled={submitting}
                >
                  <option value={1}>1 (Narrow)</option>
                  <option value={2}>2 (Medium)</option>
                  <option value={3}>3 (Wide)</option>
                  <option value={4}>4 (Full-Width)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Grid Height (Y)</label>
                <select 
                  className="form-input" 
                  value={gridSpanY} 
                  onChange={(e) => setGridSpanY(Number(e.target.value))}
                  disabled={submitting}
                >
                  <option value={1}>1 (Standard)</option>
                  <option value={2}>2 (Tall)</option>
                  <option value={3}>3 (Double Tall)</option>
                  <option value={4}>4 (Full Height)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '40px', justifyContent: 'center' }} disabled={submitting}>
              {submitting ? 'Creating...' : <><Plus size={16} /> Create Link</>}
            </button>
          </form>
        </div>

        {/* Right Side: Analytics & Link List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Analytics Chart Panel */}
          <div className="dashboard-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="dashboard-panel-title" style={{ margin: 0 }}>
                <BarChart3 size={18} color="var(--accent-cyan)" /> Click Analytics
              </h2>
              
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button 
                  className="btn" 
                  onClick={() => setChartType('bar')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px', background: chartType === 'bar' ? 'rgba(0, 242, 254, 0.15)' : 'transparent', color: chartType === 'bar' ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
                >
                  <BarChart3 size={12} /> Bar
                </button>
                <button 
                  className="btn" 
                  onClick={() => setChartType('pie')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px', background: chartType === 'pie' ? 'rgba(0, 242, 254, 0.15)' : 'transparent', color: chartType === 'pie' ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
                >
                  <PieChartIcon size={12} /> Pie
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Cards</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{links.length}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aggregated Clicks</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{totalClicks}</div>
              </div>
            </div>

            {loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading analytics data...</div>
            ) : chartData.length === 0 ? (
              <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                <BarChart3 size={36} style={{ marginBottom: '0.5rem' }} />
                <span>No click data to visualize. Add links and click them!</span>
              </div>
            ) : (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--text-muted)" 
                        fontSize={10} 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="var(--text-muted)" 
                        fontSize={10} 
                        tickLine={false} 
                        allowDecimals={false} 
                      />
                      <Tooltip 
                        contentStyle={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                      />
                      <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="clicks"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                        style={{ fontSize: '0.65rem', fill: 'var(--text-primary)' }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Links Listing Panel */}
          <div className="dashboard-panel">
            <h2 className="dashboard-panel-title">
              <LinkIcon size={18} color="var(--accent-cyan)" /> Live Link Grid Control
            </h2>

            {loading ? (
              <div style={{ color: 'var(--text-secondary)' }}>Loading links...</div>
            ) : links.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                No active links found. Add a link from the creation panel.
              </div>
            ) : (
              <div className="links-admin-list">
                {links.map((link) => (
                  <div key={link._id} className="link-admin-item">
                    <div className="link-admin-info">
                      <span className="link-admin-title">{link.title}</span>
                      <span className="link-admin-url">{link.url}</span>
                      <div className="link-admin-meta">
                        <span className="badge badge-clicks">{link.clickCount || 0} clicks</span>
                        <span className="badge">Grid: {link.gridSpanX}x{link.gridSpanY}</span>
                      </div>
                    </div>
                    <div className="link-admin-actions">
                      <button 
                        className="btn btn-secondary btn-danger" 
                        onClick={() => handleDeleteLink(link._id)}
                        style={{ padding: '0.5rem', borderRadius: '6px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
