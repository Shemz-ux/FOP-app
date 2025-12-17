import dotenv from 'dotenv';
import db from '../db/db.js';

// Load test environment variables first
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  try {
    // Test database connection without starting server
    await db.query("SELECT 1");
    console.log("✅ Test database connection successful!");
  } catch (err) {
    console.error("❌ Test database connection failed:", err.message);
    throw err;
  }
});

afterAll(async () => {
  // Close database connections to prevent hanging
  try {
    await db.end();
  } catch (err) {
    // Ignore cleanup errors
  }
});
