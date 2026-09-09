// Test-only stand-in for src/services/emailService.js.
//
// Wired in via jest.config.js's moduleNameMapper, so every controller that imports
// emailService.js (jobseekers, authentication, contact) gets this instead during tests.
// Real emailService.js uses live SMTP credentials (see api/.env) - without this mock,
// every test run sends real emails through that account.
//
// Keep this file's exports in sync with src/services/emailService.js's exports.

export const sendPasswordResetEmail = async (email) => {
  console.log('📧 [test mock] sendPasswordResetEmail (not actually sent) ->', email);
  return { success: true };
};

export const sendContactEmail = async (senderEmail, topic) => {
  console.log('📧 [test mock] sendContactEmail (not actually sent) -> topic:', topic, 'from:', senderEmail);
  return { success: true };
};

export const sendWelcomeEmail = async (email) => {
  console.log('📧 [test mock] sendWelcomeEmail (not actually sent) ->', email);
  return { success: true };
};

export default {
  sendPasswordResetEmail,
  sendContactEmail,
  sendWelcomeEmail,
};
