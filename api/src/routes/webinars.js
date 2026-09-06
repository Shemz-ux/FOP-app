/**
 * Webinars Routes
 * 
 * Query Parameters for GET /api/webinars:
 * - search: string - Search in title and description
 * - category: string - Filter by category (exact match)
 * - is_published: boolean - Filter by published status (true/false)
 * - is_featured: boolean - Filter by featured status (true/false)
 * - sort: string - Sort by: 'newest', 'oldest', 'popular', 'title' (default: 'newest')
 * - page: number - Page number for pagination (default: 1)
 * - limit: number - Results per page (default: 12, max: 50)
 * 
 * Admin-only fields for POST/PATCH:
 * - is_featured: boolean - Promote webinar to featured list (default: false)
 */
import express from 'express';
import { 
    getWebinars, 
    getWebinar, 
    postWebinar, 
    patchWebinar, 
    removeWebinar,
    trackView,
    getCategories
} from '../controllers/webinars.js';
import adminChecker from '../middleware/adminChecker.js';

const router = express.Router();

// Public routes
router.get('/', getWebinars);                    // GET /api/webinars?category=Tech&search=react&is_published=true&is_featured=true&page=1&limit=12&sort=popular
router.get('/categories', getCategories);        // GET /api/webinars/categories
router.get('/:webinar_id', getWebinar);          // GET /api/webinars/1
router.post('/:webinar_id/view', trackView);     // POST /api/webinars/1/view

// Admin-only routes (require authentication)
router.post('/', adminChecker, postWebinar);                    // POST /api/webinars
router.patch('/:webinar_id', adminChecker, patchWebinar);       // PATCH /api/webinars/1
router.delete('/:webinar_id', adminChecker, removeWebinar);     // DELETE /api/webinars/1

export default router;
