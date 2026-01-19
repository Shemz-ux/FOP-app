import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EditEventForm } from './EditEventForm';
import { apiGet } from '../../services/api';

export default function EventEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/events/${id}`);
        const eventData = response.event || response;
        console.log('Edit event data:', eventData);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-foreground mb-2">Event Not Found</h2>
        <p className="text-muted-foreground">The event you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return <EditEventForm event={event} onCancel={() => navigate(`/admin/events/${event.event_id}`)} />;
}
