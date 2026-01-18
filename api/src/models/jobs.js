import db from "../db/db.js";

export const fetchJobs = () => {
    return db.query(`SELECT * FROM jobs ORDER BY created_at DESC`).then(({rows}) => {
        return rows;
    });
};

export const fetchJobById = (id) => {
    return db.query(`SELECT * FROM jobs WHERE job_id = $1`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Job not found'});
        }
        return rows[0];
    });
};

export const createJob = (newJob) => {
    const {
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
        is_active = true
    } = newJob;
    
    return db.query(`
        INSERT INTO jobs (
            title, company, company_logo, company_color, company_description, company_website, 
            description, industry, location, experience_level, role_type, work_type, job_link, 
            deadline, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING *`, 
        [title, company, company_logo, company_color, company_description, company_website, 
         description, industry, location, experience_level, role_type, work_type, job_link, 
         deadline, is_active]
    ).then(({rows}) => {
        return rows[0];
    });
};

export const updateJob = (updateJob, id) => {
    const fields = [];
    const values = [];
    const validFields = [
        "title", "company", "company_logo", "company_color", "company_description", "company_website", 
        "description", "industry", "location", "experience_level", "role_type", "work_type", "job_link", 
        "deadline", "is_active"
    ];
    let index = 1;

    for (const [key, value] of Object.entries(updateJob)) {
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
        UPDATE jobs
        SET ${fields.join(", ")}
        WHERE job_id = $${index}
        RETURNING *
    `;

    return db.query(query, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Job not found'});
        }
        return rows[0];
    });
};

export const removeJob = (id) => {
    return db.query(`DELETE FROM jobs WHERE job_id = $1 RETURNING *`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Job not found'});
        }
        return 'Job deleted!';
    });
};

export const fetchActiveJobs = () => {
    return db.query(`SELECT * FROM jobs WHERE is_active = true ORDER BY created_at DESC`).then(({rows}) => {
        return rows;
    });
};

export const fetchJobsByCompany = (company) => {
    return db.query(`SELECT * FROM jobs WHERE company ILIKE $1 ORDER BY created_at DESC`, [`%${company}%`]).then(({rows}) => {
        return rows;
    });
};
