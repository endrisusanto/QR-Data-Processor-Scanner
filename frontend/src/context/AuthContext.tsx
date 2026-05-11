import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    loading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setAuthToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['x-auth-token'] = token;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token'];
    }
    setToken(token);
  }, []);

  useEffect(() => {
    setAuthToken(token);
    setLoading(false);
  }, [token, setAuthToken]);

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    setAuthToken(res.data.token);
  };

  const register = async (username: string, password: string) => {
    const res = await api.post('/auth/register', { username, password });
    setAuthToken(res.data.token);
  };

  const logout = () => {
    setAuthToken(null);
    navigate('/login');
  };
  
  const authContextValue = {
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
