import db from "../db/db.js";

export const fetchSocieties = () => {
    return db.query(`
        SELECT 
            s.*,
            COUNT(j.jobseeker_id) as member_count
        FROM societies s
        LEFT JOIN jobseekers j ON j.society_id = s.society_id
        GROUP BY s.society_id
        ORDER BY s.name ASC
    `).then(({rows}) => {
        return rows;
    });
};

export const fetchSocietyNames = () => {
    return db.query(`SELECT society_id, name FROM societies ORDER BY name ASC`).then(({rows}) => {
        return rows;
    });
};

// Works out the society_id and society name to store for a jobseeker, from
// whatever the caller supplied. Both columns are always written together from
// this one result, so they can never disagree.
//
// Accepts either a society_id (unambiguous, preferred) or a society name.
// A name that matches no society is kept as text with a null society_id, so a
// student who belongs to a society that is not on the platform does not lose it.
export const resolveSocietyLink = async ({ society_id, society } = {}) => {
    const hasId = society_id !== undefined && society_id !== null && society_id !== '';

    if (hasId) {
        const { rows } = await db.query(
            `SELECT society_id, name FROM societies WHERE society_id = $1`,
            [society_id]
        );
        if (rows.length === 0) {
            return Promise.reject({ status: 400, msg: 'Society not found' });
        }
        return { society_id: rows[0].society_id, society: rows[0].name };
    }

    const name = typeof society === 'string' ? society.trim() : society;

    // 'None' is a legacy value the signup form used to send for "no society"
    if (!name || name === 'None') {
        return { society_id: null, society: null };
    }

    const { rows } = await db.query(
        `SELECT society_id, name FROM societies
         WHERE LOWER(BTRIM(name)) = LOWER(BTRIM($1))
         ORDER BY society_id
         LIMIT 1`,
        [name]
    );

    // Matched: store the society's own spelling so the text and the key agree.
    // Unmatched: keep what was given, with no link.
    return rows.length > 0
        ? { society_id: rows[0].society_id, society: rows[0].name }
        : { society_id: null, society: name };
};

// What a society may see about its own members. Deliberately narrower than the
// admin view: enough to run the members table in the design, and nothing more.
// No phone number, LinkedIn, CV, or the demographic answers students gave to
// FOP rather than to their society.
const SOCIETY_MEMBER_FIELDS = [
    'jobseeker_id',
    'first_name',
    'last_name',
    'email',
    'education_level',
    'institution_name',
    'uni_year',
    'degree_type',
    'area_of_study',
    'created_at'
];

// Members of one society, with how many jobs each has applied for.
// Takes the id from the caller's token, never from a URL.
export const fetchSocietyMembers = (society_id) => {
    const columns = SOCIETY_MEMBER_FIELDS.map(field => `j.${field}`).join(', ');

    return db.query(`
        SELECT ${columns},
               COUNT(a.job_id)::int AS application_count
        FROM jobseekers j
        LEFT JOIN jobseekers_jobs_applied a ON a.jobseeker_id = j.jobseeker_id
        WHERE j.society_id = $1
        GROUP BY j.jobseeker_id
        ORDER BY j.created_at DESC
    `, [society_id]).then(({rows}) => {
        return rows;
    });
};

export const fetchSocietyById = (id) => {
    return db.query(`SELECT * FROM societies WHERE society_id = $1`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Society not found'});
        }
        return rows[0];
    });
};

export const fetchSocietyByEmail = (email) => {
    return db.query(`SELECT * FROM societies WHERE email = $1`, [email])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Society not found'});
        }
        return rows[0];
    });
};

export const createSociety = (newSociety) => {
    const { name, university, description, email, password_hash } = newSociety;
    
    return db.query(`
        INSERT INTO societies (name, university, description, email, password_hash)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`, 
        [name, university, description, email, password_hash]
    ).then(({rows}) => {
        return rows[0];
    });
};

export const updateSociety = (updateSociety, id) => {
    const fields = [];
    const values = [];
    const validFields = ["name", "university", "description", "email", "password_hash"];
    let index = 1;

    for (const [key, value] of Object.entries(updateSociety)) {
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
        UPDATE societies
        SET ${fields.join(", ")}
        WHERE society_id = $${index}
        RETURNING *
    `;

    return db.query(query, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Society not found'});
        }
        return rows[0];
    });
};

export const removeSociety = (id) => {
    return db.query(`DELETE FROM societies WHERE society_id = $1 RETURNING *`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Society not found'});
        }
        return 'Society deleted!';
    });
};
