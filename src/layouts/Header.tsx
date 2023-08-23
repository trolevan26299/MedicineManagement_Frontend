import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../Redux/reducers/globalLoading';
import globalLoading from '../Redux/reducers/globalLoading';

const Header = () => {
  const Navigate = useNavigate();
  const user = useSelector((state: RootState) => state.globalLoading.info);

  const onHandleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
    Navigate('/login');
  };
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark " style={{ position: 'fixed', width: '100%' }}>
      {/* Navbar Brand*/}
      <a className="navbar-brand ps-3" href="/">
        Long Chau Manage
      </a>
      {/* Sidebar Toggle*/}
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
        <i className="fas fa-bars" />
      </button>
      {/* Navbar Search*/}
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group"></div>
      </form>
      {/* Navbar*/}
      <ul
        className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <li style={{ color: '#ffffff', textTransform: 'uppercase' }}>
          {`${user.last_name} ${user.first_name} (${user.permission})`}{' '}
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            href="/"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw" />
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li>
              <a className="dropdown-item" href="#!" onClick={onHandleLogout}>
                Logout
              </a>
              <Link className="dropdown-item" to="/change-password">
                Change Password
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
