import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import path from 'path';
import fs from 'fs';
import { generateToken } from '../../lib/token.js';
import '../utils/setup.js';

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
        // No need to create admin user since we're using uploaded_by as string
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

        // No admin user to clean up

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

            expect(response.body).toHaveProperty('msg', 'Title and category are required');
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

            expect(response.body).toHaveProperty('download_url');
            expect(response.body).toHaveProperty('file_name');
            expect(response.body).toHaveProperty('file_size');
            expect(response.body).toHaveProperty('expires_in');
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

    describe('Resource audience access', () => {
        let publicResourceId;
        let societyResourceId;
        let inactiveResourceId;
        let societyToken;
        let jobseekerToken;

        const insertResource = async (title, category, audience, isActive = true) => {
            const result = await db.query(
                `INSERT INTO resources (
                    title, category, file_name, file_size, file_type, storage_key, audience, is_active
                ) VALUES ($1, $2, $3, '1 MB', 'application/pdf', $4, $5, $6)
                RETURNING resource_id`,
                [title, category, `${title}.pdf`, `resources/audience-test/${title}.pdf`, audience, isActive]
            );
            return result.rows[0].resource_id;
        };

        beforeAll(async () => {
            societyToken = generateToken(1, 'society');
            jobseekerToken = generateToken(1, 'jobseeker');

            publicResourceId = await insertResource('audience-test-public', 'CV', 'public');
            societyResourceId = await insertResource('audience-test-society', 'Career Workshops', 'society');
            inactiveResourceId = await insertResource('audience-test-inactive', 'CV', 'public', false);
        });

        afterAll(async () => {
            await db.query(
                'DELETE FROM resources WHERE resource_id = ANY($1)',
                [[publicResourceId, societyResourceId, inactiveResourceId]]
            );
        });

        const listIds = (response) => response.body.resources.map(resource => resource.resource_id);

        describe('GET /api/resources', () => {
            test('should exclude society resources for anonymous users', async () => {
                const response = await request(app)
                    .get('/api/resources?limit=100')
                    .expect(200);

                expect(listIds(response)).toContain(publicResourceId);
                expect(listIds(response)).not.toContain(societyResourceId);
                response.body.resources.forEach(resource => {
                    expect(resource.audience).toBe('public');
                });
            });

            test('should exclude society resources by default for societies', async () => {
                const response = await request(app)
                    .get('/api/resources?limit=100')
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(200);

                expect(listIds(response)).not.toContain(societyResourceId);
            });

            test('should return 403 when anonymous user requests society audience', async () => {
                const response = await request(app)
                    .get('/api/resources?audience=society')
                    .expect(403);

                expect(response.body).toHaveProperty('msg', 'Society access required');
            });

            test('should return 403 when jobseeker requests society or all audience', async () => {
                await request(app)
                    .get('/api/resources?audience=society')
                    .set('Authorization', `Bearer ${jobseekerToken}`)
                    .expect(403);

                await request(app)
                    .get('/api/resources?audience=all')
                    .set('Authorization', `Bearer ${jobseekerToken}`)
                    .expect(403);
            });

            test('should return 403 for an invalid token requesting society audience', async () => {
                await request(app)
                    .get('/api/resources?audience=society')
                    .set('Authorization', 'Bearer not-a-real-token')
                    .expect(403);
            });

            test('should return 400 for an unknown audience', async () => {
                const response = await request(app)
                    .get('/api/resources?audience=everyone')
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(400);

                expect(response.body).toHaveProperty('msg', 'Invalid audience');
            });

            test('should return only society resources for society audience', async () => {
                const response = await request(app)
                    .get('/api/resources?audience=society&limit=100')
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(200);

                expect(listIds(response)).toContain(societyResourceId);
                expect(listIds(response)).not.toContain(publicResourceId);
            });

            test('should return public and society resources for all audience', async () => {
                const response = await request(app)
                    .get('/api/resources?audience=all&limit=100')
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(200);

                expect(listIds(response)).toContain(societyResourceId);
                expect(listIds(response)).toContain(publicResourceId);
            });

            test('should allow admin to list society resources', async () => {
                const response = await request(app)
                    .get('/api/resources?audience=society&limit=100')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .expect(200);

                expect(listIds(response)).toContain(societyResourceId);
            });

            test('should filter by multiple categories', async () => {
                const response = await request(app)
                    .get('/api/resources?audience=all&categories=Career Workshops,CV&limit=100')
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(200);

                expect(listIds(response)).toContain(societyResourceId);
                expect(listIds(response)).toContain(publicResourceId);
                response.body.resources.forEach(resource => {
                    expect(['Career Workshops', 'CV']).toContain(resource.category);
                });
            });

            test('should only include inactive resources for admins', async () => {
                const anonymousResponse = await request(app)
                    .get('/api/resources?include_inactive=true&limit=100')
                    .expect(200);

                expect(listIds(anonymousResponse)).not.toContain(inactiveResourceId);

                const adminResponse = await request(app)
                    .get('/api/resources?include_inactive=true&limit=100')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .expect(200);

                expect(listIds(adminResponse)).toContain(inactiveResourceId);
            });
        });

        describe('GET /api/resources/:resource_id', () => {
            test('should return 404 for society resource when anonymous', async () => {
                const response = await request(app)
                    .get(`/api/resources/${societyResourceId}`)
                    .expect(404);

                expect(response.body).toHaveProperty('msg', 'Resource not found');
            });

            test('should return 404 for society resource when jobseeker', async () => {
                await request(app)
                    .get(`/api/resources/${societyResourceId}`)
                    .set('Authorization', `Bearer ${jobseekerToken}`)
                    .expect(404);
            });

            test('should return society resource for society and admin', async () => {
                const societyResponse = await request(app)
                    .get(`/api/resources/${societyResourceId}`)
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(200);

                expect(societyResponse.body.resource).toHaveProperty('audience', 'society');

                await request(app)
                    .get(`/api/resources/${societyResourceId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .expect(200);
            });

            test('should return public resource when anonymous', async () => {
                const response = await request(app)
                    .get(`/api/resources/${publicResourceId}`)
                    .expect(200);

                expect(response.body.resource).toHaveProperty('audience', 'public');
            });
        });

        describe('GET /api/resources/:resource_id/download and /stream', () => {
            test('should return 404 for society resource download when anonymous or jobseeker', async () => {
                await request(app)
                    .get(`/api/resources/${societyResourceId}/download`)
                    .expect(404);

                await request(app)
                    .get(`/api/resources/${societyResourceId}/download`)
                    .set('Authorization', `Bearer ${jobseekerToken}`)
                    .expect(404);
            });

            test('should return 404 for society resource stream when anonymous or jobseeker', async () => {
                await request(app)
                    .get(`/api/resources/${societyResourceId}/stream`)
                    .expect(404);

                await request(app)
                    .get(`/api/resources/${societyResourceId}/stream`)
                    .set('Authorization', `Bearer ${jobseekerToken}`)
                    .expect(404);
            });

            test('should not count blocked downloads', async () => {
                const result = await db.query(
                    'SELECT download_count FROM resources WHERE resource_id = $1',
                    [societyResourceId]
                );

                expect(result.rows[0].download_count).toBe(0);
            });

            test('should generate download URL for society resource when society', async () => {
                const response = await request(app)
                    .get(`/api/resources/${societyResourceId}/download`)
                    .set('Authorization', `Bearer ${societyToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('download_url');
            });
        });

        describe('POST and PATCH audience', () => {
            test('should default audience to public on create', async () => {
                const response = await request(app)
                    .post('/api/resources')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .field('title', 'Audience Default Test')
                    .field('category', 'CV')
                    .field('upload_type', 'link')
                    .field('video_link', 'https://www.youtube.com/watch?v=audience-default-test')
                    .expect(201);

                expect(response.body.resource).toHaveProperty('audience', 'public');

                await db.query('DELETE FROM resources WHERE resource_id = $1', [response.body.resource.resource_id]);
            });

            test('should create a society resource', async () => {
                const response = await request(app)
                    .post('/api/resources')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .field('title', 'Audience Society Test')
                    .field('category', 'Career Workshops')
                    .field('audience', 'society')
                    .field('upload_type', 'link')
                    .field('video_link', 'https://www.youtube.com/watch?v=audience-society-test')
                    .expect(201);

                expect(response.body.resource).toHaveProperty('audience', 'society');

                await db.query('DELETE FROM resources WHERE resource_id = $1', [response.body.resource.resource_id]);
            });

            test('should reject invalid audience on create', async () => {
                const response = await request(app)
                    .post('/api/resources')
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .field('title', 'Audience Invalid Test')
                    .field('category', 'CV')
                    .field('audience', 'everyone')
                    .field('upload_type', 'link')
                    .field('video_link', 'https://www.youtube.com/watch?v=audience-invalid-test')
                    .expect(400);

                expect(response.body).toHaveProperty('msg', 'Invalid audience');
            });

            test('should move a resource between audiences on update', async () => {
                const response = await request(app)
                    .patch(`/api/resources/${publicResourceId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .send({ audience: 'society' })
                    .expect(200);

                expect(response.body.resource).toHaveProperty('audience', 'society');

                await request(app)
                    .get(`/api/resources/${publicResourceId}`)
                    .expect(404);

                await request(app)
                    .patch(`/api/resources/${publicResourceId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .send({ audience: 'public' })
                    .expect(200);
            });

            test('should reject invalid audience on update', async () => {
                const response = await request(app)
                    .patch(`/api/resources/${publicResourceId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`)
                    .send({ audience: 'everyone' })
                    .expect(400);

                expect(response.body).toHaveProperty('msg', 'Invalid audience');
            });
        });

        describe('GET /api/resources/categories and /stats', () => {
            test('should exclude society-only categories', async () => {
                const response = await request(app)
                    .get('/api/resources/categories')
                    .expect(200);

                expect(response.body.categories).not.toContain('Career Workshops');
            });

            test('should exclude society resources from stats', async () => {
                const response = await request(app)
                    .get('/api/resources/stats')
                    .expect(200);

                expect(response.body.stats.by_category).not.toHaveProperty('Career Workshops');
            });
        });
    });

    describe('POST /api/resources is_active', () => {
        const createLinkResource = (fields) => {
            const req = request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .field('title', 'Active Flag Test')
                .field('category', 'CV')
                .field('upload_type', 'link');

            Object.entries(fields).forEach(([key, value]) => req.field(key, value));
            return req;
        };

        test('should default to active on create', async () => {
            const response = await createLinkResource({
                video_link: 'https://www.youtube.com/watch?v=active-default-test'
            }).expect(201);

            expect(response.body.resource).toHaveProperty('is_active', true);

            await db.query('DELETE FROM resources WHERE resource_id = $1', [response.body.resource.resource_id]);
        });

        test('should create an inactive resource from a multipart form', async () => {
            const response = await createLinkResource({
                video_link: 'https://www.youtube.com/watch?v=inactive-form-test',
                is_active: 'false'
            }).expect(201);

            expect(response.body.resource).toHaveProperty('is_active', false);

            await db.query('DELETE FROM resources WHERE resource_id = $1', [response.body.resource.resource_id]);
        });

        test('should create an inactive resource from JSON', async () => {
            const response = await request(app)
                .post('/api/resources')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    title: 'Active Flag JSON Test',
                    category: 'CV',
                    upload_type: 'link',
                    video_link: 'https://www.youtube.com/watch?v=inactive-json-test',
                    is_active: false
                })
                .expect(201);

            expect(response.body.resource).toHaveProperty('is_active', false);

            await db.query('DELETE FROM resources WHERE resource_id = $1', [response.body.resource.resource_id]);
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

            expect(response.body).toHaveProperty('msg', 'Either a file or video link is required');
        });
    });
});
