import db from '../db/db.js';

// Create a new resource
const createResource = async (resourceData) => {
    const {
        title,
        description,
        detailed_description,
        whats_included,
        category,
        file_name,
        file_size,
        file_type,
        storage_key,
        storage_url,
        uploaded_by,
        created_by
    } = resourceData;

    const query = `
        INSERT INTO resources (
            title, description, detailed_description, whats_included, category, file_name, file_size, 
            file_type, storage_key, storage_url, uploaded_by, created_by
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *
    `;

    const values = [
        title, description, detailed_description, whats_included, category, file_name, file_size,
        file_type, storage_key, storage_url, uploaded_by, created_by
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get all resources with optional filtering
const fetchResources = async (filters = {}) => {
    let whereClause = `WHERE r.is_active = TRUE`;
    const values = [];
    let paramCount = 0;

    // Add category filter
    if (filters.category) {
        paramCount++;
        whereClause += ` AND r.category = $${paramCount}`;
        values.push(filters.category);
    }

    // Add search filter (title or description)
    if (filters.search) {
        paramCount++;
        whereClause += ` AND (r.title ILIKE $${paramCount} OR r.description ILIKE $${paramCount})`;
        values.push(`%${filters.search}%`);
    }

    // Add file type filter
    if (filters.file_type) {
        paramCount++;
        whereClause += ` AND r.file_type = $${paramCount}`;
        values.push(filters.file_type);
    }

    // Get total count with same filters
    const countQuery = `
        SELECT COUNT(*) as total
        FROM resources r
        ${whereClause}
    `;

    // Build main query
    let query = `
        SELECT r.*
        FROM resources r
        ${whereClause}
    `;

    // Add sorting
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order === 'asc' ? 'ASC' : 'DESC';
    
    const allowedSortFields = ['title', 'category', 'created_at', 'download_count', 'file_size'];
    if (allowedSortFields.includes(sortBy)) {
        query += ` ORDER BY r.${sortBy} ${sortOrder}`;
    } else {
        query += ` ORDER BY r.created_at DESC`;
    }

    // Add pagination
    const limit = Math.min(parseInt(filters.limit) || 50, 100);
    const offset = (parseInt(filters.page) - 1 || 0) * limit;
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    values.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);

    try {
        // Execute both queries
        const [countResult, resourcesResult] = await Promise.all([
            db.query(countQuery, values.slice(0, values.length - 2)), // Exclude LIMIT and OFFSET params
            db.query(query, values)
        ]);

        return {
            resources: resourcesResult.rows,
            totalCount: parseInt(countResult.rows[0].total)
        };
    } catch (error) {
        throw error;
    }
};

// Get resource by ID
const fetchResourceById = async (resourceId) => {
    const query = `
        SELECT r.*
        FROM resources r
        WHERE r.resource_id = $1 AND r.is_active = TRUE
    `;

    try {
        const result = await db.query(query, [resourceId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Update resource
const updateResource = async (resourceId, updateData) => {
    const allowedFields = ['title', 'description', 'detailed_description', 'whats_included', 'category', 'uploaded_by', 'is_active'];
    const updates = [];
    const values = [];
    let paramCount = 0;

    // Build dynamic update query
    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            paramCount++;
            updates.push(`${key} = $${paramCount}`);
            values.push(value);
        }
    }

    if (updates.length === 0) {
        throw new Error('No valid fields to update');
    }

    // Add updated_at timestamp
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    // Add resource ID for WHERE clause
    paramCount++;
    values.push(resourceId);

    const query = `
        UPDATE resources 
        SET ${updates.join(', ')} 
        WHERE resource_id = $${paramCount} AND is_active = TRUE
        RETURNING *
    `;

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Soft delete resource
const deleteResource = async (resourceId) => {
    const query = `
        UPDATE resources 
        SET is_active = FALSE, updated_at = NOW() 
        WHERE resource_id = $1 AND is_active = TRUE
        RETURNING *
    `;

    try {
        const result = await db.query(query, [resourceId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Increment download count
const incrementDownloadCount = async (resourceId) => {
    const query = `
        UPDATE resources 
        SET download_count = download_count + 1
        WHERE resource_id = $1 AND is_active = TRUE
        RETURNING download_count
    `;

    try {
        const result = await db.query(query, [resourceId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Get resource categories for filters
const fetchResourceCategories = async () => {
    const query = `
        SELECT DISTINCT category 
        FROM resources 
        WHERE is_active = TRUE 
        ORDER BY category
    `;

    try {
        const result = await db.query(query);
        return result.rows.map(row => row.category);
    } catch (error) {
        throw error;
    }
};

// Get resource statistics
const fetchResourceStats = async () => {
    const totalQuery = `
        SELECT 
            COUNT(*) as total_resources,
            SUM(download_count) as total_downloads,
            COUNT(DISTINCT category) as total_categories
        FROM resources 
        WHERE is_active = TRUE
    `;

    const categoryQuery = `
        SELECT 
            category,
            COUNT(*) as count
        FROM resources 
        WHERE is_active = TRUE
        GROUP BY category
        ORDER BY count DESC
    `;

    try {
        const totalResult = await db.query(totalQuery);
        const categoryResult = await db.query(categoryQuery);
        
        const by_category = {};
        categoryResult.rows.forEach(row => {
            by_category[row.category] = parseInt(row.count);
        });

        return {
            ...totalResult.rows[0],
            by_category
        };
    } catch (error) {
        throw error;
    }
};

export {
    createResource,
    fetchResources,
    fetchResourceById,
    updateResource,
    deleteResource,
    incrementDownloadCount,
    fetchResourceCategories,
    fetchResourceStats
};
