import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import { AdminTestHelper } from '../helpers/admin-test-helpers.js';
import '../utils/setup.js';

describe('Job Applications API Endpoints', () => {
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    let testJobId;
    let testJobseekerId;
    
    beforeAll(async () => {
        // Get a test job and jobseeker from the database
        const jobResult = await db.query('SELECT job_id FROM jobs LIMIT 1');
        testJobId = jobResult.rows[0]?.job_id;
        
        const jobseekerResult = await db.query('SELECT jobseeker_id FROM jobseekers LIMIT 1');
        testJobseekerId = jobseekerResult.rows[0]?.jobseeker_id;
        
        // Create a test application if we have both job and jobseeker
        if (testJobId && testJobseekerId) {
            await db.query(
                `INSERT INTO jobseekers_jobs_applied (jobseeker_id, job_id, status, applied_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (jobseeker_id, job_id) DO NOTHING`,
                [testJobseekerId, testJobId, 'pending']
            );
        }
    });
    
    describe('GET /api/admin/jobs/:job_id/applications', () => {
        test('should return 401 without admin token', async () => {
            await request(app)
                .get(`/api/admin/jobs/${testJobId}/applications`)
                .expect(401);
        });
        
        test('should return applications for a specific job with admin token', async () => {
            if (!testJobId) {
                console.log('Skipping test - no test job available');
                return;
            }

            const response = await request(app)
                .get(`/api/admin/jobs/${testJobId}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('job_applications');
            expect(Array.isArray(response.body.job_applications)).toBe(true);
            
            // If there are applications, check structure
            if (response.body.job_applications.length > 0) {
                const application = response.body.job_applications[0];
                expect(application).toHaveProperty('jobseeker_id');
                expect(application).toHaveProperty('first_name');
                expect(application).toHaveProperty('last_name');
                expect(application).toHaveProperty('email');
                expect(application).toHaveProperty('institution_name');
                expect(application).toHaveProperty('applied_at');
            }
        });
        
        test('should return empty array for job with no applications', async () => {
            // Create a new job with no applications
            const newJobResult = await db.query(
                `INSERT INTO jobs (title, company, location, experience_level, role_type, work_type, deadline, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING job_id`,
                ['Test Job No Apps', 'TestCorp', 'Remote', 'entry', 'full-time', 'remote', '2026-12-31', true]
            );
            const newJobId = newJobResult.rows[0].job_id;
            
            const response = await request(app)
                .get(`/api/admin/jobs/${newJobId}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body.job_applications).toEqual([]);
            
            // Cleanup
            await db.query('DELETE FROM jobs WHERE job_id = $1', [newJobId]);
        });
        
        test('should return empty array for non-existent job', async () => {
            const response = await request(app)
                .get('/api/admin/jobs/99999/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body.job_applications).toEqual([]);
        });
    });

    describe('GET /api/jobs/:job_id/applications/export', () => {
        let helper;
        let exportJobId;

        beforeAll(async () => {
            helper = new AdminTestHelper();
            await helper.initialize();
            const [jobseekerId] = await helper.createTestJobseekers(1); // seeded with society: "Tech Society"
            const [jobId] = await helper.createTestJobs(1);
            exportJobId = jobId;

            await db.query(
                `INSERT INTO jobseekers_jobs_applied (jobseeker_id, job_id, status, applied_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (jobseeker_id, job_id) DO NOTHING`,
                [jobseekerId, jobId, 'pending']
            );

            // Give the applicant all four subjects so the CSV export's combined "Subjects" column can be verified
            await db.query(
                `UPDATE jobseekers SET subject_one = $1, subject_two = $2, subject_three = $3, subject_four = $4 WHERE jobseeker_id = $5`,
                ['Mathematics', 'Physics', 'Chemistry', 'Further Mathematics', jobseekerId]
            );
        });

        afterAll(async () => {
            await helper.cleanup();
        });

        test('CSV export includes the applicant\'s Society', async () => {
            const response = await request(app)
                .get(`/api/jobs/${exportJobId}/applications/export`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.headers['content-type']).toContain('text/csv');
            expect(response.text).toContain('Society');
            expect(response.text).toContain('Tech Society');
        });

        test('CSV export combines all four subject columns, not just the first', async () => {
            const response = await request(app)
                .get(`/api/jobs/${exportJobId}/applications/export`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.text).toContain('Mathematics, Physics, Chemistry, Further Mathematics');
        });
    });
});
