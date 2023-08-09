import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as actions from '../../Redux/actions/index';
import { requestApi } from '../../helpers/api';

const CategoryAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitFormAdd = async (data: any) => {
    dispatch(actions.controlLoading(true));
    try {
      await requestApi('/category', 'POST', data);
      dispatch(actions.controlLoading(false));
      toast.success('Category has been created successfully !', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        navigate('/categorys');
      }, 3000);
    } catch (error) {
      dispatch(actions.controlLoading(false));
    }
  };

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4"> New Category</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              {' '}
              <Link to="/medicines">Category</Link>
            </li>
            <li className="breadcrumb-item active">Add New Category</li>
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

export default CategoryAdd;
