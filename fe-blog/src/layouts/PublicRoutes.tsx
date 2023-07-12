import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
  const token = localStorage.getItem('ACCESS_TOKEN') || false;
  return !token ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
