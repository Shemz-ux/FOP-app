import { 
    fetchSocietyDashboard,
    fetchSocietySavedJobs,
    fetchSocietySavedEvents,
    societySaveJob,
    societySaveEvent,
    societyUnsaveJob,
    societyUnsaveEvent
} from "../models/society-dashboard.js";

// This file contains SOCIETY dashboard controllers
// For jobseeker dashboard controllers, see dashboard.js

/**
 * Get complete dashboard data for a society
 * GET /api/societies/:society_id/dashboard
 */
export const getSocietyDashboard = (req, res, next) => {
    const { society_id } = req.params;

    fetchSocietyDashboard(society_id)
        .then((dashboard) => {
            res.status(200).send({ dashboard });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Get only saved jobs for a society
 * GET /api/societies/:society_id/saved-jobs
 */
export const getSocietySavedJobs = (req, res, next) => {
    const { society_id } = req.params;

    fetchSocietySavedJobs(society_id)
        .then((savedJobs) => {
            res.status(200).send({ 
                saved_jobs: savedJobs,
                total: savedJobs.length 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Get only saved events for a society
 * GET /api/societies/:society_id/saved-events
 */
export const getSocietySavedEvents = (req, res, next) => {
    const { society_id } = req.params;

    fetchSocietySavedEvents(society_id)
        .then((savedEvents) => {
            res.status(200).send({ 
                saved_events: savedEvents,
                total: savedEvents.length 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Save a job for a society
 * POST /api/societies/:society_id/save-job/:job_id
 */
export const postSocietySaveJob = (req, res, next) => {
    const { society_id, job_id } = req.params;

    societySaveJob(society_id, job_id)
        .then((savedJob) => {
            res.status(201).send({ 
                message: 'Job saved successfully',
                saved_job: savedJob 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Save an event for a society
 * POST /api/societies/:society_id/save-event/:event_id
 */
export const postSocietySaveEvent = (req, res, next) => {
    const { society_id, event_id } = req.params;

    societySaveEvent(society_id, event_id)
        .then((savedEvent) => {
            res.status(201).send({ 
                message: 'Event saved successfully',
                saved_event: savedEvent 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Remove a saved job for a society
 * DELETE /api/societies/:society_id/save-job/:job_id
 */
export const deleteSocietySavedJob = (req, res, next) => {
    const { society_id, job_id } = req.params;

    societyUnsaveJob(society_id, job_id)
        .then((removedJob) => {
            res.status(200).send({ 
                message: 'Job removed from saved list',
                removed_job: removedJob 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Remove a saved event for a society
 * DELETE /api/societies/:society_id/save-event/:event_id
 */
export const deleteSocietySavedEvent = (req, res, next) => {
    const { society_id, event_id } = req.params;

    societyUnsaveEvent(society_id, event_id)
        .then((removedEvent) => {
            res.status(200).send({ 
                message: 'Event removed from saved list',
                removed_event: removedEvent 
            });
        })
        .catch((err) => {
            next(err);
        });
};