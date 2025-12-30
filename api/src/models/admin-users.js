import db from "../db/db.js";

export const fetchAdminUsers = () => {
    return db.query(`SELECT admin_id, first_name, last_name, email, role, is_active, created_at, last_login FROM admin_users WHERE is_active = true`).then(({rows}) => {
        return rows;
    });
};

export const fetchAdminUserById = (id) => {
    return db.query(`SELECT admin_id, first_name, last_name, email, role, is_active, created_at, last_login FROM admin_users WHERE admin_id = $1`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Admin user not found'});
        }
        return rows[0];
    });
};

export const fetchAdminUserByEmail = (email) => {
    return db.query(`SELECT * FROM admin_users WHERE email = $1 AND is_active = true`, [email])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Admin user not found'});
        }
        return rows[0];
    });
};

export const createAdminUser = (newAdminUser) => {
    const {
        first_name, 
        last_name, 
        email, 
        password_hash, 
        role = 'admin',
        created_by = null
    } = newAdminUser;
    
    return db.query(`
        INSERT INTO admin_users (
            first_name, last_name, email, password_hash, role, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING admin_id, first_name, last_name, email, role, is_active, created_at`, 
        [first_name, last_name, email, password_hash, role, created_by]
    ).then(({rows}) => {
        return rows[0];
    });
};

export const updateAdminUser = (updateAdminUser, id) => {
    const fields = [];
    const values = [];
    const validFields = [
        "first_name", "last_name", "email", "password_hash", "role", "is_active"
    ];
    let index = 1;

    for (const [key, value] of Object.entries(updateAdminUser)) {
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
        UPDATE admin_users
        SET ${fields.join(", ")}
        WHERE admin_id = $${index}
        RETURNING admin_id, first_name, last_name, email, role, is_active, created_at, updated_at
    `;

    return db.query(query, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Admin user not found'});
        }
        return rows[0];
    });
};

export const updateLastLogin = (id) => {
    return db.query(`
        UPDATE admin_users 
        SET last_login = NOW() 
        WHERE admin_id = $1
        RETURNING admin_id
    `, [id]).then(({rows}) => {
        return rows[0];
    });
};

export const deactivateAdminUser = (id) => {
    return db.query(`
        UPDATE admin_users 
        SET is_active = false, updated_at = NOW() 
        WHERE admin_id = $1 
        RETURNING admin_id, first_name, last_name, email
    `, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Admin user not found'});
        }
        return 'Admin user deactivated!';
    });
};

export const removeAdminUser = (id) => {
    return db.query(`DELETE FROM admin_users WHERE admin_id = $1 RETURNING *`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Admin user not found'});
        }
        return 'Admin user deleted!';
    });
};
