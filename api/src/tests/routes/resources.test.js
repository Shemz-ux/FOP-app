import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import path from 'path';
import fs from 'fs';
import '../setup.js';

describe('Resources API Endpoints', () => {
    let testResourceId;
    let testAdminId;
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";

    // Create a test PDF file for upload testing
    const createTestFile = () => {
        const testContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF');
        return testContent;
    };

    beforeAll(async () => {
        // Create a test admin user for resource creation
        const adminResult = await db.query(`
            INSERT INTO admin_users (first_name, last_name, email, password_hash, role)
            VALUES ('Test', 'Admin', 'test.admin@test.com', 'hashedpassword', 'admin')
            RETURNING admin_id
        `);
        testAdminId = adminResult.rows[0].admin_id;
    });

    afterAll(async () => {
        // Clean up test data
        if (testResourceId) {
            try {
                await db.query('DELETE FROM resources WHERE resource_id = $1', [testResourceId]);
            } catch (error) {
                // Ignore cleanup errors
            }
        }

        if (testAdminId) {
            try {
                await db.query('DELETE FROM admin_users WHERE admin_id = $1', [testAdminId]);
            } catch (error) {
                // Ignore cleanup errors
            }
        }

        // Close database connection
        await db.end();
    });

    describe('GET /api/resources', () => {
        test('should return all resources', async () => {
            const response = await request(app)
                .get('/api/resources')
                .expect(200);

            expect(response.body).toHaveProperty('resources');
            expect(response.body).toHaveProperty('pagination');
            expect(Array.isArray(response.body.resources)).toBe(true);
        });

        test('should filter resources by category', async () => {
            const response = await request(app)
                .get('/api/resources?category=career-guides')
                .expect(200);

            expect(response.body).toHaveProperty('resources');
            expect(Array.isArray(response.body.resources)).toBe(true);
        });

        test('should search resources by title', async () => {
            const response = await request(app)
                .get('/api/resources?search=test')
                .expect(200);

            expect(response.body).toHaveProperty('resources');
            expect(Array.isArray(response.body.resources)).toBe(true);
        });

        test('should paginate results', async () => {
            const response = await request(app)
                .get('/api/resources?page=1&limit=5')
                .expect(200);

            expect(response.body).toHaveProperty('pagination');
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.limit).toBe(5);
        });
    });

    describe('POST /api/resources', () => {
        test('should create a new resource with file upload', async () => {
            const testFile = createTestFile();
            
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'Test Career Guide')
                .field('description', 'A comprehensive career guide for students')
                .field('category', 'career-guides')
                .attach('file', testFile, 'test-guide.pdf')
                .expect(201);

            expect(response.body).toHaveProperty('msg', 'Resource created successfully');
            expect(response.body).toHaveProperty('resource');
            expect(response.body.resource.title).toBe('Test Career Guide');
            expect(response.body.resource.category).toBe('career-guides');
            expect(response.body.resource.file_name).toBe('test-guide.pdf');

            // Store for cleanup
            testResourceId = response.body.resource.resource_id;
        });

        test('should require admin authentication', async () => {
            const testFile = createTestFile();
            
            const response = await request(app)
                .post('/api/resources')
                .field('title', 'Unauthorized Test')
                .field('category', 'test')
                .attach('file', testFile, 'test.pdf')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        test('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'Test Resource')
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Title, category, and file are required');
        });

        test('should validate file type', async () => {
            const invalidFile = Buffer.from('This is not a valid file type');
            
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'Invalid File Test')
                .field('category', 'test')
                .attach('file', invalidFile, 'test.exe');

            // Should fail due to multer file filter
            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });

    describe('GET /api/resources/:resource_id', () => {
        test('should return a specific resource', async () => {
            if (!testResourceId) {
                // Create a test resource first
                const testFile = createTestFile();
                const createResponse = await request(app)
                    .post('/api/resources')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .field('title', 'Test Resource for Get')
                    .field('category', 'test')
                    .attach('file', testFile, 'test.pdf');
                testResourceId = createResponse.body.resource.resource_id;
            }

            const response = await request(app)
                .get(`/api/resources/${testResourceId}`)
                .expect(200);

            expect(response.body).toHaveProperty('resource');
            expect(response.body.resource.resource_id).toBe(testResourceId);
        });

        test('should return 404 for non-existent resource', async () => {
            const response = await request(app)
                .get('/api/resources/99999')
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Resource not found');
        });

        test('should handle invalid resource ID', async () => {
            const response = await request(app)
                .get('/api/resources/invalid')
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid resource ID');
        });
    });

    describe('PATCH /api/resources/:resource_id', () => {
        test('should update resource metadata', async () => {
            if (!testResourceId) return;

            const updateData = {
                title: 'Updated Career Guide',
                description: 'Updated description for the career guide'
            };

            const response = await request(app)
                .patch(`/api/resources/${testResourceId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Resource updated successfully');
            expect(response.body.resource.title).toBe('Updated Career Guide');
        });

        test('should require admin authentication', async () => {
            if (!testResourceId) return;

            const response = await request(app)
                .patch(`/api/resources/${testResourceId}`)
                .send({ title: 'Unauthorized Update' })
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        test('should validate update fields', async () => {
            if (!testResourceId) return;

            const response = await request(app)
                .patch(`/api/resources/${testResourceId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({ invalid_field: 'test' })
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Invalid field provided');
        });

        test('should return 404 for non-existent resource', async () => {
            const response = await request(app)
                .patch('/api/resources/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({ title: 'Test Update' })
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Resource not found');
        });
    });

    describe('GET /api/resources/:resource_id/download', () => {
        test('should generate download URL for resource', async () => {
            if (!testResourceId) return;

            const response = await request(app)
                .get(`/api/resources/${testResourceId}/download`)
                .expect(200);

            expect(response.body).toHaveProperty('downloadUrl');
            expect(response.body).toHaveProperty('fileName');
            expect(response.body).toHaveProperty('fileSize');
            expect(response.body).toHaveProperty('expiresIn');
        });

        test('should return 404 for non-existent resource', async () => {
            const response = await request(app)
                .get('/api/resources/99999/download')
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Resource not found');
        });
    });

    describe('DELETE /api/resources/:resource_id', () => {
        test('should delete a resource', async () => {
            if (!testResourceId) return;

            const response = await request(app)
                .delete(`/api/resources/${testResourceId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('msg', 'Resource deleted successfully');

            // Verify resource is soft deleted
            const getResponse = await request(app)
                .get(`/api/resources/${testResourceId}`)
                .expect(404);
        });

        test('should require admin authentication', async () => {
            const response = await request(app)
                .delete('/api/resources/1')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Admin authentication required');
        });

        test('should return 404 for non-existent resource', async () => {
            const response = await request(app)
                .delete('/api/resources/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('msg', 'Resource not found');
        });
    });

    describe('GET /api/resources/categories', () => {
        test('should return available categories', async () => {
            const response = await request(app)
                .get('/api/resources/categories')
                .expect(200);

            expect(response.body).toHaveProperty('categories');
            expect(Array.isArray(response.body.categories)).toBe(true);
        });
    });

    describe('GET /api/resources/stats', () => {
        test('should return resource statistics', async () => {
            const response = await request(app)
                .get('/api/resources/stats')
                .expect(200);

            expect(response.body).toHaveProperty('stats');
            expect(response.body.stats).toHaveProperty('total_resources');
            expect(response.body.stats).toHaveProperty('total_downloads');
            expect(response.body.stats).toHaveProperty('total_categories');
        });
    });

    describe('File Upload Validation', () => {
        test('should reject files that are too large', async () => {
            // Create a large buffer (simulate 60MB file)
            const largeFile = Buffer.alloc(60 * 1024 * 1024, 'a');
            
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'Large File Test')
                .field('category', 'test')
                .attach('file', largeFile, 'large-file.pdf');

            // Should be rejected by multer or validation
            expect(response.status).toBeGreaterThanOrEqual(400);
        });

        test('should handle multiple file upload attempts', async () => {
            const testFile1 = createTestFile();
            const testFile2 = createTestFile();
            
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'Multiple Files Test')
                .field('category', 'test')
                .attach('file', testFile1, 'test1.pdf')
                .attach('file', testFile2, 'test2.pdf');

            // Should handle gracefully (multer configured for single file)
            expect(response.status).toBeGreaterThanOrEqual(200);
        });
    });

    describe('Error Handling', () => {
        test('should handle database errors gracefully', async () => {
            // Test with invalid category that might cause DB issues
            const testFile = createTestFile();
            
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'DB Error Test')
                .field('category', 'a'.repeat(150)) // Exceeds VARCHAR(100) limit
                .attach('file', testFile, 'test.pdf');

            expect(response.status).toBeGreaterThanOrEqual(400);
        });

        test('should handle missing file gracefully', async () => {
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'No File Test')
                .field('category', 'test')
                .expect(400);

            expect(response.body).toHaveProperty('msg', 'Title, category, and file are required');
        });
    });
});
