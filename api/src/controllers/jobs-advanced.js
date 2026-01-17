import { fetchJobsAdvanced, getJobsCount, getJobFilterOptions } from '../models/jobs-advanced.js';

/**
 * Get jobs with advanced filtering and sorting
 * Query parameters:
 * - company: Filter by company name (partial match)
 * - industry: Filter by industry (partial match)
 * - location: Filter by location (partial match)
 * - experience_level: Filter by experience level (partial match)
 * - role_type: Filter by role type (partial match)
 * - work_type: Filter by work type (partial match)
 * - sort: Sort by 'newest', 'oldest', 'popular', 'company', 'title'
 * - limit: Number of results per page (default: 50, max: 100)
 * - page: Page number (default: 1)
 * - active: Filter by active status (default: true)
 */
export const getJobsAdvanced = async (req, res) => {
    try {
        const {
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

        // Get jobs and total count in parallel
        const [jobs, totalCount] = await Promise.all([
            fetchJobsAdvanced(filters),
            getJobsCount(filters)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / parsedLimit);
        const hasNextPage = parsedPage < totalPages;
        const hasPrevPage = parsedPage > 1;

        res.status(200).json({
            jobs,
            pagination: {
                currentPage: parsedPage,
                totalPages,
                totalCount,
                limit: parsedLimit,
                hasNextPage,
                hasPrevPage
            },
            filters: {
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
 */
export const getJobFilters = async (req, res) => {
    try {
        const filterOptions = await getJobFilterOptions();
        
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
