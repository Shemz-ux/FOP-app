import express from 'express';
import {
    uploadMedia,
    deleteMedia
} from '../controllers/mediaUpload.js';
import { uploadSingle, handleMulterError } from '../middleware/uploadMiddleware.js';
import tokenChecker from '../middleware/tokenChecker.js';

const router = express.Router();

router.post('/upload', tokenChecker, uploadSingle, handleMulterError, uploadMedia);

router.delete('/delete', tokenChecker, deleteMedia);

export default router;
