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
import PostList from './components/post/PostList';
import PostAdd from './components/post/PostAdd';
import PostUpdate from './components/post/PostUpdate';

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
            <Route path="/posts" element={<PostList />} />
            <Route path="/post/add" element={<PostAdd />} />
            <Route path="/post/edit/:id" element={<PostUpdate />} />
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
