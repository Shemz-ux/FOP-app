import express from 'express';
import { getJobsAdvanced, getJobFilters } from '../controllers/jobs-advanced.js';

const router = express.Router();

// Advanced job search with filtering and sorting
router.get('/search', getJobsAdvanced);

// Get available filter options for dropdowns
router.get('/filters', getJobFilters);

export default router;
