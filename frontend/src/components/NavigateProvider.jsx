import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component to register navigate function with AuthContext
 * This allows logout to redirect to login page
 */
export default function NavigateProvider({ children }) {
  const navigate = useNavigate();
  const { registerNavigate } = useAuth();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate, registerNavigate]);

  return children;
}
