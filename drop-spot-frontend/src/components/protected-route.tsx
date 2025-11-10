// components/ProtectedRoute.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../providers/auth-provider';
import Loading from './loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.roles !== roles) {
    return <Navigate to={user.roles === 'admin' ? '/dashboard' : '/'} replace />;
  }
  return children;
}
