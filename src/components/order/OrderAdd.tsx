import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { apiUrl, requestApi } from '../../helpers/api';
import Select, { components } from 'react-select';
import { debounce } from 'lodash';

export interface IOptions {
  label?: string;
  value?: number;
  [key: string]: any;
}

interface FormValues {
  customerId?: number;
  product?: {
    medicineId: number;
    count: number;
  }[];
  totalPrice: number;
  description: string;
}

const defaultValues: DefaultValues<FormValues> = {
  totalPrice: 0,
  description: '',
};

const CustomerAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValue,
  } = useForm<FormValues>({
    defaultValues,
    reValidateMode: 'onSubmit',
  });
  const [birthDay, setBirthDay] = useState<Date | undefined>(undefined);
  const [medicine, setMedicine] = useState([{ productId: 0, quantity: 0 }]);
  const [optionCustomers, setOptionCustomers] = useState<IOptions[]>([]);
  const [optionMedicines, setOptionMedicines] = useState<IOptions[]>([]);
  // hanle add remove medicine0 list
  const addMedicine = () => {
    setMedicine([...medicine, { productId: 0, quantity: 0 }]);
  };
  const deleteMedicine = (index: number) => {
    const updatedRows = [...medicine];
    updatedRows.splice(index, 1);
    setMedicine(updatedRows);
  };

  const handleSubmitFormAdd = async (data: any) => {
    console.log('🚀 ~ file: OrderAdd.tsx:58 ~ handleSubmitFormAdd ~ data:', data);
    // dispatch(actions.controlLoading(true));
    // try {
    //   await requestApi('/customer', 'POST', { ...data, birth_day: birthDay });
    //   dispatch(actions.controlLoading(false));
    //   toast.success('Customer has been created successfully !', { position: 'top-center', autoClose: 2000 });
    //   setTimeout(() => {
    //     navigate('/customers');
    //   }, 3000);
    // } catch (error) {
    //   dispatch(actions.controlLoading(false));
    // }
  };

  const fetchCustomers = async (searchTerm: string) => {
    const query = `?keyword=${searchTerm}`;
    dispatch(actions.controlLoading(false));

    await requestApi(`/customer${query}`, 'GET', [])
      .then((response) => {
        if (response.data) {
          const newOptions = response.data.data.map((item: any) => ({
            value: item.id,
            label: `${item.full_name} - ${item.phone_number} - ${item.address}`,
          }));
          setOptionCustomers(newOptions);
          dispatch(actions.controlLoading(false));
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch(actions.controlLoading(false));
      });
  };

  const fetchMedicines = async (searchTerm: string) => {
    const query = `?keyword=${searchTerm}`;
    await requestApi(`/posts${query}`, 'GET', [])
      .then((response) => {
        const modifiedOptions = response.data.data.map((medicine: any) => ({
          label: medicine.title,
          value: medicine.id,
          price: medicine.price,
          imgUrl: medicine.thumbnail,
        }));
        setOptionMedicines(modifiedOptions);
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  };

  const debouncedFetchCustomers = debounce(fetchCustomers, 300);
  const debouncedFetchMedicines = debounce(fetchMedicines, 300);

  const handleInputChangeCustomers = (value: string, { action }: any) => {
    if (action === 'input-blur') {
      return;
    }
    if (!value) {
      setOptionCustomers([]);
    } else {
      debouncedFetchCustomers(value);
    }
  };

  const handleInputChangeMedicines = (value: string, { action }: any) => {
    if (action === 'input-blur') {
      return;
    }
    if (!value) {
      setOptionMedicines([]);
    } else {
      debouncedFetchMedicines(value);
    }
  };

  const handleChangeOptionCustomer = (optionsData: IOptions) => {
    setValue('customerId', optionsData.value);
  };

  const handleChangeOptionMedicines = (optionsData: IOptions) => {
    console.log('🚀 ~ file: OrderAdd.tsx:139 ~ handleChangeOptionMedicines ~ optionsData:', optionsData);
    const currentProduct = getValue('product');
    console.log('🚀 ~ file: OrderAdd.tsx:147 ~ handleChangeOptionMedicines ~ currentProduct:', currentProduct);
  };

  const CustomOption = ({ innerProps, data }: any) => {
    return (
      <div {...innerProps} style={{ display: 'flex', alignItems: 'center' }}>
        <img style={{ width: '100px', height: '100px', mr: '5px' }} src={`${apiUrl}/${data.imgUrl}`} alt={data.label} />
        <div>
          <div>{data.label}</div>
        </div>
      </div>
    );
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
                      <Select
                        options={optionCustomers}
                        placeholder="Search Customer follow Name,Phone Number"
                        onInputChange={handleInputChangeCustomers}
                        isMulti={false}
                        onChange={handleChangeOptionCustomer}
                        // isLoading
                      />
                    </div>
                    <div className="mb-3 mt-3">
                      <label className="form-label">Add Product:</label>
                      <button type="button" onClick={addMedicine}>
                        +
                      </button>
                      {medicine.map((item, index) => (
                        <div key={index}>
                          <Select
                            options={optionMedicines}
                            placeholder="search medicine"
                            onInputChange={handleInputChangeMedicines}
                            isMulti={false}
                            onChange={handleChangeOptionMedicines}
                            components={{
                              Option: CustomOption,
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
                            // value={item.productName}
                            onChange={(e) => {
                              // const updatedRows = [...medicine];
                              // updatedRows[index].productName = e.target.value;
                              // setMedicine(updatedRows);
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
