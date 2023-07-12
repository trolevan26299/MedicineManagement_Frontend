import React, { useState, useEffect } from 'react';
import { requestApi } from '../helpers/api';
import { UserList } from '../Definition/user.dto';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<UserList>({});

  useEffect(() => {
    requestApi('/users', 'GET', [])
      .then((response) => {
        setDashboardData({
          ...dashboardData,
          totalUser: response.data.totalCount,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Dashboard</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card bg-primary text-white mb-4">
                <div className="card-body">
                  Total Users
                  {dashboardData.totalUser && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                      {dashboardData.totalUser}
                    </span>
                  )}
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <a className="small text-white stretched-link" href="/">
                    View Details
                  </a>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-warning text-white mb-4">
                <div className="card-body">Warning Card</div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <a className="small text-white stretched-link" href="/">
                    View Details
                  </a>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-success text-white mb-4">
                <div className="card-body">Success Card</div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <a className="small text-white stretched-link" href="/">
                    View Details
                  </a>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-danger text-white mb-4">
                <div className="card-body">Danger Card</div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <a className="small text-white stretched-link" href="/">
                    View Details
                  </a>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 bg-light mt-auto">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between small">
            <div className="text-muted">Copyright © Your Website 2021</div>
            <div>
              <a href="/">Privacy Policy</a>·<a href="/">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
