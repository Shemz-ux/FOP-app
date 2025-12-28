import db from "../db/db.js";

/**
 * Get jobseeker's applied jobs with job details in a single query
 * Uses JOIN to prevent N+1 problem
 */
export const fetchJobseekerAppliedJobs = (jobseeker_id) => {
    return db.query(`
        SELECT 
            j.job_id,
            j.title,
            j.company,
            j.description,
            j.industry,
            j.location,
            j.job_link,
            j.contact_email,
            j.deadline,
            j.is_active,
            j.applicant_count,
            j.created_at as job_created_at,
            j.updated_at as job_updated_at,
            ja.applied_at
        FROM job_applications ja
        JOIN jobs j ON ja.job_id = j.job_id
        WHERE ja.jobseeker_id = $1
        ORDER BY ja.applied_at DESC
    `, [jobseeker_id])
    .then(({rows}) => {
        return rows;
    });
};

/**
 * Get jobseeker's saved jobs with job details in a single query
 * Uses JOIN to prevent N+1 problem
 */
export const fetchJobseekerSavedJobs = (jobseeker_id) => {
    return db.query(`
        SELECT 
            j.job_id,
            j.title,
            j.company,
            j.description,
            j.industry,
            j.location,
            j.job_link,
            j.contact_email,
            j.deadline,
            j.is_active,
            j.applicant_count,
            j.created_at as job_created_at,
            j.updated_at as job_updated_at,
            js.saved_at
        FROM jobs_saved js
        JOIN jobs j ON js.job_id = j.job_id
        WHERE js.jobseeker_id = $1
        ORDER BY js.saved_at DESC
    `, [jobseeker_id])
    .then(({rows}) => {
        return rows;
    });
};

/**
 * Get comprehensive dashboard data in a single optimized query
 * Returns both applied and saved jobs with minimal database calls
 */
export const fetchJobseekerDashboard = (jobseeker_id) => {
    // Use Promise.all to run both queries in parallel for better performance
    return Promise.all([
        fetchJobseekerAppliedJobs(jobseeker_id),
        fetchJobseekerSavedJobs(jobseeker_id)
    ]).then(([appliedJobs, savedJobs]) => {
        return {
            applied_jobs: appliedJobs,
            saved_jobs: savedJobs,
            stats: {
                total_applied: appliedJobs.length,
                total_saved: savedJobs.length,
                active_applications: appliedJobs.filter(job => job.is_active).length,
                active_saved: savedJobs.filter(job => job.is_active).length
            }
        };
    });
};

/**
 * Get dashboard data with pagination support
 * Useful for large datasets
 */
export const fetchJobseekerDashboardPaginated = (jobseeker_id, options = {}) => {
    const {
        applied_limit = 10,
        applied_offset = 0,
        saved_limit = 10,
        saved_offset = 0
    } = options;

    const appliedJobsQuery = db.query(`
        SELECT 
            j.job_id,
            j.title,
            j.company,
            j.description,
            j.industry,
            j.location,
            j.job_link,
            j.contact_email,
            j.deadline,
            j.is_active,
            j.applicant_count,
            j.created_at as job_created_at,
            j.updated_at as job_updated_at,
            ja.applied_at
        FROM job_applications ja
        JOIN jobs j ON ja.job_id = j.job_id
        WHERE ja.jobseeker_id = $1
        ORDER BY ja.applied_at DESC
        LIMIT $2 OFFSET $3
    `, [jobseeker_id, applied_limit, applied_offset]);

    const savedJobsQuery = db.query(`
        SELECT 
            j.job_id,
            j.title,
            j.company,
            j.description,
            j.industry,
            j.location,
            j.job_link,
            j.contact_email,
            j.deadline,
            j.is_active,
            j.applicant_count,
            j.created_at as job_created_at,
            j.updated_at as job_updated_at,
            js.saved_at
        FROM jobs_saved js
        JOIN jobs j ON js.job_id = j.job_id
        WHERE js.jobseeker_id = $1
        ORDER BY js.saved_at DESC
        LIMIT $2 OFFSET $3
    `, [jobseeker_id, saved_limit, saved_offset]);

    // Get total counts for pagination metadata
    const appliedCountQuery = db.query(`
        SELECT COUNT(*) as total
        FROM job_applications 
        WHERE jobseeker_id = $1
    `, [jobseeker_id]);

    const savedCountQuery = db.query(`
        SELECT COUNT(*) as total
        FROM jobs_saved 
        WHERE jobseeker_id = $1
    `, [jobseeker_id]);

    return Promise.all([
        appliedJobsQuery,
        savedJobsQuery,
        appliedCountQuery,
        savedCountQuery
    ]).then(([appliedResult, savedResult, appliedCountResult, savedCountResult]) => {
        const appliedJobs = appliedResult.rows;
        const savedJobs = savedResult.rows;
        const totalApplied = parseInt(appliedCountResult.rows[0].total);
        const totalSaved = parseInt(savedCountResult.rows[0].total);

        return {
            applied_jobs: appliedJobs,
            saved_jobs: savedJobs,
            pagination: {
                applied: {
                    total: totalApplied,
                    limit: applied_limit,
                    offset: applied_offset,
                    has_more: (applied_offset + applied_limit) < totalApplied
                },
                saved: {
                    total: totalSaved,
                    limit: saved_limit,
                    offset: saved_offset,
                    has_more: (saved_offset + saved_limit) < totalSaved
                }
            },
            stats: {
                total_applied: totalApplied,
                total_saved: totalSaved,
                active_applications: appliedJobs.filter(job => job.is_active).length,
                active_saved: savedJobs.filter(job => job.is_active).length
            }
        };
    });
};

/**
 * Apply for a job (create job application)
 */
export const applyForJob = (jobseeker_id, job_id) => {
    return db.query(`
        INSERT INTO job_applications (jobseeker_id, job_id)
        VALUES ($1, $2)
        ON CONFLICT (jobseeker_id, job_id) DO NOTHING
        RETURNING *
    `, [jobseeker_id, job_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 409, msg: 'Already applied for this job'});
        }
        return rows[0];
    });
};

/**
 * Save a job for later
 */
export const saveJob = (jobseeker_id, job_id) => {
    return db.query(`
        INSERT INTO jobs_saved (jobseeker_id, job_id)
        VALUES ($1, $2)
        ON CONFLICT (jobseeker_id, job_id) DO NOTHING
        RETURNING *
    `, [jobseeker_id, job_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 409, msg: 'Job already saved'});
        }
        return rows[0];
    });
};

/**
 * Remove a saved job
 */
export const unsaveJob = (jobseeker_id, job_id) => {
    return db.query(`
        DELETE FROM jobs_saved 
        WHERE jobseeker_id = $1 AND job_id = $2
        RETURNING *
    `, [jobseeker_id, job_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Saved job not found'});
        }
        return rows[0];
    });
};

// ============= EVENT FUNCTIONS =============

/**
 * Get jobseeker's applied events with event details in a single query
 */
export const fetchJobseekerAppliedEvents = (jobseeker_id) => {
    return db.query(`
        SELECT 
            e.event_id,
            e.title,
            e.company,
            e.description,
            e.industry,
            e.location,
            e.event_link,
            e.contact_email,
            e.event_date,
            e.event_time,
            e.is_active,
            e.applicant_count,
            e.created_at as event_created_at,
            e.updated_at as event_updated_at,
            ea.applied_at
        FROM event_applications ea
        JOIN events e ON ea.event_id = e.event_id
        WHERE ea.jobseeker_id = $1
        ORDER BY ea.applied_at DESC
    `, [jobseeker_id])
    .then(({rows}) => {
        return rows;
    });
};

/**
 * Get jobseeker's saved events with event details in a single query
 */
export const fetchJobseekerSavedEvents = (jobseeker_id) => {
    return db.query(`
        SELECT 
            e.event_id,
            e.title,
            e.company,
            e.description,
            e.industry,
            e.location,
            e.event_link,
            e.contact_email,
            e.event_date,
            e.event_time,
            e.is_active,
            e.applicant_count,
            e.created_at as event_created_at,
            e.updated_at as event_updated_at,
            es.saved_at
        FROM events_saved es
        JOIN events e ON es.event_id = e.event_id
        WHERE es.jobseeker_id = $1
        ORDER BY es.saved_at DESC
    `, [jobseeker_id])
    .then(({rows}) => {
        return rows;
    });
};

/**
 * Apply for an event (create event application)
 */
export const applyForEvent = (jobseeker_id, event_id) => {
    return db.query(`
        INSERT INTO event_applications (jobseeker_id, event_id)
        VALUES ($1, $2)
        ON CONFLICT (jobseeker_id, event_id) DO NOTHING
        RETURNING *
    `, [jobseeker_id, event_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 409, msg: 'Already applied for this event'});
        }
        return rows[0];
    });
};

/**
 * Save an event for later
 */
export const saveEvent = (jobseeker_id, event_id) => {
    return db.query(`
        INSERT INTO events_saved (jobseeker_id, event_id)
        VALUES ($1, $2)
        ON CONFLICT (jobseeker_id, event_id) DO NOTHING
        RETURNING *
    `, [jobseeker_id, event_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 409, msg: 'Event already saved'});
        }
        return rows[0];
    });
};

/**
 * Remove a saved event
 */
export const unsaveEvent = (jobseeker_id, event_id) => {
    return db.query(`
        DELETE FROM events_saved 
        WHERE jobseeker_id = $1 AND event_id = $2
        RETURNING *
    `, [jobseeker_id, event_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Saved event not found'});
        }
        return rows[0];
    });
};

/**
 * Get comprehensive dashboard data including both jobs and events
 */
export const fetchJobseekerFullDashboard = (jobseeker_id) => {
    return Promise.all([
        fetchJobseekerAppliedJobs(jobseeker_id),
        fetchJobseekerSavedJobs(jobseeker_id),
        fetchJobseekerAppliedEvents(jobseeker_id),
        fetchJobseekerSavedEvents(jobseeker_id)
    ]).then(([appliedJobs, savedJobs, appliedEvents, savedEvents]) => {
        return {
            applied_jobs: appliedJobs,
            saved_jobs: savedJobs,
            applied_events: appliedEvents,
            saved_events: savedEvents,
            stats: {
                total_applied_jobs: appliedJobs.length,
                total_saved_jobs: savedJobs.length,
                total_applied_events: appliedEvents.length,
                total_saved_events: savedEvents.length,
                active_applied_jobs: appliedJobs.filter(job => job.is_active).length,
                active_saved_jobs: savedJobs.filter(job => job.is_active).length,
                active_applied_events: appliedEvents.filter(event => event.is_active).length,
                active_saved_events: savedEvents.filter(event => event.is_active).length
            }
        };
    });
};
