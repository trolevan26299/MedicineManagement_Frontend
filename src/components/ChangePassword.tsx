import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../Redux/actions/index';
import { requestApi } from '../helpers/api';
import { RootState } from '../Redux/reducers/globalLoading';
import React from 'react';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useSelector((state: RootState) => state.globalLoading.info);

  const handleSubmitFormChangePass = async (data: any) => {
    dispatch(actions.controlLoading(true));
    try {
      await requestApi('/auth/change-password', 'PUT', { ...data, email: user.email });
      dispatch(actions.controlLoading(false));
      toast.success('Change password successfully !', { position: 'top-center', autoClose: 2000 });
    } catch (error) {
      toast.error(`${error.response.data.message}`, { position: 'top-center', autoClose: 2000 });
      dispatch(actions.controlLoading(false));
    }
  };

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> Change Password</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/" onClick={() => navigate(-1)}>
                Come back
              </Link>
            </li>
          </ol>
          <div className="card mb-4 p-4" style={{ height: '700px' }}>
            <form>
              <div className="col-md-6">
                <div className="mb-3 mt-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    {...register('email')}
                    value={user.email}
                    readOnly
                    className="form-control"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required !' })}
                    className="form-control"
                    placeholder="Enter password"
                  />
                  {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="form-label">New password:</label>
                  <input
                    type="password"
                    {...register('newPassword', { required: 'New password is required !' })}
                    className="form-control"
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(handleSubmitFormChangePass)}
                  className="btn btn-success mt-5"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
