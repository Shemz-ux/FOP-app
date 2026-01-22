import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../utils/setup.js';

describe('Event Registrations API Endpoints', () => {
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    let testEventId;
    let testJobseekerId;
    
    beforeAll(async () => {
        // Get a test event and jobseeker from the database
        const eventResult = await db.query('SELECT event_id FROM events LIMIT 1');
        testEventId = eventResult.rows[0]?.event_id;
        
        const jobseekerResult = await db.query('SELECT jobseeker_id FROM jobseekers LIMIT 1');
        testJobseekerId = jobseekerResult.rows[0]?.jobseeker_id;
        
        // Create a test registration if we have both event and jobseeker
        if (testEventId && testJobseekerId) {
            await db.query(
                `INSERT INTO jobseekers_events_applied (jobseeker_id, event_id, status, applied_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (jobseeker_id, event_id) DO NOTHING`,
                [testJobseekerId, testEventId, 'registered']
            );
        }
    });
    
    describe('GET /api/admin/events/:event_id/applications', () => {
        test('should return 401 without admin token', async () => {
            await request(app)
                .get(`/api/admin/events/${testEventId}/applications`)
                .expect(401);
        });
        
        test('should return registrations for a specific event with admin token', async () => {
            if (!testEventId) {
                console.log('Skipping test - no test event available');
                return;
            }

            const response = await request(app)
                .get(`/api/admin/events/${testEventId}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('event_applications');
            expect(Array.isArray(response.body.event_applications)).toBe(true);
            
            // If there are registrations, check structure
            if (response.body.event_applications.length > 0) {
                const registration = response.body.event_applications[0];
                expect(registration).toHaveProperty('jobseeker_id');
                expect(registration).toHaveProperty('first_name');
                expect(registration).toHaveProperty('last_name');
                expect(registration).toHaveProperty('email');
                expect(registration).toHaveProperty('institution_name');
                expect(registration).toHaveProperty('applied_at');
            }
        });
        
        test('should return empty array for event with no registrations', async () => {
            // Create a new event with no registrations
            const newEventResult = await db.query(
                `INSERT INTO events (title, organiser, industry, event_type, location, event_date, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING event_id`,
                ['Test Event No Regs', 'TestOrg', 'Technology', 'workshop', 'London', '2026-12-31', true]
            );
            const newEventId = newEventResult.rows[0].event_id;
            
            const response = await request(app)
                .get(`/api/admin/events/${newEventId}/applications`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body.event_applications).toEqual([]);
            
            // Cleanup
            await db.query('DELETE FROM events WHERE event_id = $1', [newEventId]);
        });
        
        test('should return empty array for non-existent event', async () => {
            const response = await request(app)
                .get('/api/admin/events/99999/applications')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);
            
            expect(response.body.event_applications).toEqual([]);
        });
    });
});
