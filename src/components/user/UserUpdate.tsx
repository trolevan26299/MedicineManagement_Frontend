import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';
import { toast } from 'react-toastify';

const UserUpdate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSubmitFormUpdate = async (data: any) => {
    console.log(data);
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApi(`/users/${params.id}`, 'PUT', data);
      dispatch(actions.controlLoading(false));
      toast.success('User has been updated successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/users');
      }, 3000);
    } catch (error) {
      console.log(error);
      dispatch(actions.controlLoading(false));
    }
  };
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    try {
      const getDetailUser = async () => {
        const res = await requestApi(`/users/${params.id}`, 'GET');
        dispatch(actions.controlLoading(false));
        const fields = ['first_name', 'last_name', 'status', 'permission'];
        fields.forEach((field) => setValue(field, res.data[field]));
      };
      getDetailUser();
    } catch (error) {
      console.error(error);
      dispatch(actions.controlLoading(false));
    }
  }, []);
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> Update User</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/users">Users</Link>
            </li>
            <li className="breadcrumb-item active">Update</li>
          </ol>
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-plus me-1"></i>
              Update
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <form>
                  <div className="col-md-6">
                    <div className="mb-3 mt-3">
                      <label className="form-label">First Name:</label>
                      <input
                        type="text"
                        {...register('first_name', { required: 'First Name is required !' })}
                        className="form-control"
                        placeholder="Enter first name"
                      />
                      {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name.message}</p>}
                    </div>
                    <div className="mb-3 ">
                      <label className="form-label">Last Name:</label>
                      <input
                        type="text"
                        {...register('last_name', { required: 'Last Name is required !' })}
                        className="form-control"
                        placeholder="Enter last name"
                      />
                      {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name.message}</p>}
                    </div>
                    <div className="mb-3 ">
                      <label className="form-label">Password:</label>
                      <input
                        type="password"
                        {...register('password')}
                        className="form-control"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="mt-3 mb-3">
                      <label className="form-label">Permission:</label>
                      <select {...register('permission')} className="form-select">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="mt-3 mb-3">
                      <label className="form-label">Status:</label>
                      <select {...register('status')} className="form-select">
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                    <button type="button" onClick={handleSubmit(handleSubmitFormUpdate)} className="btn btn-success">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserUpdate;
