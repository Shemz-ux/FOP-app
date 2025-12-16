import request from 'supertest';
import app from '../app.js';

describe.skip('API Integration Tests', () => {
  test('should serve endpoints documentation at root', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.headers['content-type']).toMatch(/json/);
  });

  test('should return 404 for invalid routes', async () => {
    const response = await request(app)
      .get('/api/invalid-route')
      .expect(404);

    expect(response.body).toHaveProperty('msg', 'Invalid request!');
  });

  test('should handle CORS properly', async () => {
    const response = await request(app)
      .options('/api/users')
      .expect(204);

    expect(response.headers).toHaveProperty('access-control-allow-origin');
  });

  describe('Full CRUD Workflow', () => {
    let userId;

    test('should complete full user lifecycle', async () => {
      // 1. Create user
      const newUser = {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        number: '+1234567890',
        industry: 'QA Engineer',
        message: 'Full integration test'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(createResponse.body).toHaveProperty('newUser');
      userId = createResponse.body.newUser.user_id;

      // 2. Get all users (should include our new user)
      const getAllResponse = await request(app)
        .get('/api/users')
        .expect(200);

      expect(getAllResponse.body.users.some(user => user.user_id === userId)).toBe(true);

      // 3. Get specific user
      const getUserResponse = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(getUserResponse.body).toHaveProperty('user');
      expect(getUserResponse.body.user).toHaveProperty('user_id', userId);

      // 4. Update user
      const updateData = {
        firstName: 'Updated Integration',
        industry: 'Senior QA Engineer'
      };

      const updateResponse = await request(app)
        .patch(`/api/users/${userId}`)
        .send(updateData)
        .expect(201);

      expect(updateResponse.body).toHaveProperty('user');
      expect(updateResponse.body.user).toHaveProperty('user_id', userId);

      // 5. Delete user
      const deleteResponse = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(deleteResponse.body).toHaveProperty('msg', 'User deleted!');

      // 6. Verify deletion
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });
});
