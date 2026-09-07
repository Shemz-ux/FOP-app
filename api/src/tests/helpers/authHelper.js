/**
 * Authentication Helper for Tests
 * 
 * Creates test admin users and generates JWT tokens for testing
 * protected routes without modifying source code.
 */

import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../db/db.js';

/**
 * Create a test admin user in the database
 * @returns {Promise<Object>} Admin user object with id
 */
export const createTestAdmin = async () => {
  const hashedPassword = await bcrypt.hash('testpassword123', 10);
  
  const result = await db.query(
    `INSERT INTO admin_users (email, password_hash, role, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
     RETURNING admin_id, email, role`,
    ['test-admin@example.com', hashedPassword, 'admin', 'Test', 'Admin']
  );
  
  return result.rows[0];
};

/**
 * Generate a JWT token for a test admin user
 * @param {number} adminId - Admin user ID
 * @param {string} role - Admin role (default: 'admin')
 * @returns {string} JWT token
 */
export const generateAdminToken = (adminId, role = 'admin') => {
  const jwtSecret = process.env.JWT_SECRET || 'test_secret_key';
  
  const payload = {
    sub: adminId,
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  };
  
  return JWT.sign(payload, jwtSecret);
};

/**
 * Setup admin authentication for tests
 * Creates an admin user and returns a valid JWT token
 * @returns {Promise<Object>} { adminId, token }
 */
export const setupAdminAuth = async () => {
  const admin = await createTestAdmin();
  const token = generateAdminToken(admin.admin_id, admin.role);
  
  return {
    adminId: admin.admin_id,
    token
  };
};

/**
 * Clean up test admin user
 * @param {number} adminId - Admin user ID to delete
 */
export const cleanupTestAdmin = async (adminId) => {
  if (adminId) {
    await db.query('DELETE FROM admin_users WHERE admin_id = $1', [adminId]);
  }
};

export default {
  createTestAdmin,
  generateAdminToken,
  setupAdminAuth,
  cleanupTestAdmin
};
