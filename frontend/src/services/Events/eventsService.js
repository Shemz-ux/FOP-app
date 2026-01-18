import { apiGet, apiPost, apiPatch, apiDelete, buildQueryString } from '../api';
import { addEventTags, addEventTagsToList } from '../../utils/tagGenerator';

// Get all events with optional filters
export const getEvents = async (filters = {}) => {
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/events${queryString}`);
  return addEventTagsToList(data.events);
};

// Get events with advanced filtering
export const getEventsAdvanced = async (filters = {}) => {
  const queryString = buildQueryString(filters);
  const data = await apiGet(`/events/search${queryString}`);
  return {
    ...data,
    events: addEventTagsToList(data.events || [])
  };
};

// Get available event filter options
export const getEventFilters = async () => {
  const data = await apiGet('/events/filters');
  return data.filters;
};

// Get single event by ID
export const getEventById = async (eventId) => {
  const data = await apiGet(`/events/${eventId}`);
  return addEventTags(data.event);
};

// Create new event (admin only)
export const createEvent = async (eventData, adminToken) => {
  const data = await apiPost('/events', eventData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return addEventTags(data.newEvent);
};

// Update event (admin only)
export const updateEvent = async (eventId, eventData, adminToken) => {
  const data = await apiPatch(`/events/${eventId}`, eventData, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return addEventTags(data.event);
};

// Delete event (admin only)
export const deleteEvent = async (eventId, adminToken) => {
  const data = await apiDelete(`/events/${eventId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return data.msg;
};

// Get active events only
export const getActiveEvents = async () => {
  const data = await apiGet('/events?active=true');
  return addEventTagsToList(data.events);
};

// Get upcoming events only
export const getUpcomingEvents = async () => {
  const data = await apiGet('/events?upcoming=true');
  return addEventTagsToList(data.events);
};
