import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import JobseekerProfile from './jobseeker/JobseekerProfile';
import InstitutionProfile from './institution/InstitutionProfile';

// /profile shows a different page for each account type.
export default function Profile() {
  const { user, loading, isSociety, isAdmin } = useAuth();

  // Wait for the saved login to be read before deciding where to send the user
  if (loading) return <div className="min-h-screen" />;

  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin()) return <Navigate to="/admin" replace />;

  return isSociety() ? <InstitutionProfile /> : <JobseekerProfile />;
}
