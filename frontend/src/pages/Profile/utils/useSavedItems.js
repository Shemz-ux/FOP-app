import { useCallback, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { dashboardService } from '../../../services';
import * as jobActionsService from '../../../services/Jobs/jobActions';
import * as eventActionsService from '../../../services/Events/eventActions';
import { addJobTagsToList, addEventTagsToList } from '../../../utils/tagGenerator';
import { useLoadOnVisible } from './useLoadOnVisible';
import { profileSharedCopy as copy } from '../profile.copy';

const withId = (ids, id) => new Set(ids).add(id);

const withoutId = (ids, id) => {
  const next = new Set(ids);
  next.delete(id);
  return next;
};

// Saved jobs and saved events for the logged-in jobseeker or society,
// with the actions to save and unsave them.
// onError receives a message to show; pass a stable function such as showToast.
export function useSavedItems(onError) {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savedEventIds, setSavedEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const loadSavedItems = useCallback(async () => {
    if (!user) return;

    try {
      const [jobs, events] = await Promise.all([
        dashboardService.getSavedJobs(user.userId, user.userType),
        dashboardService.getSavedEvents(user.userId, user.userType)
      ]);
      const jobsWithTags = addJobTagsToList(jobs);
      const eventsWithTags = addEventTagsToList(events);

      setSavedJobs(jobsWithTags);
      setSavedEvents(eventsWithTags);
      setSavedJobIds(new Set(jobsWithTags.map(job => job.job_id)));
      setSavedEventIds(new Set(eventsWithTags.map(event => event.event_id)));
    } catch (error) {
      console.error('Error fetching saved items:', error);
      onError?.(copy.errors.loadSaved);
    } finally {
      setLoading(false);
    }
  }, [user, onError]);

  useLoadOnVisible(loadSavedItems);

  const toggleSavedJob = async (jobId) => {
    if (!user) return;
    const isSaved = savedJobIds.has(jobId);

    try {
      if (isSaved) {
        await jobActionsService.unsaveJob(jobId, user.userId, user.userType);
        setSavedJobIds(prev => withoutId(prev, jobId));
        setSavedJobs(prev => prev.filter(job => job.job_id !== jobId));
      } else {
        await jobActionsService.saveJob(jobId, user.userId, user.userType);
        setSavedJobIds(prev => withId(prev, jobId));
      }
    } catch (error) {
      console.error('Error toggling job save:', error);
      onError?.(isSaved ? copy.errors.unsaveJob : copy.errors.saveJob);
    }
  };

  const toggleSavedEvent = async (eventId) => {
    if (!user) return;
    const isSaved = savedEventIds.has(eventId);

    try {
      if (isSaved) {
        await eventActionsService.unsaveEvent(eventId, user.userId, user.userType);
        setSavedEventIds(prev => withoutId(prev, eventId));
        setSavedEvents(prev => prev.filter(event => event.event_id !== eventId));
      } else {
        await eventActionsService.saveEvent(eventId, user.userId, user.userType);
        setSavedEventIds(prev => withId(prev, eventId));
      }
    } catch (error) {
      console.error('Error toggling event save:', error);
      onError?.(isSaved ? copy.errors.unsaveEvent : copy.errors.saveEvent);
    }
  };

  return { savedJobs, savedEvents, savedJobIds, savedEventIds, loading, toggleSavedJob, toggleSavedEvent };
}
