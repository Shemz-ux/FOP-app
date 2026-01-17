import { useNavigate } from 'react-router-dom';
import { CreateJobForm } from './CreateJobForm';

export default function JobCreate() {
  const navigate = useNavigate();

  return <CreateJobForm onCancel={() => navigate('/admin/jobs')} />;
}
