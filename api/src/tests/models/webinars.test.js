import {
    fetchAllWebinars,
    fetchWebinarById,
    createWebinar,
    updateWebinar,
    deleteWebinar,
    incrementViewCount,
    getWebinarsCount,
    getWebinarCategories
} from '../../models/webinars.js';
import db from '../../db/db.js';
import '../utils/setup.js';

describe('Webinars Model', () => {
    let testWebinarIds = [];

    // Clean up before tests start
    beforeAll(async () => {
        try {
            // Clean up any leftover test data from previous runs
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['c%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['m%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['f%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['b%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['u%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['n%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['v%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['d%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['t%']);
        } catch (error) {
            console.log('Pre-cleanup error:', error.message);
        }
    });

    afterAll(async () => {
        // Clean up test data
        try {
            for (const id of testWebinarIds) {
                await db.query('DELETE FROM webinars WHERE webinar_id = $1', [id]);
            }
            // Also clean by pattern as backup
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['c%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['m%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['f%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['b%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['u%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['n%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['v%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['d%']);
            await db.query('DELETE FROM webinars WHERE youtube_video_id LIKE $1', ['t%']);
        } catch (error) {
            console.log('Cleanup error:', error.message);
        }
    });

    describe('fetchAllWebinars', () => {
        test('should fetch all webinars', async () => {
            const webinars = await fetchAllWebinars();
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should filter by category', async () => {
            const webinars = await fetchAllWebinars({ category: 'Tech' });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should filter by is_published', async () => {
            const webinars = await fetchAllWebinars({ is_published: true });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should filter by is_featured', async () => {
            const webinars = await fetchAllWebinars({ is_featured: true });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should filter by is_featured=false', async () => {
            const webinars = await fetchAllWebinars({ is_featured: false });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should combine is_featured with other filters', async () => {
            const webinars = await fetchAllWebinars({ 
                is_featured: true, 
                is_published: true,
                category: 'Tech'
            });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should search by keyword', async () => {
            const webinars = await fetchAllWebinars({ search: 'test' });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should sort by newest', async () => {
            const webinars = await fetchAllWebinars({ sort: 'newest' });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should sort by popular', async () => {
            const webinars = await fetchAllWebinars({ sort: 'popular' });
            
            expect(Array.isArray(webinars)).toBe(true);
        });

        test('should paginate results', async () => {
            const webinars = await fetchAllWebinars({ limit: 5, offset: 0 });
            
            expect(Array.isArray(webinars)).toBe(true);
            expect(webinars.length).toBeLessThanOrEqual(5);
        });
    });

    describe('createWebinar', () => {
        test('should create a new webinar', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `c${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=crt${timestamp}`,
                title: 'Model Test Webinar',
                description: 'Test description',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: true
            };

            const created = await createWebinar(newWebinar);
            testWebinarIds.push(created.webinar_id);

            expect(created).toHaveProperty('webinar_id');
            expect(created.title).toBe('Model Test Webinar');
            expect(created.youtube_video_id).toBe(newWebinar.youtube_video_id);
        });

        test('should handle optional fields', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const minimalWebinar = {
                youtube_video_id: `m${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=min${timestamp}`,
                title: 'Minimal Webinar',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600
            };

            const created = await createWebinar(minimalWebinar);
            testWebinarIds.push(created.webinar_id);

            expect(created).toHaveProperty('webinar_id');
            expect(created.title).toBe('Minimal Webinar');
        });

        test('should create a featured webinar', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const featuredWebinar = {
                youtube_video_id: `f${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=feat${timestamp}`,
                title: 'Featured Webinar',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: true,
                is_featured: true
            };

            const created = await createWebinar(featuredWebinar);
            testWebinarIds.push(created.webinar_id);

            expect(created).toHaveProperty('webinar_id');
            expect(created.title).toBe('Featured Webinar');
            expect(created.is_featured).toBe(true);
        });
    });

    describe('fetchWebinarById', () => {
        test('should fetch a webinar by ID', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `b${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=byid${timestamp}`,
                title: 'Fetch By ID Test',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: true
            };

            const created = await createWebinar(newWebinar);
            testWebinarIds.push(created.webinar_id);

            const fetched = await fetchWebinarById(created.webinar_id);

            expect(fetched).toBeDefined();
            expect(fetched.webinar_id).toBe(created.webinar_id);
            expect(fetched.title).toBe('Fetch By ID Test');
        });

        test('should return undefined for non-existent ID', async () => {
            const webinar = await fetchWebinarById(99999);
            expect(webinar).toBeUndefined();
        });
    });

    describe('updateWebinar', () => {
        test('should update webinar fields', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `u${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=upd${timestamp}`,
                title: 'Original Title',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: false
            };

            const created = await createWebinar(newWebinar);
            testWebinarIds.push(created.webinar_id);

            const updates = {
                title: 'Updated Title',
                is_published: true
            };

            const updated = await updateWebinar(updates, created.webinar_id);

            expect(updated.title).toBe('Updated Title');
            expect(updated.is_published).toBe(true);
        });

        test('should toggle is_featured status', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `t${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=tog${timestamp}`,
                title: 'Toggle Featured Test',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_featured: false
            };

            const created = await createWebinar(newWebinar);
            testWebinarIds.push(created.webinar_id);

            expect(created.is_featured).toBe(false);

            // Toggle to featured
            const updated = await updateWebinar({ is_featured: true }, created.webinar_id);
            expect(updated.is_featured).toBe(true);

            // Toggle back to non-featured
            const updatedAgain = await updateWebinar({ is_featured: false }, created.webinar_id);
            expect(updatedAgain.is_featured).toBe(false);
        });

        test('should throw error for non-existent webinar', async () => {
            await expect(
                updateWebinar({ title: 'Updated' }, 99999)
            ).rejects.toMatchObject({
                status: 404,
                msg: 'Webinar not found'
            });
        });

        test('should throw error for no update fields', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `n${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=nof${timestamp}`,
                title: 'No Fields Test',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600
            };

            const created = await createWebinar(newWebinar);
            testWebinarIds.push(created.webinar_id);

            await expect(
                updateWebinar({}, created.webinar_id)
            ).rejects.toMatchObject({
                status: 400
            });
        });
    });

    describe('incrementViewCount', () => {
        test('should increment view count', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `v${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=viw${timestamp}`,
                title: 'View Count Test',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                view_count: 100,
                is_published: true
            };

            const created = await createWebinar(newWebinar);
            testWebinarIds.push(created.webinar_id);

            const updated = await incrementViewCount(created.webinar_id);

            expect(updated.view_count).toBe(101);
        });

        test('should return undefined for non-existent webinar', async () => {
            const result = await incrementViewCount(99999);
            expect(result).toBeUndefined();
        });
    });

    describe('deleteWebinar', () => {
        test('should delete a webinar', async () => {
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const newWebinar = {
                youtube_video_id: `d${timestamp}${randomSuffix}`.slice(0, 11),
                youtube_url: `https://youtube.com/watch?v=del${timestamp}`,
                title: 'Delete Test',
                category: 'Tech',
                thumbnail_url: 'https://img.youtube.com/vi/test/0.jpg',
                duration: 3600,
                is_published: true
            };

            const created = await createWebinar(newWebinar);
            const webinarId = created.webinar_id;

            const deleted = await deleteWebinar(webinarId);

            expect(deleted).toBeDefined();
            expect(deleted.webinar_id).toBe(webinarId);

            // Verify deletion
            const fetched = await fetchWebinarById(webinarId);
            expect(fetched).toBeUndefined();
        });

        test('should throw error for non-existent webinar', async () => {
            await expect(
                deleteWebinar(99999)
            ).rejects.toMatchObject({
                status: 404,
                msg: 'Webinar not found'
            });
        });
    });

    describe('getWebinarsCount', () => {
        test('should return count of webinars', async () => {
            const count = await getWebinarsCount();
            
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should count with filters', async () => {
            const count = await getWebinarsCount({ category: 'Tech' });
            
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    describe('getWebinarCategories', () => {
        test('should return unique categories', async () => {
            const categories = await getWebinarCategories();
            
            expect(Array.isArray(categories)).toBe(true);
        });
    });
});
