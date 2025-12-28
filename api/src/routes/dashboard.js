import express from 'express';
import { 
    getJobseekerDashboard,
    getJobseekerAppliedJobs,
    getJobseekerSavedJobs,
    getJobseekerFullDashboard,
    getJobseekerAppliedEvents,
    getJobseekerSavedEvents,
    postJobApplication,
    postSaveJob,
    deleteSavedJob,
    postEventApplication,
    postSaveEvent,
    deleteSavedEvent
} from '../controllers/dashboard.js';

const router = express.Router();

// Dashboard routes for jobseekers
router.get('/jobseekers/:jobseeker_id/dashboard', getJobseekerDashboard);
router.get('/jobseekers/:jobseeker_id/full-dashboard', getJobseekerFullDashboard);
router.get('/jobseekers/:jobseeker_id/applied-jobs', getJobseekerAppliedJobs);
router.get('/jobseekers/:jobseeker_id/saved-jobs', getJobseekerSavedJobs);
router.get('/jobseekers/:jobseeker_id/applied-events', getJobseekerAppliedEvents);
router.get('/jobseekers/:jobseeker_id/saved-events', getJobseekerSavedEvents);

// Job application and saving routes
router.post('/jobseekers/:jobseeker_id/apply/:job_id', postJobApplication);
router.post('/jobseekers/:jobseeker_id/save/:job_id', postSaveJob);
router.delete('/jobseekers/:jobseeker_id/save/:job_id', deleteSavedJob);

// Event application and saving routes
router.post('/jobseekers/:jobseeker_id/apply-event/:event_id', postEventApplication);
router.post('/jobseekers/:jobseeker_id/save-event/:event_id', postSaveEvent);
router.delete('/jobseekers/:jobseeker_id/save-event/:event_id', deleteSavedEvent);

export default router;
