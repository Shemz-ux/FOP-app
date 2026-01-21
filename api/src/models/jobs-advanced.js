import db from "../db/db.js";

/**
 * Advanced job filtering and sorting
 * @param {Object} filters - Filter parameters
 * @param {string} filters.company - Filter by company name
 * @param {string} filters.industry - Filter by industry
 * @param {string} filters.location - Filter by location
 * @param {string} filters.experience_level - Filter by experience level
 * @param {string} filters.role_type - Filter by role type
 * @param {string} filters.work_type - Filter by work type
 * @param {string} filters.sort - Sort by: 'newest', 'oldest', 'popular', 'company', 'title'
 * @param {number} filters.limit - Limit results (default: 50)
 * @param {number} filters.offset - Offset for pagination (default: 0)
 * @param {boolean} filters.active - Filter by active status (default: true)
 */
export const fetchJobsAdvanced = (filters = {}) => {
    const {
        search,
        company,
        industry,
        location,
        experience_level,
        role_type,
        work_type,
        sort = 'newest',
        limit = 50,
        offset = 0,
        active = true
    } = filters;

    // Build WHERE clause dynamically
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Always filter by active status
    conditions.push(`is_active = $${paramIndex}`);
    params.push(active);
    paramIndex++;

    // Add search filter (searches across title, company, and location)
    if (search) {
        conditions.push(`(
            LOWER(title) LIKE LOWER($${paramIndex}) OR 
            LOWER(company) LIKE LOWER($${paramIndex}) OR 
            LOWER(location) LIKE LOWER($${paramIndex})
        )`);
        params.push(`%${search}%`);
        paramIndex++;
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

    if (experience_level) {
        conditions.push(`LOWER(experience_level) LIKE LOWER($${paramIndex})`);
        params.push(`%${experience_level}%`);
        paramIndex++;
    }

    if (role_type) {
        conditions.push(`LOWER(role_type) LIKE LOWER($${paramIndex})`);
        params.push(`%${role_type}%`);
        paramIndex++;
    }

    if (work_type) {
        conditions.push(`LOWER(work_type) LIKE LOWER($${paramIndex})`);
        params.push(`%${work_type}%`);
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
        case 'company':
            orderBy = 'ORDER BY company ASC, created_at DESC';
            break;
        case 'title':
            orderBy = 'ORDER BY title ASC, created_at DESC';
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
            job_id,
            title,
            company,
            company_logo,
            company_color,
            company_description,
            company_website,
            description,
            industry,
            location,
            experience_level,
            role_type,
            work_type,
            job_link,
            deadline,
            is_active,
            applicant_count,
            created_at,
            updated_at
        FROM jobs 
        ${whereClause}
        ${orderBy}
        ${limitClause}
    `;

    console.log('🔍 Jobs Query:', query);
    console.log('📊 Query Params:', params);

    return db.query(query, params).then(({ rows }) => {
        console.log('✅ Jobs Found:', rows.length);
        return rows;
    });
};

/**
 * Get total count for pagination
 */
export const getJobsCount = (filters = {}) => {
    const {
        search,
        company,
        industry,
        location,
        experience_level,
        role_type,
        work_type,
        active = true
    } = filters;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    conditions.push(`is_active = $${paramIndex}`);
    params.push(active);
    paramIndex++;

    // Add search filter (searches across title, company, and location)
    if (search) {
        conditions.push(`(
            LOWER(title) LIKE LOWER($${paramIndex}) OR 
            LOWER(company) LIKE LOWER($${paramIndex}) OR 
            LOWER(location) LIKE LOWER($${paramIndex})
        )`);
        params.push(`%${search}%`);
        paramIndex++;
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

    if (experience_level) {
        conditions.push(`LOWER(experience_level) LIKE LOWER($${paramIndex})`);
        params.push(`%${experience_level}%`);
        paramIndex++;
    }

    if (role_type) {
        conditions.push(`LOWER(role_type) LIKE LOWER($${paramIndex})`);
        params.push(`%${role_type}%`);
        paramIndex++;
    }

    if (work_type) {
        conditions.push(`LOWER(work_type) LIKE LOWER($${paramIndex})`);
        params.push(`%${work_type}%`);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) as total FROM jobs ${whereClause}`;

    return db.query(query, params).then(({ rows }) => {
        return parseInt(rows[0].total);
    });
};

/**
 * Get unique values for filter dropdowns
 */
export const getJobFilterOptions = () => {
    const queries = [
        'SELECT DISTINCT company FROM jobs WHERE company IS NOT NULL AND company != \'\' ORDER BY company',
        'SELECT DISTINCT industry FROM jobs WHERE industry IS NOT NULL AND industry != \'\' ORDER BY industry',
        'SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL AND location != \'\' ORDER BY location',
        'SELECT DISTINCT experience_level FROM jobs WHERE experience_level IS NOT NULL AND experience_level != \'\' ORDER BY experience_level',
        'SELECT DISTINCT role_type FROM jobs WHERE role_type IS NOT NULL AND role_type != \'\' ORDER BY role_type',
        'SELECT DISTINCT work_type FROM jobs WHERE work_type IS NOT NULL AND work_type != \'\' ORDER BY work_type'
    ];

    return Promise.all(queries.map(query => db.query(query)))
        .then(results => {
            return {
                companies: results[0].rows.map(row => row.company),
                industries: results[1].rows.map(row => row.industry),
                locations: results[2].rows.map(row => row.location),
                experience_levels: results[3].rows.map(row => row.experience_level),
                role_types: results[4].rows.map(row => row.role_type),
                work_types: results[5].rows.map(row => row.work_type)
            };
        });
};
