import { Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth-layout';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Home from './pages/home';
import AdminHome from './pages/admin-home';
import ClientLayout from './layouts/client-layout';
import AdminLayout from './layouts/admin-layout';
import AdminDrops from './pages/AdminDrops';
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ClientLayout />}>
        <Route index path="/" element={<Home />} />
      </Route>
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route index path="" element={<AdminHome />} />
        <Route index path="drops" element={<AdminDrops />} />
      </Route>
    </Routes>
  );
}
