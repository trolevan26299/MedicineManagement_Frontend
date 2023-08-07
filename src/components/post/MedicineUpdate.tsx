import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions/index';
import { requestApi, requestApiFormData } from '../../helpers/api';
import { toast } from 'react-toastify';

const MedicineUpdate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
    setValue('category', event.target.value);
  };
  const handleSubmitFormUpdate = async (data: any) => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append('thumbnail', selectedImage);
    }
    formData.append('title', data.title);
    formData.append('category', selectedCategory);
    formData.append('quantity', data.quantity);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('status', data.status);
    dispatch(actions.controlLoading(true));
    try {
      const res = await requestApiFormData(`/posts/${params.id}`, 'PUT', formData);
      dispatch(actions.controlLoading(false));
      toast.success('Medicine has been updated successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/medicines');
      }, 3000);
    } catch (error) {
      console.log(error);
      dispatch(actions.controlLoading(false));
    }
  };
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    try {
      const getMedicineDetail = async () => {
        const res = await requestApi(`/posts/${params.id}`, 'GET');
        dispatch(actions.controlLoading(false));
        const fields = ['thumbnail', 'title', 'category', 'quantity', 'price', 'description', 'status'];
        fields.forEach((field) => setValue(field, res.data[field]));
        setSelectedCategory(res.data.category.id);
        setSelectedImage(`http://localhost:8080/${res.data.thumbnail}`);
      };
      getMedicineDetail();
    } catch (error) {
      console.error(error);
      dispatch(actions.controlLoading(false));
    }
  }, []);
  useEffect(() => {
    requestApi('/category', 'GET')
      .then((response) => {
        setCategory(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> Update Medicine</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/medicines">Medicine</Link>
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
                    <div className="mb-3 ">
                      <label htmlFor="imageInput" className="form-label">
                        Chọn ảnh:
                      </label>
                      <input type="file" className="form-control" id="imageInput" onChange={handleImageChange} />
                    </div>
                    <div className="mt-3">
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Ảnh"
                          className="img-fluid"
                          style={{ width: '200px', height: '200px' }}
                        />
                      )}
                    </div>

                    <div className="mb-3 mt-3">
                      <label className="form-label">Name:</label>
                      <input
                        type="text"
                        {...register('title', { required: 'Name is required !' })}
                        className="form-control"
                        placeholder="Enter Name "
                      />
                      {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
                    </div>

                    <div className="mb-3 mt-3">
                      <label className="form-label">Category:</label>
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
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantity:</label>
                      <input
                        type="number"
                        {...register('quantity', { required: 'Quantity is required !' })}
                        className="form-control"
                        placeholder="Enter Quantity"
                      />
                      {errors.Quantity && <p style={{ color: 'red' }}>{errors.Quantity.message}</p>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price:</label>
                      <input
                        type="number"
                        {...register('price', { required: 'Price is required !' })}
                        className="form-control"
                        placeholder="Enter Price"
                      />
                      {errors.price && <p style={{ color: 'red' }}>{errors.price.message}</p>}
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

export default MedicineUpdate;
