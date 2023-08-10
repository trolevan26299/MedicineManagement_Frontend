import 'react-toastify/dist/ReactToastify.css';
import './assets/css/styles.css';
import { Route, Routes } from 'react-router-dom';
import Main from './layouts/Main';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoutes from './layouts/PrivateRoutes';
import PublicRoutes from './layouts/PublicRoutes';
import Layout from './layouts/Layout';
import UserList from './components/user/UserList';
import UserAdd from './components/user/UserAdd';
import UserUpdate from './components/user/UserUpdate';
import PageNotFound from './components/PageNotFound';
import MedicineList from './components/medicine/MedicineList';
import MedicineAdd from './components/medicine/MedicineAdd';
import MedicineUpdate from './components/medicine/MedicineUpdate';
import CategoryList from './components/category/CategoryList';
import CategoryAdd from './components/category/CategoryAdd';
import CategoryUpdate from './components/category/CategoryUpdate';
import CustomerList from './components/customer/CustomerList';
import CustomerAdd from './components/customer/CustomerAdd';
import CustomerUpdate from './components/customer/CustomerUpdate';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Main />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/user/add" element={<UserAdd />} />
            <Route path="/user/edit/:id" element={<UserUpdate />} />
            <Route path="/medicines" element={<MedicineList />} />
            <Route path="/medicine/add" element={<MedicineAdd />} />
            <Route path="/medicine/edit/:id" element={<MedicineUpdate />} />
            <Route path="/categorys" element={<CategoryList />} />
            <Route path="/category/add" element={<CategoryAdd />} />
            <Route path="/category/edit/:id" element={<CategoryUpdate />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customer/add" element={<CustomerAdd />} />
            <Route path="/customer/edit/:id" element={<CustomerUpdate />} />
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
