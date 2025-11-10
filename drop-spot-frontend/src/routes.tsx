import { Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth-layout';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Home from './pages/home';
import AdminHome from './pages/admin-home';
import ClientLayout from './layouts/client-layout';
import AdminLayout from './layouts/admin-layout';
import AdminDrops from './pages/Admin-drops';
import ProtectedRoute from './components/protected-route';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute roles={'admin'}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="drops" element={<AdminDrops />} />
      </Route>

      {/* Client routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute roles={'user'}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
