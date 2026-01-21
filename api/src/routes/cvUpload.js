import express from 'express';
import multer from 'multer';
import { uploadCV, deleteCV, getCVDownloadUrl } from '../controllers/cvUpload.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload CV
router.post('/upload', upload.single('cv'), uploadCV);

// Delete CV
router.delete('/delete', deleteCV);

// Get CV download URL
router.get('/download-url', getCVDownloadUrl);

export default router;
