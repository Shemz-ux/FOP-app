import { EventForm } from './EventForm';
import { apiPatch } from '../../services/api';

export function EditEventForm({ event, onCancel }) {
  const handleSubmit = async (eventData) => {
    try {
      await apiPatch(`/events/${event.event_id}`, eventData);
      setTimeout(() => onCancel(), 2000);
    } catch (error) {
      throw error;
    }
  };

  return <EventForm event={event} onSubmit={handleSubmit} onCancel={onCancel} isEdit={true} />;
}
