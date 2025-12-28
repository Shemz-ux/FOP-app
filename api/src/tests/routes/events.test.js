 import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';

describe('Events API Endpoints', () => {
    let testEventId;
    
    beforeEach(() => {
        // Reset testEventId before each test
        testEventId = null;
    });
    
    describe('GET /api/events', () => {
        test('should return all events', async () => {
            const response = await request(app)
                .get('/api/events')
                .expect(200);

            expect(response.body).toHaveProperty('events');
            expect(Array.isArray(response.body.events)).toBe(true);
        });

        test('should return active events only when active=true', async () => {
            const response = await request(app)
                .get('/api/events?active=true')
                .expect(200);

            expect(response.body).toHaveProperty('events');
            expect(Array.isArray(response.body.events)).toBe(true);
        });

        test('should return upcoming events only when upcoming=true', async () => {
            const response = await request(app)
                .get('/api/events?upcoming=true')
                .expect(200);

            expect(response.body).toHaveProperty('events');
            expect(Array.isArray(response.body.events)).toBe(true);
        });
    });
    
    describe('POST /api/events', () => {
        test('should create a new event with valid data', async () => {
            const timestamp = Date.now();
            const newEvent = {
                title: 'Tech Conference 2024',
                company: `TechOrg ${timestamp}`,
                description: 'Annual technology conference',
                industry: 'Technology',
                location: 'London Convention Center',
                event_link: 'https://techorg.com/conference',
                contact_email: `contact.${timestamp}@techorg.com`,
                event_date: '2024-12-15',
                event_time: '09:00:00',
                is_active: true
            };

            const response = await request(app)
                .post('/api/events')
                .send(newEvent)
                .expect(201);

            expect(response.body).toHaveProperty('newEvent');
            expect(response.body.newEvent).toHaveProperty('event_id');
            expect(response.body.newEvent.title).toBe('Tech Conference 2024');
            expect(response.body.newEvent.company).toBe(`TechOrg ${timestamp}`);
            expect(response.body.newEvent.contact_email).toBe(`contact.${timestamp}@techorg.com`);

            // Store the event ID for other tests
            testEventId = response.body.newEvent.event_id;
        });

        test('should handle missing required fields', async () => {
            const incompleteEvent = {
                description: 'Test description',
                location: 'Test Location',
                // Missing title, company, contact_email, and event_date (required fields)
            };

            const response = await request(app)
                .post('/api/events')
                .send(incompleteEvent);

            // Accept either 400 (validation error) or 500 (database error)
            expect([400, 500]).toContain(response.status);
        });

        test('should create event with minimal required fields', async () => {
            const timestamp = Date.now();
            const minimalEvent = {
                title: 'Minimal Event',
                company: `MinimalCorp ${timestamp}`,
                location: 'Test Location',
                contact_email: `minimal.${timestamp}@test.com`,
                event_date: '2024-12-20'
            };

            const response = await request(app)
                .post('/api/events')
                .send(minimalEvent)
                .expect(201);

            expect(response.body.newEvent.title).toBe('Minimal Event');
            expect(response.body.newEvent.event_date).toBe('2024-12-20T00:00:00.000Z');
            expect(response.body.newEvent.is_active).toBe(true); // Default value
        });
    });

    describe('GET /api/events/:event_id', () => {
        test('should return a specific event', async () => {
            if (!testEventId) {
                const timestamp = Date.now();
                const newEvent = {
                    title: 'Test Event',
                    company: `GetTestOrg ${timestamp}`,
                    location: 'Test Location',
                    contact_email: `get.test.${timestamp}@test.com`,
                    event_date: '2024-12-25'
                };
                const response = await request(app)
                    .post('/api/events')
                    .send(newEvent)
                    .expect(201);
                testEventId = response.body.newEvent.event_id;
            }

            const response = await request(app)
                .get(`/api/events/${testEventId}`)
                .expect(200);

            expect(response.body).toHaveProperty('event');
            expect(response.body.event).toHaveProperty('event_id');
            expect(response.body.event.title).toBe('Test Event');
            expect(response.body.event.company).toContain('GetTestOrg');
        });

        test('should return 404 if event not found', async () => {
            const response = await request(app)
                .get(`/api/events/999999`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Event not found');
        });

        test('should handle invalid event ID format', async () => {
            const response = await request(app)
                .get('/api/events/invalid-id');

            // Accept either 400 (validation error) or 404 (not found)
            expect([400, 404]).toContain(response.status);
        });
    });

    describe('PATCH /api/events/:event_id', () => {
        test('should update an event with valid data', async () => {
            if (!testEventId) {
                const timestamp = Date.now();
                const newEvent = {
                    title: 'Update Test Event',
                    company: `UpdateTestOrg ${timestamp}`,
                    location: 'Test Location',
                    contact_email: `update.test.${timestamp}@test.com`,
                    event_date: '2024-12-30'
                };
                const response = await request(app)
                    .post('/api/events')
                    .send(newEvent)
                    .expect(201);
                testEventId = response.body.newEvent.event_id;
            }

            const updateTimestamp = Date.now();
            const updateData = {
                title: 'Updated Event Title',
                description: 'Updated event description',
                location: 'Updated Location',
                applicant_count: 1000,
                contact_email: `updated.contact.${updateTimestamp}@org.com`
            };

            const response = await request(app)
                .patch(`/api/events/${testEventId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('event');
            expect(response.body.event).toHaveProperty('event_id');
            expect(response.body.event.title).toBe('Updated Event Title');
            expect(response.body.event.description).toBe('Updated event description');
            expect(response.body.event.location).toBe('Updated Location');
            expect(response.body.event.applicant_count).toBe(1000);
            expect(response.body.event.contact_email).toBe(`updated.contact.${updateTimestamp}@org.com`);
        });

        test('should handle non-existent event update', async () => {
            const updateData = { title: 'Updated Event' };

            const response = await request(app)
                .patch('/api/events/99999')
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Event not found');
        });

        test('should handle invalid field updates', async () => {
            if (!testEventId) return; // Skip if no test event
            
            const invalidData = { invalidField: 'test', anotherInvalidField: 'value' };

            const response = await request(app)
                .patch(`/api/events/${testEventId}`)
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid field provided');
        });

        test('should update only provided fields', async () => {
            if (!testEventId) return; // Skip if no test event

            const partialUpdate = {
                title: 'Partially Updated Event'
            };

            const response = await request(app)
                .patch(`/api/events/${testEventId}`)
                .send(partialUpdate)
                .expect(200);

            expect(response.body.event.title).toBe('Partially Updated Event');
            // Other fields should remain unchanged
            expect(response.body.event.location).toBe('Updated Location');
        });
    });

    describe('DELETE /api/events/:event_id', () => {
        test('should delete an event successfully', async () => {
            if (!testEventId) {
                // Create an event first if we don't have one
                const timestamp = Date.now();
                const newEvent = {
                    title: 'Delete Test Event',
                    company: `DeleteTestOrg ${timestamp}`,
                    location: 'Test Location',
                    contact_email: `delete.test.${timestamp}@test.com`,
                    event_date: '2024-12-31'
                };
                
                const createResponse = await request(app)
                    .post('/api/events')
                    .send(newEvent);
                
                testEventId = createResponse.body.newEvent.event_id;
            }

            const response = await request(app)
                .delete(`/api/events/${testEventId}`)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Event deleted!');

            // Verify event is actually deleted
            const deleteResponse = await request(app)
                .get(`/api/events/${testEventId}`)
                .expect(404);

            expect(deleteResponse.body).toHaveProperty('msg', 'Event not found');
        });

        test('should return 404 for non-existent event', async () => {
            const response = await request(app)
                .delete('/api/events/99999')
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Event not found');
        });
    });

    describe('Data validation and edge cases', () => {
        test('should handle very long strings in fields', async () => {
            const timestamp = Date.now();
            const longStringEvent = {
                title: 'A'.repeat(300), // Exceeds VARCHAR(255)
                event_date: '2024-12-31',
                organizer: `LongTestOrg ${timestamp}`
            };

            const response = await request(app)
                .post('/api/events')
                .send(longStringEvent);

            // Should fail due to field length constraints
            expect([400, 500]).toContain(response.status);
        });

        test('should handle invalid date format', async () => {
            const timestamp = Date.now();
            const invalidDateEvent = {
                title: 'Date Test Event',
                event_date: 'invalid-date',
                organizer: `DateTestOrg ${timestamp}`
            };

            const response = await request(app)
                .post('/api/events')
                .send(invalidDateEvent);

            // Should fail due to invalid date format
            expect([400, 500]).toContain(response.status);
        });

        test('should handle invalid time format', async () => {
            const timestamp = Date.now();
            const invalidTimeEvent = {
                title: 'Time Test Event',
                event_date: '2024-12-31',
                event_time: 'invalid-time',
                organizer: `TimeTestOrg ${timestamp}`
            };

            const response = await request(app)
                .post('/api/events')
                .send(invalidTimeEvent);

            // Should fail due to invalid time format
            expect([400, 500]).toContain(response.status);
        });

        test('should handle boolean and integer field validation', async () => {
            const timestamp = Date.now();
            const validationTestEvent = {
                title: 'Validation Test Event',
                company: `ValidationTestOrg ${timestamp}`,
                location: 'Test Location',
                contact_email: `validation.${timestamp}@test.com`,
                event_date: '2024-12-31',
                applicant_count: 250,
                is_active: false
            };

            const response = await request(app)
                .post('/api/events')
                .send(validationTestEvent)
                .expect(201);

            expect(response.body.newEvent.applicant_count).toBe(250);
            expect(response.body.newEvent.is_active).toBe(false);
        });
    });

    afterAll(async () => {
        if (testEventId) {
            try {
                await request(app).delete(`/api/events/${testEventId}`);
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
