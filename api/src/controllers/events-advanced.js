import { fetchEventsAdvanced, getEventsCount, getEventFilterOptions } from '../models/events-advanced.js';

/**
 * Get events with advanced filtering and sorting
 * Query parameters:
 * - company: Filter by company name (partial match)
 * - industry: Filter by industry (partial match)
 * - location: Filter by location (partial match)
 * - type: Filter by event type in title/description (partial match)
 * - date_from: Filter events from this date (YYYY-MM-DD)
 * - date_to: Filter events until this date (YYYY-MM-DD)
 * - sort: Sort by 'newest', 'oldest', 'popular', 'date_asc', 'date_desc', 'company'
 * - limit: Number of results per page (default: 50, max: 100)
 * - page: Page number (default: 1)
 * - active: Filter by active status (default: true)
 * - upcoming: Filter for upcoming events only (default: false)
 */
export const getEventsAdvanced = async (req, res) => {
    try {
        const {
            company,
            industry,
            location,
            type,
            date_from,
            date_to,
            sort = 'newest',
            limit = 50,
            page = 1,
            active = 'true',
            upcoming = 'false'
        } = req.query;

        // Validate and sanitize inputs
        const parsedLimit = Math.min(parseInt(limit) || 50, 100); // Max 100 results per page
        const parsedPage = Math.max(parseInt(page) || 1, 1); // Min page 1
        const offset = (parsedPage - 1) * parsedLimit;
        const isActive = active === 'true';
        const isUpcoming = upcoming === 'true';

        // Validate sort parameter
        const validSorts = ['newest', 'oldest', 'popular', 'date_asc', 'date_desc', 'company'];
        const validSort = validSorts.includes(sort) ? sort : 'newest';

        // Validate date format (basic validation)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (date_from && !dateRegex.test(date_from)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'date_from must be in YYYY-MM-DD format'
            });
        }
        if (date_to && !dateRegex.test(date_to)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'date_to must be in YYYY-MM-DD format'
            });
        }

        const filters = {
            company,
            industry,
            location,
            type,
            date_from,
            date_to,
            sort: validSort,
            limit: parsedLimit,
            offset,
            active: isActive,
            upcoming: isUpcoming
        };

        // Get events and total count in parallel
        const [events, totalCount] = await Promise.all([
            fetchEventsAdvanced(filters),
            getEventsCount(filters)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / parsedLimit);
        const hasNextPage = parsedPage < totalPages;
        const hasPrevPage = parsedPage > 1;

        res.status(200).json({
            events,
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
                type,
                date_from,
                date_to,
                sort: validSort,
                active: isActive,
                upcoming: isUpcoming
            }
        });

    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch events'
        });
    }
};

/**
 * Get available filter options for dropdowns
 */
export const getEventFilters = async (req, res) => {
    try {
        const filterOptions = await getEventFilterOptions();
        
        res.status(200).json({
            filterOptions,
            sortOptions: [
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'date_asc', label: 'Event Date (Earliest)' },
                { value: 'date_desc', label: 'Event Date (Latest)' },
                { value: 'company', label: 'Company A-Z' }
            ]
        });

    } catch (err) {
        console.error('Error fetching event filters:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch filter options'
        });
    }
};
