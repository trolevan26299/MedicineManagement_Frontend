import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';

const CategoryUpdate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSubmitFormUpdate = async (data: any) => {
    dispatch(actions.controlLoading(true));
    try {
      await requestApi(`/category/${params.id}`, 'PUT', data);
      dispatch(actions.controlLoading(false));
      toast.success('Category has been updated successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/categorys');
      }, 3000);
    } catch (error) {
      console.log(error);
      dispatch(actions.controlLoading(false));
    }
  };
  useEffect(() => {
    dispatch(actions.controlLoading(true));
    try {
      const getCategoryDetail = async () => {
        const res = await requestApi(`/category/${params.id}`, 'GET');
        dispatch(actions.controlLoading(false));
        const fields = ['name', 'description', 'status'];
        fields.forEach((field) => setValue(field, res.data[field]));
      };
      getCategoryDetail();
    } catch (error) {
      console.error(error);
      dispatch(actions.controlLoading(false));
    }
  }, []);

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> Update Category</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/categorys">Category</Link>
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
                    <div className="mb-3 mt-3">
                      <label className="form-label">Name:</label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required !' })}
                        className="form-control"
                        placeholder="Enter Name "
                      />
                      {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
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

export default CategoryUpdate;
