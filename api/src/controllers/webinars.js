import {
    fetchAllWebinars,
    fetchWebinarById,
    createWebinar,
    updateWebinar,
    deleteWebinar,
    incrementViewCount,
    getWebinarsCount,
    getWebinarCategories
} from '../models/webinars.js';

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

// Create new webinar (admin only - add auth middleware to route)
// Optional fields: description, published_at, view_count, like_count, metadata_synced_at, is_published, is_featured
export const postWebinar = async (req, res) => {
    try {
        const webinarData = req.body;
        
        // Validate required fields
        const requiredFields = ['youtube_video_id', 'youtube_url', 'title', 'category', 'thumbnail_url', 'duration'];
        const missingFields = requiredFields.filter(field => !webinarData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                msg: 'Missing required fields',
                missing: missingFields 
            });
        }
        
        // Set uploaded_by from authenticated user if available
        if (req.user && req.user.admin_id) {
            webinarData.uploaded_by = req.user.admin_id;
        }
        
        const newWebinar = await createWebinar(webinarData);
        
        res.status(201).json({ 
            msg: 'Webinar created successfully',
            webinar: newWebinar 
        });
    } catch (error) {
        console.error('Create webinar error:', error);
        
        // Handle duplicate youtube_video_id
        if (error.code === '23505') {
            return res.status(409).json({ 
                msg: 'Webinar with this YouTube video ID already exists' 
            });
        }
        
        res.status(500).json({ 
            msg: 'Failed to create webinar',
            error: error.message 
        });
    }
};

// Update webinar (admin only)
// Updatable fields: title, description, category, thumbnail_url, duration, published_at, view_count, like_count, is_published, is_featured
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
        
        const updatedWebinar = await updateWebinar(updates, webinar_id);
        
        res.status(200).json({ 
            msg: 'Webinar updated successfully',
            webinar: updatedWebinar 
        });
    } catch (error) {
        console.error('Update webinar error:', error);
        
        if (error.status === 404) {
            return res.status(404).json({ msg: error.msg });
        }
        
        if (error.status === 400) {
            return res.status(400).json({ msg: error.msg });
        }
        
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
        
        // Get webinar details before deletion (for logging/audit)
        const webinar = await fetchWebinarById(webinar_id);
        
        if (!webinar) {
            return res.status(404).json({ msg: 'Webinar not found' });
        }
        
        await deleteWebinar(webinar_id);
        
        res.status(200).json({ 
            msg: 'Webinar deleted successfully',
            deleted: {
                webinar_id: webinar.webinar_id,
                title: webinar.title,
                youtube_video_id: webinar.youtube_video_id
            }
        });
    } catch (error) {
        console.error('Delete webinar error:', error);
        
        if (error.status === 404) {
            return res.status(404).json({ msg: error.msg });
        }
        
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
