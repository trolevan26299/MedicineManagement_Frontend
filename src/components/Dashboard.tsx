import React, { useState, useEffect } from 'react';
import { requestApi } from '../helpers/api';
import { DashboardDto } from '../Definition/user.dto';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../Redux/actions/index';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState<DashboardDto>({});

  useEffect(() => {
    const promiseUser = requestApi('/users', 'GET');
    const promisePost = requestApi('/posts', 'GET');
    dispatch(actions.controlLoading(true));
    Promise.all([promiseUser, promisePost])
      .then((res) => {
        dispatch(actions.controlLoading(false));
        setDashboardData({ ...dashboardData, totalUser: res[0].data.totalCount, totalPost: res[1].data.totalCount });
      })
      .catch((err) => {
        console.error(err);
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
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {dashboardData.totalUser}
                    </span>
                  )}
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link className="small text-white stretched-link" to="/users">
                    View Details
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-warning text-white mb-4">
                <div className="card-body">
                  Total Posts
                  {dashboardData.totalPost && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {dashboardData.totalPost}
                    </span>
                  )}
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/users" className="small text-white stretched-link">
                    View Details
                  </Link>
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
