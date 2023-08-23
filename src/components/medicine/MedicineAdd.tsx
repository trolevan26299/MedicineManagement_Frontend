import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions/index';
import { requestApi, requestApiFormData } from '../../helpers/api';
import { toast } from 'react-toastify';

const MedicineAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    setPreviewUrl(url);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmitFormAdd = async (data: any) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('thumbnail', selectedFile);
    }
    formData.append('title', data.title);
    formData.append('category', selectedCategory || category[0].id);
    formData.append('quantity', data.quantity);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('status', data.status);
    dispatch(actions.controlLoading(true));
    try {
      await requestApiFormData('/medicines', 'POST', formData);
      dispatch(actions.controlLoading(false));
      toast.success('Medicines has been created successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/medicines');
      }, 3000);
    } catch (error) {
      dispatch(actions.controlLoading(false));
    }
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
      <main style={{ height: '100%' }}>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> New Medicine</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/medicines">Mediacine</Link>
            </li>
            <li className="breadcrumb-item active">Add New Medicine</li>
          </ol>
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-plus me-1"></i>
              Add
            </div>
            <div className="card-body" style={{ height: '670px' }}>
              <div className="row mb-3">
                <form>
                  <div className="col-md-6">
                    <div className="mb-3 ">
                      <label className="form-label">Image:</label>
                      <input
                        type="file"
                        {...register('thumbnail', { required: 'Thumbnail is required !' })}
                        className="form-control"
                        placeholder="Upload thumbnail"
                        onChange={(event) => {
                          handleFileChange(event);
                          clearErrors('thumbnail');
                        }}
                        accept="image/*"
                      />
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Thumbnail Preview"
                          style={{ maxWidth: '150px', marginTop: '20px' }}
                        />
                      )}
                      {errors.thumbnail && <p style={{ color: 'red' }}>{errors.thumbnail.message}</p>}
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
                      {errors.quantity && <p style={{ color: 'red' }}>{errors.quantity.message}</p>}
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

export default MedicineAdd;
