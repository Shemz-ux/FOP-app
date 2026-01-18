import db from "../db/db.js";

// This file contains SOCIETY dashboard functions
// For jobseeker dashboard functions, see dashboard.js

/**
 * Get society's saved jobs with job details in a single query
 * Uses JOIN to prevent N+1 problem
 */
export const fetchSocietySavedJobs = (society_id) => {
    return db.query(`
        SELECT 
            j.job_id,
            j.title,
            j.company,
            j.company_logo,
            j.company_color,
            j.company_description,
            j.company_website,
            j.description,
            j.industry,
            j.location,
            j.experience_level,
            j.role_type,
            j.work_type,
            j.job_link,
            j.deadline,
            j.is_active,
            j.applicant_count,
            j.created_at as job_created_at,
            j.updated_at as job_updated_at,
            sjs.saved_at
        FROM society_jobs_saved sjs
        JOIN jobs j ON sjs.job_id = j.job_id
        WHERE sjs.society_id = $1
        ORDER BY sjs.saved_at DESC
    `, [society_id])
    .then(({rows}) => {
        return rows;
    });
};

/**
 * Get society's saved events with event details in a single query
 * Uses JOIN to prevent N+1 problem
 */
export const fetchSocietySavedEvents = (society_id) => {
    return db.query(`
        SELECT 
            e.event_id,
            e.title,
            e.organiser,
            e.organiser_logo,
            e.organiser_description,
            e.organiser_website,
            e.industry,
            e.event_type,
            e.location_type,
            e.location,
            e.address,
            e.capacity,
            e.event_link,
            e.description,
            e.event_image,
            e.event_date,
            e.event_start_time,
            e.event_end_time,
            e.is_active,
            e.applicant_count,
            e.created_at as event_created_at,
            e.updated_at as event_updated_at,
            ses.saved_at
        FROM society_events_saved ses
        JOIN events e ON ses.event_id = e.event_id
        WHERE ses.society_id = $1
        ORDER BY ses.saved_at DESC
    `, [society_id])
    .then(({rows}) => {
        return rows;
    });
};

/**
 * Get complete society dashboard data
 * NOTE: Societies can only SAVE jobs/events, NOT apply/register
 */
export const fetchSocietyDashboard = (society_id) => {
    return Promise.all([
        fetchSocietySavedJobs(society_id),
        fetchSocietySavedEvents(society_id)
    ]).then(([savedJobs, savedEvents]) => {
        return {
            saved_jobs: savedJobs,
            saved_events: savedEvents,
            stats: {
                total_saved_jobs: savedJobs.length,
                total_saved_events: savedEvents.length,
                active_saved_jobs: savedJobs.filter(job => job.is_active).length,
                active_saved_events: savedEvents.filter(event => event.is_active).length
            }
        };
    });
};

/**
 * Save a job for a society
 */
export const societySaveJob = (society_id, job_id) => {
    return db.query(`
        INSERT INTO society_jobs_saved (society_id, job_id)
        VALUES ($1, $2)
        ON CONFLICT (society_id, job_id) DO NOTHING
        RETURNING *
    `, [society_id, job_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 409, msg: 'Job already saved'});
        }
        return rows[0];
    });
};

/**
 * Save an event for a society
 */
export const societySaveEvent = (society_id, event_id) => {
    return db.query(`
        INSERT INTO society_events_saved (society_id, event_id)
        VALUES ($1, $2)
        ON CONFLICT (society_id, event_id) DO NOTHING
        RETURNING *
    `, [society_id, event_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 409, msg: 'Event already saved'});
        }
        return rows[0];
    });
};

/**
 * Remove a saved job for a society
 */
export const societyUnsaveJob = (society_id, job_id) => {
    return db.query(`
        DELETE FROM society_jobs_saved 
        WHERE society_id = $1 AND job_id = $2
        RETURNING *
    `, [society_id, job_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Saved job not found'});
        }
        return rows[0];
    });
};

/**
 * Remove a saved event for a society
 */
export const societyUnsaveEvent = (society_id, event_id) => {
    return db.query(`
        DELETE FROM society_events_saved 
        WHERE society_id = $1 AND event_id = $2
        RETURNING *
    `, [society_id, event_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Saved event not found'});
        }
        return rows[0];
    });
};