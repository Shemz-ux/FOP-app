import express from 'express';
import adminChecker from '../middleware/adminChecker.js';
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

// Public routes - anyone can view and download resources
router.get('/', getResources);
router.get('/categories', getResourceCategories);
router.get('/stats', getResourceStats);
router.get('/:resource_id', getResourceById);
router.get('/:resource_id/download', downloadResource);
router.get('/:resource_id/stream', streamResource);

// Admin-only routes - require authentication for create, update, delete
router.post('/', adminChecker, upload.single('file'), postResource);
router.patch('/:resource_id', adminChecker, patchResource);
router.get('/:resource_id/toggle-active', adminChecker, toggleResourceActive);
router.delete('/:resource_id', adminChecker, deleteResourceById);

export default router;
