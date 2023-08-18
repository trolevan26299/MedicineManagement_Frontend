import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Main = () => {
  return (
    <div>
      <Header />
      <div id="layoutSidenav" style={{ height: '100vh' }}>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
