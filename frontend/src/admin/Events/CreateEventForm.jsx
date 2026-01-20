import { EventForm } from './EventForm';
import { apiPost } from '../../services/api';

export function CreateEventForm({ onCancel }) {
  const handleSubmit = async (eventData) => {
    try {
      await apiPost('/events', eventData);
    } catch (error) {
      throw error;
    }
  };

  return <EventForm onSubmit={handleSubmit} onCancel={onCancel} isEdit={false} />;
}
