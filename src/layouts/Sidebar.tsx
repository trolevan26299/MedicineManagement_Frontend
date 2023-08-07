import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Core</div>
            <a className="nav-link" href="/">
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt" />
              </div>
              Dashboard
            </a>
            <div className="sb-sidenav-menu-heading">Interface</div>
            <a
              className="nav-link collapsed"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapseLayouts"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-user" />
              </div>
              Users
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </a>
            <div
              className="collapse"
              id="collapseLayouts"
              aria-labelledby="headingOne"
              data-bs-parent="#sidenavAccordion"
            >
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/user/add">
                  Add User
                </Link>
                <Link className="nav-link" to="/users">
                  List Users
                </Link>
              </nav>
            </div>
            <a
              className="nav-link collapsed"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapsePost"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-columns" />
              </div>
              Medicine
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </a>
            <div className="collapse" id="collapsePost" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/medicine/add">
                  Add Medicine
                </Link>
                <Link className="nav-link" to="/medicines">
                  List Medicines
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
