import dotenv from "dotenv";
dotenv.config({ path: "./.env.test" });

/** @type {import('jest').Config} */
const config = {
  verbose: true, // Give more useful output
  maxWorkers: 1, // Make sure our tests run one after another
  moduleNameMapper: {
    // Redirect every import of emailService.js to a no-op mock during tests, regardless
    // of the relative path used to import it. Prevents tests from sending real emails
    // through the live SMTP credentials in .env (see src/tests/mocks/emailService.js).
    "services/emailService\\.js$": "<rootDir>/src/tests/mocks/emailService.js",
  },
};

export default config;