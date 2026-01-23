import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitContactForm } from '../controllers/contact.js';

const router = express.Router();

// Rate limiter: 3 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    message: 'Too many contact form submissions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, submitContactForm);

export default router;
