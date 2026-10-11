import EventCard from '../../../components/EventCard/EventCard';
import { formatEventDate, formatEventTime } from '../utils/profileOptions';

// An event record from the API shown as an EventCard with a save button
export default function ProfileEventCard({ event, isFavorite, onFavoriteClick }) {
  return (
    <EventCard
      eventId={event.event_id}
      title={event.title}
      organiser={event.organiser}
      date={formatEventDate(event.event_date)}
      time={formatEventTime(event)}
      location={event.location}
      attendees={event.attendee_count || 0}
      description={event.description}
      tags={event.tags}
      image={event.event_image}
      isFavorite={isFavorite}
      onFavoriteClick={() => onFavoriteClick(event.event_id)}
      createdAt={event.event_created_at || event.created_at}
    />
  );
}
