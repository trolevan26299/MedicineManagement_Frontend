import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as actions from '../../Redux/actions/index';
import { requestApi, requestApiFormData } from '../../helpers/api';
import { toast } from 'react-toastify';

const PostAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    console.log('file', event.target.files[0]);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitFormAdd = async (data: any) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('thumbnail', selectedFile);
    }
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('quantity', data.quantity);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('status', data.status);
    console.log(data);
    dispatch(actions.controlLoading(true));
    try {
      await requestApiFormData('/posts', 'POST', formData);
      dispatch(actions.controlLoading(false));
      toast.success('Post has been created successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/posts');
      }, 3000);
    } catch (error) {
      dispatch(actions.controlLoading(false));
    }
  };
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> New Medicine</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/posts">Mediacines</Link>
            </li>
            <li className="breadcrumb-item active">Add New Medicine</li>
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
                    <div className="mb-3 ">
                      <label className="form-label">Image:</label>
                      <input
                        type="file"
                        {...register('thumbnail', { required: 'Thumbnail is required !' })}
                        className="form-control"
                        placeholder="Upload thumbnail"
                        onChange={handleFileChange}
                      />
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
                      <input
                        type="number"
                        {...register('category', {
                          required: 'Category is required !',
                        })}
                        className="form-control"
                        placeholder="Enter Category"
                      />
                      {errors.category && <p style={{ color: 'red' }}>{errors.category.message}</p>}
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

export default PostAdd;
