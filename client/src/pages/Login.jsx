import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        // Register route
        await axios.post(`${API_URL}/auth/register`, { email, password });
        setSuccess('Registration successful! Please login.');
        setIsRegister(false);
        setPassword('');
      } else {
        // Login route
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ margin: '0 auto 1rem auto', width: '48px', height: '48px', borderRadius: '12px', fontSize: '1.5rem' }}>B</div>
          <h2>{isRegister ? 'Create Admin Account' : 'Admin Login'}</h2>
          <p>{isRegister ? 'Register to manage your Bento Hub' : 'Enter credentials to access the analytics dashboard'}</p>
        </div>

        {error && <div className="auth-alert error">{error}</div>}
        {success && <div className="auth-alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="admin@bento.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '44px', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Processing...' : (
              isRegister ? (
                <>Register Account <UserPlus size={16} /></>
              ) : (
                <>Log In <LogIn size={16} /></>
              )
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button 
            type="button" 
            className="auth-link" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
          >
            {isRegister ? 'Log In' : 'Register Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
