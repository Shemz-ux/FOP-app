import db from "../db/db.js";

export const fetchEvents = () => {
    return db.query(`SELECT * FROM events ORDER BY event_date ASC, event_time ASC`).then(({rows}) => {
        return rows;
    });
};

export const fetchEventById = (id) => {
    return db.query(`SELECT * FROM events WHERE event_id = $1`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Event not found'});
        }
        return rows[0];
    });
};

export const createEvent = (newEvent) => {
    const {
        title,
        description,
        event_date,
        event_time,
        location,
        event_type,
        organizer,
        contact_email,
        event_link,
        capacity,
        is_active = true
    } = newEvent;
    
    return db.query(`
        INSERT INTO events (
            title, description, event_date, event_time, location, 
            event_type, organizer, contact_email, event_link, 
            capacity, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`, 
        [title, description, event_date, event_time, location, 
         event_type, organizer, contact_email, event_link, 
         capacity, is_active]
    ).then(({rows}) => {
        return rows[0];
    });
};

export const updateEvent = (updateEvent, id) => {
    const fields = [];
    const values = [];
    const validFields = [
        "title", "description", "event_date", "event_time", "location", 
        "event_type", "organizer", "contact_email", "event_link", 
        "capacity", "is_active"
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
    return db.query(`SELECT * FROM events WHERE is_active = true ORDER BY event_date ASC, event_time ASC`).then(({rows}) => {
        return rows;
    });
};

export const fetchUpcomingEvents = () => {
    return db.query(`SELECT * FROM events WHERE event_date >= CURRENT_DATE AND is_active = true ORDER BY event_date ASC, event_time ASC`).then(({rows}) => {
        return rows;
    });
};
