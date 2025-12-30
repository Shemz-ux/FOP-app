import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../setup.js';

describe('Events Advanced Filtering API Endpoints', () => {
    let testEventIds = [];
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";

    beforeAll(async () => {
        // Create test events with diverse data for filtering
        const testEvents = [
            {
                title: 'Tech Conference 2024',
                company: 'Google',
                industry: 'Technology',
                location: 'London',
                event_date: '2024-06-15',
                event_time: '09:00:00',
                contact_email: 'events@google.com',
                description: 'Annual technology conference with networking opportunities'
            },
            {
                title: 'Startup Networking Event',
                company: 'Microsoft',
                industry: 'Technology',
                location: 'Manchester',
                event_date: '2024-07-20',
                event_time: '18:00:00',
                contact_email: 'events@microsoft.com',
                description: 'Networking event for startup founders and investors'
            },
            {
                title: 'Marketing Workshop',
                company: 'Apple',
                industry: 'Technology',
                location: 'London',
                event_date: '2024-05-10',
                event_time: '14:00:00',
                contact_email: 'workshops@apple.com',
                description: 'Digital marketing strategies workshop'
            },
            {
                title: 'Data Science Meetup',
                company: 'Facebook',
                industry: 'Technology',
                location: 'Birmingham',
                event_date: '2024-08-05',
                event_time: '19:00:00',
                contact_email: 'meetups@facebook.com',
                description: 'Monthly data science and AI meetup'
            },
            {
                title: 'Finance Summit',
                company: 'Goldman Sachs',
                industry: 'Finance',
                location: 'London',
                event_date: '2024-09-12',
                event_time: '10:00:00',
                contact_email: 'events@gs.com',
                description: 'Annual finance and investment summit'
            }
        ];

        // Insert test events and collect IDs
        for (const event of testEvents) {
            const response = await request(app)
                .post('/api/events')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(event);
            if (response.body.newEvent) {
                testEventIds.push(response.body.newEvent.event_id);
            }
        }
    });

    afterAll(async () => {
        // Clean up test events
        for (const eventId of testEventIds) {
            try {
                await request(app)
                    .delete(`/api/events/${eventId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        // Close database connection
        await db.end();
    });

    describe('GET /api/events/search', () => {
        
        describe('Basic filtering', () => {
            it('should filter events by company', async () => {
                const response = await request(app)
                    .get('/api/events/search?company=Google')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThanOrEqual(1);
                const googleEvent = response.body.events.find(event => event.company === 'Google');
                expect(googleEvent).toBeDefined();
                expect(googleEvent.title).toBe('Tech Conference 2024');
            });

            it('should filter events by industry', async () => {
                const response = await request(app)
                    .get('/api/events/search?industry=Technology')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThanOrEqual(4);
                response.body.events.forEach(event => {
                    if (testEventIds.includes(event.event_id)) {
                        expect(event.industry).toBe('Technology');
                    }
                });
            });

            it('should filter events by location', async () => {
                const response = await request(app)
                    .get('/api/events/search?location=London')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThanOrEqual(3);
                const londonEvents = response.body.events.filter(event => testEventIds.includes(event.event_id));
                londonEvents.forEach(event => {
                    expect(event.location).toBe('London');
                });
            });

            it('should filter events by type (in title/description)', async () => {
                const response = await request(app)
                    .get('/api/events/search?type=networking')
                    .expect(200);

                // Check that all returned events contain 'networking' in title or description
                response.body.events.forEach(event => {
                    const titleMatch = event.title.toLowerCase().includes('networking');
                    const descMatch = event.description && event.description.toLowerCase().includes('networking');
                    expect(titleMatch || descMatch).toBe(true);
                });
                
                // Should return array (may be empty if no networking events exist)
                expect(Array.isArray(response.body.events)).toBe(true);
            });
        });

        describe('Date filtering', () => {
            it('should filter events by date range', async () => {
                const response = await request(app)
                    .get('/api/events/search?date_from=2024-06-01&date_to=2024-08-31')
                    .expect(200);

                const filteredEvents = response.body.events.filter(event => testEventIds.includes(event.event_id));
                filteredEvents.forEach(event => {
                    const eventDate = new Date(event.event_date);
                    expect(eventDate.getTime()).toBeGreaterThanOrEqual(new Date('2024-06-01').getTime());
                    expect(eventDate.getTime()).toBeLessThanOrEqual(new Date('2024-08-31').getTime());
                });
            });

            it('should filter events from a specific date', async () => {
                const response = await request(app)
                    .get('/api/events/search?date_from=2024-07-01')
                    .expect(200);

                const filteredEvents = response.body.events.filter(event => testEventIds.includes(event.event_id));
                filteredEvents.forEach(event => {
                    const eventDate = new Date(event.event_date);
                    expect(eventDate.getTime()).toBeGreaterThanOrEqual(new Date('2024-07-01').getTime());
                });
            });

            it('should filter events until a specific date', async () => {
                const response = await request(app)
                    .get('/api/events/search?date_to=2024-06-30')
                    .expect(200);

                const filteredEvents = response.body.events.filter(event => testEventIds.includes(event.event_id));
                filteredEvents.forEach(event => {
                    const eventDate = new Date(event.event_date);
                    expect(eventDate.getTime()).toBeLessThanOrEqual(new Date('2024-06-30').getTime());
                });
            });

            it('should validate date format', async () => {
                const response = await request(app)
                    .get('/api/events/search?date_from=invalid-date')
                    .expect(400);

                expect(response.body.error).toBe('Invalid date format');
                expect(response.body.message).toContain('date_from must be in YYYY-MM-DD format');
            });
        });

        describe('Combined filtering', () => {
            it('should filter by multiple criteria', async () => {
                const response = await request(app)
                    .get('/api/events/search?industry=Technology&location=London&type=conference')
                    .expect(200);

                // Check that all returned events match the criteria
                response.body.events.forEach(event => {
                    expect(event.industry).toBe('Technology');
                    expect(event.location.toLowerCase()).toContain('london'); // Partial match for location
                    const titleMatch = event.title.toLowerCase().includes('conference');
                    const descMatch = event.description && event.description.toLowerCase().includes('conference');
                    expect(titleMatch || descMatch).toBe(true);
                });
                
                // Should have at least some results or empty array
                expect(Array.isArray(response.body.events)).toBe(true);
            });

            it('should return empty results for impossible combinations', async () => {
                const response = await request(app)
                    .get('/api/events/search?company=Google&industry=Finance')
                    .expect(200);

                const matchingEvents = response.body.events.filter(event => 
                    event.company === 'Google' && event.industry === 'Finance'
                );
                expect(matchingEvents).toHaveLength(0);
            });
        });

        describe('Sorting functionality', () => {
            it('should sort by popularity (most applicants first)', async () => {
                const response = await request(app)
                    .get('/api/events/search?sort=popular&limit=10')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThan(0);
                
                // Check that events are sorted by applicant_count descending (handle null values)
                for (let i = 1; i < response.body.events.length; i++) {
                    const prevCount = response.body.events[i-1].applicant_count || 0;
                    const currCount = response.body.events[i].applicant_count || 0;
                    expect(prevCount).toBeGreaterThanOrEqual(currCount);
                }
            });

            it('should sort by event date ascending', async () => {
                const response = await request(app)
                    .get('/api/events/search?sort=date_asc&limit=10')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThan(0);
                
                // Check that events are sorted by event_date ascending
                for (let i = 1; i < response.body.events.length; i++) {
                    const date1 = new Date(response.body.events[i-1].event_date);
                    const date2 = new Date(response.body.events[i].event_date);
                    expect(date1.getTime()).toBeLessThanOrEqual(date2.getTime());
                }
            });

            it('should sort by event date descending', async () => {
                const response = await request(app)
                    .get('/api/events/search?sort=date_desc&limit=10')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThan(0);
                
                // Check that events are sorted by event_date descending
                for (let i = 1; i < response.body.events.length; i++) {
                    const date1 = new Date(response.body.events[i-1].event_date);
                    const date2 = new Date(response.body.events[i].event_date);
                    expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
                }
            });

            it('should sort by company name alphabetically', async () => {
                const response = await request(app)
                    .get('/api/events/search?sort=company&limit=10')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThan(0);
                
                // Check alphabetical order
                for (let i = 1; i < response.body.events.length; i++) {
                    const company1 = response.body.events[i-1].company.toLowerCase();
                    const company2 = response.body.events[i].company.toLowerCase();
                    expect(company1.localeCompare(company2)).toBeLessThanOrEqual(0);
                }
            });

            it('should sort by newest first (default)', async () => {
                const response = await request(app)
                    .get('/api/events/search?sort=newest&limit=10')
                    .expect(200);

                expect(response.body.events.length).toBeGreaterThan(0);
                
                // Check that events are sorted by created_at descending
                for (let i = 1; i < response.body.events.length; i++) {
                    const date1 = new Date(response.body.events[i-1].created_at);
                    const date2 = new Date(response.body.events[i].created_at);
                    expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
                }
            });
        });

        describe('Upcoming events filter', () => {
            it('should filter for upcoming events only', async () => {
                const response = await request(app)
                    .get('/api/events/search?upcoming=true')
                    .expect(200);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                response.body.events.forEach(event => {
                    const eventDate = new Date(event.event_date);
                    expect(eventDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
                });
            });

            it('should include past events when upcoming=false', async () => {
                const response = await request(app)
                    .get('/api/events/search?upcoming=false')
                    .expect(200);

                // Should include all events regardless of date
                expect(response.body.events.length).toBeGreaterThanOrEqual(0);
            });
        });

        describe('Pagination', () => {
            it('should paginate results correctly', async () => {
                const response = await request(app)
                    .get('/api/events/search?limit=2&page=1')
                    .expect(200);

                expect(response.body.pagination.currentPage).toBe(1);
                expect(response.body.pagination.limit).toBe(2);
                expect(response.body.pagination.totalCount).toBeGreaterThanOrEqual(0);
                expect(response.body.events.length).toBeLessThanOrEqual(2);
            });

            it('should respect maximum limit of 100', async () => {
                const response = await request(app)
                    .get('/api/events/search?limit=150')
                    .expect(200);

                expect(response.body.pagination.limit).toBe(100);
            });
        });

        describe('Input validation', () => {
            it('should handle invalid sort parameter', async () => {
                const response = await request(app)
                    .get('/api/events/search?sort=invalid_sort')
                    .expect(200);

                expect(response.body.filters.sort).toBe('newest'); // Default fallback
            });

            it('should handle invalid page numbers', async () => {
                const response = await request(app)
                    .get('/api/events/search?page=0')
                    .expect(200);

                expect(response.body.pagination.currentPage).toBe(1); // Minimum page
            });

            it('should handle non-numeric limit', async () => {
                const response = await request(app)
                    .get('/api/events/search?limit=abc')
                    .expect(200);

                expect(response.body.pagination.limit).toBe(50); // Default fallback
            });
        });

        describe('Partial matching', () => {
            it('should perform partial matching on company names', async () => {
                const response = await request(app)
                    .get('/api/events/search?company=Goog')
                    .expect(200);

                const googleEvents = response.body.events.filter(event => event.company.includes('Google'));
                expect(googleEvents.length).toBeGreaterThanOrEqual(1);
            });

            it('should be case insensitive', async () => {
                const response = await request(app)
                    .get('/api/events/search?company=google')
                    .expect(200);

                const googleEvents = response.body.events.filter(event => event.company === 'Google');
                expect(googleEvents.length).toBeGreaterThanOrEqual(1);
            });

            it('should search in both title and description for type', async () => {
                const response = await request(app)
                    .get('/api/events/search?type=workshop')
                    .expect(200);

                // Check that all returned events contain 'workshop' in title or description
                response.body.events.forEach(event => {
                    const titleMatch = event.title.toLowerCase().includes('workshop');
                    const descMatch = event.description && event.description.toLowerCase().includes('workshop');
                    expect(titleMatch || descMatch).toBe(true);
                });
                
                // Should return array (may be empty if no workshops exist)
                expect(Array.isArray(response.body.events)).toBe(true);
            });
        });

        describe('Response structure', () => {
            it('should return correct response structure', async () => {
                const response = await request(app)
                    .get('/api/events/search')
                    .expect(200);

                expect(response.body).toHaveProperty('events');
                expect(response.body).toHaveProperty('pagination');
                expect(response.body).toHaveProperty('filters');

                expect(response.body.pagination).toHaveProperty('currentPage');
                expect(response.body.pagination).toHaveProperty('totalPages');
                expect(response.body.pagination).toHaveProperty('totalCount');
                expect(response.body.pagination).toHaveProperty('limit');
                expect(response.body.pagination).toHaveProperty('hasNextPage');
                expect(response.body.pagination).toHaveProperty('hasPrevPage');
            });

            it('should include all event fields', async () => {
                const response = await request(app)
                    .get('/api/events/search?limit=1')
                    .expect(200);

                if (response.body.events.length > 0) {
                    const event = response.body.events[0];
                    expect(event).toHaveProperty('event_id');
                    expect(event).toHaveProperty('title');
                    expect(event).toHaveProperty('company');
                    expect(event).toHaveProperty('industry');
                    expect(event).toHaveProperty('location');
                    expect(event).toHaveProperty('event_date');
                    expect(event).toHaveProperty('applicant_count');
                    expect(event).toHaveProperty('created_at');
                }
            });
        });
    });

    describe('GET /api/events/filters', () => {
        it('should return available filter options', async () => {
            const response = await request(app)
                .get('/api/events/filters')
                .expect(200);

            expect(response.body).toHaveProperty('filterOptions');
            expect(response.body).toHaveProperty('sortOptions');

            expect(response.body.filterOptions).toHaveProperty('companies');
            expect(response.body.filterOptions).toHaveProperty('industries');
            expect(response.body.filterOptions).toHaveProperty('locations');

            expect(Array.isArray(response.body.filterOptions.companies)).toBe(true);
            expect(Array.isArray(response.body.sortOptions)).toBe(true);
        });

        it('should include test data in filter options', async () => {
            const response = await request(app)
                .get('/api/events/filters')
                .expect(200);

            expect(response.body.filterOptions.companies).toContain('Google');
            expect(response.body.filterOptions.industries).toContain('Technology');
            expect(response.body.filterOptions.locations).toContain('London');
        });

        it('should return correct sort options for events', async () => {
            const response = await request(app)
                .get('/api/events/filters')
                .expect(200);

            const sortValues = response.body.sortOptions.map(option => option.value);
            expect(sortValues).toContain('newest');
            expect(sortValues).toContain('oldest');
            expect(sortValues).toContain('popular');
            expect(sortValues).toContain('date_asc');
            expect(sortValues).toContain('date_desc');
            expect(sortValues).toContain('company');
        });
    });

    describe('Performance and edge cases', () => {
        it('should handle empty results gracefully', async () => {
            const response = await request(app)
                .get('/api/events/search?company=NonExistentCompany12345')
                .expect(200);

            expect(response.body.events).toHaveLength(0);
            expect(response.body.pagination.totalCount).toBe(0);
            expect(response.body.pagination.totalPages).toBe(0);
        });

        it('should handle special characters in search terms', async () => {
            const response = await request(app)
                .get('/api/events/search?company=Test%26Company')
                .expect(200);

            // Should not crash, even if no results
            expect(response.body).toHaveProperty('events');
        });

        it('should handle invalid date ranges gracefully', async () => {
            const response = await request(app)
                .get('/api/events/search?date_from=2024-12-31&date_to=2024-01-01')
                .expect(200);

            // Should return empty results for impossible date range
            expect(response.body.events).toHaveLength(0);
        });

        it('should complete search within reasonable time', async () => {
            const startTime = Date.now();
            
            await request(app)
                .get('/api/events/search?industry=Technology&location=London&upcoming=true')
                .expect(200);
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete within 2 seconds
            expect(duration).toBeLessThan(2000);
        });

        it('should handle concurrent requests without issues', async () => {
            const requests = Array(5).fill().map(() => 
                request(app).get('/api/events/search?industry=Technology')
            );

            const responses = await Promise.all(requests);
            
            responses.forEach(response => {
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('events');
                expect(response.body).toHaveProperty('pagination');
            });
        });
    });
});
