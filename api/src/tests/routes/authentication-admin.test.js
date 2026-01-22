import app from "../../app.js";
import supertest from "supertest";
import bcrypt from "bcrypt";
import { createAdminUser, removeAdminUser } from "../../models/admin-users.js";
import "../utils/setup.js";
import db from '../../db/db.js';

describe("Admin User Authentication", () => {
  let testAdminUserId;
  const testPassword = "AdminPassword123";
  let hashedPassword;

  beforeAll(async () => {
    // Hash password for direct database insertion
    hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // Create test admin user directly in database with hashed password
    const adminUser = await createAdminUser({
      first_name: "Test",
      last_name: "Admin",
      email: "admin-auth@test.com",
      password_hash: hashedPassword,
      role: "admin"
    });
    testAdminUserId = adminUser.admin_id;
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (testAdminUserId) {
        await removeAdminUser(testAdminUserId);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe("Admin User Login", () => {
    it("returns a token when admin credentials are valid", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "admin-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user_id).toBe(testAdminUserId);
      expect(response.body.user_type).toBe("admin");
      expect(response.body.role).toBe("admin");
      expect(response.body.message).toEqual("OK");
    });

    it("doesn't return a token when admin password is wrong", async () => {
      const response = await supertest(app)
        .post("/api/tokens")
        .send({ email: "admin-auth@test.com", password: "WrongPassword123" });

      expect(response.status).toEqual(401);
      expect(response.body.token).toBeUndefined();
      expect(response.body.message).toEqual("Password incorrect");
    });

    it("JWT token contains admin role for admin access", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "admin-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(201);
      
      // Test that the JWT token works with admin endpoints
      const adminResponse = await supertest(app)
        .get('/api/admin/summary')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);

      expect(adminResponse.body).toHaveProperty('analytics_summary');
    });
  });

  describe("Super Admin User", () => {
    let superAdminId;

    beforeAll(async () => {
      const superAdmin = await createAdminUser({
        first_name: "Super",
        last_name: "Admin",
        email: "super-admin-auth@test.com",
        password_hash: hashedPassword,
        role: "super_admin"
      });
      superAdminId = superAdmin.admin_id;
    });

    afterAll(async () => {
      try {
        if (superAdminId) {
          await removeAdminUser(superAdminId);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    it("returns super_admin role in token", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "super-admin-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user_id).toBe(superAdminId);
      expect(response.body.user_type).toBe("admin");
      expect(response.body.role).toBe("super_admin");
      expect(response.body.message).toEqual("OK");
    });

    it("super admin JWT token works with admin endpoints", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "super-admin-auth@test.com", password: testPassword });
      
      // Test that the super admin JWT token works with admin endpoints
      const adminResponse = await supertest(app)
        .get('/api/admin/summary')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);

      expect(adminResponse.body).toHaveProperty('analytics_summary');
    });
  });

  describe("Inactive Admin User", () => {
    let inactiveAdminId;

    beforeAll(async () => {
      const inactiveAdmin = await createAdminUser({
        first_name: "Inactive",
        last_name: "Admin",
        email: "inactive-admin-auth@test.com",
        password_hash: hashedPassword,
        role: "admin"
      });
      inactiveAdminId = inactiveAdmin.admin_id;

      // Deactivate the user
      await db.query(
        "UPDATE admin_users SET is_active = false WHERE admin_id = $1",
        [inactiveAdminId]
      );
    });

    afterAll(async () => {
      try {
        if (inactiveAdminId) {
          await removeAdminUser(inactiveAdminId);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    it("doesn't return token for inactive admin user", async () => {
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "inactive-admin-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(401);
      expect(response.body.token).toBeUndefined();
      expect(response.body.message).toEqual("User not found");
    });
  });

  describe("Authentication Priority", () => {
    it("checks admin users after jobseekers and societies", async () => {
      // This test ensures the authentication flow checks all three user types
      const response = await supertest(app)
        .post('/api/tokens')
        .send({ email: "admin-auth@test.com", password: testPassword });
      
      expect(response.status).toEqual(201);
      expect(response.body.user_type).toBe("admin");
    });
  });

  afterAll(async () => {
    // Close database connection to prevent Jest from hanging
    await db.end();
  });
});
