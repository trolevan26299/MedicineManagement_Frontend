import { debounce } from 'lodash';
import { useState, useEffect } from 'react';
import { DefaultValues, FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import * as actions from '../../Redux/actions/index';
import { apiUrl, requestApi } from '../../helpers/api';
import './styles.css';
import { formatCurrency } from '../../constant/common';
import { toast } from 'react-toastify';

export interface IOptions {
  label?: string;
  value?: number;
  [key: string]: any;
}

interface ISelectValue {
  id: number;
  value: string | null;
  [key: string]: any;
}

interface ISelectCustomer {
  customer: number;
}

interface FormValues {
  customer?: number;
  details: {
    id?: number;
    count: number;
    price: number;
  }[];
  total_price: number;
  description: string;
}

const defaultValues: DefaultValues<FormValues> = {
  total_price: 0,
  description: '',
  details: [
    {
      count: 0,
      price: 0,
    },
  ],
};

const SaleForCategory = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues,
    reValidateMode: 'onSubmit',
  });
  const [selectCustomer, setSelectCustomer] = useState<ISelectCustomer>({ customer: 0 });
  const [optionCustomers, setOptionCustomers] = useState<IOptions[]>([]);
  const [selectValues, setSelectValues] = useState<ISelectValue[]>([{ id: 0, value: null }]);
  const [loadedOptions, setLoadedOptions] = useState<IOptions[]>([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    const totalPrice = selectValues.reduce((acc, item) => acc + item.price, 0);
    return totalPrice || 0;
  };
  // hanle add remove medicine0 list
  const addMedicine = () => {
    setSelectValues([...selectValues, { id: selectValues.length, value: null }]);
  };

  const handleSubmitFormAdd = async (data: any) => {
    dispatch(actions.controlLoading(true));
    const newData = {
      ...data,
      total_price: calculateTotalPrice(),
      details: selectValues.map((item: ISelectValue) => ({
        id: item.value,
        count: item.count,
      })),
    };

    try {
      await requestApi('/order', 'POST', { ...newData });
      toast.success('Customer has been created successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/order-history-list');
      }, 3000);
    } catch (error) {
      dispatch(actions.controlLoading(false));
    }
  };

  const onError = () => {
    if (selectCustomer.customer === 0) {
      setError('customer', { message: 'Customer is required !' });
    }
    const hasValidDetails = selectValues.some((item) => item.value === null && item.count === 0);

    if (!hasValidDetails) {
      setError('details', { message: 'Product is required !' });
    }
  };

  const debouncedFetchCustomers = debounce((searchTerm: string) => {
    const query = `?keyword=${searchTerm}`;
    dispatch(actions.controlLoading(false));

    requestApi(`/customer${query}`, 'GET', [])
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
  }, 300);

  const handleInputChangeCustomers = (value: string, { action }: any) => {
    if (action === 'input-blur') {
      return;
    }
    if (value === '') {
      return;
    } else {
      debouncedFetchCustomers(value);
    }
  };

  const handleChangeOptionCustomer = (optionsData: number) => {
    setValue('customer', optionsData);
    setSelectCustomer({ customer: optionsData as number });
    clearErrors('customer');
  };

  // medicine
  const debouncedFetchMedicines = debounce((searchTerm: string, id: number) => {
    const query = `?keyword=${searchTerm}`;
    requestApi(`/posts${query}`, 'GET', [])
      .then((response) => {
        const modifiedOptions = response.data.data.map((medicine: any) => ({
          label: medicine.title,
          value: medicine.id,
          price: medicine.price,
          imgUrl: medicine.thumbnail,
          count: 1,
        }));
        setLoadedOptions((prevOptions) => {
          const updatedOptions = [...prevOptions];
          updatedOptions[id] = modifiedOptions;
          return updatedOptions;
        });
        dispatch(actions.controlLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(actions.controlLoading(false));
      });
  }, 300);

  const handleInputChangeMedicines = async (value: string, id: number, { action }: any) => {
    if (action === 'input-blur') {
      return;
    }
    if (value === '') return;
    debouncedFetchMedicines(value, id);
  };

  const handleChangeMedicines = (value: ISelectValue | null, id: number) => {
    const updatedValues = [...selectValues];
    updatedValues[id].value = value?.value as string;
    updatedValues[id].count = value?.count as number;
    updatedValues[id].price = value?.price as number;
    setSelectValues(updatedValues);
    const allValuesNotNull = updatedValues.every((item) => item.value !== null);

    if (allValuesNotNull) {
      clearErrors('details');
    }
  };

  const handleRemoveMedicine = (id: number) => {
    const updatedValues = selectValues.filter((item) => item.id !== id);
    setSelectValues(updatedValues);
  };

  const handleCountChange = (newValue: string, id: number) => {
    const updatedValues = [...selectValues];
    const parsedCount = parseInt(newValue);

    if (!isNaN(parsedCount) && parsedCount > 0) {
      updatedValues[id].count = parsedCount;

      const selectedOption = loadedOptions[id]?.find((option) => option.value === updatedValues[id].value);
      if (selectedOption) {
        updatedValues[id].price = selectedOption.price * parsedCount;
      } else {
        updatedValues[id].price = 0;
      }
    }

    setSelectValues(updatedValues);
  };

  const CustomOption = ({ innerProps, data }: any) => {
    return (
      <div {...innerProps} style={{ display: 'flex', alignItems: 'center' }}>
        <img
          style={{ width: '100px', height: '100px', marginRight: '5px' }}
          src={`${apiUrl}/${data.imgUrl}`}
          alt={data.label}
        />
        <div>
          <div>{data.label}</div>
        </div>
      </div>
    );
  };
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    requestApi('/category', 'GET')
      .then((response) => {
        setCategory(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="form-label add-product">Add sale for category:</label>
                      <button type="button" onClick={addMedicine} className="btn-plus">
                        +
                      </button>
                      <div className="title_detail">
                        <p className="choose_medicine_category">vui lòng chọn thuốc</p>
                        <p className="input_sale_category">Nhập % khuyến mãi</p>
                      </div>
                      {selectValues.map((item, index) => (
                        <>
                          <div key={item.id} className={`all-product mb`}>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              onChange={handleCategoryChange}
                              value={selectedCategory}
                            >
                              {category.map((category: any) => {
                                return (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                );
                              })}
                            </select>
                            <input
                              type="number"
                              value={item.count || 0}
                              onChange={(e) => handleCountChange(e.target.value, index)}
                              className="select-quantity"
                            />

                            <button
                              type="button"
                              disabled={selectValues.length === 1}
                              onClick={() => handleRemoveMedicine(item.id)}
                              className="btn-remove"
                            >
                              -
                            </button>
                          </div>

                          {item.value === null && errors.details && <p className="err-text">Product is required !</p>}
                        </>
                      ))}
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

export default SaleForCategory;
