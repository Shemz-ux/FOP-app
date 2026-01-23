import { sendContactEmail } from '../services/emailService.js';

export const submitContactForm = async (req, res) => {
  try {
    const { email, topic, message } = req.body;

    // Validate inputs
    if (!email || !topic || !message) {
      return res.status(400).json({
        message: 'Email, topic, and message are required.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address.',
      });
    }

    // Validate topic length
    if (topic.length > 100) {
      return res.status(400).json({
        message: 'Topic must be 100 characters or less.',
      });
    }

    // Validate message length
    if (message.length > 2000) {
      return res.status(400).json({
        message: 'Message must be 2000 characters or less.',
      });
    }

    // Trim inputs
    const trimmedEmail = email.trim();
    const trimmedTopic = topic.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail || !trimmedTopic || !trimmedMessage) {
      return res.status(400).json({
        message: 'Email, topic, and message cannot be empty.',
      });
    }

    // Send email
    await sendContactEmail(trimmedEmail, trimmedTopic, trimmedMessage);

    return res.status(200).json({
      message: 'Message sent successfully.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      message: 'Failed to send message. Please try again later.',
    });
  }
};

export default {
  submitContactForm,
};
