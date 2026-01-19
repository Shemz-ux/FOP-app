import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../setup.js';

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
    
    describe('GET /api/jobs/:job_id/applications', () => {
        test('should return 401 without admin token', async () => {
            await request(app)
                .get(`/api/jobs/${testJobId}/applications`)
                .expect(401);
        });
        
        test('should return applications for a specific job with admin token', async () => {
            const response = await request(app)
                .get(`/api/jobs/${testJobId}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('applications');
            expect(Array.isArray(response.body.applications)).toBe(true);
            
            // If there are applications, check structure
            if (response.body.applications.length > 0) {
                const application = response.body.applications[0];
                expect(application).toHaveProperty('application_id');
                expect(application).toHaveProperty('jobseeker_id');
                expect(application).toHaveProperty('job_id');
                expect(application).toHaveProperty('status');
                expect(application).toHaveProperty('applied_at');
                expect(application).toHaveProperty('jobseeker');
                
                // Check jobseeker nested object
                expect(application.jobseeker).toHaveProperty('first_name');
                expect(application.jobseeker).toHaveProperty('last_name');
                expect(application.jobseeker).toHaveProperty('email');
                expect(application.jobseeker).toHaveProperty('institution_name');
            }
        });
        
        test('should return empty array for job with no applications', async () => {
            // Create a new job with no applications
            const newJobResult = await db.query(
                `INSERT INTO jobs (title, company, location, salary, job_level, role_type, work_mode, contact_email, deadline, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING job_id`,
                ['Test Job No Apps', 'TestCorp', 'Remote', '50000', 'entry', 'full-time', 'remote', 'test@test.com', '2026-12-31', true]
            );
            const newJobId = newJobResult.rows[0].job_id;
            
            const response = await request(app)
                .get(`/api/jobs/${newJobId}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body.applications).toEqual([]);
            
            // Cleanup
            await db.query('DELETE FROM jobs WHERE job_id = $1', [newJobId]);
        });
        
        test('should return 404 for non-existent job', async () => {
            await request(app)
                .get('/api/jobs/99999/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);
        });
    });
});
