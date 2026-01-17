import { useNavigate, useParams } from 'react-router-dom';
import { EditEventForm } from './EditEventForm';
import { mockEvents } from '../../services/Admin/admin-analytics';

export default function EventEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const event = mockEvents.find(e => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-foreground mb-2">Event Not Found</h2>
        <p className="text-muted-foreground">The event you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return <EditEventForm event={event} onCancel={() => navigate(`/admin/events/${id}`)} />;
}
