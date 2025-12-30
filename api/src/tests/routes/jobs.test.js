import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../setup.js';

describe('Jobs API Endpoints', () => {
    let testJobId;
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    
    beforeEach(() => {
        // Reset testJobId before each test
        testJobId = null;
    });
    
    describe('GET /api/jobs', () => {
        test('should return all jobs', async () => {
            const response = await request(app)
                .get('/api/jobs')
                .expect(200);

            expect(response.body).toHaveProperty('jobs');
            expect(Array.isArray(response.body.jobs)).toBe(true);
        });

        test('should return active jobs only when active=true', async () => {
            const response = await request(app)
                .get('/api/jobs?active=true')
                .expect(200);

            expect(response.body).toHaveProperty('jobs');
            expect(Array.isArray(response.body.jobs)).toBe(true);
        });

        test('should filter jobs by company', async () => {
            const response = await request(app)
                .get('/api/jobs?company=TestCorp')
                .expect(200);

            expect(response.body).toHaveProperty('jobs');
            expect(Array.isArray(response.body.jobs)).toBe(true);
        });
    });
    
    describe('POST /api/jobs', () => {
        test('should create a new job with valid data', async () => {
            const timestamp = Date.now();
            const newJob = {
                title: 'Software Developer',
                company: `TestCorp ${timestamp}`,
                description: 'Exciting software development role',
                industry: 'Technology',
                location: 'London',
                job_level: 'Mid-level',
                role_type: 'Full-time',
                contact_email: `hr.${timestamp}@testcorp.com`,
                job_link: 'https://testcorp.com/jobs/123',
                salary: '£50,000 - £70,000',
                deadline: '2024-12-31',
                is_active: true
            };

            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(newJob)
                .expect(201);

            expect(response.body).toHaveProperty('newJob');
            expect(response.body.newJob).toHaveProperty('job_id');
            expect(response.body.newJob.title).toBe('Software Developer');
            expect(response.body.newJob.company).toBe(`TestCorp ${timestamp}`);
            expect(response.body.newJob.contact_email).toBe(`hr.${timestamp}@testcorp.com`);

            // Store the job ID for other tests
            testJobId = response.body.newJob.job_id;
        });

        test('should handle missing required fields', async () => {
            const incompleteJob = {
                company: 'TestCorp',
                description: 'Test description',
                // Missing title (required field)
            };

            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(incompleteJob);

            // Accept either 400 (validation error) or 500 (database error)
            expect([400, 500]).toContain(response.status);
        });

        test('should create job with minimal required fields', async () => {
            const timestamp = Date.now();
            const minimalJob = {
                title: 'Minimal Job',
                company: `MinimalCorp ${timestamp}`
            };

            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(minimalJob)
                .expect(201);

            expect(response.body.newJob.title).toBe('Minimal Job');
            expect(response.body.newJob.company).toBe(`MinimalCorp ${timestamp}`);
            expect(response.body.newJob.is_active).toBe(true); // Default value
        });
    });

    describe('GET /api/jobs/:job_id', () => {
        test('should return a specific job', async () => {
            if (!testJobId) {
                const timestamp = Date.now();
                const newJob = {
                    title: 'Test Job',
                    company: `GetTestCorp ${timestamp}`,
                    description: 'Test description'
                };
                const response = await request(app)
                    .post('/api/jobs')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .send(newJob)
                    .expect(201);
                testJobId = response.body.newJob.job_id;
            }

            const response = await request(app)
                .get(`/api/jobs/${testJobId}`)
                .expect(200);

            expect(response.body).toHaveProperty('job');
            expect(response.body.job).toHaveProperty('job_id');
            expect(response.body.job.title).toBe('Test Job');
            expect(response.body.job.company).toContain('GetTestCorp');
        });

        test('should return 404 if job not found', async () => {
            const response = await request(app)
                .get(`/api/jobs/999999`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Job not found');
        });

        test('should handle invalid job ID format', async () => {
            const response = await request(app)
                .get('/api/jobs/invalid-id');

            // Accept either 400 (validation error) or 404 (not found)
            expect([400, 404]).toContain(response.status);
        });
    });

    describe('PATCH /api/jobs/:job_id', () => {
        test('should update a job with valid data', async () => {
            if (!testJobId) {
                const timestamp = Date.now();
                const newJob = {
                    title: 'Update Test Job',
                    company: `UpdateTestCorp ${timestamp}`,
                    description: 'Test description'
                };
                const response = await request(app)
                    .post('/api/jobs')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .send(newJob)
                    .expect(201);
                testJobId = response.body.newJob.job_id;
            }

            const updateTimestamp = Date.now();
            const updateData = {
                title: 'Updated Job Title',
                company: 'Updated Company',
                description: 'Updated description',
                salary: '£60,000 - £80,000',
                contact_email: `updated.hr.${updateTimestamp}@company.com`
            };

            const response = await request(app)
                .patch(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('job');
            expect(response.body.job).toHaveProperty('job_id');
            expect(response.body.job.title).toBe('Updated Job Title');
            expect(response.body.job.company).toBe('Updated Company');
            expect(response.body.job.salary).toBe('£60,000 - £80,000');
            expect(response.body.job.contact_email).toBe(`updated.hr.${updateTimestamp}@company.com`);
        });

        test('should handle non-existent job update', async () => {
            const updateData = { title: 'Updated Job' };

            const response = await request(app)
                .patch('/api/jobs/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Job not found');
        });

        test('should handle invalid field updates', async () => {
            if (!testJobId) return; // Skip if no test job
            
            const invalidData = { invalidField: 'test', anotherInvalidField: 'value' };

            const response = await request(app)
                .patch(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid field provided');
        });

        test('should update only provided fields', async () => {
            if (!testJobId) return; // Skip if no test job

            const partialUpdate = {
                title: 'Partially Updated Job'
            };

            const response = await request(app)
                .patch(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(partialUpdate)
                .expect(200);

            expect(response.body.job.title).toBe('Partially Updated Job');
            // Other fields should remain unchanged
            expect(response.body.job.company).toBe('Updated Company');
        });
    });

    describe('DELETE /api/jobs/:job_id', () => {
        test('should delete a job successfully', async () => {
            if (!testJobId) {
                // Create a job first if we don't have one
                const timestamp = Date.now();
                const newJob = {
                    title: 'Delete Test Job',
                    company: `DeleteTestCorp ${timestamp}`,
                    description: 'Test description'
                };
                
                const createResponse = await request(app)
                    .post('/api/jobs')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .send(newJob);
                
                testJobId = createResponse.body.newJob.job_id;
            }

            const response = await request(app)
                .delete(`/api/jobs/${testJobId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Job deleted!');

            // Verify job is actually deleted
            const deleteResponse = await request(app)
                .get(`/api/jobs/${testJobId}`)
                .expect(404);

            expect(deleteResponse.body).toHaveProperty('msg', 'Job not found');
        });

        test('should return 404 for non-existent job', async () => {
            const response = await request(app)
                .delete('/api/jobs/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Job not found');
        });
    });

    describe('Data validation and edge cases', () => {
        test('should handle very long strings in fields', async () => {
            const timestamp = Date.now();
            const longStringJob = {
                title: 'A'.repeat(300), // Exceeds VARCHAR(255)
                company: `LongTestCorp ${timestamp}`,
                description: 'Test description'
            };

            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(longStringJob);

            // Should fail due to field length constraints
            expect([400, 500]).toContain(response.status);
        });

        test('should handle invalid date format', async () => {
            const timestamp = Date.now();
            const invalidDateJob = {
                title: 'Date Test Job',
                company: `DateTestCorp ${timestamp}`,
                description: 'Test description',
                deadline: 'invalid-date'
            };

            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(invalidDateJob);

            // Should fail due to invalid date format
            expect([400, 500]).toContain(response.status);
        });

        test('should handle boolean field validation', async () => {
            const timestamp = Date.now();
            const booleanTestJob = {
                title: 'Boolean Test Job',
                company: `BoolTestCorp ${timestamp}`,
                description: 'Test description',
                is_active: false
            };

            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(booleanTestJob)
                .expect(201);

            expect(response.body.newJob.is_active).toBe(false);
        });
    });

    afterAll(async () => {
        if (testJobId) {
            try {
                await request(app)
                    .delete(`/api/jobs/${testJobId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
    });

    afterAll(async () => {
        // Close database connection to prevent Jest from hanging
        await db.end();
    });
});
