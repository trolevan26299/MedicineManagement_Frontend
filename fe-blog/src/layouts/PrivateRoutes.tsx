import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const token = localStorage.getItem('ACCESS_TOKEN') || false;
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
