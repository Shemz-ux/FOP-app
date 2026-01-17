import request from 'supertest';
import app from '../../app.js';
import { createJobseeker, removeJobseeker } from "../../models/jobseekers.js";
import { createJob, removeJob } from "../../models/jobs.js";
import { createEvent, removeEvent } from "../../models/events.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';
import db from '../../db/db.js';
import '../setup.js';

describe('Admin Analytics API Endpoints', () => {
    let testJobseekerIds = [];
    let testJobIds = [];
    let testEventIds = [];
    const testPassword = "TestPassword123";
    let hashedPassword;
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    let adminJwtToken;

    beforeAll(async () => {
        hashedPassword = await bcrypt.hash(testPassword, 10);
        
        // Create admin JWT token
        const adminPayload = { sub: "admin123", role: "admin" };
        adminJwtToken = JWT.sign(adminPayload, process.env.JWT_SECRET || "test_secret");
        
        // Create test jobseekers with diverse attributes
        const jobseekers = [
            {
                first_name: "John",
                last_name: "Doe",
                email: "john.admin.route.test@example.com",
                password_hash: hashedPassword,
                gender: "male",
                institution_name: "University College London",
                education_level: "undergraduate",
                uni_year: "2nd",
                degree_type: "bsc",
                area_of_study: "Computer Science",
                society: "Tech Society",
                school_meal_eligible: true,
                first_gen_to_go_uni: true
            },
            {
                first_name: "Jane",
                last_name: "Smith",
                email: "jane.admin.route.test@example.com",
                password_hash: hashedPassword,
                gender: "female",
                institution_name: "Imperial College London",
                education_level: "postgraduate",
                uni_year: "masters",
                degree_type: "msc",
                area_of_study: "Engineering",
                society: "Engineering Society",
                school_meal_eligible: false,
                first_gen_to_go_uni: false
            },
            {
                first_name: "Alex",
                last_name: "Johnson",
                email: "alex.admin.route.test@example.com",
                password_hash: hashedPassword,
                gender: "non_binary",
                institution_name: "King's College London",
                education_level: "phd",
                uni_year: "phd_year_2",
                degree_type: "phd",
                area_of_study: "Research Studies",
                society: "Research Society",
                school_meal_eligible: true,
                first_gen_to_go_uni: false
            }
        ];

        for (const jobseeker of jobseekers) {
            const created = await createJobseeker(jobseeker);
            testJobseekerIds.push(created.jobseeker_id);
        }

        // Create test jobs
        const jobs = [
            {
                title: "Software Engineer Admin Test",
                company: "Tech Corp Admin",
                description: "Test job for admin routes",
                industry: "Technology",
                location: "London",
                experience_level: "Entry",
                role_type: "Full-time",
                salary: "£30,000"
            },
            {
                title: "Data Scientist Admin Test",
                company: "Data Inc Admin",
                description: "Another test job for admin routes",
                industry: "Technology",
                location: "Manchester",
                experience_level: "Mid",
                role_type: "Full-time",
                salary: "£45,000"
            }
        ];

        for (const job of jobs) {
            const created = await createJob(job);
            testJobIds.push(created.job_id);
        }

        // Create test events
        const events = [
            {
                title: "Admin Career Fair 2024",
                organiser: "Admin University Careers",
                description: "Admin test career fair",
                industry: "Education",
                event_date: "2024-12-15",
                event_start_time: "10:00:00"
            },
            {
                title: "Admin Tech Networking",
                organiser: "Admin Tech Network",
                description: "Admin networking event",
                industry: "Technology",
                event_date: "2024-12-20",
                event_start_time: "18:00:00"
            }
        ];

        for (const event of events) {
            const created = await createEvent(event);
            testEventIds.push(created.event_id);
        }

        // Create job applications
        await db.query(
            "INSERT INTO jobseekers_jobs_applied (jobseeker_id, job_id) VALUES ($1, $2), ($3, $4), ($5, $6)",
            [testJobseekerIds[0], testJobIds[0], testJobseekerIds[1], testJobIds[0], testJobseekerIds[2], testJobIds[1]]
        );

        // Create event applications
        await db.query(
            "INSERT INTO jobseekers_events_applied (jobseeker_id, event_id) VALUES ($1, $2), ($3, $4), ($5, $6)",
            [testJobseekerIds[0], testEventIds[0], testJobseekerIds[1], testEventIds[0], testJobseekerIds[2], testEventIds[1]]
        );
    });

    afterAll(async () => {
        // Clean up test data
        try {
            await db.query("DELETE FROM jobseekers_jobs_applied WHERE jobseeker_id = ANY($1)", [testJobseekerIds]);
            await db.query("DELETE FROM jobseekers_events_applied WHERE jobseeker_id = ANY($1)", [testJobseekerIds]);
            
            for (const id of testJobseekerIds) {
                await removeJobseeker(id);
            }
            for (const id of testJobIds) {
                await removeJob(id);
            }
            for (const id of testEventIds) {
                await removeEvent(id);
            }
        } catch (error) {
            console.log("Cleanup error:", error.message);
        }
    });

    describe('Authentication Tests', () => {
        it('should allow access with backdoor token', async () => {
            const response = await request(app)
                .get('/api/admin/summary')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('analytics_summary');
        });

        it('should allow access with admin JWT token', async () => {
            const response = await request(app)
                .get('/api/admin/summary')
                .set('Authorization', `Bearer ${adminJwtToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('analytics_summary');
        });

        it('should reject access without token', async () => {
            const response = await request(app)
                .get('/api/admin/summary')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        it('should reject access with invalid token', async () => {
            const response = await request(app)
                .get('/api/admin/summary')
                .set('Authorization', 'Bearer invalid_token')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        it('should reject access with non-admin JWT token', async () => {
            const userPayload = { sub: "user123", role: "user" };
            const userToken = JWT.sign(userPayload, process.env.JWT_SECRET || "test_secret");

            const response = await request(app)
                .get('/api/admin/summary')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);

            expect(response.body).toHaveProperty('message', 'Admin access required');
        });
    });

    describe('Analytics Summary Endpoint', () => {
        it('should return analytics summary', async () => {
            const response = await request(app)
                .get('/api/admin/summary')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('analytics_summary');
            const summary = response.body.analytics_summary;
            
            expect(summary).toHaveProperty('total_students');
            expect(summary).toHaveProperty('total_jobs');
            expect(summary).toHaveProperty('total_events');
            expect(summary).toHaveProperty('total_job_applications');
            expect(summary).toHaveProperty('total_event_applications');
            expect(summary).toHaveProperty('free_meal_eligible_count');
            expect(summary).toHaveProperty('first_gen_count');
        });
    });

    describe('Job Application Analytics', () => {
        it('should return job application statistics', async () => {
            const response = await request(app)
                .get('/api/admin/jobs/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('job_application_stats');
            expect(Array.isArray(response.body.job_application_stats)).toBe(true);
            
            const stats = response.body.job_application_stats;
            const testJobStat = stats.find(stat => stat.title === "Software Engineer Admin Test");
            expect(testJobStat).toBeDefined();
            expect(testJobStat.company).toBe("Tech Corp Admin");
        });

        it('should return applications for specific job', async () => {
            const response = await request(app)
                .get(`/api/admin/jobs/${testJobIds[0]}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('job_applications');
            expect(Array.isArray(response.body.job_applications)).toBe(true);
            expect(response.body.job_applications.length).toBeGreaterThan(0);
            
            const application = response.body.job_applications[0];
            expect(application).toHaveProperty('jobseeker_id');
            expect(application).toHaveProperty('first_name');
            expect(application).toHaveProperty('last_name');
            expect(application).toHaveProperty('email');
        });
    });

    describe('Event Application Analytics', () => {
        it('should return event application statistics', async () => {
            const response = await request(app)
                .get('/api/admin/events/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('event_application_stats');
            expect(Array.isArray(response.body.event_application_stats)).toBe(true);
            
            const stats = response.body.event_application_stats;
            const testEventStat = stats.find(stat => stat.title === "Admin Career Fair 2024");
            expect(testEventStat).toBeDefined();
            expect(testEventStat.organiser).toBe("Admin University Careers");
        });

        it('should return applications for specific event', async () => {
            const response = await request(app)
                .get(`/api/admin/events/${testEventIds[0]}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('event_applications');
            expect(Array.isArray(response.body.event_applications)).toBe(true);
            expect(response.body.event_applications.length).toBeGreaterThan(0);
            
            const application = response.body.event_applications[0];
            expect(application).toHaveProperty('jobseeker_id');
            expect(application).toHaveProperty('first_name');
            expect(application).toHaveProperty('last_name');
            expect(application).toHaveProperty('email');
        });
    });

    describe('Student Filtering Endpoints', () => {
        it('should return students by gender', async () => {
            const response = await request(app)
                .get('/api/admin/students/gender/male')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.students)).toBe(true);
            expect(response.body.students.length).toBeGreaterThan(0);
            expect(response.body.students[0].gender).toBe('male');
        });

        it('should return 400 for invalid gender', async () => {
            const response = await request(app)
                .get('/api/admin/students/gender/invalid_gender')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid gender parameter');
        });

        it('should return students by university', async () => {
            const response = await request(app)
                .get('/api/admin/students/university/London')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.students)).toBe(true);
            expect(response.body.students.length).toBeGreaterThan(0);
        });

        it('should return students by society', async () => {
            const response = await request(app)
                .get('/api/admin/students/society/Tech')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.students)).toBe(true);
            expect(response.body.students.length).toBeGreaterThan(0);
        });

        it('should return students eligible for free meals', async () => {
            const response = await request(app)
                .get('/api/admin/students/free-meals')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.students)).toBe(true);
            expect(response.body.students.length).toBeGreaterThan(0);
            
            response.body.students.forEach(student => {
                expect(student.school_meal_eligible).toBe(true);
            });
        });

        it('should return first generation students', async () => {
            const response = await request(app)
                .get('/api/admin/students/first-gen')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.students)).toBe(true);
            expect(response.body.students.length).toBeGreaterThan(0);
            
            response.body.students.forEach(student => {
                expect(student.first_gen_to_go_uni).toBe(true);
            });
        });

        it('should return students by education status', async () => {
            const response = await request(app)
                .get('/api/admin/students/education/undergraduate')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.students)).toBe(true);
            expect(response.body.students.length).toBeGreaterThan(0);
            expect(response.body.students[0].education_level).toBe('undergraduate');
        });

        it('should return 400 for invalid education level', async () => {
            const response = await request(app)
                .get('/api/admin/students/education/invalid_level')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid education level parameter');
        });

        it('should return users by name', async () => {
            const response = await request(app)
                .get('/api/admin/users/name/John')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('users');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.users)).toBe(true);
            expect(response.body.users.length).toBeGreaterThan(0);
        });

        it('should return empty results for non-existent name', async () => {
            const response = await request(app)
                .get('/api/admin/users/name/NonExistentName12345')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('users');
            expect(response.body).toHaveProperty('count', 0);
            expect(Array.isArray(response.body.users)).toBe(true);
            expect(response.body.users.length).toBe(0);
        });
    });

    describe('Parameter Validation', () => {
        it('should handle URL encoding in parameters', async () => {
            const response = await request(app)
                .get('/api/admin/students/university/University%20College%20London')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('students');
            expect(Array.isArray(response.body.students)).toBe(true);
        });

        it('should handle special characters in name search', async () => {
            const response = await request(app)
                .get('/api/admin/users/name/O\'Connor')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('users');
            expect(Array.isArray(response.body.users)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle non-existent job ID gracefully', async () => {
            const response = await request(app)
                .get('/api/admin/jobs/99999/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('job_applications');
            expect(Array.isArray(response.body.job_applications)).toBe(true);
            expect(response.body.job_applications.length).toBe(0);
        });

        it('should handle non-existent event ID gracefully', async () => {
            const response = await request(app)
                .get('/api/admin/events/99999/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('event_applications');
            expect(Array.isArray(response.body.event_applications)).toBe(true);
            expect(response.body.event_applications.length).toBe(0);
        });

        it('should handle invalid job ID format', async () => {
            const response = await request(app)
                .get('/api/admin/jobs/invalid_id/applications')
                .set('Authorization', `Bearer ${backdoorToken}`);

            // Should either return 400 for validation error or 200 with empty results
            expect([200, 400, 500]).toContain(response.status);
        });
    });

    describe('Response Format Consistency', () => {
        it('should have consistent response format for all student endpoints', async () => {
            const endpoints = [
                '/api/admin/students/gender/male',
                '/api/admin/students/university/London',
                '/api/admin/students/society/Tech',
                '/api/admin/students/free-meals',
                '/api/admin/students/first-gen',
                '/api/admin/students/education/undergraduate'
            ];

            for (const endpoint of endpoints) {
                const response = await request(app)
                    .get(endpoint)
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('students');
                expect(response.body).toHaveProperty('count');
                expect(Array.isArray(response.body.students)).toBe(true);
                expect(typeof response.body.count).toBe('number');
            }
        });

        it('should have consistent response format for user search', async () => {
            const response = await request(app)
                .get('/api/admin/users/name/John')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('users');
            expect(response.body).toHaveProperty('count');
            expect(Array.isArray(response.body.users)).toBe(true);
            expect(typeof response.body.count).toBe('number');
        });
    });
});
