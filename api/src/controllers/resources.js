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
            limit: req.query.limit || 20
        };

        const resources = await fetchResources(filters);

        res.status(200).json({
            resources,
            pagination: {
                page: parseInt(filters.page),
                limit: parseInt(filters.limit),
                total: resources.length
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

// Create new resource with file upload
const postResource = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const file = req.file;

        // Validate required fields
        if (!title || !category || !file) {
            return res.status(400).json({ 
                msg: 'Title, category, and file are required' 
            });
        }

        // Validate file size
        if (!validateFileSize(file.size)) {
            return res.status(400).json({ 
                msg: 'File size exceeds 50MB limit' 
            });
        }

        // Get admin user ID from middleware
        const created_by = req.user_id;

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
            category,
            file_name: file.originalname,
            file_size: file.size,
            file_type: file.mimetype,
            storage_key: uploadResult.storageKey,
            storage_url: uploadResult.publicUrl,
            created_by
        };

        const newResource = await createResource(resourceData);

        res.status(201).json({
            msg: 'Resource created successfully',
            resource: newResource
        });
    } catch (error) {
        console.error('Create resource error:', error);
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
        const allowedFields = ['title', 'description', 'category', 'is_active'];
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

        // Delete file from R2 storage
        try {
            await deleteFile(resource.storage_key);
        } catch (r2Error) {
            console.error('R2 deletion error:', r2Error);
            // Continue even if R2 deletion fails - resource is already soft deleted
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
    downloadResource,
    streamResource,
    getResourceCategories,
    getResourceStats
};
