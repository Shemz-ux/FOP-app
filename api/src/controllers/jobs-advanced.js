import { fetchJobsAdvanced, getJobsCount, getJobFilterOptions, fetchFeaturedJobs } from '../models/jobs-advanced.js';
import { clearExpiredFeaturedJobs } from '../models/jobs.js';

// Maximum featured jobs returned with the jobs page. A payload guard, not a product cap:
// the carousel bounds the layout at any count, but an unbounded query would ship every
// featured row on every landing-page load, which would defeat the point of the feature.
const FEATURED_LIMIT = 24;

/**
 * Get jobs with advanced filtering and sorting
 * Query parameters:
 * - search: Keyword search; each whitespace-separated word (stopwords like "and"/"the"/"of"
 *   ignored) must match somewhere across title, company, location, role_type, work_type, or
 *   experience_level (partial match, any word order). Deliberately excludes the free-text
 *   description field (false positives from generic boilerplate text) and industry (too
 *   broad a category to keyword-match precisely).
 * - company: Filter by company name (partial match)
 * - industry: Filter by industry (exact match; comma-separated for multiple, OR'd)
 * - location: Filter by location (exact match; comma-separated for multiple, OR'd)
 * - experience_level: Filter by experience level (exact match; comma-separated for multiple, OR'd)
 * - role_type: Filter by role type (exact match; comma-separated for multiple, OR'd)
 * - work_type: Filter by work type (exact match; comma-separated for multiple, OR'd)
 * - sort: Sort by 'newest', 'oldest', 'popular', 'company', 'title'
 * - limit: Number of results per page (default: 50, max: 100)
 * - page: Page number (default: 1)
 * - active: Filter by active status (default: true)
 *
 * Response also carries `featuredJobs`: the admin-curated Featured Jobs section for the
 * public jobs page. Populated only on the unfiltered first page (see `wantsFeatured`),
 * so a filtered, searched or paginated request costs exactly the same two queries it did
 * before this feature existed.
 */
export const getJobsAdvanced = async (req, res) => {
    try {
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
            page = 1,
            active = 'true'
        } = req.query;

        // Validate and sanitize inputs
        const parsedLimit = Math.min(parseInt(limit) || 50, 100); // Max 100 results per page
        const parsedPage = Math.max(parseInt(page) || 1, 1); // Min page 1
        const offset = (parsedPage - 1) * parsedLimit;
        const isActive = active === 'true';

        // Validate sort parameter
        const validSorts = ['newest', 'oldest', 'popular', 'company', 'title'];
        const validSort = validSorts.includes(sort) ? sort : 'newest';

        const filters = {
            search,
            company,
            industry,
            location,
            experience_level,
            role_type,
            work_type,
            sort: validSort,
            limit: parsedLimit,
            offset,
            active: isActive
        };

        // The featured section is only rendered on the unfiltered first page, so only
        // query for it there. Keeps query count identical to pre-feature behaviour on
        // every other request. The client gates rendering on the same conditions.
        const wantsFeatured = parsedPage === 1
            && isActive
            && !search
            && !company
            && !industry
            && !location
            && !experience_level
            && !role_type
            && !work_type;

        // Get jobs, total count and featured jobs in parallel. The featured query runs
        // concurrently on the same pool, so it adds no serial round trip to the response.
        const [jobs, totalCount, featuredJobs] = await Promise.all([
            fetchJobsAdvanced(filters),
            getJobsCount(filters),
            wantsFeatured ? fetchFeaturedJobs({ limit: FEATURED_LIMIT }) : Promise.resolve([])
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / parsedLimit);
        const hasNextPage = parsedPage < totalPages;
        const hasPrevPage = parsedPage > 1;

        res.status(200).json({
            jobs,
            featuredJobs,
            pagination: {
                currentPage: parsedPage,
                totalPages,
                totalCount,
                limit: parsedLimit,
                hasNextPage,
                hasPrevPage
            },
            filters: {
                search,
                company,
                industry,
                location,
                experience_level,
                role_type,
                work_type,
                sort: validSort,
                active: isActive
            }
        });

    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch jobs'
        });
    }
};

/**
 * Get available filter options for dropdowns
 * Query parameters:
 * - includeInactive: when 'true', the returned `locations` list also includes locations that
 *   currently only belong to inactive jobs (intended for admin-facing consumers, e.g. the job
 *   posting form, so an existing spelling can be reused). Defaults to false, i.e. active-only,
 *   which is what student-facing consumers (the Jobs sidebar) should rely on.
 */
export const getJobFilters = async (req, res) => {
    try {
        const activeOnly = req.query.includeInactive !== 'true';
        const filterOptions = await getJobFilterOptions({ activeOnly });

        res.status(200).json({
            filterOptions,
            sortOptions: [
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'company', label: 'Company A-Z' },
                { value: 'title', label: 'Job Title A-Z' }
            ]
        });

    } catch (err) {
        console.error('Error fetching job filters:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch filter options'
        });
    }
};

/**
 * Unfeature every job whose deadline has passed.
 *
 * Exists because the public featured query filters by deadline at read time rather than
 * rewriting is_featured, which keeps admin intent intact when a deadline is extended but
 * leaves the stored flag set on jobs that are no longer shown. This lets an admin clear
 * that backlog deliberately, in one atomic statement, instead of a scheduled job deciding
 * for them.
 */
export const clearExpiredFeatured = async (req, res) => {
    try {
        const clearedJobIds = await clearExpiredFeaturedJobs();

        res.status(200).json({
            clearedCount: clearedJobIds.length,
            clearedJobIds
        });
    } catch (err) {
        console.error('Error clearing expired featured jobs:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to clear expired featured jobs'
        });
    }
};
