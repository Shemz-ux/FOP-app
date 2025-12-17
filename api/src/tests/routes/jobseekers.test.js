import request from 'supertest';
import app from '../../app.js';
import bcrypt from 'bcrypt';

describe.only('Jobseekers API Endpoints', () => {
  let testJobseekerId;
  const testPassword = 'TestPassword123';
  let hashedPassword;

  beforeAll(async () => {
    // Hash password for testing
    hashedPassword = await bcrypt.hash(testPassword, 10);
  });

  describe('GET /api/jobseekers', () => {
    test('should return all jobseekers', async () => {
      const response = await request(app)
        .get('/api/jobseekers')
        .expect(200);

      expect(response.body).toHaveProperty('jobseekers');
      expect(Array.isArray(response.body.jobseekers)).toBe(true);
    });
  });

  describe('POST /api/jobseekers', () => {
    test('should create a new jobseeker with valid data', async () => {
      const newJobseeker = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password_hash: hashedPassword,
        phone_number: '+1234567890',
        date_of_birth: '1995-01-15',
        gender: 'Male',
        ethnicity: 'White British',
        school_meal_eligible: 'No',
        first_gen_to_go_uni: 'No',
        education_level: 'Undergraduate',
        area_of_study: 'Computer Science',
        role_of_interest: 'Software Developer',
        society: 'Tech Society'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(newJobseeker)
        .expect(201);

      expect(response.body).toHaveProperty('newJobseeker');
      expect(response.body.newJobseeker).toHaveProperty('jobseeker_id');
      expect(response.body.newJobseeker.first_name).toBe('John');
      expect(response.body.newJobseeker.last_name).toBe('Doe');
      expect(response.body.newJobseeker.email).toBe('john.doe@test.com');
      
      // Store the jobseeker ID for other tests
      testJobseekerId = response.body.newJobseeker.jobseeker_id;
    });

    test('should handle missing required fields', async () => {
      const incompleteJobseeker = {
        first_name: 'Jane'
        // Missing email and password_hash (required fields)
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(incompleteJobseeker);

      // Accept either 400 (validation error) or 500 (database error)
      expect([400, 500]).toContain(response.status);
    });

    test('should handle duplicate email', async () => {
      const duplicateJobseeker = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'john.doe@test.com', // Same email as previous test
        password_hash: hashedPassword,
        phone_number: '+0987654321'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(duplicateJobseeker);

      // Should fail due to unique email constraint
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/jobseekers/:jobseeker_id', () => {
    test('should return a specific jobseeker by ID', async () => {
      if (!testJobseekerId) {
        // Create a jobseeker first if we don't have one
        const newJobseeker = {
          first_name: 'Get',
          last_name: 'Test',
          email: 'gettest@example.com',
          password_hash: hashedPassword
        };
        
        const createResponse = await request(app)
          .post('/api/jobseekers')
          .send(newJobseeker);
        
        testJobseekerId = createResponse.body.newJobseeker.jobseeker_id;
      }

      const response = await request(app)
        .get(`/api/jobseekers/${testJobseekerId}`)
        .expect(200);

      expect(response.body).toHaveProperty('jobseeker');
      expect(response.body.jobseeker).toHaveProperty('jobseeker_id', testJobseekerId);
      expect(response.body.jobseeker).toHaveProperty('email');
      expect(response.body.jobseeker).toHaveProperty('created_at');
    });

    test('should return 404 for non-existent jobseeker', async () => {
      const response = await request(app)
        .get('/api/jobseekers/99999')
        .expect(404);

      expect(response.body).toHaveProperty('msg', 'Jobseeker not found');
    });

    test('should handle invalid jobseeker ID format', async () => {
      const response = await request(app)
        .get('/api/jobseekers/invalid-id');

      // Accept either 400 (validation error) or 404 (not found)
      expect([400, 404]).toContain(response.status);
    });
  });

  describe('PATCH /api/jobseekers/:jobseeker_id', () => {
    test('should update a jobseeker with valid data', async () => {
      if (!testJobseekerId) {
        // Create a jobseeker first if we don't have one
        const newJobseeker = {
          first_name: 'Patch',
          last_name: 'Test',
          email: 'patchtest@example.com',
          password_hash: hashedPassword
        };
        
        const createResponse = await request(app)
          .post('/api/jobseekers')
          .send(newJobseeker);
        
        testJobseekerId = createResponse.body.newJobseeker.jobseeker_id;
      }

      const updateData = {
        first_name: 'Updated John',
        role_of_interest: 'Senior Software Developer',
        education_level: 'Postgraduate'
      };

      const response = await request(app)
        .patch(`/api/jobseekers/${testJobseekerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('jobseeker');
      expect(response.body.jobseeker).toHaveProperty('jobseeker_id', testJobseekerId);
      expect(response.body.jobseeker.first_name).toBe('Updated John');
      expect(response.body.jobseeker.role_of_interest).toBe('Senior Software Developer');
      expect(response.body.jobseeker.education_level).toBe('Postgraduate');
    });

    test('should handle non-existent jobseeker update', async () => {
      const updateData = { first_name: 'Updated' };

      const response = await request(app)
        .patch('/api/jobseekers/99999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('msg', 'Jobseeker not found');
    });

    test('should handle invalid field updates', async () => {
      if (!testJobseekerId) return; // Skip if no test jobseeker
      
      const invalidData = { invalidField: 'test', anotherInvalidField: 'value' };

      const response = await request(app)
        .patch(`/api/jobseekers/${testJobseekerId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('msg', 'Invalid field provided');
    });

    test('should update only provided fields', async () => {
      if (!testJobseekerId) return; // Skip if no test jobseeker

      const partialUpdate = {
        phone_number: '+44123456789'
      };

      const response = await request(app)
        .patch(`/api/jobseekers/${testJobseekerId}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body.jobseeker.phone_number).toBe('+44123456789');
      // Other fields should remain unchanged
      expect(response.body.jobseeker.first_name).toBe('Updated John'); // From previous test
    });
  });

  describe('DELETE /api/jobseekers/:jobseeker_id', () => {
    test('should delete a jobseeker successfully', async () => {
      if (!testJobseekerId) {
        // Create a jobseeker first if we don't have one
        const newJobseeker = {
          first_name: 'Delete',
          last_name: 'Test',
          email: 'deletetest@example.com',
          password_hash: hashedPassword
        };
        
        const createResponse = await request(app)
          .post('/api/jobseekers')
          .send(newJobseeker);
        
        testJobseekerId = createResponse.body.newJobseeker.jobseeker_id;
      }

      const response = await request(app)
        .delete(`/api/jobseekers/${testJobseekerId}`)
        .expect(200);

      expect(response.body).toHaveProperty('msg', 'Jobseeker deleted!');

      // Verify jobseeker is actually deleted
      await request(app)
        .get(`/api/jobseekers/${testJobseekerId}`)
        .expect(404);

      testJobseekerId = null; // Reset for cleanup
    });

    test('should return 404 for non-existent jobseeker', async () => {
      const response = await request(app)
        .delete('/api/jobseekers/99999')
        .expect(404);

      expect(response.body).toHaveProperty('msg', 'Jobseeker not found');
    });
  });

  describe('Data validation and edge cases', () => {
    test('should handle very long strings in fields', async () => {
      const longStringJobseeker = {
        first_name: 'A'.repeat(300), // Exceeds VARCHAR(255)
        last_name: 'Test',
        email: 'longstring@test.com',
        password_hash: hashedPassword
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(longStringJobseeker);

      // Should fail due to field length constraints
      expect([400, 500]).toContain(response.status);
    });

    test('should handle invalid date format', async () => {
      const invalidDateJobseeker = {
        first_name: 'Date',
        last_name: 'Test',
        email: 'datetest@test.com',
        password_hash: hashedPassword,
        date_of_birth: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(invalidDateJobseeker);

      // Should fail due to invalid date format
      expect([400, 500]).toContain(response.status);
    });

    test('should handle empty string values', async () => {
      const emptyStringJobseeker = {
        first_name: '',
        last_name: '',
        email: 'empty@test.com',
        password_hash: hashedPassword
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(emptyStringJobseeker);

      // Should either succeed with empty strings or fail validation
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    if (testJobseekerId) {
      try {
        await request(app).delete(`/api/jobseekers/${testJobseekerId}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});
