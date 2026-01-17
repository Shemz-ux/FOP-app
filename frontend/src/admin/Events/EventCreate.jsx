import { useNavigate } from 'react-router-dom';
import { CreateEventForm } from './CreateEventForm';

export default function EventCreate() {
  const navigate = useNavigate();

  return <CreateEventForm onCancel={() => navigate('/admin/events')} />;
}
