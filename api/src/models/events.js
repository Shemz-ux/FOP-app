import db from "../db/db.js";

export const fetchEvents = () => {
    return db.query(`
        SELECT 
            e.*,
            COUNT(jea.jobseeker_id) as applicant_count
        FROM events e
        LEFT JOIN jobseekers_events_applied jea ON e.event_id = jea.event_id
        GROUP BY e.event_id
        ORDER BY e.event_date ASC, e.event_start_time ASC
    `).then(({rows}) => {
        return rows.map(row => ({
            ...row,
            applicant_count: parseInt(row.applicant_count) || 0
        }));
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
        return {
            ...rows[0],
            applicant_count: parseInt(rows[0].applicant_count) || 0
        };
    });
};

export const createEvent = (newEvent) => {
    const {
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
        applicant_count,
        is_active = true
    } = newEvent;
    
    return db.query(`
        INSERT INTO events (
            title, organiser, organiser_logo, organiser_description, organiser_website,
            industry, event_type, location_type, location, address, capacity,
            event_link, description, event_image, event_date, event_start_time, event_end_time,
            applicant_count, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
        RETURNING *`, 
        [title, organiser, organiser_logo, organiser_description, organiser_website,
         industry, event_type, location_type, location, address, capacity,
         event_link, description, event_image, event_date, event_start_time, event_end_time,
         applicant_count, is_active]
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
