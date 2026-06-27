import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // If token is missing, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render child components (via Outlet)
  return <Outlet />;
};

export default PrivateRoute;
