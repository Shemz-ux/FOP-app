import db from "../db/db.js";

export const fetchSocieties = () => {
    return db.query(`SELECT * FROM societies`).then(({rows}) => {
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
