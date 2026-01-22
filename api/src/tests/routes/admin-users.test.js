import request from 'supertest';
import app from '../../app.js';
import { createAdminUser, removeAdminUser } from "../../models/admin-users.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import db from '../../db/db.js';
import '../utils/setup.js';

describe('Admin Users API Endpoints', () => {
    let testAdminUserIds = [];
    const testPassword = "AdminPassword123";
    let hashedPassword;
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    let adminJwtToken;

    beforeAll(async () => {
        hashedPassword = await bcrypt.hash(testPassword, 10);
        
        // Create admin JWT token
        const adminPayload = { sub: "admin123", role: "admin" };
        adminJwtToken = JWT.sign(adminPayload, process.env.JWT_SECRET || "test_secret");
        
        // Create a test admin user for testing
        const testAdmin = await createAdminUser({
            first_name: "Test",
            last_name: "Admin",
            email: `test.admin.routes.${Date.now()}@example.com`,
            password_hash: hashedPassword,
            role: "admin"
        });
        testAdminUserIds.push(testAdmin.admin_id);
    });

    afterAll(async () => {
        // Clean up test data
        try {
            for (const id of testAdminUserIds) {
                await removeAdminUser(id);
            }
        } catch (error) {
            console.log("Cleanup error:", error.message);
        }
    });

    describe('Authentication Tests', () => {
        it('should allow access with backdoor token', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('admin_users');
        });

        it('should allow access with admin JWT token', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminJwtToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('admin_users');
        });

        it('should reject access without token', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        it('should reject access with invalid token', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', 'Bearer invalid_token')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        it('should reject access with non-admin JWT token', async () => {
            const userPayload = { sub: "user123", role: "user" };
            const userToken = JWT.sign(userPayload, process.env.JWT_SECRET || "test_secret");

            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);

            expect(response.body).toHaveProperty('message', 'Admin access required');
        });
    });

    describe('GET /api/admin/users', () => {
        it('should return all admin users', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('admin_users');
            expect(Array.isArray(response.body.admin_users)).toBe(true);
            expect(response.body.admin_users.length).toBeGreaterThan(0);
            
            // Verify structure and no password exposure
            const user = response.body.admin_users[0];
            expect(user).toHaveProperty('admin_id');
            expect(user).toHaveProperty('first_name');
            expect(user).toHaveProperty('last_name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('role');
            expect(user).not.toHaveProperty('password_hash');
        });
    });

    describe('GET /api/admin/users/:admin_id', () => {
        it('should return specific admin user', async () => {
            const adminId = testAdminUserIds[0];
            
            const response = await request(app)
                .get(`/api/admin/users/${adminId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('admin_user');
            expect(response.body.admin_user.admin_id).toBe(adminId);
            expect(response.body.admin_user).toHaveProperty('first_name');
            expect(response.body.admin_user).toHaveProperty('email');
            expect(response.body.admin_user).not.toHaveProperty('password_hash');
        });

        it('should return 404 for non-existent admin user', async () => {
            const response = await request(app)
                .get('/api/admin/users/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Admin user not found');
        });
    });

    describe('POST /api/admin/users', () => {
        it('should create a new admin user', async () => {
            const timestamp = Date.now();
            const newAdminUser = {
                first_name: 'New',
                last_name: 'Admin',
                email: `new.admin.${timestamp}@example.com`,
                password: 'NewAdminPassword123',
                role: 'admin'
            };

            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(newAdminUser)
                .expect(201);

            expect(response.body).toHaveProperty('newAdminUser');
            expect(response.body.newAdminUser).toHaveProperty('admin_id');
            expect(response.body.newAdminUser.first_name).toBe('New');
            expect(response.body.newAdminUser.last_name).toBe('Admin');
            expect(response.body.newAdminUser.email).toBe(newAdminUser.email);
            expect(response.body.newAdminUser.role).toBe('admin');
            expect(response.body.newAdminUser).not.toHaveProperty('password_hash');
            
            // Store for cleanup
            testAdminUserIds.push(response.body.newAdminUser.admin_id);
        });

        it('should create super admin user', async () => {
            const timestamp = Date.now();
            const newSuperAdmin = {
                first_name: 'Super',
                last_name: 'Admin',
                email: `super.admin.${timestamp}@example.com`,
                password: 'SuperAdminPassword123',
                role: 'super_admin'
            };

            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(newSuperAdmin)
                .expect(201);

            expect(response.body.newAdminUser.role).toBe('super_admin');
            testAdminUserIds.push(response.body.newAdminUser.admin_id);
        });

        it('should default to admin role if not specified', async () => {
            const timestamp = Date.now();
            const newAdminUser = {
                first_name: 'Default',
                last_name: 'Role',
                email: `default.role.${timestamp}@example.com`,
                password: 'DefaultPassword123'
                // No role specified
            };

            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(newAdminUser)
                .expect(201);

            expect(response.body.newAdminUser.role).toBe('admin');
            testAdminUserIds.push(response.body.newAdminUser.admin_id);
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteUser = {
                first_name: 'Incomplete'
                // Missing last_name, email, password
            };

            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(incompleteUser)
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'First name, last name, email, and password are required');
        });

        it('should handle duplicate email', async () => {
            const timestamp = Date.now();
            const duplicateUser = {
                first_name: 'Duplicate',
                last_name: 'Email',
                email: `duplicate.${timestamp}@example.com`,
                password: 'DuplicatePassword123'
            };

            // Create first user
            const firstResponse = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(duplicateUser)
                .expect(201);
            
            testAdminUserIds.push(firstResponse.body.newAdminUser.admin_id);

            // Try to create second user with same email
            const secondResponse = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(duplicateUser);

            expect([400, 500]).toContain(secondResponse.status);
        });
    });

    describe('PATCH /api/admin/users/:admin_id', () => {
        it('should update admin user fields', async () => {
            const adminId = testAdminUserIds[0];
            const updateData = {
                first_name: 'Updated',
                role: 'super_admin'
            };

            const response = await request(app)
                .patch(`/api/admin/users/${adminId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('admin_user');
            expect(response.body.admin_user.first_name).toBe('Updated');
            expect(response.body.admin_user.role).toBe('super_admin');
            expect(response.body.admin_user).toHaveProperty('updated_at');
        });

        it('should update password', async () => {
            const adminId = testAdminUserIds[0];
            const updateData = {
                password: 'NewPassword123'
            };

            const response = await request(app)
                .patch(`/api/admin/users/${adminId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('admin_user');
            expect(response.body.admin_user).not.toHaveProperty('password_hash');
        });

        it('should return 404 for non-existent admin user', async () => {
            const updateData = { first_name: 'Updated' };

            const response = await request(app)
                .patch('/api/admin/users/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Admin user not found');
        });
    });

    describe('PATCH /api/admin/users/:admin_id/deactivate', () => {
        it('should deactivate admin user', async () => {
            // Create a user specifically for deactivation
            const testUser = await createAdminUser({
                first_name: 'To',
                last_name: 'Deactivate',
                email: `deactivate.route.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: 'admin'
            });

            const response = await request(app)
                .patch(`/api/admin/users/${testUser.admin_id}/deactivate`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Admin user deactivated!');

            // Verify user is deactivated by checking active users list
            const usersResponse = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            const deactivatedUser = usersResponse.body.admin_users.find(u => u.admin_id === testUser.admin_id);
            expect(deactivatedUser).toBeUndefined();
        });

        it('should return 404 for non-existent admin user', async () => {
            const response = await request(app)
                .patch('/api/admin/users/99999/deactivate')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Admin user not found');
        });
    });

    describe('DELETE /api/admin/users/:admin_id', () => {
        it('should delete admin user', async () => {
            // Create a user specifically for deletion
            const testUser = await createAdminUser({
                first_name: 'To',
                last_name: 'Delete',
                email: `delete.route.${Date.now()}@example.com`,
                password_hash: hashedPassword,
                role: 'admin'
            });

            const response = await request(app)
                .delete(`/api/admin/users/${testUser.admin_id}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Admin user deleted!');

            // Verify user is deleted
            const getUserResponse = await request(app)
                .get(`/api/admin/users/${testUser.admin_id}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);
        });

        it('should return 404 for non-existent admin user', async () => {
            const response = await request(app)
                .delete('/api/admin/users/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Admin user not found');
        });
    });

    describe('Admin User Creation Tracking', () => {
        it('should track creator when using JWT token', async () => {
            // Create JWT token with user ID
            const creatorPayload = { sub: testAdminUserIds[0], role: "admin" };
            const creatorToken = JWT.sign(creatorPayload, process.env.JWT_SECRET || "test_secret");

            const timestamp = Date.now();
            const newAdminUser = {
                first_name: 'Tracked',
                last_name: 'Creation',
                email: `tracked.creation.${timestamp}@example.com`,
                password: 'TrackedPassword123'
            };

            const response = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${creatorToken}`)
                .send(newAdminUser)
                .expect(201);

            expect(response.body).toHaveProperty('newAdminUser');
            testAdminUserIds.push(response.body.newAdminUser.admin_id);
        });
    });
});
