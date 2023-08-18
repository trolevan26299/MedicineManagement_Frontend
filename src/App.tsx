import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import * as actions from './Redux/actions/index';
import './assets/css/styles.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Register from './components/Register';
import CategoryAdd from './components/category/CategoryAdd';
import CategoryList from './components/category/CategoryList';
import CategoryUpdate from './components/category/CategoryUpdate';
import CustomerAdd from './components/customer/CustomerAdd';
import CustomerList from './components/customer/CustomerList';
import CustomerUpdate from './components/customer/CustomerUpdate';
import MedicineAdd from './components/medicine/MedicineAdd';
import MedicineList from './components/medicine/MedicineList';
import MedicineUpdate from './components/medicine/MedicineUpdate';
import OrderAdd from './components/order/OrderAdd';
import OrderHistoryList from './components/order/OrderHistoryList';
import Sales from './components/sales/Sales';
import UserAdd from './components/user/UserAdd';
import UserList from './components/user/UserList';
import UserUpdate from './components/user/UserUpdate';
import { requestApi } from './helpers/api';
import Layout from './layouts/Layout';
import Main from './layouts/Main';
import PrivateRoutes from './layouts/PrivateRoutes';
import PublicRoutes from './layouts/PublicRoutes';
import { RootState } from './Redux/reducers/globalLoading';
import { PERMISSIONS } from './constant/common';

function App() {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.globalLoading.role);

  useEffect(() => {
    requestApi('/auth/getUserPermissions', 'GET')
      .then((res) => {
        dispatch(actions.setRole(res.data.permission));
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Main />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            {userRole === PERMISSIONS.ADMIN && <Route path="/user/add" element={<UserAdd />} />}
            {userRole === PERMISSIONS.ADMIN && <Route path="/user/edit/:id" element={<UserUpdate />} />}
            <Route path="/medicines" element={<MedicineList />} />
            <Route path="/medicine/add" element={<MedicineAdd />} />
            <Route path="/medicine/edit/:id" element={<MedicineUpdate />} />
            <Route path="/categorys" element={<CategoryList />} />
            <Route path="/category/add" element={<CategoryAdd />} />
            <Route path="/category/edit/:id" element={<CategoryUpdate />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customer/add" element={<CustomerAdd />} />
            <Route path="/customer/edit/:id" element={<CustomerUpdate />} />
            <Route path="/order-history-list" element={<OrderHistoryList />} />
            <Route path="/order/add" element={<OrderAdd />} />
            <Route path="/order/edit/:id" element={<OrderAdd />} />
            <Route path="/sale" element={<Sales />} />
          </Route>
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
