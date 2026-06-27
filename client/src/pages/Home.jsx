import React from 'react';
import { useFetchLinks } from '../hooks/useFetchLinks';
import BentoCard from '../components/BentoCard';
import SkeletonGrid from '../components/SkeletonGrid';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const { links, loading, error } = useFetchLinks(`${API_URL}/links`);

  return (
    <div>
      <div className="page-title-section">
        <span className="page-tag">
          <Sparkles size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Interactive Hub
        </span>
        <h1 className="page-title">Personal Bento Link Hub</h1>
        <p className="page-subtitle">
          Explore my projects, social channels, and creations. Every card click is tracked in real-time.
        </p>
      </div>

      {loading && <SkeletonGrid />}

      {error && (
        <div className="error-card">
          <AlertCircle size={48} color="#ef4444" />
          <h3 className="error-title">Backend API Offline</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            We could not connect to the database stream. Please verify that the Node.js/Express server is active and running.
          </p>
          <button className="btn btn-secondary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
            <RefreshCw size={14} /> Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && links.length === 0 && (
        <div className="error-card" style={{ background: 'rgba(255, 255, 255, 0.02)', borderColor: 'var(--border-color)' }}>
          <Sparkles size={48} color="var(--accent-cyan)" />
          <h3 className="card-title" style={{ marginTop: '1rem' }}>No Links Added Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
            The hub database is empty. Log in as admin and add some cards to populate your Bento Link Hub!
          </p>
        </div>
      )}

      {!loading && !error && links.length > 0 && (
        <div className="bento-grid">
          {links.map((link) => (
            <BentoCard key={link._id} item={link} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
