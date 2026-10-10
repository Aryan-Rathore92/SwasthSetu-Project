import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('swasthsetu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('swasthsetu_token'));
  const [loading, setLoading] = useState(true);

  const setSession = (session) => {
    const { token: newToken, user: newUser } = session;
    if (!newToken || !newUser) {
      throw new Error('The server returned an invalid authentication session.');
    }

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('swasthsetu_token', newToken);
    localStorage.setItem('swasthsetu_user', JSON.stringify(newUser));
    return newUser;
  };

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('swasthsetu_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing credentials:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (phone, otp) => {
    const res = await authApi.login(phone, otp);
    if (res.success && res.data) {
      return setSession(res.data);
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = async () => {
    try {
      if (token) await authApi.logout();
    } catch (_) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('swasthsetu_token');
    localStorage.removeItem('swasthsetu_user');
  };

  const getDashboardPathForRole = (role) => {
    switch (role) {
      case 'patient': return '/patient/dashboard';
      case 'health_worker': return '/healthworker/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'facility_admin': return '/facility/dashboard';
      case 'district_admin': return '/district/dashboard';
      default: return '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        role: user?.role,
        login,
        setSession,
        logout,
        getDashboardPathForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
