import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/reducers/globalLoading';

const Layout = () => {
  const statusLoading = useSelector((state: RootState) => state.globalLoading.status);
  return (
    <div>
      <PropagateLoader
        loading={statusLoading}
        cssOverride={{
          position: 'absolute',
          top: '0',
          left: '0',
          margin: 'auto',
          textAlign: 'center',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgb(0 0 0 / 30%)',
          zIndex: '9999',
          paddingTop: '25%',
          height: '100vh',
        }}
        color="#36d7b7"
      />
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default Layout;
