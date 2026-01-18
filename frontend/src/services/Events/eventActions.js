import { apiPost, apiDelete, apiGet } from '../api';

// Save an event
export const saveEvent = async (eventId, userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/save-event/${eventId}`
    : `/societies/${userId}/save-event/${eventId}`;
  
  const data = await apiPost(endpoint, {});
  return data;
};

// Unsave an event
export const unsaveEvent = async (eventId, userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/save-event/${eventId}`
    : `/societies/${userId}/save-event/${eventId}`;
  
  const data = await apiDelete(endpoint);
  return data;
};

// Check if event is saved
export const checkEventSaved = async (eventId, userId, userType) => {
  const endpoint = userType === 'jobseeker'
    ? `/jobseekers/${userId}/saved-events`
    : `/societies/${userId}/saved-events`;
  
  const data = await apiGet(endpoint);
  const savedEvents = data.saved_events || [];
  return savedEvents.some(event => event.event_id === parseInt(eventId));
};

// Register for an event (jobseekers only - societies cannot register)
export const registerForEvent = async (eventId, userId, userType) => {
  if (userType !== 'jobseeker') {
    throw new Error('Only jobseekers can register for events. Societies can only save events.');
  }
  
  const endpoint = `/jobseekers/${userId}/apply-event/${eventId}`;
  const data = await apiPost(endpoint, {});
  return data;
};

// Check if registered for event (jobseekers only)
export const checkEventRegistered = async (eventId, userId, userType) => {
  if (userType !== 'jobseeker') {
    return false; // Societies cannot register, so always return false
  }
  
  const endpoint = `/jobseekers/${userId}/applied-events`;
  const data = await apiGet(endpoint);
  const appliedEvents = data.applied_events || [];
  return appliedEvents.some(event => event.event_id === parseInt(eventId));
};
