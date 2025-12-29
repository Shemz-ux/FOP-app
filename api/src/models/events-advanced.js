import db from "../db/db.js";

/**
 * Advanced event filtering and sorting
 * @param {Object} filters - Filter parameters
 * @param {string} filters.company - Filter by company name
 * @param {string} filters.industry - Filter by industry
 * @param {string} filters.location - Filter by location
 * @param {string} filters.type - Filter by event type (from description or title)
 * @param {string} filters.date_from - Filter events from this date (YYYY-MM-DD)
 * @param {string} filters.date_to - Filter events until this date (YYYY-MM-DD)
 * @param {string} filters.sort - Sort by: 'newest', 'oldest', 'popular', 'date_asc', 'date_desc', 'company'
 * @param {number} filters.limit - Limit results (default: 50)
 * @param {number} filters.offset - Offset for pagination (default: 0)
 * @param {boolean} filters.active - Filter by active status (default: true)
 * @param {boolean} filters.upcoming - Filter for upcoming events only (default: false)
 */
export const fetchEventsAdvanced = (filters = {}) => {
    const {
        company,
        industry,
        location,
        type,
        date_from,
        date_to,
        sort = 'newest',
        limit = 50,
        offset = 0,
        active = true,
        upcoming = false
    } = filters;

    // Build WHERE clause dynamically
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Always filter by active status
    conditions.push(`is_active = $${paramIndex}`);
    params.push(active);
    paramIndex++;

    // Filter for upcoming events only
    if (upcoming) {
        conditions.push(`event_date >= CURRENT_DATE`);
    }

    // Add filters if provided
    if (company) {
        conditions.push(`LOWER(company) LIKE LOWER($${paramIndex})`);
        params.push(`%${company}%`);
        paramIndex++;
    }

    if (industry) {
        conditions.push(`LOWER(industry) LIKE LOWER($${paramIndex})`);
        params.push(`%${industry}%`);
        paramIndex++;
    }

    if (location) {
        conditions.push(`LOWER(location) LIKE LOWER($${paramIndex})`);
        params.push(`%${location}%`);
        paramIndex++;
    }

    if (type) {
        conditions.push(`(LOWER(title) LIKE LOWER($${paramIndex}) OR LOWER(description) LIKE LOWER($${paramIndex + 1}))`);
        params.push(`%${type}%`, `%${type}%`);
        paramIndex += 2;
    }

    if (date_from) {
        conditions.push(`event_date >= $${paramIndex}`);
        params.push(date_from);
        paramIndex++;
    }

    if (date_to) {
        conditions.push(`event_date <= $${paramIndex}`);
        params.push(date_to);
        paramIndex++;
    }

    // Build ORDER BY clause
    let orderBy;
    switch (sort) {
        case 'oldest':
            orderBy = 'ORDER BY created_at ASC';
            break;
        case 'popular':
            orderBy = 'ORDER BY applicant_count DESC, created_at DESC';
            break;
        case 'date_asc':
            orderBy = 'ORDER BY event_date ASC, event_time ASC';
            break;
        case 'date_desc':
            orderBy = 'ORDER BY event_date DESC, event_time DESC';
            break;
        case 'company':
            orderBy = 'ORDER BY company ASC, event_date ASC';
            break;
        case 'newest':
        default:
            orderBy = 'ORDER BY created_at DESC';
            break;
    }

    // Add pagination parameters
    params.push(limit, offset);
    const limitClause = `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    // Build final query
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT 
            event_id,
            title,
            company,
            description,
            industry,
            location,
            event_link,
            contact_email,
            event_date,
            event_time,
            is_active,
            applicant_count,
            created_at,
            updated_at
        FROM events 
        ${whereClause}
        ${orderBy}
        ${limitClause}
    `;

    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

/**
 * Get total count for pagination
 */
export const getEventsCount = (filters = {}) => {
    const {
        company,
        industry,
        location,
        type,
        date_from,
        date_to,
        active = true,
        upcoming = false
    } = filters;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    conditions.push(`is_active = $${paramIndex}`);
    params.push(active);
    paramIndex++;

    if (upcoming) {
        conditions.push(`event_date >= CURRENT_DATE`);
    }

    if (company) {
        conditions.push(`LOWER(company) LIKE LOWER($${paramIndex})`);
        params.push(`%${company}%`);
        paramIndex++;
    }

    if (industry) {
        conditions.push(`LOWER(industry) LIKE LOWER($${paramIndex})`);
        params.push(`%${industry}%`);
        paramIndex++;
    }

    if (location) {
        conditions.push(`LOWER(location) LIKE LOWER($${paramIndex})`);
        params.push(`%${location}%`);
        paramIndex++;
    }

    if (type) {
        conditions.push(`(LOWER(title) LIKE LOWER($${paramIndex}) OR LOWER(description) LIKE LOWER($${paramIndex + 1}))`);
        params.push(`%${type}%`, `%${type}%`);
        paramIndex += 2;
    }

    if (date_from) {
        conditions.push(`event_date >= $${paramIndex}`);
        params.push(date_from);
        paramIndex++;
    }

    if (date_to) {
        conditions.push(`event_date <= $${paramIndex}`);
        params.push(date_to);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) as total FROM events ${whereClause}`;

    return db.query(query, params).then(({ rows }) => {
        return parseInt(rows[0].total);
    });
};

/**
 * Get unique values for filter dropdowns
 */
export const getEventFilterOptions = () => {
    const queries = [
        'SELECT DISTINCT company FROM events WHERE company IS NOT NULL AND company != \'\' ORDER BY company',
        'SELECT DISTINCT industry FROM events WHERE industry IS NOT NULL AND industry != \'\' ORDER BY industry',
        'SELECT DISTINCT location FROM events WHERE location IS NOT NULL AND location != \'\' ORDER BY location'
    ];

    return Promise.all(queries.map(query => db.query(query)))
        .then(results => {
            return {
                companies: results[0].rows.map(row => row.company),
                industries: results[1].rows.map(row => row.industry),
                locations: results[2].rows.map(row => row.location)
            };
        });
};
