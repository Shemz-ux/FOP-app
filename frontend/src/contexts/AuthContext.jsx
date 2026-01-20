import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/Auth/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigate, setNavigate] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    console.log('AuthContext - Loading user from localStorage:', currentUser);
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      console.log('AuthContext - Login response data:', data);
      const userData = {
        token: data.token,
        userType: data.user_type,
        userId: data.user_id,
        role: data.role || null,
        name: data.name || null,
        first_name: data.first_name || null
      };
      console.log('AuthContext - User data being set:', userData);
      setUser(userData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    // Redirect to login page and refresh
    if (navigate) {
      navigate('/login');
    } else {
      window.location.href = '/login';
    }
  };
  
  const registerNavigate = (nav) => {
    setNavigate(() => nav);
  };

  const isLoggedIn = () => {
    return isAuthenticated();
  };

  const isJobseeker = () => {
    return user?.userType === 'jobseeker';
  };

  const isSociety = () => {
    return user?.userType === 'society';
  };

  const isAdmin = () => {
    return user?.userType === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerNavigate,
    isLoggedIn,
    isJobseeker,
    isSociety,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
