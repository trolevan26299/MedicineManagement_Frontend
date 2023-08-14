import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';
import CommonDatePicker from '../../utils/CommonDatePicker';
import Select from 'react-select';

const CustomerAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [birthDay, setBirthDay] = useState<Date | undefined>(undefined);
  const [medicine, setMedicine] = useState([]);

  const options = [
    { value: '01', label: 'Lê Văn Trợ - 0839579012 - 42 đường 2 tháng 2,Hải chẩu ,đà nẵng' },
    { value: '02', label: 'Phan Công Huy - 0949191441 - 42 đường 2 tháng 2,Hải chẩu ,đà nẵng' },
    { value: '03', label: 'Võ Mỹ Yến - 0374071200 - 12 An Thượng 24,Đà Nẵng' },
  ];
  // hanle add remove medicine0 list
  const addMedicine = () => {
    setMedicine([...medicine, { productName: '', quantity: 0 }]);
  };
  const deleteMedicine = (index: number) => {
    const updatedRows = [...medicine];
    updatedRows.splice(index, 1);
    setMedicine(updatedRows);
  };

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

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> New Order</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/order-history-list">Orders</Link>
            </li>
            <li className="breadcrumb-item active">Add New Order</li>
          </ol>
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-plus me-1"></i>
              Add Order
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <form>
                  <div className="col-md-6">
                    <div className="mb-3 mt-3">
                      <label className="form-label">Customer:</label>
                      <Select options={options} placeholder="Search Customer follow Name,Phone Number" />
                    </div>
                    <div className="mb-3 mt-3">
                      {medicine.map((item, index) => (
                        <div key={index}>
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) => {
                              const updatedRows = [...medicine];
                              updatedRows[index].productName = e.target.value;
                              setMedicine(updatedRows);
                            }}
                          />
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const updatedRows = [...rows];
                              updatedRows[index].quantity = e.target.value;
                              setMedicine(updatedRows);
                            }}
                          />
                          <button onClick={() => deleteMedicine(index)}>-</button>
                        </div>
                      ))}
                      <button type="button" onClick={addMedicine}>
                        +
                      </button>
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Birth Day:</label>
                      <CommonDatePicker
                        selectedDate={birthDay}
                        setSelecteDate={setBirthDay as any}
                        format="dd/MM/yyyy"
                        placeholder="DD/MM/YYYY"
                      />
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
                    <button type="button" onClick={handleSubmit(handleSubmitFormAdd)} className="btn btn-success">
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
