import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';
import CommonDatePicker from '../../utils/CommonDatePicker';
import InputMask from 'react-input-mask';

const CustomerAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [birthDay, setBirthDay] = useState<Date | undefined>(undefined);
  const handleSubmitFormAdd = async (data: any) => {
    dispatch(actions.controlLoading(true));
    try {
      await requestApi('/customer', 'POST', { ...data, birth_day: birthDay });
      dispatch(actions.controlLoading(false));
      toast.success('Customer has been created successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/customers');
      }, 3000);
    } catch (error) {
      dispatch(actions.controlLoading(false));
    }
  };

  const onError = () => {
    if (!birthDay) {
      setError('birth_day', { message: 'Birth day is required !' });
    }
  };

  const handleChangeDate = (date: Date) => {
    setBirthDay(date);
    clearErrors('birth_day');
  };

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> New Customer</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/customers">Customers</Link>
            </li>
            <li className="breadcrumb-item active">Add New Customer</li>
          </ol>
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-plus me-1"></i>
              Add
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
                      <CommonDatePicker
                        selectedDate={birthDay}
                        setSelecteDate={(date: Date) => handleChangeDate?.(date)}
                        format="dd/MM/yyyy"
                        placeholder="DD/MM/YYYY"
                        name="birth_day"
                      />
                      {errors.birth_day && <p style={{ color: 'red' }}>{errors.birth_day.message}</p>}
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Phone Number:</label>
                      <InputMask
                        mask="+84 999 999 999"
                        maskChar="_"
                        id="phone"
                        placeholder="+84"
                        {...register('phone_number', {
                          required: 'Phone Number is required !',
                          pattern: {
                            value: /^(\+84\s\d{3}\s\d{3}\s\d{3})$/,
                            message: 'Please enter a valid Vietnamese phone number (+84 xxx xxx xxx)',
                          },
                        })}
                        className="form-control"
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
                      <input
                        type="email"
                        {...register('email', {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email format',
                          },
                        })}
                        className="form-control"
                        placeholder="Enter Email"
                      />
                      {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                    </div>
                    <div className="mt-3 mb-3">
                      <label className="form-label">Status:</label>
                      <select {...register('status')} className="form-select">
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit(handleSubmitFormAdd, onError)}
                      className="btn btn-success"
                    >
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

export default CustomerAdd;
