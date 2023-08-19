import { debounce, update } from 'lodash';
import { useState, useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { formatCurrency } from '../../constant/common';
import { apiUrl, requestApi } from '../../helpers/api';
import './styles.css';
import { IDetailOrder, IOrder } from './OrderHistoryList';

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

export const customStylesCustomer = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? '#e9ecef' : provided.backgroundColor,
    color: state.isDisabled ? 'black' : provided.color,
    border: state.isDisabled ? '1px solid #ced4da' : provided.border,
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? 'black' : provided.color,
  }),
};

export const customStylesMedicines = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? '#e9ecef' : provided.backgroundColor,
    color: state.isDisabled ? 'black' : provided.color,
    border: state.isDisabled ? '1px solid #ced4da' : provided.border,
    width: '400px',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? 'black' : provided.color,
  }),
};

const OrderAdd = ({ readonly, data }: { readonly?: boolean; data?: IOrder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

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
      if (id) {
        await requestApi(`/order/${id}`, 'PUT', { ...newData });
        toast.success('Customer has been updated successfully !', { position: 'top-center', autoClose: 2000 });
        setTimeout(() => {
          navigate('/order-history-list');
        }, 3000);
      } else {
        await requestApi('/order', 'POST', { ...newData });
        toast.success('Customer has been created successfully !', { position: 'top-center', autoClose: 2000 });
        setTimeout(() => {
          navigate('/order-history-list');
        }, 3000);
      }
    } catch (error) {
      dispatch(actions.controlLoading(false));
    }
  };

  const onError = () => {
    if (selectCustomer.customer === 0) {
      setError('customer', { message: 'Customer is required !' });
    }
    const hasValidDetails = selectValues.filter((item) => item.value === null && item.id === 0).length > 0;

    if (hasValidDetails) {
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
          price: medicine.price_sale !== 0 ? medicine.price_sale : medicine.price,
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
    const updatedValues = selectValues.filter((item) => item.id !== id).map((x, index) => ({ ...x, id: index }));
    const indexLoadedOptions = selectValues.findIndex((item) => item.id === id);
    const updateLoadedOptions = loadedOptions.filter((item, index) => index !== indexLoadedOptions);
    setLoadedOptions(updateLoadedOptions);
    setSelectValues(updatedValues);
  };

  const handleCountChange = (newValue: string, id: number) => {
    const updatedValues = [...selectValues];
    const parsedCount = parseInt(newValue);

    if (!isNaN(parsedCount) && parsedCount > 0) {
      updatedValues[id].count = parsedCount;

      const selectedOption = loadedOptions[id]?.find((option: any) => option.value === updatedValues[id].value);
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
          style={{ width: '120px', height: '120px', marginRight: '5px' }}
          src={`${apiUrl}/${data.imgUrl}`}
          alt={data.label}
        />
        <div>
          <div>{data.label}</div>
        </div>
      </div>
    );
  };

  const setDataToForm = (data: IOrder) => {
    const cloneData = { ...data };
    const currentOptionCustomer = [
      {
        value: cloneData?.customer?.id as number,
        label: `${cloneData?.customer?.full_name} - ${cloneData?.customer?.phone_number} - ${cloneData?.customer?.address}`,
      },
    ];
    setOptionCustomers(currentOptionCustomer);
    setSelectCustomer({ customer: cloneData?.customer?.id as number });
    setValue('description', cloneData?.description as string);

    const setOptionProducts = cloneData?.details?.map((item: IDetailOrder, index: number) => ({
      id: index,
      value: item.post_id,
      count: item?.count,
      price: ((item?.post?.price_sale ? item?.post?.price_sale : item.post?.price) as number) * (item?.count as number),
    }));
    const setLoadOptionProducts = cloneData?.details?.map((item: IDetailOrder) => [
      {
        value: item.post_id,
        label: item.post?.title,
        price: item?.post?.price_sale ? item?.post?.price_sale : item.post?.price,
        imgUrl: item.post?.thumbnail,
      },
    ]);
    setSelectValues(setOptionProducts);
    setLoadedOptions(setLoadOptionProducts);
  };

  const fetchOrderById = (id: number) => {
    requestApi(`/order/${id}`, 'GET', [])
      .then((response) => {
        setDataToForm(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (data) setDataToForm(data);
    if (id) fetchOrderById(Number(id));
    if (!data && !id) {
      setSelectCustomer({ customer: 0 });
      setOptionCustomers([]);
      setSelectValues([{ id: 0, value: null }]);
      setLoadedOptions([]);
      setValue('description', '');
    }
  }, [data, id]);
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          {!readonly && (
            <>
              <h1 className="mt-4">{id ? 'Update Order' : 'New Order'}</h1>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/order-history-list">Orders</Link>
                </li>
                <li className="breadcrumb-item active">{id ? 'Update order' : 'Add New Order'}</li>
              </ol>
            </>
          )}
          <div className="card mb-4" style={{ height: '77vh' }}>
            {!readonly && (
              <div className="card-header">
                <i className="fas fa-plus me-1"></i>
                {id ? 'Update Order' : 'Add Order'}
              </div>
            )}
            <div className="card-body">
              <div className="row mb-3">
                <form>
                  <div className={`col-md-6 ${readonly ? 'w-100' : ''}`}>
                    <div className="mb-3 mt-3">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="form-label">Customer:</label>
                      <Select
                        name="customer"
                        options={optionCustomers || []}
                        placeholder="Search Customer follow Name,Phone Number"
                        onInputChange={handleInputChangeCustomers}
                        isMulti={false}
                        onChange={(selectedOption: any) => handleChangeOptionCustomer(selectedOption.value)}
                        value={optionCustomers?.find((option: any) => option.value === selectCustomer.customer)}
                        isDisabled={readonly}
                        styles={customStylesCustomer}
                      />
                      {errors.customer && <p className="err-text">{errors.customer.message}</p>}
                    </div>
                    <div className="mb-3 mt-3">
                      <div className="add_product">
                        <label className="form-label add-product">{!readonly ? 'Add Medicine:' : 'Detail Order'}</label>
                        {!readonly && (
                          <button type="button" onClick={addMedicine} className="btn-plus" disabled={readonly}>
                            +
                          </button>
                        )}
                      </div>
                      {selectValues.map((item, index) => (
                        <>
                          <div key={item.id} className={`all-product mb`}>
                            <Select
                              name="details"
                              placeholder="search medicine"
                              className="select-product"
                              options={(loadedOptions[item.id] || []) as any}
                              onInputChange={(inputValue, actionMeta) => {
                                handleInputChangeMedicines(inputValue, item.id, actionMeta);
                              }}
                              components={{ Option: CustomOption }}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                              value={loadedOptions[item.id]?.find((option: any) => option?.value === item?.value) || ''}
                              onChange={(value) => handleChangeMedicines(value || null, item.id)}
                              isDisabled={readonly}
                              styles={customStylesMedicines}
                            />
                            <input
                              type="number"
                              value={item.count || 0}
                              onChange={(e) => handleCountChange(e.target.value, index)}
                              className="select-quantity form-control"
                              disabled={readonly}
                              style={{ height: '38px' }}
                            />
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Price"
                              disabled
                              value={formatCurrency(item.price || 0)}
                            />
                            {!readonly && (
                              <button
                                type="button"
                                disabled={selectValues.length === 1}
                                onClick={() => handleRemoveMedicine(item.id)}
                                className="btn-remove"
                                style={{ width: '255px' }}
                              >
                                -
                              </button>
                            )}
                          </div>

                          {item.value === null && errors.details && <p className="err-text">Product is required !</p>}
                        </>
                      ))}
                      <div className="d-flex total-price">
                        <h4>Total Price : {formatCurrency(calculateTotalPrice())}</h4>
                      </div>
                    </div>
                    <div className="mb-3 mt-3">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="form-label">Description:</label>
                      <input
                        type="text"
                        {...register('description', { required: 'Description is required !' })}
                        className="form-control"
                        placeholder="Enter Description"
                        onBlur={() => clearErrors('description')}
                        disabled={readonly}
                      />
                      {errors.description && <p className="err-text">{errors.description.message}</p>}
                    </div>
                    {!readonly && (
                      <button
                        type="button"
                        onClick={handleSubmit(handleSubmitFormAdd, onError)}
                        className="btn btn-success"
                      >
                        Submit
                      </button>
                    )}
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

export default OrderAdd;
