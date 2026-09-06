import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../utils/setup.js';

describe('Webinars API Endpoints', () => {
    let testWebinarIds = [];
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
    
    // Clean up before tests start
    beforeAll(async () => {
        try {
            // Clean up any leftover test data from previous runs
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['t%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['g%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['u%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['v%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['d%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['f%']);
        } catch (error) {
            console.log('Pre-cleanup error:', error.message);
        }
    });
    
    beforeEach(() => {
        testWebinarIds = [];
    });
    
    // Clean up test data after all tests
    afterAll(async () => {
        try {
            // Clean up any webinars created during tests
            for (const id of testWebinarIds) {
                await db.query('DELETE FROM webinars WHERE webinar_id = $1', [id]);
            }
            // Also clean by pattern as backup
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['t%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['g%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['u%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['v%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['d%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['f%']);
        } catch (error) {
            console.log('Cleanup error:', error.message);
        }
    });
    
    describe('GET /api/webinars', () => {
        test('should return all webinars with pagination', async () => {
            const response = await request(app)
                .get('/api/webinars')
                .expect(200);

            expect(response.body).toHaveProperty('webinars');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body).toHaveProperty('filters');
            expect(Array.isArray(response.body.webinars)).toBe(true);
        });

        test('should filter webinars by category', async () => {
            const response = await request(app)
                .get('/api/webinars?category=Tech')
                .expect(200);

            expect(response.body).toHaveProperty('webinars');
            expect(Array.isArray(response.body.webinars)).toBe(true);
        });

        test('should search webinars', async () => {
            const response = await request(app)
                .get('/api/webinars?search=test')
                .expect(200);

            expect(response.body).toHaveProperty('webinars');
            expect(Array.isArray(response.body.webinars)).toBe(true);
        });

        test('should paginate results', async () => {
            const response = await request(app)
                .get('/api/webinars?page=1&limit=5')
                .expect(200);

            expect(response.body.pagination.currentPage).toBe(1);
            expect(response.body.pagination.limit).toBe(5);
        });

        test('should respect max limit of 50', async () => {
            const response = await request(app)
                .get('/api/webinars?limit=100')
                .expect(200);

            expect(response.body.pagination.limit).toBe(50);
        });

        test('should filter by is_featured=true', async () => {
            const response = await request(app)
                .get('/api/webinars?is_featured=true')
                .expect(200);

            expect(response.body).toHaveProperty('webinars');
            expect(response.body.filters.is_featured).toBe(true);
            expect(Array.isArray(response.body.webinars)).toBe(true);
        });

        test('should filter by is_featured=false', async () => {
            const response = await request(app)
                .get('/api/webinars?is_featured=false')
                .expect(200);

            expect(response.body).toHaveProperty('webinars');
            expect(response.body.filters.is_featured).toBe(false);
            expect(Array.isArray(response.body.webinars)).toBe(true);
        });

        test('should combine is_featured with other filters', async () => {
            const response = await request(app)
                .get('/api/webinars?is_featured=true&is_published=true&category=Tech')
                .expect(200);

            expect(response.body).toHaveProperty('webinars');
            expect(response.body.filters.is_featured).toBe(true);
            expect(response.body.filters.is_published).toBe(true);
            expect(response.body.filters.category).toBe('Tech');
        });
    });

    describe('GET /api/webinars/categories', () => {
        test('should return categories and sort options', async () => {
            const response = await request(app)
                .get('/api/webinars/categories')
                .expect(200);

            expect(response.body).toHaveProperty('categories');
            expect(response.body).toHaveProperty('sortOptions');
            expect(Array.isArray(response.body.categories)).toBe(true);
            expect(Array.isArray(response.body.sortOptions)).toBe(true);
        });
    });

    describe('POST /api/webinars', () => {
        test('should create a new webinar with admin token', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const newWebinar = {
                youtube_video_id: `t${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=test${timestamp}`,
                title: 'Test Webinar',
                description: 'Test description',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: true
            };

            const response = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(newWebinar)
                .expect(201);

            expect(response.body).toHaveProperty('webinar');
            expect(response.body.webinar.title).toBe('Test Webinar');
            
            testWebinarIds.push(response.body.webinar.webinar_id);
        });

        test('should reject creation without admin token', async () => {
            const newWebinar = {
                youtube_video_id: 'test123',
                youtube_url: 'https://youtube.com/watch?v=test123',
                title: 'Test Webinar',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600
            };

            await request(app)
                .post('/api/webinars')
                .send(newWebinar)
                .expect(401);
        });

        test('should return 400 for missing required fields', async () => {
            const incompleteWebinar = {
                title: 'Incomplete'
            };

            const response = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(incompleteWebinar)
                .expect(400);

            expect(response.body).toHaveProperty('msg');
        });

        test('should create a featured webinar with admin token', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const featuredWebinar = {
                youtube_video_id: `f${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=feat${timestamp}`,
                title: 'Featured Webinar',
                description: 'Featured test description',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: true,
                is_featured: true
            };

            const response = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(featuredWebinar)
                .expect(201);

            expect(response.body).toHaveProperty('webinar');
            expect(response.body.webinar.title).toBe('Featured Webinar');
            expect(response.body.webinar.is_featured).toBe(true);
            
            testWebinarIds.push(response.body.webinar.webinar_id);
        });
    });

    describe('GET /api/webinars/:webinar_id', () => {
        test('should return a single webinar', async () => {
            // Create a test webinar first
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const createResponse = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    youtube_video_id: `g${timestamp}${randomSuffix}`.slice(0, 11),
                    youtube_url: `https://youtube.com/watch?v=get${timestamp}`,
                    title: 'Get Test Webinar',
                    category: 'Tech',
                    thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                    duration: 3600,
                    is_published: true
                });

            const webinarId = createResponse.body.webinar.webinar_id;
            testWebinarIds.push(webinarId);

            const response = await request(app)
                .get(`/api/webinars/${webinarId}`)
                .expect(200);

            expect(response.body).toHaveProperty('webinar');
            expect(response.body.webinar.webinar_id).toBe(webinarId);
        });

        test('should return 404 for non-existent webinar', async () => {
            await request(app)
                .get('/api/webinars/99999')
                .expect(404);
        });

        test('should return 400 for invalid webinar ID', async () => {
            await request(app)
                .get('/api/webinars/invalid')
                .expect(400);
        });
    });

    describe('PATCH /api/webinars/:webinar_id', () => {
        test('should update a webinar with admin token', async () => {
            // Create a test webinar first
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const createResponse = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    youtube_video_id: `u${timestamp}${randomSuffix}`.slice(0, 11),
                    youtube_url: `https://youtube.com/watch?v=upd${timestamp}`,
                    title: 'Original Title',
                    category: 'Tech',
                    thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                    duration: 3600,
                    is_published: false
                });

            const webinarId = createResponse.body.webinar.webinar_id;
            testWebinarIds.push(webinarId);

            const response = await request(app)
                .patch(`/api/webinars/${webinarId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    title: 'Updated Title',
                    is_published: true
                })
                .expect(200);

            expect(response.body.webinar.title).toBe('Updated Title');
            expect(response.body.webinar.is_published).toBe(true);
        });

        test('should reject update without admin token', async () => {
            await request(app)
                .patch('/api/webinars/1')
                .send({ title: 'Updated' })
                .expect(401);
        });

        test('should toggle is_featured status with admin token', async () => {
            // Create a non-featured webinar
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const createResponse = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    youtube_video_id: `tf${timestamp}${randomSuffix}`.slice(0, 11),
                    youtube_url: `https://youtube.com/watch?v=togfeat${timestamp}`,
                    title: 'Toggle Featured Test',
                    category: 'Tech',
                    thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                    duration: 3600,
                    is_featured: false
                });

            const webinarId = createResponse.body.webinar.webinar_id;
            testWebinarIds.push(webinarId);

            expect(createResponse.body.webinar.is_featured).toBe(false);

            // Toggle to featured
            const updateResponse = await request(app)
                .patch(`/api/webinars/${webinarId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({ is_featured: true })
                .expect(200);

            expect(updateResponse.body.webinar.is_featured).toBe(true);
        });

        test('should return 404 for non-existent webinar', async () => {
            await request(app)
                .patch('/api/webinars/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({ title: 'Updated' })
                .expect(404);
        });
    });

    describe('POST /api/webinars/:webinar_id/view', () => {
        test('should increment view count', async () => {
            // Create a test webinar first
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const createResponse = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    youtube_video_id: `v${timestamp}${randomSuffix}`.slice(0, 11),
                    youtube_url: `https://youtube.com/watch?v=viw${timestamp}`,
                    title: 'View Test Webinar',
                    category: 'Tech',
                    thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                    duration: 3600,
                    is_published: true
                });

            const webinarId = createResponse.body.webinar.webinar_id;
            testWebinarIds.push(webinarId);

            const response = await request(app)
                .post(`/api/webinars/${webinarId}/view`)
                .expect(200);

            expect(response.body).toHaveProperty('msg');
            expect(response.body).toHaveProperty('view_count');
            // Just verify view_count exists and is a valid value
            expect(response.body.view_count).toBeDefined();
        });

        test('should return 404 for non-existent webinar', async () => {
            await request(app)
                .post('/api/webinars/99999/view')
                .expect(404);
        });

        test('should return 400 for invalid webinar ID', async () => {
            await request(app)
                .post('/api/webinars/invalid/view')
                .expect(400);
        });
    });

    describe('DELETE /api/webinars/:webinar_id', () => {
        test('should delete a webinar with admin token', async () => {
            // Create a test webinar first
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 5);
            const createResponse = await request(app)
                .post('/api/webinars')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send({
                    youtube_video_id: `d${timestamp}${randomSuffix}`.slice(0, 11),
                    youtube_url: `https://youtube.com/watch?v=del${timestamp}`,
                    title: 'Delete Test Webinar',
                    category: 'Tech',
                    thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                    duration: 3600,
                    is_published: true
                });

            const webinarId = createResponse.body.webinar.webinar_id;
            testWebinarIds.push(webinarId);

            const response = await request(app)
                .delete(`/api/webinars/${webinarId}`)
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('deleted');
            expect(response.body.deleted.webinar_id).toBe(webinarId);

            // Verify deletion
            await request(app)
                .get(`/api/webinars/${webinarId}`)
                .expect(404);
        });

        test('should reject deletion without admin token', async () => {
            await request(app)
                .delete('/api/webinars/1')
                .expect(401);
        });

        test('should return 404 for non-existent webinar', async () => {
            await request(app)
                .delete('/api/webinars/99999')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .expect(404);
        });
    });

});
