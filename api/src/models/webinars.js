import db from "../db/db.js";

/**
 * Fetch webinars with server-side filtering, search, sorting, and pagination
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Search in title and description
 * @param {string} filters.category - Filter by category
 * @param {boolean} filters.is_published - Filter by published status
 * @param {boolean} filters.is_featured - Filter by featured status
 * @param {string} filters.sort - Sort by: 'newest', 'oldest', 'popular', 'title'
 * @param {number} filters.limit - Limit results (default: 12)
 * @param {number} filters.offset - Offset for pagination (default: 0)
 */
export const fetchAllWebinars = (filters = {}) => {
    const {
        search,
        category,
        is_published,
        is_featured,
        sort = 'newest',
        limit = 12,
        offset = 0
    } = filters;

    const conditions = [];
    const params = [];
    let paramCount = 1;

    // Search filter (searches title and description)
    if (search) {
        conditions.push(`(
            LOWER(title) LIKE LOWER($${paramCount}) OR 
            LOWER(description) LIKE LOWER($${paramCount})
        )`);
        params.push(`%${search}%`);
        paramCount++;
    }

    // Category filter (exact match)
    if (category) {
        conditions.push(`category = $${paramCount}`);
        params.push(category);
        paramCount++;
    }

    // Published status filter
    if (is_published !== undefined) {
        conditions.push(`is_published = $${paramCount}`);
        params.push(is_published);
        paramCount++;
    }

    // Featured status filter
    if (is_featured !== undefined) {
        conditions.push(`is_featured = $${paramCount}`);
        params.push(is_featured);
        paramCount++;
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}` 
        : '';

    // Build ORDER BY clause
    let orderBy;
    switch (sort) {
        case 'oldest':
            orderBy = 'ORDER BY created_at ASC';
            break;
        case 'popular':
            orderBy = 'ORDER BY view_count DESC, created_at DESC';
            break;
        case 'title':
            orderBy = 'ORDER BY title ASC';
            break;
        case 'newest':
        default:
            orderBy = 'ORDER BY created_at DESC';
            break;
    }

    // Add pagination
    params.push(limit);
    const limitClause = `LIMIT $${paramCount}`;
    paramCount++;

    params.push(offset);
    const offsetClause = `OFFSET $${paramCount}`;

    const query = `
        SELECT * FROM webinars 
        ${whereClause} 
        ${orderBy} 
        ${limitClause} 
        ${offsetClause}
    `;

    return db.query(query, params).then(({rows}) => {
        return rows;
    });
}

/**
 * Get total count of webinars matching filters (for pagination)
 */
export const getWebinarsCount = (filters = {}) => {
    const {
        search,
        category,
        is_published,
        is_featured
    } = filters;

    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (search) {
        conditions.push(`(
            LOWER(title) LIKE LOWER($${paramCount}) OR 
            LOWER(description) LIKE LOWER($${paramCount})
        )`);
        params.push(`%${search}%`);
        paramCount++;
    }

    if (category) {
        conditions.push(`category = $${paramCount}`);
        params.push(category);
        paramCount++;
    }

    if (is_published !== undefined) {
        conditions.push(`is_published = $${paramCount}`);
        params.push(is_published);
        paramCount++;
    }

    if (is_featured !== undefined) {
        conditions.push(`is_featured = $${paramCount}`);
        params.push(is_featured);
        paramCount++;
    }

    const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}` 
        : '';

    const query = `SELECT COUNT(*) as count FROM webinars ${whereClause}`;

    return db.query(query, params).then(({rows}) => {
        return parseInt(rows[0].count);
    });
}

/**
 * Get unique categories for filter dropdown
 */
export const getWebinarCategories = () => {
    return db.query(`
        SELECT DISTINCT category, COUNT(*) as count 
        FROM webinars 
        WHERE is_published = true 
        GROUP BY category 
        ORDER BY count DESC, category ASC
    `).then(({rows}) => {
        return rows;
    });
}

export const fetchWebinarById = (id) => {
    return db.query(`
        SELECT * FROM webinars WHERE webinar_id = $1
    `, [id]).then(({rows}) => {
        return rows[0];
    });
}

export const createWebinar = (webinar) => {
    const {
       youtube_video_id,
       youtube_url,
       title,
       description,
       category,
       thumbnail_url,
       duration,
       published_at,
       view_count,
       like_count,
       metadata_synced_at,
       uploaded_by,
       is_published,
       is_featured
    } = webinar;
    
    return db.query(`
        INSERT INTO webinars (
            youtube_video_id, youtube_url, title, description, category,
            thumbnail_url, duration, published_at, view_count, like_count,
            metadata_synced_at, uploaded_by, is_published, is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
    `, [
        youtube_video_id, youtube_url, title, description, category,
        thumbnail_url, duration, published_at, view_count, like_count,
        metadata_synced_at, uploaded_by, is_published, is_featured
    ]).then(({rows}) => {
        return rows[0];
    });
}

export const updateWebinar = (updateWebinar, id) => {
    const fields = [];
    const values = [];
    const validFields = [
        "youtube_video_id", "youtube_url", "title", "description", "category", 
        "thumbnail_url", "duration", "published_at", "view_count", "like_count", 
        "metadata_synced_at", "is_published", "is_featured", "updated_at"
    ];
    let index = 1;

    for (const [key, value] of Object.entries(updateWebinar)) {
        if (value !== undefined && validFields.includes(key)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }
    }

    if (fields.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid field provided" });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE webinars SET ${fields.join(", ")} WHERE webinar_id = $${index} RETURNING *`;

    return db.query(query, values).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Webinar not found" });
        }
        return rows[0];
    });
}

export const deleteWebinar = (id) => {
    return db.query(`
        DELETE FROM webinars WHERE webinar_id = $1 RETURNING *
    `, [id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Webinar not found" });
        }
        return rows[0];
    });
}

// will need to flesh out how to increment view count from an iframe
export const incrementViewCount = (id) => {
    return db.query(`
        UPDATE webinars 
        SET view_count = view_count + 1 
        WHERE webinar_id = $1 
        RETURNING *
    `, [id]).then(({rows}) => {
        return rows[0];
    });
}
