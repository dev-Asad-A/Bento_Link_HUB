import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { Shield, Home as HomeIcon, LayoutGrid, Heart } from 'lucide-react';

// A sub-component to handle conditional header/navbar states
const NavigationHeader = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state when location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <header>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="logo-container">
          <div className="logo-icon">B</div>
          <span className="logo-text">BentoHub</span>
        </div>
      </Link>
      <nav>
        <Link to="/" className="btn btn-secondary">
          <HomeIcon size={16} /> Home
        </Link>
        {isLoggedIn ? (
          <Link to="/dashboard" className="btn btn-primary">
            <LayoutGrid size={16} /> Dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn btn-secondary">
            <Shield size={16} /> Admin Login
          </Link>
        )}
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavigationHeader />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected admin dashboard route */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>

        <footer>
          <p>© {new Date().getFullYear()} Bento Link Hub.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
