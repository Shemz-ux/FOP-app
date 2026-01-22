import dotenv from 'dotenv';
import db from '../../db/db.js';
import seed from '../../db/tables.js';

// Load test environment variables first
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  try {
    // Test database connection without starting server
    await db.query("SELECT 1");
    console.log("✅ Test database connection successful!");
    
    // Ensure all tables exist in test database
    await seed();
    console.log("✅ Test database tables created!");
  } catch (err) {
    console.error("❌ Test database setup failed:", err.message);
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
