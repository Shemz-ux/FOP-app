import {
    fetchAllWebinars,
    fetchWebinarById,
    updateWebinar as updateWebinarModel,
    incrementViewCount,
    getWebinarsCount,
    getWebinarCategories
} from '../models/webinars.js';

// Import webinar service for business logic
import {
    createFromURL,
    resyncMetadata,
    updateStatus,
    deleteWebinar as deleteWebinarService,
    ValidationError,
    DuplicateError,
    NotFoundError
} from '../services/webinarService.js';

// Import YouTube service errors
import { YouTubeAPIError } from '../services/youtubeService.js';

// Get all webinars with server-side filtering, search, sorting, and pagination
export const getWebinars = async (req, res) => {
    try {
        const {
            search,
            category,
            is_published,
            is_featured,
            sort = 'newest',
            page = 1,
            limit = 12
        } = req.query;
        
        // Validate and sanitize inputs
        const parsedLimit = Math.min(parseInt(limit) || 12, 50); // Max 50 per page
        const parsedPage = Math.max(parseInt(page) || 1, 1);
        const offset = (parsedPage - 1) * parsedLimit;
        
        const filters = {
            search,
            category,
            is_published: is_published === 'true' ? true : is_published === 'false' ? false : undefined,
            is_featured: is_featured === 'true' ? true : is_featured === 'false' ? false : undefined,
            sort,
            limit: parsedLimit,
            offset
        };
        
        // Get webinars and total count in parallel
        const [webinars, totalCount] = await Promise.all([
            fetchAllWebinars(filters),
            getWebinarsCount(filters)
        ]);
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / parsedLimit);
        
        res.status(200).json({ 
            webinars,
            pagination: {
                currentPage: parsedPage,
                totalPages,
                totalCount,
                limit: parsedLimit,
                hasNextPage: parsedPage < totalPages,
                hasPrevPage: parsedPage > 1
            },
            filters: {
                search,
                category,
                is_published: filters.is_published,
                is_featured: filters.is_featured,
                sort
            }
        });
    } catch (error) {
        console.error('Get webinars error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch webinars',
            error: error.message 
        });
    }
};

// Get available categories for filter dropdown
export const getCategories = async (req, res) => {
    try {
        const categories = await getWebinarCategories();
        
        res.status(200).json({ 
            categories,
            sortOptions: [
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'title', label: 'Title A-Z' }
            ]
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch categories',
            error: error.message 
        });
    }
};

// Get single webinar by ID
export const getWebinar = async (req, res) => {
    try {
        const { webinar_id } = req.params;
        
        if (!webinar_id || isNaN(webinar_id)) {
            return res.status(400).json({ msg: 'Invalid webinar ID' });
        }
        
        const webinar = await fetchWebinarById(webinar_id);
        
        if (!webinar) {
            return res.status(404).json({ msg: 'Webinar not found' });
        }
        
        res.status(200).json({ webinar });
    } catch (error) {
        console.error('Get webinar error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch webinar',
            error: error.message 
        });
    }
};

// Create new webinar from YouTube URL (admin only)
// Required: youtube_url, title, category
// Optional: description, is_published, is_featured
export const postWebinar = async (req, res) => {
    try {
        const { youtube_url, title, description, category, is_published, is_featured } = req.body;
        
        // Get admin ID from authenticated user (set by adminChecker middleware)
        const adminId = req.user_id;
        if (!adminId) {
            return res.status(401).json({ msg: 'Authentication required' });
        }
        
        // Create webinar using service layer
        const webinar = await createFromURL(
            youtube_url,
            adminId,
            {
                title,
                description,
                category,
                is_published,
                is_featured
            }
        );
        
        res.status(201).json({ 
            msg: 'Webinar created successfully',
            webinar 
        });
        
    } catch (error) {
        // Handle validation errors (user-facing)
        if (error instanceof ValidationError) {
            return res.status(error.statusCode).json({
                msg: error.message,
                field: error.field
            });
        }
        
        // Handle duplicate video
        if (error instanceof DuplicateError) {
            return res.status(error.statusCode).json({
                msg: error.message,
                field: error.field
            });
        }
        
        // Handle YouTube API errors
        if (error instanceof YouTubeAPIError) {
            console.error('YouTube API error:', error);
            return res.status(502).json({
                msg: 'Failed to fetch video metadata from YouTube. Please try again later.'
            });
        }
        
        // Handle unexpected errors
        console.error('Create webinar error:', error);
        res.status(500).json({ 
            msg: 'Failed to create webinar',
            error: error.message 
        });
    }
};

// Update webinar (admin only)
// Supports two modes:
// 1. Resync metadata from YouTube: { action: 'resync' }
// 2. Update status: { is_published: true/false }
// 3. Update other fields: { title, description, category, is_featured, etc. }
export const patchWebinar = async (req, res) => {
    try {
        const { webinar_id } = req.params;
        const updates = req.body;
        
        if (!webinar_id || isNaN(webinar_id)) {
            return res.status(400).json({ msg: 'Invalid webinar ID' });
        }
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ msg: 'No update fields provided' });
        }
        
        let updatedWebinar;
        
        // Handle resync action (re-fetch metadata from YouTube)
        if (updates.action === 'resync') {
            updatedWebinar = await resyncMetadata(webinar_id);
            return res.status(200).json({ 
                msg: 'Metadata resynced successfully',
                webinar: updatedWebinar 
            });
        }
        
        // Handle status update (publish/unpublish)
        if ('is_published' in updates && Object.keys(updates).length === 1) {
            updatedWebinar = await updateStatus(webinar_id, updates.is_published);
            return res.status(200).json({ 
                msg: 'Status updated successfully',
                webinar: updatedWebinar 
            });
        }
        
        // Handle regular field updates (title, description, category, etc.)
        updatedWebinar = await updateWebinarModel(updates, webinar_id);
        
        res.status(200).json({ 
            msg: 'Webinar updated successfully',
            webinar: updatedWebinar 
        });
        
    } catch (error) {
        // Handle not found errors
        if (error instanceof NotFoundError) {
            return res.status(error.statusCode).json({ msg: error.message });
        }
        
        // Handle validation errors
        if (error instanceof ValidationError) {
            return res.status(error.statusCode).json({
                msg: error.message,
                field: error.field
            });
        }
        
        // Handle YouTube API errors (for resync)
        if (error instanceof YouTubeAPIError) {
            console.error('YouTube API error:', error);
            return res.status(502).json({
                msg: 'Failed to fetch video metadata from YouTube'
            });
        }
        
        // Handle model-level errors
        if (error.status === 404) {
            return res.status(404).json({ msg: error.msg });
        }
        
        if (error.status === 400) {
            return res.status(400).json({ msg: error.msg });
        }
        
        console.error('Update webinar error:', error);
        res.status(500).json({ 
            msg: 'Failed to update webinar',
            error: error.message 
        });
    }
};

// Delete webinar (admin only)
export const removeWebinar = async (req, res) => {
    try {
        const { webinar_id } = req.params;
        
        if (!webinar_id || isNaN(webinar_id)) {
            return res.status(400).json({ msg: 'Invalid webinar ID' });
        }
        
        // Delete using service layer
        const deletedWebinar = await deleteWebinarService(webinar_id);
        
        res.status(200).json({ 
            msg: 'Webinar deleted successfully',
            deleted: {
                webinar_id: deletedWebinar.webinar_id,
                title: deletedWebinar.title,
                youtube_video_id: deletedWebinar.youtube_video_id
            }
        });
        
    } catch (error) {
        // Handle not found errors
        if (error instanceof NotFoundError) {
            return res.status(error.statusCode).json({ msg: error.message });
        }
        
        // Handle model-level errors
        if (error.status === 404) {
            return res.status(404).json({ msg: error.msg });
        }
        
        console.error('Delete webinar error:', error);
        res.status(500).json({ 
            msg: 'Failed to delete webinar',
            error: error.message 
        });
    }
};

// Increment view count (called when user watches video)
export const trackView = async (req, res) => {
    try {
        const { webinar_id } = req.params;
        
        if (!webinar_id || isNaN(webinar_id)) {
            return res.status(400).json({ msg: 'Invalid webinar ID' });
        }
        
        const updatedWebinar = await incrementViewCount(webinar_id);
        
        if (!updatedWebinar) {
            return res.status(404).json({ msg: 'Webinar not found' });
        }
        
        res.status(200).json({ 
            msg: 'View tracked',
            view_count: updatedWebinar.view_count 
        });
    } catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({ 
            msg: 'Failed to track view',
            error: error.message 
        });
    }
};
