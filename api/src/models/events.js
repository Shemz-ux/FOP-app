import db from "../db/db.js";

// Helper function to convert description sections to plain text
const sectionsToDescription = (sections) => {
    if (!sections || sections.length === 0) {
        return '';
    }
    
    return sections
        .map(section => {
            const header = section.header;
            const content = section.content
                .filter(item => item.trim())
                .map(item => `• ${item}`)
                .join('\n');
            
            return `${header}:\n${content}`;
        })
        .join('\n\n');
};

// Helper function to parse plain text description into structured sections
const parseDescriptionToSections = (description) => {
    if (!description) {
        return [
            { header: 'About the Event', content: [''] },
            { header: 'What to Expect', content: [''] },
            { header: 'Who Should Attend', content: [''] },
        ];
    }

    const sections = [];
    const lines = description.split('\n').filter(line => line.trim());
    
    let currentSection = null;
    
    // Map of known headers to normalized format
    const HEADING_MAP = {
        'about the event': 'About the Event',
        'what to expect': 'What to Expect',
        'who should attend': 'Who Should Attend',
        'topics covered': 'Topics Covered',
        'requirements': 'Requirements',
        'format': 'Format'
    };
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        const lowerLine = trimmedLine.toLowerCase();
        
        // Check if line matches a known header (case-insensitive)
        let normalizedHeader = null;
        for (const [key, value] of Object.entries(HEADING_MAP)) {
            if (lowerLine.startsWith(key)) {
                normalizedHeader = value;
                break;
            }
        }
        
        if (normalizedHeader || trimmedLine.endsWith(':') || (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3)) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                header: normalizedHeader || trimmedLine.replace(':', ''),
                content: []
            };
        } else if (currentSection) {
            // Add content to current section
            const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '');
            if (cleanLine) {
                currentSection.content.push(cleanLine);
            }
        }
    }
    
    if (currentSection) {
        sections.push(currentSection);
    }
    
    // If no sections were parsed, create default structure
    if (sections.length === 0) {
        return [
            { header: 'About the Event', content: [description] },
            { header: 'What to Expect', content: [''] },
            { header: 'Who Should Attend', content: [''] },
        ];
    }
    
    return sections;
};

export const fetchEvents = () => {
    return db.query(`
        SELECT 
            e.*,
            COUNT(jea.jobseeker_id) as applicant_count
        FROM events e
        LEFT JOIN jobseekers_events_applied jea ON e.event_id = jea.event_id
        GROUP BY e.event_id
        ORDER BY e.created_at DESC
    `).then(({rows}) => {
        return rows.map(row => {
            const event = {
                ...row,
                applicant_count: parseInt(row.applicant_count) || 0
            };
            
            // Parse description into description_sections for frontend
            if (event.description) {
                event.description_sections = parseDescriptionToSections(event.description);
            }
            
            return event;
        });
    });
};

export const fetchEventById = (id) => {
    return db.query(`
        SELECT 
            e.*,
            COUNT(jea.jobseeker_id) as applicant_count
        FROM events e
        LEFT JOIN jobseekers_events_applied jea ON e.event_id = jea.event_id
        WHERE e.event_id = $1
        GROUP BY e.event_id
    `, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Event not found'});
        }
        const event = {
            ...rows[0],
            applicant_count: parseInt(rows[0].applicant_count) || 0
        };
        
        // Parse description into description_sections for frontend
        if (event.description) {
            event.description_sections = parseDescriptionToSections(event.description);
        }
        
        return event;
    });
};

export const createEvent = (newEvent) => {
    const {
        title,
        organiser,
        organiser_logo = null,
        organiser_description,
        organiser_website,
        industry,
        event_type,
        location_type,
        location,
        address,
        capacity = null,
        event_link,
        description_sections,
        event_image = null,
        event_date,
        event_start_time,
        event_end_time,
        applicant_count = 0,
        is_active = true
    } = newEvent;
    
    // Convert description_sections to plain text for the description column
    const description = description_sections ? sectionsToDescription(description_sections) : '';
    
    return db.query(`
        INSERT INTO events (
            title, organiser, organiser_logo, organiser_description, organiser_website,
            industry, event_type, location_type, location, address, capacity,
            event_link, description, event_image, 
            event_date, event_start_time, event_end_time, applicant_count, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
        RETURNING *`, 
        [title, organiser, organiser_logo, organiser_description, organiser_website,
         industry, event_type, location_type, location, address, capacity,
         event_link, description, event_image,
         event_date, event_start_time, event_end_time, applicant_count, is_active]
    ).then(({rows}) => {
        return rows[0];
    });
};

export const updateEvent = (updateEvent, id) => {
    const fields = [];
    const values = [];
    const validFields = [
        "title", "organiser", "organiser_logo", "organiser_description", "organiser_website",
        "industry", "event_type", "location_type", "location", "address", "capacity",
        "event_link", "description", "event_image", "event_date", "event_start_time", "event_end_time",
        "applicant_count", "is_active"
    ];
    let index = 1;

    // If description_sections is provided, convert it to description text
    if (updateEvent.description_sections) {
        updateEvent.description = sectionsToDescription(updateEvent.description_sections);
        delete updateEvent.description_sections;
    }

    for (const [key, value] of Object.entries(updateEvent)) {
        if (value !== undefined && validFields.includes(key)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }
    }

    if (fields.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid field provided" });
    }

    // Add updated_at timestamp
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
        UPDATE events
        SET ${fields.join(", ")}
        WHERE event_id = $${index}
        RETURNING *
    `;

    return db.query(query, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Event not found'});
        }
        return rows[0];
    });
};

export const removeEvent = (id) => {
    return db.query(`DELETE FROM events WHERE event_id = $1 RETURNING *`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Event not found'});
        }
        return 'Event deleted!';
    });
};

export const fetchActiveEvents = () => {
    return db.query(`
        SELECT 
            e.*,
            COUNT(jea.jobseeker_id) as applicant_count
        FROM events e
        LEFT JOIN jobseekers_events_applied jea ON e.event_id = jea.event_id
        WHERE e.is_active = true
        GROUP BY e.event_id
        ORDER BY e.event_date ASC, e.event_start_time ASC
    `).then(({rows}) => {
        return rows.map(row => ({
            ...row,
            applicant_count: parseInt(row.applicant_count) || 0
        }));
    });
};

export const fetchUpcomingEvents = () => {
    return db.query(`
        SELECT 
            e.*,
            COUNT(jea.jobseeker_id) as applicant_count
        FROM events e
        LEFT JOIN jobseekers_events_applied jea ON e.event_id = jea.event_id
        WHERE e.event_date >= CURRENT_DATE AND e.is_active = true
        GROUP BY e.event_id
        ORDER BY e.event_date ASC, e.event_start_time ASC
    `).then(({rows}) => {
        return rows.map(row => ({
            ...row,
            applicant_count: parseInt(row.applicant_count) || 0
        }));
    });
};
