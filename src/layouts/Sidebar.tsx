import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../Redux/reducers/globalLoading';
import { PERMISSIONS } from '../constant/common';

const Sidebar = () => {
  const userRole = useSelector((state: RootState) => state.globalLoading.role);
  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark "
        style={{ paddingTop: '30%', color: '#ffffff' }}
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            <Link className="nav-link" to="/">
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt" />
              </div>
              Dashboard
            </Link>
            <a
              className="nav-link collapsed pb-2"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOrder"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-history"></i>
              </div>
              Order
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </a>
            <div
              className="collapse"
              id="collapseOrder"
              aria-labelledby="headingOne"
              data-bs-parent="#sidenavAccordion"
            >
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/order/add">
                  Add Order
                </Link>
                <Link className="nav-link" to="/order-history-list">
                  Order History List
                </Link>
              </nav>
            </div>
            <a
              className="nav-link collapsed pb-2"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapseLayouts"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-user-nurse"></i>
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
                {userRole === PERMISSIONS.ADMIN && (
                  <Link className="nav-link" to="/user/add">
                    Add User
                  </Link>
                )}
                <Link className="nav-link" to="/users">
                  List Users
                </Link>
              </nav>
            </div>
            <a
              className="nav-link collapsed pb-2"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapsePost"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-capsules"></i>
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
            <a
              className="nav-link collapsed pb-2"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapseCategory"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-book-medical"></i>
              </div>
              Category
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </a>
            <div
              className="collapse"
              id="collapseCategory"
              aria-labelledby="headingOne"
              data-bs-parent="#sidenavAccordion"
            >
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/category/add">
                  Add Category
                </Link>
                <Link className="nav-link" to="/categorys">
                  List Category
                </Link>
              </nav>
            </div>
            <a
              className="nav-link collapsed pb-2"
              href="/"
              data-bs-toggle="collapse"
              data-bs-target="#collapseCustomer"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-users"></i>
              </div>
              Customer
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </a>
            <div
              className="collapse"
              id="collapseCustomer"
              aria-labelledby="headingOne"
              data-bs-parent="#sidenavAccordion"
            >
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link" to="/customer/add">
                  Add Customer
                </Link>
                <Link className="nav-link" to="/customers">
                  List Customer
                </Link>
              </nav>
            </div>
            <Link
              className="nav-link "
              to="/sale"
              data-bs-target="#collapseSale"
              aria-expanded="false"
              aria-controls="collapseLayouts"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-donate"></i>
              </div>
              Sale
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
