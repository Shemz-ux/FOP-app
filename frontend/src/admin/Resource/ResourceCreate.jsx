import { useNavigate } from 'react-router-dom';
import { CreateResourceForm } from './CreateResourceForm';

export default function ResourceCreate() {
  const navigate = useNavigate();

  return <CreateResourceForm onCancel={() => navigate('/admin/resources')} />;
}
