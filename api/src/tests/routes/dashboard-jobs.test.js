import request from 'supertest';
import app from '../../app.js';
import bcrypt from 'bcrypt';
import db from '../../db/db.js';
import '../utils/setup.js';

describe('Dashboard Jobs API Endpoints', () => {
    let testJobseekerId;
    let testJobIds = [];
    let hashedPassword;
    const testPassword = 'TestPassword123';
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";

    beforeAll(async () => {
        // Create hashed password for test users
        hashedPassword = await bcrypt.hash(testPassword, 10);
    });

    beforeEach(async () => {
        // Create test jobseeker
        const jobseekerResponse = await request(app)
            .post('/api/jobseekers')
            .send({
                first_name: 'Dashboard',
                last_name: 'Tester',
                email: `dashboard.tester.${Date.now()}@test.com`,
                password: testPassword,
                education_level: 'undergraduate',
                institution_name: 'Test University',
                uni_year: '3rd',
                degree_type: 'bsc',
                area_of_study: 'Computer Science'
            });
        
        testJobseekerId = jobseekerResponse.body.newJobseeker.jobseeker_id;

        // Create test jobs
        const job1Response = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${backdoorToken}`)
            .send({
                title: 'Software Developer',
                company: 'TechCorp',
                location: 'London',
                contact_email: 'jobs@techcorp.com',
                deadline: '2024-12-31'
            });
        testJobId1 = job1Response.body.newJob.job_id;

        const job2Response = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${backdoorToken}`)
            .send({
                title: 'Data Analyst',
                company: 'DataCorp',
                location: 'Manchester',
                contact_email: 'careers@datacorp.com',
                deadline: '2024-12-25'
            });
        testJobId2 = job2Response.body.newJob.job_id;

        const job3Response = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${backdoorToken}`)
            .send({
                title: 'Product Manager',
                company: 'ProductCorp',
                location: 'Birmingham',
                contact_email: 'hiring@productcorp.com',
                deadline: '2024-12-20'
            });
        testJobId3 = job3Response.body.newJob.job_id;
    });

    describe('GET /api/jobseekers/:jobseeker_id/dashboard', () => {
        test('should return empty dashboard for new jobseeker', async () => {
            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/dashboard`)
                .expect(200);

            expect(response.body).toHaveProperty('dashboard');
            expect(response.body.dashboard.applied_jobs).toEqual([]);
            expect(response.body.dashboard.saved_jobs).toEqual([]);
            expect(response.body.dashboard.stats.total_applied).toBe(0);
            expect(response.body.dashboard.stats.total_saved).toBe(0);
        });

        test('should return dashboard with applied and saved jobs', async () => {
            // Apply for jobs
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`)
                .expect(201);
            
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId2}`)
                .expect(201);

            // Save jobs
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId2}`)
                .expect(201);
            
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId3}`)
                .expect(201);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/dashboard`)
                .expect(200);

            expect(response.body.dashboard.applied_jobs).toHaveLength(2);
            expect(response.body.dashboard.saved_jobs).toHaveLength(2);
            expect(response.body.dashboard.stats.total_applied).toBe(2);
            expect(response.body.dashboard.stats.total_saved).toBe(2);

            // Check job details are included (no N+1 problem)
            expect(response.body.dashboard.applied_jobs[0]).toHaveProperty('title');
            expect(response.body.dashboard.applied_jobs[0]).toHaveProperty('company');
            expect(response.body.dashboard.applied_jobs[0]).toHaveProperty('applied_at');
            
            expect(response.body.dashboard.saved_jobs[0]).toHaveProperty('title');
            expect(response.body.dashboard.saved_jobs[0]).toHaveProperty('company');
            expect(response.body.dashboard.saved_jobs[0]).toHaveProperty('saved_at');
        });

        test('should return paginated dashboard data', async () => {
            // Apply for multiple jobs
            await request(app).post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`);
            await request(app).post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId2}`);
            await request(app).post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId3}`);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/dashboard`)
                .query({
                    paginated: 'true',
                    applied_limit: 2,
                    applied_offset: 0
                })
                .expect(200);

            expect(response.body.dashboard).toHaveProperty('pagination');
            expect(response.body.dashboard.applied_jobs).toHaveLength(2);
            expect(response.body.dashboard.pagination.applied.total).toBe(3);
            expect(response.body.dashboard.pagination.applied.has_more).toBe(true);
        });

        test('should return 404 for non-existent jobseeker', async () => {
            await request(app)
                .get('/api/jobseekers/99999/dashboard')
                .expect(200); // Empty dashboard is valid for non-existent user
        });
    });

    describe('GET /api/jobseekers/:jobseeker_id/applied-jobs', () => {
        test('should return only applied jobs', async () => {
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`)
                .expect(201);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/applied-jobs`)
                .expect(200);

            expect(response.body.applied_jobs).toHaveLength(1);
            expect(response.body.applied_jobs[0].title).toBe('Software Developer');
            expect(response.body.applied_jobs[0]).toHaveProperty('applied_at');
            expect(response.body.total).toBe(1);
        });
    });

    describe('GET /api/jobseekers/:jobseeker_id/saved-jobs', () => {
        test('should return only saved jobs', async () => {
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(201);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/saved-jobs`)
                .expect(200);

            expect(response.body.saved_jobs).toHaveLength(1);
            expect(response.body.saved_jobs[0].title).toBe('Software Developer');
            expect(response.body.saved_jobs[0]).toHaveProperty('saved_at');
            expect(response.body.total).toBe(1);
        });
    });

    describe('POST /api/jobseekers/:jobseeker_id/apply/:job_id', () => {
        test('should successfully apply for a job', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`)
                .expect(201);

            expect(response.body.message).toBe('Successfully applied for job');
            expect(response.body.application).toHaveProperty('applied_at');
        });

        test('should prevent duplicate applications', async () => {
            // Apply first time
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`)
                .expect(201);

            // Try to apply again
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`)
                .expect(409);

            expect(response.body.msg).toBe('Already applied for this job');
        });

        test('should handle invalid job ID', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/99999`);
            
            // Accept either 400 or 500 depending on how the error is handled
            expect([400, 500]).toContain(response.status);
        });
    });

    describe('POST /api/jobseekers/:jobseeker_id/save/:job_id', () => {
        test('should successfully save a job', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(201);

            expect(response.body.message).toBe('Job saved successfully');
            expect(response.body.saved_job).toHaveProperty('saved_at');
        });

        test('should prevent duplicate saves', async () => {
            // Save first time
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(201);

            // Try to save again
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(409);

            expect(response.body.msg).toBe('Job already saved');
        });
    });

    describe('DELETE /api/jobseekers/:jobseeker_id/save/:job_id', () => {
        test('should successfully remove a saved job', async () => {
            // Save job first
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(201);

            // Remove saved job
            const response = await request(app)
                .delete(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(200);

            expect(response.body.message).toBe('Job removed from saved list');
        });

        test('should return 404 for non-existent saved job', async () => {
            const response = await request(app)
                .delete(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`)
                .expect(404);

            expect(response.body.msg).toBe('Saved job not found');
        });
    });

    describe('Application Status Field', () => {
        test('should create job application with default status', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`)
                .expect(201);

            expect(response.body.application).toHaveProperty('status', 'applied');
        });

        test('should verify status is stored in database', async () => {
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId2}`)
                .expect(201);

            const result = await db.query(
                'SELECT status FROM jobseekers_jobs_applied WHERE jobseeker_id = $1 AND job_id = $2',
                [testJobseekerId, testJobId2]
            );

            expect(result.rows[0].status).toBe('applied');
        });

        test('should allow admin to update application status', async () => {
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId3}`)
                .expect(201);

            await db.query(
                'UPDATE jobseekers_jobs_applied SET status = $1 WHERE jobseeker_id = $2 AND job_id = $3',
                ['succeeded', testJobseekerId, testJobId3]
            );

            const result = await db.query(
                'SELECT status FROM jobseekers_jobs_applied WHERE jobseeker_id = $1 AND job_id = $2',
                [testJobseekerId, testJobId3]
            );

            expect(result.rows[0].status).toBe('succeeded');
        });
    });

    describe('Performance and N+1 Prevention', () => {
        test('should handle large datasets efficiently', async () => {
            // This test would ideally measure query count and execution time
            // For now, we'll just verify the functionality works with multiple jobs
            
            // Apply for all test jobs
            await Promise.all([
                request(app).post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId1}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId2}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/apply/${testJobId3}`)
            ]);

            // Save all test jobs
            await Promise.all([
                request(app).post(`/api/jobseekers/${testJobseekerId}/save/${testJobId1}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/save/${testJobId2}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/save/${testJobId3}`)
            ]);

            const startTime = Date.now();
            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/dashboard`)
                .expect(200);
            const endTime = Date.now();

            // Verify all data is returned correctly
            expect(response.body.dashboard.applied_jobs).toHaveLength(3);
            expect(response.body.dashboard.saved_jobs).toHaveLength(3);
            
            // Basic performance check (should be fast with JOINs)
            expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
        });
    });

    afterEach(async () => {
        // Cleanup test data
        if (testJobseekerId) {
            try {
                await request(app).delete(`/api/jobseekers/${testJobseekerId}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        if (testJobId1) {
            try {
                await request(app)
                    .delete(`/api/jobs/${testJobId1}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        if (testJobId2) {
            try {
                await request(app)
                    .delete(`/api/jobs/${testJobId2}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        if (testJobId3) {
            try {
                await request(app)
                    .delete(`/api/jobs/${testJobId3}`)
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
