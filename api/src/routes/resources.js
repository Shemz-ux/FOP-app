import express from 'express';
import adminChecker from '../middleware/adminChecker.js';
import optionalAuth from '../middleware/optionalAuth.js';
import {
    upload,
    getResources,
    getResourceById,
    postResource,
    patchResource,
    deleteResourceById,
    toggleResourceActive,
    downloadResource,
    streamResource,
    getResourceCategories,
    getResourceStats
} from '../controllers/resources.js';

const router = express.Router();

// Public routes - anyone can view and download public resources
// optionalAuth identifies societies and admins so they can also access society-only resources
router.get('/', optionalAuth, getResources);
router.get('/categories', getResourceCategories);
router.get('/stats', getResourceStats);
router.get('/:resource_id', optionalAuth, getResourceById);
router.get('/:resource_id/download', optionalAuth, downloadResource);
router.get('/:resource_id/stream', optionalAuth, streamResource);

// Admin-only routes - require authentication for create, update, delete
router.post('/', adminChecker, upload.single('file'), postResource);
router.patch('/:resource_id', adminChecker, upload.single('file'), patchResource);
router.get('/:resource_id/toggle-active', adminChecker, toggleResourceActive);
router.delete('/:resource_id', adminChecker, deleteResourceById);

export default router;
