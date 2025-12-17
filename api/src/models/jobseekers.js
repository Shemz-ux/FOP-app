import db from "../db/db.js";

export const fetchJobseekers = () => {
    return db.query(`SELECT * FROM jobseekers`).then(({rows}) => {
        return rows;
    });
};

export const fetchJobseekerById = (id) => {
    return db.query(`SELECT * FROM jobseekers WHERE jobseeker_id = $1`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Jobseeker not found'});
        }
        return rows[0];
    });
};

export const createJobseeker = (newJobseeker) => {
    const {
        first_name, 
        last_name, 
        email, 
        password_hash, 
        phone_number, 
        date_of_birth, 
        gender, 
        ethnicity, 
        school_meal_eligible, 
        first_gen_to_go_uni, 
        education_level, 
        area_of_study, 
        role_of_interest, 
        society
    } = newJobseeker;
    
    return db.query(`
        INSERT INTO jobseekers (
            first_name, last_name, email, password_hash, phone_number, 
            date_of_birth, gender, ethnicity, school_meal_eligible, 
            first_gen_to_go_uni, education_level, area_of_study, 
            role_of_interest, society
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING *`, 
        [first_name, last_name, email, password_hash, phone_number, 
         date_of_birth, gender, ethnicity, school_meal_eligible, 
         first_gen_to_go_uni, education_level, area_of_study, 
         role_of_interest, society]
    ).then(({rows}) => {
        return rows[0];
    });
};

export const updateJobseeker = (updateJobseeker, id) => {
    const fields = [];
    const values = [];
    const validFields = [
        "first_name", "last_name", "email", "phone_number", "date_of_birth", 
        "gender", "ethnicity", "school_meal_eligible", "first_gen_to_go_uni", 
        "education_level", "area_of_study", "role_of_interest", "society"
    ];
    let index = 1;

    for (const [key, value] of Object.entries(updateJobseeker)) {
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
        UPDATE jobseekers
        SET ${fields.join(", ")}
        WHERE jobseeker_id = $${index}
        RETURNING *
    `;

    return db.query(query, values).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Jobseeker not found'});
        }
        return rows[0];
    });
};

export const removeJobseeker = (id) => {
    return db.query(`DELETE FROM jobseekers WHERE jobseeker_id = $1 RETURNING *`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Jobseeker not found'});
        }
        return 'Jobseeker deleted!';
    });
};
