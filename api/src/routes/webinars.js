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
router.get('/', getWebinars);                    // GET /api/webinars?category=Tech&search=react&page=1&limit=12&sort=popular
router.get('/categories', getCategories);        // GET /api/webinars/categories
router.get('/:webinar_id', getWebinar);          // GET /api/webinars/1
router.post('/:webinar_id/view', trackView);     // POST /api/webinars/1/view

// Admin-only routes (require authentication)
router.post('/', adminChecker, postWebinar);                    // POST /api/webinars
router.patch('/:webinar_id', adminChecker, patchWebinar);       // PATCH /api/webinars/1
router.delete('/:webinar_id', adminChecker, removeWebinar);     // DELETE /api/webinars/1

export default router;
