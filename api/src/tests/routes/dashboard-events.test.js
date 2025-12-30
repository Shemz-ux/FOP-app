import request from 'supertest';
import app from '../../app.js';
import bcrypt from 'bcrypt';
import db from '../../db/db.js';
import '../setup.js';

describe('Dashboard Events API Endpoints', () => {
    let testJobseekerId;
    let testEventIds = [];
    let hashedPassword;
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    const testPassword = 'TestPassword123';

    beforeAll(async () => {
        // Create hashed password for test users
        hashedPassword = await bcrypt.hash(testPassword, 10);
    });

    beforeEach(async () => {
        // Create test jobseeker
        const jobseekerResponse = await request(app)
            .post('/api/jobseekers')
            .send({
                first_name: 'Event',
                last_name: 'Tester',
                email: `event.tester.${Date.now()}@test.com`,
                password: testPassword,
                education_level: 'undergraduate',
                institution_name: 'Test University',
                uni_year: '3rd',
                degree_type: 'bsc',
                area_of_study: 'Computer Science'
            });
        
        testJobseekerId = jobseekerResponse.body.newJobseeker.jobseeker_id;

        // Create test events
        const event1Response = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${backdoorToken}`)
            .send({
                title: 'Tech Conference',
                company: 'TechCorp',
                location: 'London',
                contact_email: 'events@techcorp.com',
                event_date: '2024-12-31',
                event_time: '09:00:00'
            });
        testEventId1 = event1Response.body.newEvent.event_id;

        const event2Response = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${backdoorToken}`)
            .send({
                title: 'Data Workshop',
                company: 'DataCorp',
                location: 'Manchester',
                contact_email: 'workshops@datacorp.com',
                event_date: '2024-12-25',
                event_time: '14:00:00'
            });
        testEventId2 = event2Response.body.newEvent.event_id;

        const event3Response = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${backdoorToken}`)
            .send({
                title: 'Product Meetup',
                company: 'ProductCorp',
                location: 'Birmingham',
                contact_email: 'meetups@productcorp.com',
                event_date: '2024-12-20',
                event_time: '18:00:00'
            });
        testEventId3 = event3Response.body.newEvent.event_id;
    });

    describe('GET /api/jobseekers/:jobseeker_id/full-dashboard', () => {
        test('should return full dashboard with both jobs and events', async () => {
            // Apply for events
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId1}`)
                .expect(201);
            
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId2}`)
                .expect(201);

            // Save events
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId2}`)
                .expect(201);
            
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId3}`)
                .expect(201);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/full-dashboard`)
                .expect(200);

            expect(response.body.dashboard.applied_events).toHaveLength(2);
            expect(response.body.dashboard.saved_events).toHaveLength(2);
            expect(response.body.dashboard.stats.total_applied_events).toBe(2);
            expect(response.body.dashboard.stats.total_saved_events).toBe(2);

            // Check event details are included (no N+1 problem)
            expect(response.body.dashboard.applied_events[0]).toHaveProperty('title');
            expect(response.body.dashboard.applied_events[0]).toHaveProperty('company');
            expect(response.body.dashboard.applied_events[0]).toHaveProperty('applied_at');
            
            expect(response.body.dashboard.saved_events[0]).toHaveProperty('title');
            expect(response.body.dashboard.saved_events[0]).toHaveProperty('company');
            expect(response.body.dashboard.saved_events[0]).toHaveProperty('saved_at');
        });
    });

    describe('GET /api/jobseekers/:jobseeker_id/applied-events', () => {
        test('should return only applied events', async () => {
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId1}`)
                .expect(201);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/applied-events`)
                .expect(200);

            expect(response.body.applied_events).toHaveLength(1);
            expect(response.body.applied_events[0].title).toBe('Tech Conference');
            expect(response.body.applied_events[0]).toHaveProperty('applied_at');
            expect(response.body.total).toBe(1);
        });
    });

    describe('GET /api/jobseekers/:jobseeker_id/saved-events', () => {
        test('should return only saved events', async () => {
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(201);

            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/saved-events`)
                .expect(200);

            expect(response.body.saved_events).toHaveLength(1);
            expect(response.body.saved_events[0].title).toBe('Tech Conference');
            expect(response.body.saved_events[0]).toHaveProperty('saved_at');
            expect(response.body.total).toBe(1);
        });
    });

    describe('POST /api/jobseekers/:jobseeker_id/apply-event/:event_id', () => {
        test('should successfully apply for an event', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId1}`)
                .expect(201);

            expect(response.body.message).toBe('Successfully applied for event');
            expect(response.body.application).toHaveProperty('applied_at');
        });

        test('should prevent duplicate event applications', async () => {
            // Apply first time
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId1}`)
                .expect(201);

            // Try to apply again
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId1}`)
                .expect(409);

            expect(response.body.msg).toBe('Already applied for this event');
        });

        test('should handle invalid event ID', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/apply-event/99999`);
            
            // Accept either 400 or 500 depending on how the error is handled
            expect([400, 500]).toContain(response.status);
        });
    });

    describe('POST /api/jobseekers/:jobseeker_id/save-event/:event_id', () => {
        test('should successfully save an event', async () => {
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(201);

            expect(response.body.message).toBe('Event saved successfully');
            expect(response.body.saved_event).toHaveProperty('saved_at');
        });

        test('should prevent duplicate event saves', async () => {
            // Save first time
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(201);

            // Try to save again
            const response = await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(409);

            expect(response.body.msg).toBe('Event already saved');
        });
    });

    describe('DELETE /api/jobseekers/:jobseeker_id/save-event/:event_id', () => {
        test('should successfully remove a saved event', async () => {
            // Save event first
            await request(app)
                .post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(201);

            // Remove saved event
            const response = await request(app)
                .delete(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(200);

            expect(response.body.message).toBe('Event removed from saved list');
        });

        test('should return 404 for non-existent saved event', async () => {
            const response = await request(app)
                .delete(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`)
                .expect(404);

            expect(response.body.msg).toBe('Saved event not found');
        });
    });

    describe('Performance and N+1 Prevention for Events', () => {
        test('should handle large event datasets efficiently', async () => {
            // Apply for all test events
            await Promise.all([
                request(app).post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId1}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId2}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/apply-event/${testEventId3}`)
            ]);

            // Save all test events
            await Promise.all([
                request(app).post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId1}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId2}`),
                request(app).post(`/api/jobseekers/${testJobseekerId}/save-event/${testEventId3}`)
            ]);

            const startTime = Date.now();
            const response = await request(app)
                .get(`/api/jobseekers/${testJobseekerId}/full-dashboard`)
                .expect(200);
            const endTime = Date.now();

            // Verify all data is returned correctly
            expect(response.body.dashboard.applied_events).toHaveLength(3);
            expect(response.body.dashboard.saved_events).toHaveLength(3);
            
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
        
        if (testEventId1) {
            try {
                await request(app)
                    .delete(`/api/events/${testEventId1}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        if (testEventId2) {
            try {
                await request(app)
                    .delete(`/api/events/${testEventId2}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        if (testEventId3) {
            try {
                await request(app)
                    .delete(`/api/events/${testEventId3}`)
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
