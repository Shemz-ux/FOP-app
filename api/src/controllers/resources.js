import multer from 'multer';
import {
    createResource,
    fetchResources,
    fetchResourceById,
    updateResource,
    deleteResource,
    incrementDownloadCount,
    fetchResourceCategories,
    fetchResourceStats
} from '../models/resources.js';
import {
    uploadFile,
    generateDownloadUrl,
    deleteFile,
    validateFileType,
    validateFileSize,
    getFileStream
} from '../lib/r2Storage.js';

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Configure multer for file uploads (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 1 // Only one file at a time
    },
    fileFilter: (req, file, cb) => {
        if (validateFileType(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, TXT, and RTF files are allowed.'));
        }
    }
});

// Get all resources with filtering and pagination
const getResources = async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            search: req.query.search,
            file_type: req.query.file_type,
            sort_by: req.query.sort_by,
            sort_order: req.query.sort_order,
            page: req.query.page || 1,
            limit: req.query.limit || 20,
            include_inactive: req.query.include_inactive === 'true'
        };

        const result = await fetchResources(filters);

        res.status(200).json({
            resources: result.resources,
            pagination: {
                page: parseInt(filters.page),
                limit: parseInt(filters.limit),
                total: result.resources.length,
                totalCount: result.totalCount
            }
        });
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch resources',
            error: error.message 
        });
    }
};

// Get single resource by ID
const getResourceById = async (req, res) => {
    try {
        const { resource_id } = req.params;

        if (!resource_id || isNaN(resource_id)) {
            return res.status(400).json({ msg: 'Invalid resource ID' });
        }

        const resource = await fetchResourceById(resource_id);

        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        res.status(200).json({ resource });
    } catch (error) {
        console.error('Get resource by ID error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch resource',
            error: error.message 
        });
    }
};

// Create new resource with file upload or video link
const postResource = async (req, res) => {
    try {
        const { title, description, detailed_description, whats_included, category, uploaded_by, upload_type, video_link } = req.body;
        const file = req.file;

        // Validate required fields
        if (!title || !category) {
            return res.status(400).json({ 
                msg: 'Title and category are required' 
            });
        }

        // Check if it's a video link or file upload (prioritize file presence)
        if (file) {
            // Handle file upload

            // Validate file size
            if (!validateFileSize(file.size)) {
                return res.status(400).json({ 
                    msg: 'File size exceeds 50MB limit' 
                });
            }

            // Upload file to R2
            const uploadResult = await uploadFile(
                file.buffer,
                file.originalname,
                file.mimetype,
                category
            );

            // Create resource record in database
            const resourceData = {
                title,
                description: description || null,
                detailed_description: detailed_description || null,
                whats_included: whats_included || null,
                category,
                file_name: file.originalname,
                file_size: formatFileSize(file.size),
                file_type: file.mimetype,
                storage_key: uploadResult.storageKey,
                storage_url: uploadResult.publicUrl,
                created_by: uploaded_by || 'FOP',  // Company/person name
                uploaded_by: req.user_id || null    // Admin user ID
            };

            const newResource = await createResource(resourceData);

            return res.status(201).json({
                msg: 'Resource created successfully',
                resource: newResource
            });
        } else if (upload_type === 'link') {
            // Handle video link resource
            if (!video_link) {
                return res.status(400).json({ 
                    msg: 'Video link is required for link type resources' 
                });
            }

            const resourceData = {
                title,
                description: description || null,
                detailed_description: detailed_description || null,
                whats_included: whats_included || null,
                category,
                file_name: 'Video Link',
                file_size: 'N/A',
                file_type: 'video/link',
                storage_key: video_link,
                storage_url: video_link,
                created_by: uploaded_by || 'FOP',  // Company/person name
                uploaded_by: req.user_id || null    // Admin user ID
            };

            const newResource = await createResource(resourceData);

            return res.status(201).json({
                msg: 'Video resource created successfully',
                resource: newResource
            });
        } else {
            return res.status(400).json({ 
                msg: 'Either a file or video link is required' 
            });
        }
    } catch (error) {
        console.error('Create resource error:', error);
        
        // Check for duplicate storage_key (unique constraint violation)
        if (error.code === '23505' && error.constraint === 'resources_storage_key_key') {
            return res.status(400).json({ 
                msg: 'This file or video has already been uploaded. Please upload a different resource or update the existing one.',
                error: 'Duplicate resource'
            });
        }
        
        res.status(500).json({ 
            msg: 'Failed to create resource',
            error: error.message 
        });
    }
};

// Update resource metadata (not the file)
const patchResource = async (req, res) => {
    try {
        const { resource_id } = req.params;
        const updateData = req.body;

        if (!resource_id || isNaN(resource_id)) {
            return res.status(400).json({ msg: 'Invalid resource ID' });
        }

        // Check if resource exists
        const existingResource = await fetchResourceById(resource_id);
        if (!existingResource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Validate update fields
        const allowedFields = [
            'title', 
            'description', 
            'detailed_description',
            'whats_included',
            'category', 
            'uploaded_by',  // Maps to created_by in DB (company/person name)
            'upload_type',
            'video_link',
            'is_active'
        ];
        const invalidFields = Object.keys(updateData).filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({ 
                msg: 'Invalid field provided',
                invalidFields 
            });
        }

        const updatedResource = await updateResource(resource_id, updateData);

        if (!updatedResource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        res.status(200).json({
            msg: 'Resource updated successfully',
            resource: updatedResource
        });
    } catch (error) {
        console.error('Update resource error:', error);
        res.status(500).json({ 
            msg: 'Failed to update resource',
            error: error.message 
        });
    }
};

// Delete resource (soft delete + remove from R2)
const deleteResourceById = async (req, res) => {
    try {
        const { resource_id } = req.params;

        if (!resource_id || isNaN(resource_id)) {
            return res.status(400).json({ msg: 'Invalid resource ID' });
        }

        // Get resource details before deletion
        const resource = await fetchResourceById(resource_id);
        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Soft delete from database
        const deletedResource = await deleteResource(resource_id);

        if (!deletedResource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Delete file from R2 storage only if it's not a video link
        if (resource.file_type !== 'video/link' && resource.storage_key && !resource.storage_key.includes('youtube.com') && !resource.storage_key.includes('vimeo.com')) {
            try {
                await deleteFile(resource.storage_key);
            } catch (r2Error) {
                console.error('R2 deletion error:', r2Error);
                // Continue even if R2 deletion fails - resource is already soft deleted
                // This is expected if Cloudflare R2 is not configured
            }
        }

        res.status(200).json({
            msg: 'Resource deleted successfully'
        });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ 
            msg: 'Failed to delete resource',
            error: error.message 
        });
    }
};

// Toggle resource active status
const toggleResourceActive = async (req, res) => {
    try {
        const { resource_id } = req.params;

        if (!resource_id || isNaN(resource_id)) {
            return res.status(400).json({ msg: 'Invalid resource ID' });
        }

        // Get current resource
        const resource = await fetchResourceById(resource_id);
        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Toggle the is_active status
        const updatedResource = await updateResource(resource_id, {
            is_active: !resource.is_active
        });

        res.status(200).json({
            msg: `Resource ${updatedResource.is_active ? 'activated' : 'deactivated'} successfully`,
            resource: updatedResource
        });
    } catch (error) {
        console.error('Toggle resource active error:', error);
        res.status(500).json({ 
            msg: 'Failed to toggle resource status',
            error: error.message 
        });
    }
};

// Download resource file
const downloadResource = async (req, res) => {
    try {
        const { resource_id } = req.params;

        if (!resource_id || isNaN(resource_id)) {
            return res.status(400).json({ msg: 'Invalid resource ID' });
        }

        // Get resource details
        const resource = await fetchResourceById(resource_id);
        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Increment download count
        await incrementDownloadCount(resource_id);

        // Generate presigned download URL (expires in 1 hour) with forced download
        const downloadUrl = await generateDownloadUrl(resource.storage_key, 3600, resource.file_name);

        res.status(200).json({
            downloadUrl,
            fileName: resource.file_name,
            fileSize: resource.file_size,
            expiresIn: 3600 // seconds
        });
    } catch (error) {
        console.error('Download resource error:', error);
        res.status(500).json({ 
            msg: 'Failed to generate download link',
            error: error.message 
        });
    }
};

// Stream resource file directly
const streamResource = async (req, res) => {
    try {
        const { resource_id } = req.params;

        if (!resource_id || isNaN(resource_id)) {
            return res.status(400).json({ msg: 'Invalid resource ID' });
        }

        // Get resource details
        const resource = await fetchResourceById(resource_id);
        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Increment download count
        await incrementDownloadCount(resource_id);

        // Get file stream from R2
        const fileStream = await getFileStream(resource.storage_key);

        // Set response headers
        res.setHeader('Content-Type', resource.file_type);
        res.setHeader('Content-Disposition', `attachment; filename="${resource.file_name}"`);
        res.setHeader('Content-Length', resource.file_size);

        // Pipe the stream to response
        fileStream.pipe(res);
    } catch (error) {
        console.error('Stream resource error:', error);
        res.status(500).json({ 
            msg: 'Failed to stream resource',
            error: error.message 
        });
    }
};

// Get resource categories for filtering
const getResourceCategories = async (req, res) => {
    try {
        const categories = await fetchResourceCategories();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch categories',
            error: error.message 
        });
    }
};

// Get resource statistics
const getResourceStats = async (req, res) => {
    try {
        const stats = await fetchResourceStats();
        res.status(200).json({ stats });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ 
            msg: 'Failed to fetch statistics',
            error: error.message 
        });
    }
};

export {
    upload,
    getResources,
    getResourceById,
    postResource,
    patchResource,
    deleteResourceById,
    toggleResourceActive,
    downloadResource,
    streamResource,
    getResourceCategories,
    getResourceStats
};
