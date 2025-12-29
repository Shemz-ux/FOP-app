import express from 'express';
import { getEventsAdvanced, getEventFilters } from '../controllers/events-advanced.js';

const router = express.Router();

// Advanced event search with filtering and sorting
router.get('/search', getEventsAdvanced);

// Get available filter options for dropdowns
router.get('/filters', getEventFilters);

export default router;
