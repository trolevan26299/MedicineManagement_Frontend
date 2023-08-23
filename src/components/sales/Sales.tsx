import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { formatCurrency } from '../../constant/common';
import { apiUrl, requestApi } from '../../helpers/api';
import { IOptions } from '../order/OrderAdd';
import './styles.css';

interface ISelectValue {
  id: number;
  value: string | null;
  [key: string]: any;
}

interface FormValues {
  id_medicine?: number;
  price_sale?: number;
  id_category?: number;
  percent_sales?: number;
}

const defaultValues: DefaultValues<FormValues> = {
  id_medicine: 0,
  price_sale: 0,
  id_category: 0,
  percent_sales: 0,
};

const Sales = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues,
    reValidateMode: 'onSubmit',
  });
  const [selectValues, setSelectValues] = useState<ISelectValue[]>([{ id: 0, value: null }]);
  const [selectCategory, setSelectCategory] = useState<ISelectValue[]>([{ id: 0, value: null }]);

  const [loadedOptions, setLoadedOptions] = useState<IOptions[]>([]);
  const [typeSalesItem, setTypeSaleItem] = useState<boolean>(true);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const addMedicine = () => {
    if (typeSalesItem) {
      setSelectValues([...selectValues, { id: selectValues.length, value: null }]);
    } else {
      setSelectCategory([...selectCategory, { id: selectCategory.length, value: '11', percent_sales: 1 }]);
    }
  };

  const handleSubmitFormAdd = async () => {
    if (typeSalesItem) {
      const hasValidDetails = selectValues.filter((item) => item.value === null).length > 0;
      if (hasValidDetails) {
        setError('id_medicine', { message: 'Medicine is required !' });
      } else {
        dispatch(actions.controlLoading(true));
        const newData = selectValues.map((item: ISelectValue) => ({
          id_medicine: item.value,
          price_sale: item.price,
        }));
        try {
          await requestApi('/medicines/sales', 'PATCH', newData);
          toast.success('Customer has been created successfully !', { position: 'top-center', autoClose: 2000 });
          setTimeout(() => {
            navigate('/medicines');
          }, 3000);
        } catch (error) {
          dispatch(actions.controlLoading(false));
        }
      }
    } else {
      const hasValidDetails = selectCategory.filter((item) => item.value === null).length > 0;
      if (hasValidDetails) {
        setError('id_category', { message: 'Category is required !' });
      } else {
        dispatch(actions.controlLoading(true));
        const newData = selectCategory.map((item: ISelectValue) => ({
          id_category: Number(item.value),
          percent_sales: Number(item.percent_sales),
        }));
        try {
          await requestApi('/medicines/sales-category', 'PATCH', newData);
          toast.success('Customer has been created successfully !', { position: 'top-center', autoClose: 2000 });
          setTimeout(() => {
            navigate('/medicines');
          }, 3000);
        } catch (error) {
          dispatch(actions.controlLoading(false));
        }
      }
    }
  };

  // medicine
  const debouncedFetchMedicines = debounce((searchTerm: string, id: number) => {
    const query = `?keyword=${searchTerm}`;
    requestApi(`/medicines${query}`, 'GET', [])
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

          const selectedValues = selectValues.map((selected) => selected.value);

          updatedOptions[id] = modifiedOptions.filter((option: any) => !selectedValues.includes(option.value));

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
    updatedValues[id].price = (value?.price * ((100 - value?.count) / 100)) as number;
    setSelectValues(updatedValues);

    const allValuesNotNull = updatedValues.every((item) => item.value !== null);

    if (allValuesNotNull) {
      clearErrors('id_medicine');
    }
  };

  const handleRemoveMedicine = (id: number) => {
    const updatedValues = selectValues.filter((item) => item.id !== id).map((x, index) => ({ ...x, id: index }));
    const indexLoadedOptions = selectValues.findIndex((item) => item.id === id);
    const updateLoadedOptions = loadedOptions.filter((item, index) => index !== indexLoadedOptions);
    setLoadedOptions(updateLoadedOptions);
    setSelectValues(updatedValues);
  };

  const handleChangeCountMedicinesSale = (newValue: string, id: number) => {
    const updatedValues = [...selectValues];
    const parsedCount = parseInt(newValue);

    if (!isNaN(parsedCount) && parsedCount > 0) {
      updatedValues[id].count = parsedCount;

      const selectedOption = loadedOptions[id]?.find((option: any) => option.value === updatedValues[id].value);
      if (selectedOption) {
        updatedValues[id].price = selectedOption.price * ((100 - parsedCount) / 100);
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

  // category
  const handleCountChangeCountCategorySale = (newValue: string, id: number) => {
    const updateCategory = [...selectCategory];
    const parsedCount = parseInt(newValue);

    if (!isNaN(parsedCount) && parsedCount > 0) {
      updateCategory[id].percent_sales = parsedCount;
    }
    setSelectCategory(updateCategory);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const cloneSelectCategory = [...selectCategory];
    cloneSelectCategory[id].value = event.target.value;
    cloneSelectCategory[id].percent_sales = 1;
    setSelectCategory(cloneSelectCategory);
    const allValuesNotNull = cloneSelectCategory.every((item) => item.value !== null);

    if (allValuesNotNull) {
      clearErrors('id_category');
    }
  };

  const handleRemoveCategory = (id: number) => {
    const cloneSelectCategory = [...selectCategory]
      .filter((item) => item.id !== id)
      .map((x, index) => ({ ...x, id: index }));
    setSelectCategory(cloneSelectCategory);
  };

  useEffect(() => {
    requestApi('/category', 'GET')
      .then((response) => {
        setCategory(response.data.data);
        const newData = [{ id: selectCategory.length, value: '11', percent_sales: 1 }];
        setSelectCategory(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">New Sales</h1>

          <div className="card mb-4 mt-4" style={{ height: '82vh' }}>
            <div className="card-header">
              <i className="fas fa-plus me-1"></i>
              Add Sales
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <form>
                  <div className="col-md-6">
                    <div className="mb-3 mt-3">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="form-label add-product">Sales for :</label>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic radio toggle button group"
                        onChange={(e) => {
                          if (e.target.value === 'item') setTypeSaleItem(true);
                          else setTypeSaleItem(false);
                        }}
                      >
                        <input
                          type="radio"
                          value="item"
                          className="btn-check"
                          id="btnradio2"
                          autoComplete="off"
                          name="btnradio"
                          checked={typeSalesItem}
                        />
                        <label className="btn btn-outline-info" htmlFor="btnradio2">
                          Medicine Item
                        </label>

                        <input
                          type="radio"
                          value="category"
                          className="btn-check"
                          id="btnradio3"
                          autoComplete="off"
                          name="btnradio"
                          checked={!typeSalesItem}
                        />
                        <label className="btn btn-outline-info" htmlFor="btnradio3">
                          Category
                        </label>
                      </div>
                      {typeSalesItem ? (
                        <>
                          <div className="title_detail">
                            <p className="choose_medicine">Please choose medicine</p>
                            <p className="input_sale">Enter % Sales</p>
                            <p className="price_sale">Price after sales</p>
                            <button type="button" onClick={addMedicine} className="btn-plus ">
                              +
                            </button>
                          </div>
                          {selectValues.map((item, index) => (
                            <>
                              <div key={item.id} className={`all-product mb`}>
                                <Select
                                  name="id_medicine"
                                  placeholder="search medicine"
                                  className="select-product"
                                  options={(loadedOptions[item.id] || []) as any}
                                  onInputChange={(inputValue, actionMeta) => {
                                    handleInputChangeMedicines(inputValue, item.id, actionMeta);
                                  }}
                                  components={{ Option: CustomOption }}
                                  getOptionLabel={(option) => option.label}
                                  getOptionValue={(option) => option.value}
                                  value={
                                    loadedOptions[item.id]?.find((option: any) => option.value === item.value) || ''
                                  }
                                  onChange={(value) => handleChangeMedicines(value || null, item.id)}
                                />

                                <div className="percentage-input">
                                  <input
                                    type="number"
                                    value={item.count || 0}
                                    onChange={(e) => handleChangeCountMedicinesSale(e.target.value, index)}
                                    className="select-quantity"
                                  />
                                  <span className="percentage-symbol">%</span>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Price"
                                  disabled
                                  value={formatCurrency(item.price || 0)}
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

                              {item.value === null && errors.id_medicine && (
                                <p className="err-text">{errors.id_medicine.message}</p>
                              )}
                            </>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="title_detail">
                            <p className="choose_medicine_category">Please choose category</p>
                            <p className="input_sale_category">Enter % sales</p>
                            <button type="button" onClick={addMedicine} className="btn-plus ">
                              +
                            </button>
                          </div>
                          {selectCategory.map((item, index) => (
                            <>
                              <div key={item.id} className={`all-product mb`}>
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  onChange={(event) => handleCategoryChange(event, item.id)}
                                  value={item.value || ''}
                                  placeholder="Search"
                                >
                                  {category.map((category: any) => {
                                    return (
                                      <option key={category.id} value={category.id}>
                                        {category.name}
                                      </option>
                                    );
                                  })}
                                </select>

                                <div className="percentage-input">
                                  <input
                                    type="number"
                                    value={item.percent_sales || 0}
                                    onChange={(e) => handleCountChangeCountCategorySale(e.target.value, index)}
                                    className="select-quantity"
                                  />
                                  <span className="percentage-symbol">%</span>
                                </div>

                                <button
                                  type="button"
                                  disabled={selectCategory.length === 1}
                                  className="btn-remove"
                                  onClick={() => handleRemoveCategory(item.id)}
                                  style={{ width: '58px', height: '40px' }}
                                >
                                  -
                                </button>
                              </div>

                              {item.value === null && errors.id_category && (
                                <p className="err-text">Category is required !</p>
                              )}
                            </>
                          ))}
                        </>
                      )}
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

export default Sales;
