import { 
    fetchJobseekerDashboard, 
    fetchJobseekerDashboardPaginated,
    fetchJobseekerAppliedJobs,
    fetchJobseekerSavedJobs,
    fetchJobseekerAppliedEvents,
    fetchJobseekerSavedEvents,
    fetchJobseekerFullDashboard,
    applyForJob,
    saveJob,
    unsaveJob,
    applyForEvent,
    saveEvent,
    unsaveEvent
} from "../models/jobseeker-dashboard.js";

// This file contains JOBSEEKER dashboard controllers
// For society dashboard controllers, see society-dashboard.js

/**
 * Get complete dashboard data for a jobseeker
 * GET /api/jobseekers/:jobseeker_id/dashboard
 */
export const getJobseekerDashboard = (req, res, next) => {
    const { jobseeker_id } = req.params;
    const { paginated, applied_limit, applied_offset, saved_limit, saved_offset } = req.query;

    // Check if pagination is requested
    if (paginated === 'true') {
        const options = {
            applied_limit: parseInt(applied_limit) || 10,
            applied_offset: parseInt(applied_offset) || 0,
            saved_limit: parseInt(saved_limit) || 10,
            saved_offset: parseInt(saved_offset) || 0
        };

        fetchJobseekerDashboardPaginated(jobseeker_id, options)
            .then((dashboard) => {
                res.status(200).send({ dashboard });
            })
            .catch((err) => {
                next(err);
            });
    } else {
        fetchJobseekerDashboard(jobseeker_id)
            .then((dashboard) => {
                res.status(200).send({ dashboard });
            })
            .catch((err) => {
                next(err);
            });
    }
};

/**
 * Get only applied jobs for a jobseeker
 * GET /api/jobseekers/:jobseeker_id/applied-jobs
 */
export const getJobseekerAppliedJobs = (req, res, next) => {
    const { jobseeker_id } = req.params;

    fetchJobseekerAppliedJobs(jobseeker_id)
        .then((appliedJobs) => {
            res.status(200).send({ 
                applied_jobs: appliedJobs,
                total: appliedJobs.length 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Get only saved jobs for a jobseeker
 * GET /api/jobseekers/:jobseeker_id/saved-jobs
 */
export const getJobseekerSavedJobs = (req, res, next) => {
    const { jobseeker_id } = req.params;

    fetchJobseekerSavedJobs(jobseeker_id)
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
 * Apply for a job
 * POST /api/jobseekers/:jobseeker_id/apply/:job_id
 */
export const postJobApplication = (req, res, next) => {
    const { jobseeker_id, job_id } = req.params;

    applyForJob(jobseeker_id, job_id)
        .then((application) => {
            res.status(201).send({ 
                message: 'Successfully applied for job',
                application 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Save a job
 * POST /api/jobseekers/:jobseeker_id/save/:job_id
 */
export const postSaveJob = (req, res, next) => {
    const { jobseeker_id, job_id } = req.params;

    saveJob(jobseeker_id, job_id)
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
 * Remove a saved job
 * DELETE /api/jobseekers/:jobseeker_id/save/:job_id
 */
export const deleteSavedJob = (req, res, next) => {
    const { jobseeker_id, job_id } = req.params;

    unsaveJob(jobseeker_id, job_id)
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

// ============= EVENT CONTROLLERS =============

/**
 * Get complete dashboard data including both jobs and events
 * GET /api/jobseekers/:jobseeker_id/full-dashboard
 */
export const getJobseekerFullDashboard = (req, res, next) => {
    const { jobseeker_id } = req.params;

    fetchJobseekerFullDashboard(jobseeker_id)
        .then((dashboard) => {
            res.status(200).send({ dashboard });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Get only applied events for a jobseeker
 * GET /api/jobseekers/:jobseeker_id/applied-events
 */
export const getJobseekerAppliedEvents = (req, res, next) => {
    const { jobseeker_id } = req.params;

    fetchJobseekerAppliedEvents(jobseeker_id)
        .then((appliedEvents) => {
            res.status(200).send({ 
                applied_events: appliedEvents,
                total: appliedEvents.length 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Get only saved events for a jobseeker
 * GET /api/jobseekers/:jobseeker_id/saved-events
 */
export const getJobseekerSavedEvents = (req, res, next) => {
    const { jobseeker_id } = req.params;

    fetchJobseekerSavedEvents(jobseeker_id)
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
 * Apply for an event
 * POST /api/jobseekers/:jobseeker_id/apply-event/:event_id
 */
export const postEventApplication = (req, res, next) => {
    const { jobseeker_id, event_id } = req.params;

    applyForEvent(jobseeker_id, event_id)
        .then((application) => {
            res.status(201).send({ 
                message: 'Successfully applied for event',
                application 
            });
        })
        .catch((err) => {
            next(err);
        });
};

/**
 * Save an event
 * POST /api/jobseekers/:jobseeker_id/save-event/:event_id
 */
export const postSaveEvent = (req, res, next) => {
    const { jobseeker_id, event_id } = req.params;

    saveEvent(jobseeker_id, event_id)
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
 * Remove a saved event
 * DELETE /api/jobseekers/:jobseeker_id/save-event/:event_id
 */
export const deleteSavedEvent = (req, res, next) => {
    const { jobseeker_id, event_id } = req.params;

    unsaveEvent(jobseeker_id, event_id)
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
