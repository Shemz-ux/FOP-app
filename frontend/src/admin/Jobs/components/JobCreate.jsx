import { useNavigate } from 'react-router-dom';
import { JobForm } from './JobForm';
import { apiPost } from '../../../services/api';

/**
 * Create-mode configuration for JobForm: owns persistence and navigation, and leaves all
 * rendering and field state to the form. Replaces the former JobCreate + CreateJobForm pair.
 */
export default function JobCreate() {
  const navigate = useNavigate();

  // Rejections propagate to JobForm, which renders the error toast. Field state survives
  // because we only navigate away on success.
  const handleSubmit = async (jobData) => {
    await apiPost('/jobs', jobData);
    // JobForm shows the success toast; delay so it is visible before we navigate away.
    setTimeout(() => navigate('/admin/jobs'), 2000);
  };

  return (
    <JobForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/admin/jobs')}
      isEdit={false}
    />
  );
}
