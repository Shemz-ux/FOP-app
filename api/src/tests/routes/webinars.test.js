import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../utils/setup.js';
import { setupAdminAuth, cleanupTestAdmin } from '../helpers/authHelper.js';

// Real YouTube video IDs for testing (public, unlisted videos)
const TEST_VIDEOS = {
  valid: 'dQw4w9WgXcQ',      // Rick Astley - Never Gonna Give You Up
  valid2: 'jNQXAC9IVRw',     // Me at the zoo
  valid3: '9bZkp7q19f0',     // PSY - GANGNAM STYLE
  notFound: 'notfound1111',  // Invalid video ID
};

describe('Webinars API Endpoints', () => {
  let testWebinarIds = [];
  let adminToken;
  let adminId;
  
  beforeAll(async () => {
    // Setup admin authentication
    const auth = await setupAdminAuth();
    adminToken = auth.token;
    adminId = auth.adminId;
    
    // Clean up any leftover test data
    await db.query(`DELETE FROM webinars WHERE youtube_video_id IN ($1, $2, $3)`, 
      [TEST_VIDEOS.valid, TEST_VIDEOS.valid2, TEST_VIDEOS.valid3]);
  });
  
  beforeEach(async () => {
    testWebinarIds = [];
    // Clean up between tests to avoid conflicts
    await db.query(`DELETE FROM webinars WHERE youtube_video_id IN ($1, $2, $3)`, 
      [TEST_VIDEOS.valid, TEST_VIDEOS.valid2, TEST_VIDEOS.valid3]);
  });
  
  afterAll(async () => {
    // Clean up test data
    for (const id of testWebinarIds) {
      await db.query('DELETE FROM webinars WHERE webinar_id = $1', [id]);
    }
    await db.query(`DELETE FROM webinars WHERE youtube_video_id IN ($1, $2, $3)`, 
      [TEST_VIDEOS.valid, TEST_VIDEOS.valid2, TEST_VIDEOS.valid3]);
    
    // Clean up test admin user
    await cleanupTestAdmin(adminId);
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
    });
  });

  describe('GET /api/webinars/categories', () => {
    
    test('should return available categories', async () => {
      const response = await request(app)
        .get('/api/webinars/categories')
        .expect(200);

      expect(response.body).toHaveProperty('categories');
      expect(response.body).toHaveProperty('sortOptions');
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(Array.isArray(response.body.sortOptions)).toBe(true);
    });
  });

  describe('GET /api/webinars/:webinar_id', () => {
    
    test('should return a single webinar', async () => {
      // Create a test webinar first
      const createResponse = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'Get Test Webinar',
          category: 'Technology'
        })
        .expect(201);
      
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

    test('should return 400 for invalid ID', async () => {
      await request(app)
        .get('/api/webinars/invalid')
        .expect(400);
    });
  });

  describe('POST /api/webinars', () => {
    
    test('should create webinar from valid YouTube URL', async () => {
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid2}`,
          title: 'Test Webinar',
          description: 'Test description',
          category: 'Technology'
        })
        .expect(201);

      expect(response.body).toHaveProperty('webinar');
      expect(response.body.webinar.title).toBe('Test Webinar');
      expect(response.body.webinar.youtube_video_id).toBe(TEST_VIDEOS.valid2);
      expect(response.body.webinar).toHaveProperty('thumbnail_url');
      expect(response.body.webinar).toHaveProperty('duration');
      expect(response.body.webinar.is_published).toBe(false);
      
      testWebinarIds.push(response.body.webinar.webinar_id);
    });

    test('should create published webinar when is_published is true', async () => {
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://youtu.be/${TEST_VIDEOS.valid3}`,
          title: 'Published Webinar',
          category: 'Business',
          is_published: true
        })
        .expect(201);

      expect(response.body.webinar.is_published).toBe(true);
      testWebinarIds.push(response.body.webinar.webinar_id);
    });

    test('should return 400 for invalid YouTube URL', async () => {
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: 'https://example.com/not-youtube',
          title: 'Test',
          category: 'Tech'
        })
        .expect(400);

      expect(response.body.msg).toContain('Invalid YouTube URL');
      expect(response.body.field).toBe('youtube_url');
    });

    test('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          category: 'Tech'
        })
        .expect(400);

      expect(response.body.msg).toContain('Title is required');
      expect(response.body.field).toBe('title');
    });

    test('should return 400 for missing category', async () => {
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'Test'
        })
        .expect(400);

      expect(response.body.msg).toContain('Category is required');
      expect(response.body.field).toBe('category');
    });

    test('should return 400 for video not found', async () => {
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.notFound}`,
          title: 'Test',
          category: 'Tech'
        })
        .expect(400);

      expect(response.body.msg).toContain('Video not found or is set to private');
    });

    test('should return 409 for duplicate video', async () => {
      // Create first webinar
      const first = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'First',
          category: 'Tech'
        })
        .expect(201);
      
      testWebinarIds.push(first.body.webinar.webinar_id);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'Duplicate',
          category: 'Tech'
        })
        .expect(409);

      expect(response.body.msg).toContain('already been added');
    });

    test('should return 401 without admin token', async () => {
      await request(app)
        .post('/api/webinars')
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'Test',
          category: 'Tech'
        })
        .expect(401);
    });
  });

  describe('PATCH /api/webinars/:webinar_id', () => {
    
    let webinarId;

    beforeEach(async () => {
      // Create a test webinar
      const response = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid2}`,
          title: 'Update Test',
          category: 'Tech'
        })
        .expect(201);
      
      webinarId = response.body.webinar.webinar_id;
      testWebinarIds.push(webinarId);
    });

    test('should update webinar title', async () => {
      const response = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Title'
        })
        .expect(200);

      expect(response.body.webinar.title).toBe('Updated Title');
    });

    test('should update webinar description', async () => {
      const response = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Updated description'
        })
        .expect(200);

      expect(response.body.webinar.description).toBe('Updated description');
    });

    test('should update is_published status', async () => {
      const response = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          is_published: true
        })
        .expect(200);

      expect(response.body.webinar.is_published).toBe(true);
      expect(response.body.msg).toContain('Status updated');
    });

    test('should update is_featured status', async () => {
      const response = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          is_featured: true
        })
        .expect(200);

      expect(response.body.webinar.is_featured).toBe(true);
    });

    test('should resync metadata from YouTube', async () => {
      const response = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          action: 'resync'
        })
        .expect(200);

      expect(response.body.msg).toContain('Metadata resynced');
      expect(response.body.webinar).toHaveProperty('metadata_synced_at');
    });

    test('should return 404 for non-existent webinar', async () => {
      await request(app)
        .patch('/api/webinars/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test'
        })
        .expect(404);
    });

    test('should return 400 for invalid webinar ID', async () => {
      await request(app)
        .patch('/api/webinars/invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test'
        })
        .expect(400);
    });

    test('should return 401 without admin token', async () => {
      await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .send({
          title: 'Test'
        })
        .expect(401);
    });
  });

  describe('POST /api/webinars/:webinar_id/view', () => {
    
    test('should increment view count', async () => {
      // Create a test webinar
      const createResponse = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid3}`,
          title: 'View Test',
          category: 'Tech'
        })
        .expect(201);
      
      const webinarId = createResponse.body.webinar.webinar_id;
      testWebinarIds.push(webinarId);

      const initialViewCount = createResponse.body.webinar.view_count;

      const response = await request(app)
        .post(`/api/webinars/${webinarId}/view`)
        .expect(200);

      expect(response.body.view_count).toBe(initialViewCount + 1);
    });

    test('should return 404 for non-existent webinar', async () => {
      await request(app)
        .post('/api/webinars/99999/view')
        .expect(404);
    });
  });

  describe('DELETE /api/webinars/:webinar_id', () => {
    
    test('should delete webinar', async () => {
      // Create a webinar to delete
      const createResponse = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'Delete Test',
          category: 'Tech'
        })
        .expect(201);
      
      const webinarId = createResponse.body.webinar.webinar_id;

      // Delete it
      const response = await request(app)
        .delete(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.msg).toContain('deleted successfully');
      expect(response.body.deleted.webinar_id).toBe(webinarId);

      // Verify it's deleted
      await request(app)
        .get(`/api/webinars/${webinarId}`)
        .expect(404);
    });

    test('should return 404 for non-existent webinar', async () => {
      await request(app)
        .delete('/api/webinars/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    test('should return 401 without admin token', async () => {
      await request(app)
        .delete('/api/webinars/1')
        .expect(401);
    });
  });

  describe('Full Workflow - Create, Update, Delete', () => {
    
    test('should complete full webinar lifecycle', async () => {
      // 1. Create webinar
      const createResponse = await request(app)
        .post('/api/webinars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          youtube_url: `https://www.youtube.com/watch?v=${TEST_VIDEOS.valid}`,
          title: 'Lifecycle Test',
          description: 'Initial description',
          category: 'Technology',
          is_published: false,
          is_featured: false
        })
        .expect(201);

      const webinarId = createResponse.body.webinar.webinar_id;
      expect(createResponse.body.webinar.title).toBe('Lifecycle Test');
      expect(createResponse.body.webinar.is_published).toBe(false);

      // 2. Update title and description
      const updateResponse = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Lifecycle Test',
          description: 'Updated description'
        })
        .expect(200);

      expect(updateResponse.body.webinar.title).toBe('Updated Lifecycle Test');
      expect(updateResponse.body.webinar.description).toBe('Updated description');

      // 3. Publish the webinar
      const publishResponse = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          is_published: true
        })
        .expect(200);

      expect(publishResponse.body.webinar.is_published).toBe(true);

      // 4. Mark as featured
      const featureResponse = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          is_featured: true
        })
        .expect(200);

      expect(featureResponse.body.webinar.is_featured).toBe(true);

      // 5. Resync metadata
      const resyncResponse = await request(app)
        .patch(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          action: 'resync'
        })
        .expect(200);

      expect(resyncResponse.body.msg).toContain('Metadata resynced');

      // 6. Verify it's visible in public list
      const listResponse = await request(app)
        .get('/api/webinars?is_published=true')
        .expect(200);

      const foundWebinar = listResponse.body.webinars.find(w => w.webinar_id === webinarId);
      expect(foundWebinar).toBeDefined();
      expect(foundWebinar.is_published).toBe(true);
      expect(foundWebinar.is_featured).toBe(true);

      // 7. Delete the webinar
      const deleteResponse = await request(app)
        .delete(`/api/webinars/${webinarId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(deleteResponse.body.msg).toContain('deleted successfully');

      // 8. Verify it's gone
      await request(app)
        .get(`/api/webinars/${webinarId}`)
        .expect(404);
    });
  });
});
