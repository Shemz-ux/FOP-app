import db from "../db/db.js";

/**
 * Parse a possibly comma-separated filter value (e.g. "Internship,Placement")
 * into a lowercased array suitable for an `= ANY($n)` match, so multiple
 * checked options within the same filter category are OR'd together instead
 * of being treated as one literal string.
 * Returns null if there are no usable values.
 */
const parseMultiValueFilter = (rawValue) => {
    if (!rawValue) return null;
    const values = rawValue
        .split(',')
        .map(v => v.trim().toLowerCase())
        .filter(Boolean);
    return values.length > 0 ? values : null;
};

// Columns a free-text keyword search checks. Deliberately wider than just
// title/company/location so keywords that only appear as a category value
// (e.g. "internship", "remote", "consulting") still find matches.
// Deliberately excludes:
// - `description`: a long free-text paragraph, and matching against it at
//   equal weight to title/company causes false positives — generic
//   boilerplate language ("risk", "operations", "compliance") shows up in
//   unrelated roles' descriptions, making a job match just because a common
//   word appears once in its prose.
// - `industry`: a broad umbrella category (e.g. "Technology" covers Data
//   Analyst, Marketing Manager, Junior Developer roles alike), so matching
//   it by keyword returns a much wider, less relevant set of jobs than a
//   user typing that word would expect.
const SEARCH_COLUMNS = ['title', 'company', 'location', 'role_type', 'work_type', 'experience_level'];

// Common connector words carry no filtering signal (they appear in almost
// every job's text) but would otherwise still be required to match
// somewhere, diluting the rest of the query. Strip them before searching.
const SEARCH_STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by'
]);

// Escape LIKE's special characters (Postgres' default LIKE escape character
// is backslash) so a literal "%" or "_" typed by a user is matched literally
// instead of being treated as a wildcard.
const escapeLikeSpecialChars = (value) => value.replace(/[\\%_]/g, '\\$&');

/**
 * Build a keyword search WHERE clause: splits the query into words, drops
 * stopwords, and requires every remaining word to appear (in any order)
 * across at least one of SEARCH_COLUMNS, rather than requiring the whole
 * phrase to appear verbatim in a single column. Mutates `params` and
 * returns the next free paramIndex.
 */
const addKeywordSearchCondition = (search, conditions, params, paramIndex) => {
    if (!search) return paramIndex;

    const words = search.trim().split(/\s+/).filter(Boolean)
        .filter(word => !SEARCH_STOPWORDS.has(word.toLowerCase()));
    if (words.length === 0) return paramIndex;

    const wordClauses = words.map((word) => {
        const columnMatches = SEARCH_COLUMNS
            .map(col => `LOWER(${col}) LIKE LOWER($${paramIndex})`)
            .join(' OR ');
        params.push(`%${escapeLikeSpecialChars(word)}%`);
        paramIndex++;
        return `(${columnMatches})`;
    });

    conditions.push(`(${wordClauses.join(' AND ')})`);
    return paramIndex;
};

/**
 * Advanced job filtering and sorting
 * @param {Object} filters - Filter parameters
 * @param {string} filters.company - Filter by company name
 * @param {string} filters.industry - Filter by industry; comma-separated for multiple (OR'd)
 * @param {string} filters.location - Filter by location
 * @param {string} filters.experience_level - Filter by experience level; comma-separated for multiple (OR'd)
 * @param {string} filters.role_type - Filter by role type; comma-separated for multiple (OR'd)
 * @param {string} filters.work_type - Filter by work type; comma-separated for multiple (OR'd)
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

    // Add keyword search filter (every word must match somewhere across SEARCH_COLUMNS)
    paramIndex = addKeywordSearchCondition(search, conditions, params, paramIndex);

    // Add filters if provided
    if (company) {
        conditions.push(`LOWER(company) LIKE LOWER($${paramIndex})`);
        params.push(`%${company}%`);
        paramIndex++;
    }

    const industryValues = parseMultiValueFilter(industry);
    if (industryValues) {
        conditions.push(`LOWER(industry) = ANY($${paramIndex})`);
        params.push(industryValues);
        paramIndex++;
    }

    if (location) {
        conditions.push(`LOWER(location) LIKE LOWER($${paramIndex})`);
        params.push(`%${location}%`);
        paramIndex++;
    }

    const experienceLevelValues = parseMultiValueFilter(experience_level);
    if (experienceLevelValues) {
        conditions.push(`LOWER(experience_level) = ANY($${paramIndex})`);
        params.push(experienceLevelValues);
        paramIndex++;
    }

    const roleTypeValues = parseMultiValueFilter(role_type);
    if (roleTypeValues) {
        conditions.push(`LOWER(role_type) = ANY($${paramIndex})`);
        params.push(roleTypeValues);
        paramIndex++;
    }

    const workTypeValues = parseMultiValueFilter(work_type);
    if (workTypeValues) {
        conditions.push(`LOWER(work_type) = ANY($${paramIndex})`);
        params.push(workTypeValues);
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

    // Add keyword search filter (every word must match somewhere across SEARCH_COLUMNS)
    paramIndex = addKeywordSearchCondition(search, conditions, params, paramIndex);

    if (company) {
        conditions.push(`LOWER(company) LIKE LOWER($${paramIndex})`);
        params.push(`%${company}%`);
        paramIndex++;
    }

    const industryValues = parseMultiValueFilter(industry);
    if (industryValues) {
        conditions.push(`LOWER(industry) = ANY($${paramIndex})`);
        params.push(industryValues);
        paramIndex++;
    }

    if (location) {
        conditions.push(`LOWER(location) LIKE LOWER($${paramIndex})`);
        params.push(`%${location}%`);
        paramIndex++;
    }

    const experienceLevelValues = parseMultiValueFilter(experience_level);
    if (experienceLevelValues) {
        conditions.push(`LOWER(experience_level) = ANY($${paramIndex})`);
        params.push(experienceLevelValues);
        paramIndex++;
    }

    const roleTypeValues = parseMultiValueFilter(role_type);
    if (roleTypeValues) {
        conditions.push(`LOWER(role_type) = ANY($${paramIndex})`);
        params.push(roleTypeValues);
        paramIndex++;
    }

    const workTypeValues = parseMultiValueFilter(work_type);
    if (workTypeValues) {
        conditions.push(`LOWER(work_type) = ANY($${paramIndex})`);
        params.push(workTypeValues);
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
