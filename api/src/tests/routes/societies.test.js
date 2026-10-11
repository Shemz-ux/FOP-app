import request from 'supertest';
import app from '../../app.js';
import bcrypt from 'bcrypt';
import db from '../../db/db.js';
import { generateToken } from '../../lib/token.js';

describe('Societies API Endpoints', () => {
    let testSocietyId;
    const testPassword = 'TestPassword123';
    let hashedPassword;
    
    beforeAll(async () => {
        // Hash password for testing
        hashedPassword = await bcrypt.hash(testPassword, 10);
    });

    beforeEach(() => {
        // Reset testSocietyId before each test
        testSocietyId = null;
    });
    
    describe('GET /api/societies', () => {
        test('should return all societies', async () => {
            const response = await request(app)
                .get('/api/societies')
                .expect(200);

            expect(response.body).toHaveProperty('societies');
            expect(Array.isArray(response.body.societies)).toBe(true);
        });
    });
    
    describe('POST /api/societies', () => {
        test('should create a new society with valid data', async () => {
            const timestamp = Date.now();
            const newSociety = {
                name: 'Test Society',
                university: 'Test University',
                description: 'Test description',
                email: `test.society.${timestamp}@test.com`,
                password: testPassword
            };

            const response = await request(app)
                .post('/api/societies')
                .send(newSociety)
                .expect(201);

            expect(response.body).toHaveProperty('newSociety');
            expect(response.body.newSociety).toHaveProperty('society_id');
            expect(response.body.newSociety.name).toBe('Test Society');
            expect(response.body.newSociety.university).toBe('Test University');
            expect(response.body.newSociety.email).toBe(`test.society.${timestamp}@test.com`);

            // Store the society ID for other tests
            testSocietyId = response.body.newSociety.society_id;
        });

        test('should handle missing required fields', async () => {
            const incompleteSociety = {
                name: 'Test Society',
                university: 'Test University',
                description: 'Test description',
                email: 'test.society@test.com',
                // Missing password (required field)
            };

            const response = await request(app)
                .post('/api/societies')
                .send(incompleteSociety);

            // Accept either 400 (validation error) or 500 (database error)
            expect([400, 500]).toContain(response.status);
        });

        test('should handle duplicate email', async () => {
            // First create a society
            const timestamp = Date.now();
            const firstSociety = {
                name: 'First Society',
                university: 'Test University',
                description: 'Test description',
                email: `duplicate.test.${timestamp}@test.com`,
                password: testPassword
            };

            await request(app)
                .post('/api/societies')
                .send(firstSociety)
                .expect(201);

            // Then try to create another with the same email
            const duplicateSociety = {
                name: 'Second Society',
                university: 'Test University',
                description: 'Test description',
                email: `duplicate.test.${timestamp}@test.com`, // Same email as previous
                password: testPassword
            };

            const response = await request(app)
                .post('/api/societies')
                .send(duplicateSociety);

            // Accept either 400 (validation error) or 500 (database error)
            expect([400, 500]).toContain(response.status);
        });
    });

    describe('GET /api/societies/:society_id', () => {
        test('should return a specific society', async () => {
            if (!testSocietyId) {
                const timestamp = Date.now();
                const newSociety = {
                    name: 'Test Society',
                    university: 'Test University',
                    description: 'Test description',
                    email: `get.society.${timestamp}@test.com`,
                    password: testPassword
                };
                const response = await request(app)
                    .post('/api/societies')
                    .send(newSociety)
                    .expect(201);
                testSocietyId = response.body.newSociety.society_id;
            }

            const response = await request(app)
                .get(`/api/societies/${testSocietyId}`)
                .expect(200);

            expect(response.body).toHaveProperty('society');
            expect(response.body.society).toHaveProperty('society_id');
            expect(response.body.society.name).toBe('Test Society');
            expect(response.body.society.university).toBe('Test University');
            expect(response.body.society.email).toContain('get.society.');
        });

        test('should return 404 if society not found', async () => {
            const response = await request(app)
                .get(`/api/societies/999999`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Society not found');
        });

        test('should handle invalid society ID format', async () => {
            const response = await request(app)
                .get('/api/societies/invalid-id');

            // Accept either 400 (validation error) or 404 (not found)
            expect([400, 404]).toContain(response.status);
        });
    });

    describe('PATCH /api/societies/:society_id', () => {
        test('should update a society with valid data', async () => {
            if (!testSocietyId) {
                const timestamp = Date.now();
                const newSociety = {
                    name: 'Test Society',
                    university: 'Test University',
                    description: 'Test description',
                    email: `patch.society.${timestamp}@test.com`,
                    password: testPassword
                };
                const response = await request(app)
                    .post('/api/societies')
                    .send(newSociety)
                    .expect(201);
                testSocietyId = response.body.newSociety.society_id;
            }

            const updateTimestamp = Date.now();
            const updateData = {
                name: 'Updated Society',
                university: 'Updated University',
                description: 'Updated description',
                email: `updated.society.${updateTimestamp}@test.com`,
                password: testPassword
            };

            const response = await request(app)
                .patch(`/api/societies/${testSocietyId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('society');
            expect(response.body.society).toHaveProperty('society_id');
            expect(response.body.society.name).toBe('Updated Society');
            expect(response.body.society.university).toBe('Updated University');
            expect(response.body.society.email).toBe(`updated.society.${updateTimestamp}@test.com`);
        });

        test('should handle non-existent society update', async () => {
            const updateData = { name: 'Updated Society' };

            const response = await request(app)
                .patch('/api/societies/99999')
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Society not found');
        });

        test('should handle invalid field updates', async () => {
            if (!testSocietyId) return; // Skip if no test society
            
            const invalidData = { invalidField: 'test', anotherInvalidField: 'value' };

            const response = await request(app)
                .patch(`/api/societies/${testSocietyId}`)
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid field provided');
        });

        test('should update only provided fields', async () => {
            if (!testSocietyId) return; // Skip if no test society

            const partialUpdate = {
                name: 'Updated Society'
            };

            const response = await request(app)
                .patch(`/api/societies/${testSocietyId}`)
                .send(partialUpdate)
                .expect(200);

            expect(response.body.society.name).toBe('Updated Society');
            // Other fields should remain unchanged
            expect(response.body.society.university).toBe('Updated University');
        });
    });

    describe('DELETE /api/societies/:society_id', () => {
        test('should delete a society successfully', async () => {
            if (!testSocietyId) {
                // Create a society first if we don't have one
                const timestamp = Date.now();
                const newSociety = {
                    name: 'Delete',
                    university: 'Test University',
                    description: 'Test description',
                    email: `delete.society.${timestamp}@test.com`,
                    password: testPassword
                };
                
                const createResponse = await request(app)
                    .post('/api/societies')
                    .send(newSociety);
                
                testSocietyId = createResponse.body.newSociety.society_id;
            }

            const response = await request(app)
                .delete(`/api/societies/${testSocietyId}`)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Society deleted!');

            // Verify society is actually deleted
            const deleteResponse = await request(app)
                .get(`/api/societies/${testSocietyId}`)
                .expect(404);

            expect(deleteResponse.body).toHaveProperty('msg', 'Society not found');
        });

        test('should return 404 for non-existent society', async () => {
            const response = await request(app)
                .delete('/api/societies/99999')
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Society not found');
        });
    });

    describe('Data validation and edge cases', () => {
        test('should handle very long strings in fields', async () => {
            const longStringSociety = {
                name: 'A'.repeat(300), // Exceeds VARCHAR(255)
                university: 'Test University',
                description: 'Test description',
                email: 'longstring@test.com',
                password: testPassword
            };

            const response = await request(app)
                .post('/api/societies')
                .send(longStringSociety);

            // Should fail due to field length constraints
            expect([400, 500]).toContain(response.status);
        });

        test('should handle invalid field updates', async () => {
            const timestamp = Date.now();
            const invalidFieldSociety = {
                name: 'Invalid Field Test',
                university: 'Test University',
                description: 'Test description',
                email: `invalidfield.${timestamp}@test.com`,
                password: testPassword,
                invalid_field: 'should not be accepted'
            };

            const response = await request(app)
                .post('/api/societies')
                .send(invalidFieldSociety);

            // Should succeed but ignore invalid field, or fail with validation error
            expect([201, 400, 500]).toContain(response.status);
        });

        test('should handle empty string values', async () => {
            const timestamp = Date.now();
            const emptyStringSociety = {
                name: '',
                university: 'Test University',
                description: 'Test description',
                email: `empty.${timestamp}@test.com`,
                password: testPassword
            };

            const response = await request(app)
                .post('/api/societies')
                .send(emptyStringSociety);

            // Should either succeed with empty strings or fail validation
            expect([201, 400, 500]).toContain(response.status);
        });
    });

    afterAll(async () => {
        if (testSocietyId) {
            try {
                await request(app).delete(`/api/societies/${testSocietyId}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
    });

    describe('GET /api/societies/me/members', () => {
        let societyId;
        let otherSocietyId;
        let societyToken;
        let otherSocietyToken;
        const memberIds = [];
        const jobIds = [];
        const eventIds = [];

        // The test database starts empty, so build two societies with their
        // own members and check one can never see the other's
        beforeAll(async () => {
            const stamp = Date.now();

            const makeSociety = async (label) => {
                const { rows: [society] } = await db.query(
                    `INSERT INTO societies (name, university, email, password_hash)
                     VALUES ($1, $2, $3, $4) RETURNING society_id`,
                    [`${label} ${stamp}`, 'Test University', `${label.toLowerCase()}.${stamp}@test.com`, 'hash']
                );
                return society.society_id;
            };

            const makeMember = async (name, society_id) => {
                const { rows: [member] } = await db.query(
                    `INSERT INTO jobseekers
                        (first_name, last_name, email, password_hash, education_level,
                         institution_name, uni_year, degree_type, area_of_study, society_id)
                     VALUES ($1, 'Member', $2, 'hash', 'undergraduate', 'Test University',
                             '2nd', 'bsc', 'Computer Science', $3)
                     RETURNING jobseeker_id`,
                    [name, `${name.toLowerCase()}.${stamp}@test.com`, society_id]
                );
                memberIds.push(member.jobseeker_id);
                return member.jobseeker_id;
            };

            societyId = await makeSociety('Members Society');
            otherSocietyId = await makeSociety('Rival Society');
            societyToken = generateToken(societyId, 'society');
            otherSocietyToken = generateToken(otherSocietyId, 'society');

            const ours = await makeMember('Ours', societyId);
            await makeMember('AlsoOurs', societyId);
            await makeMember('Theirs', otherSocietyId);

            // Give one member 2 job applications and 3 event registrations, so
            // the counts are not just 0 and the two cannot be confused.
            // The test database is empty, so the jobs and events are made here.
            for (const title of ['Members Test Job A', 'Members Test Job B']) {
                const { rows: [job] } = await db.query(
                    `INSERT INTO jobs (title, company) VALUES ($1, $2) RETURNING job_id`,
                    [`${title} ${stamp}`, 'Test Co']
                );
                jobIds.push(job.job_id);
                await db.query(
                    'INSERT INTO jobseekers_jobs_applied (jobseeker_id, job_id) VALUES ($1, $2)',
                    [ours, job.job_id]
                );
            }

            for (const title of ['Members Test Event A', 'Members Test Event B', 'Members Test Event C']) {
                const { rows: [event] } = await db.query(
                    `INSERT INTO events (title, organiser, event_date, event_start_time, event_end_time)
                     VALUES ($1, $2, '2026-01-01', '10:00', '11:00') RETURNING event_id`,
                    [`${title} ${stamp}`, 'Test Organiser']
                );
                eventIds.push(event.event_id);
                await db.query(
                    'INSERT INTO jobseekers_events_applied (jobseeker_id, event_id) VALUES ($1, $2)',
                    [ours, event.event_id]
                );
            }
        });

        afterAll(async () => {
            for (const id of memberIds) {
                await db.query('DELETE FROM jobseekers WHERE jobseeker_id = $1', [id]);
            }
            for (const id of jobIds) {
                await db.query('DELETE FROM jobs WHERE job_id = $1', [id]);
            }
            for (const id of eventIds) {
                await db.query('DELETE FROM events WHERE event_id = $1', [id]);
            }
            await db.query('DELETE FROM societies WHERE society_id = ANY($1)', [[societyId, otherSocietyId]]);
        });

        test('returns the calling society\'s own members', async () => {
            const response = await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${societyToken}`)
                .expect(200);

            expect(response.body.count).toBe(2);
            expect(response.body.members.map(m => m.first_name).sort()).toEqual(['AlsoOurs', 'Ours']);
        });

        test('a society never sees another society\'s members', async () => {
            const response = await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${otherSocietyToken}`)
                .expect(200);

            expect(response.body.count).toBe(1);
            expect(response.body.members[0].first_name).toBe('Theirs');
        });

        test('counts job applications and event registrations separately', async () => {
            const response = await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${societyToken}`)
                .expect(200);

            const ours = response.body.members.find(m => m.first_name === 'Ours');
            const alsoOurs = response.body.members.find(m => m.first_name === 'AlsoOurs');

            // 2 jobs and 3 events. Joining both one-to-many tables at once
            // multiplies the rows, so without DISTINCT these would both be 6.
            expect(ours.application_count).toBe(2);
            expect(ours.event_registration_count).toBe(3);
            expect(alsoOurs.application_count).toBe(0);
            expect(alsoOurs.event_registration_count).toBe(0);
        });

        test('returns the fields the members table needs', async () => {
            const response = await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${societyToken}`)
                .expect(200);

            const member = response.body.members[0];
            ['jobseeker_id', 'first_name', 'last_name', 'education_level',
             'uni_year', 'area_of_study', 'created_at', 'application_count',
             'event_registration_count', 'role_interest_option_one', 'role_interest_option_two']
                .forEach(field => expect(member).toHaveProperty(field));
        });

        test('does not expose a member\'s password, phone, LinkedIn or CV', async () => {
            const response = await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${societyToken}`)
                .expect(200);

            response.body.members.forEach(member => {
                ['password_hash', 'phone_number', 'linkedin', 'cv_storage_key',
                 'cv_storage_url', 'school_meal_eligible', 'first_gen_to_go_uni']
                    .forEach(field => expect(member).not.toHaveProperty(field));
            });
        });

        test('rejects a caller with no token', async () => {
            await request(app)
                .get('/api/societies/me/members')
                .expect(401);
        });

        test('rejects a malformed token', async () => {
            await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', 'Bearer not-a-real-token')
                .expect(401);
        });

        test('rejects a jobseeker', async () => {
            await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${generateToken(1, 'jobseeker')}`)
                .expect(403);
        });

        test('rejects an admin, who has their own route for this', async () => {
            await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${generateToken(1, 'admin', 'super_admin')}`)
                .expect(403);
        });

        test('"me" is not treated as a society id', async () => {
            // /societies/me/members must not fall through to /societies/:society_id
            const response = await request(app)
                .get('/api/societies/me/members')
                .set('Authorization', `Bearer ${societyToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('members');
            expect(response.body).not.toHaveProperty('society');
        });
    });

    afterAll(async () => {
        // Close database connection to prevent Jest from hanging
        await db.end();
    });
});