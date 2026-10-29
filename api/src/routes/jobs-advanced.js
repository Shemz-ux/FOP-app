import express from 'express';
import { getJobsAdvanced, getJobFilters, clearExpiredFeatured } from '../controllers/jobs-advanced.js';
import adminChecker from '../middleware/adminChecker.js';

const router = express.Router();

// Advanced job search with filtering and sorting
router.get('/search', getJobsAdvanced);

// Get available filter options for dropdowns
router.get('/filters', getJobFilters);

// Unfeature every job whose deadline has passed. Two segments, so it cannot be captured
// by jobRouter's PATCH /:job_id.
router.patch('/featured/expired', adminChecker, clearExpiredFeatured);

export default router;
