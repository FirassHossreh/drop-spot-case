import { Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth-layout';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
