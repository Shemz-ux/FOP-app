import express from 'express';
import { 
    getSocietyDashboard,
    getSocietySavedJobs,
    getSocietySavedEvents,
    postSocietySaveJob,
    postSocietySaveEvent,
    deleteSocietySavedJob,
    deleteSocietySavedEvent
} from '../controllers/society-dashboard.js';

// This file contains SOCIETY dashboard routes
// For jobseeker dashboard routes, see dashboard.js (renamed to jobseeker-dashboard.js)
// NOTE: Societies can only SAVE jobs/events, NOT apply/register

const router = express.Router();

// Society dashboard routes
router.get('/societies/:society_id/dashboard', getSocietyDashboard);
router.get('/societies/:society_id/saved-jobs', getSocietySavedJobs);
router.get('/societies/:society_id/saved-events', getSocietySavedEvents);

// Society save/unsave routes (NO APPLY - societies can only save)
router.post('/societies/:society_id/save-job/:job_id', postSocietySaveJob);
router.post('/societies/:society_id/save-event/:event_id', postSocietySaveEvent);
router.delete('/societies/:society_id/save-job/:job_id', deleteSocietySavedJob);
router.delete('/societies/:society_id/save-event/:event_id', deleteSocietySavedEvent);

export default router;