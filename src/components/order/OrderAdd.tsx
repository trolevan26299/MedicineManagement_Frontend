import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';
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
  const [medicine, setMedicine] = useState([{ productName: '', quantity: 0 }]);

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
                      <label className="form-label">Add Product:</label>
                      <button type="button" onClick={addMedicine}>
                        +
                      </button>
                      {medicine.map((item, index) => (
                        <div key={index}>
                          <input
                            type="text"
                            placeholder="search medicine"
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
                              const updatedRows = [...medicine];
                              updatedRows[index].quantity = e.target.value;
                              setMedicine(updatedRows);
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Price"
                            disabled
                            value={item.productName}
                            onChange={(e) => {
                              const updatedRows = [...medicine];
                              updatedRows[index].productName = e.target.value;
                              setMedicine(updatedRows);
                            }}
                          />
                          <button disabled={index === 0} onClick={() => deleteMedicine(index)}>
                            -
                          </button>
                        </div>
                      ))}
                      <div className="d-flex ">
                        <h4>Total Price :</h4>
                        <h4>1000</h4>
                      </div>
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Description:</label>
                      <input
                        type="text"
                        {...register('description', { required: 'Description is required !' })}
                        className="form-control"
                        placeholder="Enter Description "
                      />
                      {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
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
