import request from 'supertest';
import app from '../../app.js';
import bcrypt from 'bcrypt';
import db from '../../db/db.js';

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
      const timestamp = Date.now();
      const newJobseeker = {
        first_name: 'John',
        last_name: 'Doe',
        email: `john.doe.${timestamp}@test.com`,
        password: testPassword, // Use plaintext password
        phone_number: '+1234567890',
        date_of_birth: '1995-01-15',
        gender: 'male',
        ethnicity: 'White British',
        school_meal_eligible: false,
        first_gen_to_go_uni: false,
        education_level: 'undergraduate',
        institution_name: 'University of London - King\'s College',
        uni_year: '2nd',
        degree_type: 'bsc',
        area_of_study: 'Computer Science',
        // No subjects required for university students
        role_interest_option_one: 'Software Developer',
        role_interest_option_two: 'Data Scientist',
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
      expect(response.body.newJobseeker.email).toBe(`john.doe.${timestamp}@test.com`);
      
      // Store the jobseeker ID for other tests
      testJobseekerId = response.body.newJobseeker.jobseeker_id;
    });

    test('should handle missing required fields', async () => {
      const incompleteJobseeker = {
        first_name: 'Jane'
        // Missing email and password (required fields)
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(incompleteJobseeker);

      // Accept either 400 (validation error) or 500 (database error)
      expect([400, 500]).toContain(response.status);
    });

    test('should handle duplicate email', async () => {
      // First create a jobseeker
      const timestamp = Date.now();
      const firstJobseeker = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: `duplicate.test.${timestamp}@test.com`,
        password: testPassword,
        phone_number: '+0987654321'
      };

      await request(app)
        .post('/api/jobseekers')
        .send(firstJobseeker)
        .expect(201);

      // Then try to create another with the same email
      const duplicateJobseeker = {
        first_name: 'John',
        last_name: 'Duplicate',
        email: `duplicate.test.${timestamp}@test.com`, // Same email
        password: testPassword,
        phone_number: '+1111111111'
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
        role_interest_option_one: 'Senior Software Developer',
        education_level: 'postgraduate'
      };

      const response = await request(app)
        .patch(`/api/jobseekers/${testJobseekerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('jobseeker');
      expect(response.body.jobseeker).toHaveProperty('jobseeker_id', testJobseekerId);
      expect(response.body.jobseeker.first_name).toBe('Updated John');
      expect(response.body.jobseeker.role_interest_option_one).toBe('Senior Software Developer');
      expect(response.body.jobseeker.education_level).toBe('postgraduate');
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
        password: testPassword,
        date_of_birth: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(invalidDateJobseeker);

      // Should fail due to invalid date format
      expect([400, 500]).toContain(response.status);
    });

    test('should allow A-level student without university details', async () => {
      const timestamp = Date.now();
      const alevelStudent = {
        first_name: 'Alex',
        last_name: 'Johnson',
        email: `alevel.${timestamp}@test.com`,
        password: testPassword,
        education_level: 'a_level_or_btec',
        institution_name: 'Harris Academy Barking',
        subject_one: 'Mathematics',
        subject_two: 'Physics',
        subject_three: 'Chemistry',
        subject_four: 'Further Mathematics'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(alevelStudent)
        .expect(201);

      expect(response.body.newJobseeker.education_level).toBe('a_level_or_btec');
      expect(response.body.newJobseeker.subject_one).toBe('Mathematics');
    });

    test('should allow university student without A-level subjects', async () => {
      const timestamp = Date.now();
      const universityStudent = {
        first_name: 'Sarah',
        last_name: 'Wilson',
        email: `university.${timestamp}@test.com`,
        password: testPassword,
        education_level: 'undergraduate',
        institution_name: 'Cambridge University',
        uni_year: '3rd',
        degree_type: 'ba',
        area_of_study: 'Economics'
        // No A-level subjects required for university students
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(universityStudent)
        .expect(201);

      expect(response.body.newJobseeker.education_level).toBe('undergraduate');
      expect(response.body.newJobseeker.institution_name).toBe('Cambridge University');
      expect(response.body.newJobseeker.area_of_study).toBe('Economics');
      // Subjects should be null/undefined for university students
      expect(response.body.newJobseeker.subject_one).toBeNull();
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

    test('should reject jobseeker with missing first_name', async () => {
      const jobseekerWithoutFirstName = {
        last_name: 'Doe',
        email: 'missing.firstname@test.com',
        password_hash: hashedPassword
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(jobseekerWithoutFirstName);

      expect([400, 500]).toContain(response.status);
    });

    test('should reject jobseeker with missing last_name', async () => {
      const jobseekerWithoutLastName = {
        first_name: 'John',
        email: 'missing.lastname@test.com',
        password_hash: hashedPassword
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(jobseekerWithoutLastName);

      expect([400, 500]).toContain(response.status);
    });
  });

  describe('LinkedIn and CV Fields', () => {
    let cvTestJobseekerId;

    afterAll(async () => {
      if (cvTestJobseekerId) {
        try {
          await db.query('DELETE FROM jobseekers WHERE jobseeker_id = $1', [cvTestJobseekerId]);
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    });

    test('should create jobseeker with LinkedIn profile', async () => {
      const timestamp = Date.now();
      const newJobseeker = {
        first_name: 'LinkedIn',
        last_name: 'User',
        email: `linkedin.user.${timestamp}@test.com`,
        password: testPassword,
        linkedin: 'https://www.linkedin.com/in/test-user',
        education_level: 'undergraduate',
        institution_name: 'Test University',
        uni_year: '2nd',
        degree_type: 'bsc',
        area_of_study: 'Computer Science'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(newJobseeker)
        .expect(201);

      expect(response.body.newJobseeker).toHaveProperty('linkedin', 'https://www.linkedin.com/in/test-user');
      cvTestJobseekerId = response.body.newJobseeker.jobseeker_id;
    });

    test('should create jobseeker with CV upload fields', async () => {
      const timestamp = Date.now();
      const newJobseeker = {
        first_name: 'CV',
        last_name: 'User',
        email: `cv.user.${timestamp}@test.com`,
        password: testPassword,
        cv_file_name: 'John_Doe_CV.pdf',
        cv_file_size: '245 KB',
        cv_storage_key: 'cvs/1234567890-abcdef.pdf',
        cv_storage_url: 'https://storage.example.com/cvs/1234567890-abcdef.pdf',
        cv_uploaded_at: new Date().toISOString(),
        education_level: 'undergraduate',
        institution_name: 'Test University',
        uni_year: '3rd',
        degree_type: 'bsc',
        area_of_study: 'Engineering'
      };

      const response = await request(app)
        .post('/api/jobseekers')
        .send(newJobseeker)
        .expect(201);

      expect(response.body.newJobseeker).toHaveProperty('cv_file_name', 'John_Doe_CV.pdf');
      expect(response.body.newJobseeker).toHaveProperty('cv_file_size', '245 KB');
      expect(response.body.newJobseeker).toHaveProperty('cv_storage_key', 'cvs/1234567890-abcdef.pdf');
      expect(response.body.newJobseeker).toHaveProperty('cv_storage_url');
      expect(response.body.newJobseeker).toHaveProperty('cv_uploaded_at');
    });

    test('should update jobseeker LinkedIn profile', async () => {
      if (!cvTestJobseekerId) return;

      const updateData = {
        linkedin: 'https://www.linkedin.com/in/updated-profile'
      };

      const response = await request(app)
        .patch(`/api/jobseekers/${cvTestJobseekerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.jobseeker.linkedin).toBe('https://www.linkedin.com/in/updated-profile');
    });

    test('should update jobseeker CV fields', async () => {
      if (!cvTestJobseekerId) return;

      const updateData = {
        cv_file_name: 'Updated_CV.pdf',
        cv_file_size: '320 KB',
        cv_storage_key: 'cvs/9876543210-xyz.pdf',
        cv_storage_url: 'https://storage.example.com/cvs/9876543210-xyz.pdf',
        cv_uploaded_at: new Date().toISOString()
      };

      const response = await request(app)
        .patch(`/api/jobseekers/${cvTestJobseekerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.jobseeker.cv_file_name).toBe('Updated_CV.pdf');
      expect(response.body.jobseeker.cv_file_size).toBe('320 KB');
      expect(response.body.jobseeker.cv_storage_key).toBe('cvs/9876543210-xyz.pdf');
    });

    test('should delete CV by setting fields to null', async () => {
      if (!cvTestJobseekerId) return;

      const updateData = {
        cv_file_name: null,
        cv_file_size: null,
        cv_storage_key: null,
        cv_storage_url: null,
        cv_uploaded_at: null
      };

      const response = await request(app)
        .patch(`/api/jobseekers/${cvTestJobseekerId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.jobseeker.cv_file_name).toBeNull();
      expect(response.body.jobseeker.cv_storage_key).toBeNull();
    });
  });

  afterAll(async () => {
    // Close database connection to prevent Jest from hanging
    await db.end();
  });
});
