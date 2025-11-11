import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../services/axios-client';
import { useNavigate } from 'react-router-dom';

interface UserType {
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiClient.get('/auth/me');
        console.log(res.data.data);
        setUser(res.data.data);
        if (res.data.data.roles === 'admin') navigate('/dashboard');
        else navigate('/');
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
