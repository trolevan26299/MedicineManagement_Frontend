import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';

const CustomerUpdate = () => {
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
    dispatch(actions.controlLoading(true));
    try {
      await requestApi(`/customer/${params.id}`, 'PUT', data);
      dispatch(actions.controlLoading(false));
      toast.success('Customer has been updated successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/customers');
      }, 3000);
    } catch (error) {
      console.log(error);
      dispatch(actions.controlLoading(false));
    }
  };
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    try {
      const getCustomerDetail = async () => {
        const res = await requestApi(`/customer/${params.id}`, 'GET');
        dispatch(actions.controlLoading(false));
        const fields = ['full_name', 'birth_day', 'phone_number', 'address', 'email', 'status'];
        fields.forEach((field) => setValue(field, res.data[field]));
      };
      getCustomerDetail();
    } catch (error) {
      console.error(error);
      dispatch(actions.controlLoading(false));
    }
  }, []);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> Update Customer</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/customers">Customers</Link>
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
                      <label className="form-label">Full Name:</label>
                      <input
                        type="text"
                        {...register('full_name', { required: 'FullName is required !' })}
                        className="form-control"
                        placeholder="Enter Full Name "
                      />
                      {errors.full_name && <p style={{ color: 'red' }}>{errors.full_name.message}</p>}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Birth Day:</label>
                      <input
                        type="date"
                        {...register('birth_day', { required: 'Birth Day is required !' })}
                        className="form-control"
                        placeholder="Enter Birth Day "
                      />
                      {errors.birth_day && <p style={{ color: 'red' }}>{errors.birth_day.message}</p>}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Phone Number:</label>
                      <input
                        type="text"
                        {...register('phone_number', { required: 'Phone Number is required !' })}
                        className="form-control"
                        placeholder="Enter Phone Number"
                      />
                      {errors.phone_number && <p style={{ color: 'red' }}>{errors.phone_number.message}</p>}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Address:</label>
                      <input
                        type="text"
                        {...register('address')}
                        className="form-control"
                        placeholder="Enter Address"
                      />
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Email:</label>
                      <input type="email" {...register('email')} className="form-control" placeholder="Enter Email" />
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

export default CustomerUpdate;
