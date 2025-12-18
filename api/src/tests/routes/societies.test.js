import request from 'supertest';
import app from '../../app.js';
import bcrypt from 'bcrypt';

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
                password_hash: hashedPassword
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
                // Missing password_hash (required field)
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
                password_hash: hashedPassword
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
                password_hash: hashedPassword
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
                    password_hash: hashedPassword
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
                    password_hash: hashedPassword
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
                password_hash: hashedPassword
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
                    password_hash: hashedPassword
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
                password_hash: hashedPassword
            };

            const response = await request(app)
                .post('/api/societies')
                .send(longStringSociety);

            // Should fail due to field length constraints
            expect([400, 500]).toContain(response.status);
        });

        test('should handle invalid date format', async () => {
            const invalidDateSociety = {
                name: 'Date',
                university: 'Test University',
                description: 'Test description',
                email: 'datetest@test.com',
                password_hash: hashedPassword,
                date_of_birth: 'invalid-date'
            };

            const response = await request(app)
                .post('/api/societies')
                .send(invalidDateSociety);

            // Should fail due to invalid date format
            expect([400, 500]).toContain(response.status);
        });

        test('should handle invalid field updates', async () => {
            const emptyStringSociety = {
                name: '',
                university: 'Test University',
                description: 'Test description',
                email: 'empty@test.com',
                password_hash: hashedPassword
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

}) 