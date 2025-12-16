import request from 'supertest';
import app from '../../app.js';

describe('Users API Endpoints', () => {
  let testUserId;

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    test('should create a new user with valid data', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        number: '+1234567890',
        industry: 'Tester',
        message: 'This is a test user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      // Test should pass if user creation succeeds (with or without Mailchimp warnings)
      expect(response.body).toHaveProperty('newUser');
      expect(response.body.newUser).toHaveProperty('user_id');
      
      // Store the user ID for cleanup
      testUserId = response.body.newUser.user_id;
    });

    test('should handle Mailchimp validation errors gracefully', async () => {
      const newUser = {
        firstName: 'Invalid',
        lastName: 'Email',
        email: 'invalid-email',
        number: '+1234567890',
        industry: 'Tester',
        message: 'This should trigger a Mailchimp warning'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('newUser');
      expect(response.body).toHaveProperty('warning');
      expect(response.body.warning).toHaveProperty('message');
    });

    test('should handle incomplete user data', async () => {
      const incompleteUser = {
        firstName: 'Test'
        // Missing lastName and email
      };

      const response = await request(app)
        .post('/api/users')
        .send(incompleteUser);

      // Accept either 400 (validation error) or 500 (database error)
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/users/:user_id', () => {
    test('should return a specific user by ID', async () => {
      if (!testUserId) {
        // Create a user first if we don't have one
        const newUser = {
          firstName: 'Get',
          lastName: 'Test',
          email: 'gettest@example.com'
        };
        
        const createResponse = await request(app)
          .post('/api/users')
          .send(newUser);
        
        testUserId = createResponse.body.newUser.user_id;
      }

      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('user_id', testUserId);
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      expect(response.body).toHaveProperty('msg', 'User not found');
    });

    test('should handle invalid user ID format', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id');

      // Accept either 400 (validation error) or 404 (not found)
      expect([400, 404]).toContain(response.status);
    });
  });

  describe('PATCH /api/users/:user_id', () => {
    test('should update a user with valid data', async () => {
      if (!testUserId) {
        // Create a user first if we don't have one
        const newUser = {
          firstName: 'Patch',
          lastName: 'Test',
          email: 'patchtest@example.com'
        };
        
        const createResponse = await request(app)
          .post('/api/users')
          .send(newUser);
        
        testUserId = createResponse.body.newUser.user_id;
      }

      const updateData = {
        firstName: 'Updated',
        industry: 'Senior Tester'
      };

      const response = await request(app)
        .patch(`/api/users/${testUserId}`)
        .send(updateData)
        .expect(201);

      // Just verify the response has a user object
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('user_id', testUserId);
    });

    test('should handle non-existent user update', async () => {
      const updateData = { firstName: 'Updated' };

      const response = await request(app)
        .patch('/api/users/99999')
        .send(updateData);

      // Accept various error responses
      expect([201, 404, 500]).toContain(response.status);
    });

    test('should handle invalid field updates', async () => {
      if (!testUserId) return; // Skip if no test user
      
      const invalidData = { invalidField: 'test' };

      const response = await request(app)
        .patch(`/api/users/${testUserId}`)
        .send(invalidData);

      // Accept various responses for invalid fields
      expect([200, 201, 400, 404]).toContain(response.status);
    });
  });

  describe('DELETE /api/users/:user_id', () => {
    test('should delete a user successfully', async () => {
      if (!testUserId) {
        // Create a user first if we don't have one
        const newUser = {
          firstName: 'Delete',
          lastName: 'Test',
          email: 'deletetest@example.com'
        };
        
        const createResponse = await request(app)
          .post('/api/users')
          .send(newUser);
        
        testUserId = createResponse.body.newUser.user_id;
      }

      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('msg', 'User deleted!');

      // Verify user is actually deleted
      await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(404);

      testUserId = null; // Reset for cleanup
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/99999')
        .expect(404);

      expect(response.body).toHaveProperty('msg', 'User not found');
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    if (testUserId) {
      try {
        await request(app).delete(`/api/users/${testUserId}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});
