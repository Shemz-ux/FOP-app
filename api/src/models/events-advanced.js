import db from "../db/db.js";

/**
 * Advanced event filtering and sorting
 * @param {Object} filters - Filter parameters
 * @param {string} filters.organiser - Filter by organiser name
 * @param {string} filters.industry - Filter by industry
 * @param {string} filters.location - Filter by location
 * @param {string} filters.event_type - Filter by event type
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
        organiser,
        industry,
        location,
        event_type,
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
    if (organiser) {
        conditions.push(`LOWER(organiser) LIKE LOWER($${paramIndex})`);
        params.push(`%${organiser}%`);
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

    if (event_type) {
        conditions.push(`LOWER(event_type) LIKE LOWER($${paramIndex})`);
        params.push(`%${event_type}%`);
        paramIndex++;
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
            orderBy = 'ORDER BY event_date ASC, event_start_time ASC';
            break;
        case 'date_desc':
            orderBy = 'ORDER BY event_date DESC, event_start_time DESC';
            break;
        case 'organiser':
            orderBy = 'ORDER BY organiser ASC, event_date ASC';
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
            organiser,
            organiser_logo,
            organiser_description,
            organiser_website,
            industry,
            event_type,
            location_type,
            location,
            address,
            capacity,
            event_link,
            description,
            event_image,
            event_date,
            event_start_time,
            event_end_time,
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
        organiser,
        industry,
        location,
        event_type,
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

    if (organiser) {
        conditions.push(`LOWER(organiser) LIKE LOWER($${paramIndex})`);
        params.push(`%${organiser}%`);
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

    if (event_type) {
        conditions.push(`LOWER(event_type) LIKE LOWER($${paramIndex})`);
        params.push(`%${event_type}%`);
        paramIndex++;
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
        'SELECT DISTINCT organiser FROM events WHERE organiser IS NOT NULL AND organiser != \'\' ORDER BY organiser',
        'SELECT DISTINCT industry FROM events WHERE industry IS NOT NULL AND industry != \'\' ORDER BY industry',
        'SELECT DISTINCT location FROM events WHERE location IS NOT NULL AND location != \'\' ORDER BY location',
        'SELECT DISTINCT event_type FROM events WHERE event_type IS NOT NULL AND event_type != \'\' ORDER BY event_type'
    ];

    return Promise.all(queries.map(query => db.query(query)))
        .then(results => {
            return {
                organisers: results[0].rows.map(row => row.organiser),
                industries: results[1].rows.map(row => row.industry),
                locations: results[2].rows.map(row => row.location),
                event_types: results[3].rows.map(row => row.event_type)
            };
        });
};
