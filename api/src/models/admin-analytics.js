import db from "../db/db.js";

// Job application analytics
export const fetchJobApplicationStats = () => {
    return db.query(`
        SELECT 
            j.job_id,
            j.title,
            j.company,
            COUNT(jja.jobseeker_id) as application_count
        FROM jobs j
        LEFT JOIN jobseekers_jobs_applied jja ON j.job_id = jja.job_id
        GROUP BY j.job_id, j.title, j.company
        ORDER BY application_count DESC
    `).then(({rows}) => {
        return rows;
    });
};

export const fetchJobApplicationsByJobId = (jobId) => {
    return db.query(`
        SELECT 
            js.jobseeker_id,
            js.first_name,
            js.last_name,
            js.email,
            js.institution_name,
            js.education_level,
            jja.applied_at
        FROM jobseekers_jobs_applied jja
        JOIN jobseekers js ON jja.jobseeker_id = js.jobseeker_id
        WHERE jja.job_id = $1
        ORDER BY jja.applied_at DESC
    `, [jobId]).then(({rows}) => {
        return rows;
    });
};

// Event application analytics
export const fetchEventApplicationStats = () => {
    return db.query(`
        SELECT 
            e.event_id,
            e.title,
            e.company,
            e.event_date,
            COUNT(jea.jobseeker_id) as application_count
        FROM events e
        LEFT JOIN jobseekers_events_applied jea ON e.event_id = jea.event_id
        GROUP BY e.event_id, e.title, e.company, e.event_date
        ORDER BY application_count DESC
    `).then(({rows}) => {
        return rows;
    });
};

export const fetchEventApplicationsByEventId = (eventId) => {
    return db.query(`
        SELECT 
            js.jobseeker_id,
            js.first_name,
            js.last_name,
            js.email,
            js.institution_name,
            js.education_level,
            jea.applied_at
        FROM jobseekers_events_applied jea
        JOIN jobseekers js ON jea.jobseeker_id = js.jobseeker_id
        WHERE jea.event_id = $1
        ORDER BY jea.applied_at DESC
    `, [eventId]).then(({rows}) => {
        return rows;
    });
};

// Student filtering functions
export const fetchStudentsByGender = (gender) => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            gender,
            institution_name,
            education_level,
            created_at
        FROM jobseekers
        WHERE gender = $1
        ORDER BY created_at DESC
    `, [gender]).then(({rows}) => {
        return rows;
    });
};

export const fetchStudentsByUniversity = (university) => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            institution_name,
            education_level,
            uni_year,
            degree_type,
            area_of_study,
            created_at
        FROM jobseekers
        WHERE LOWER(institution_name) LIKE LOWER($1)
        ORDER BY created_at DESC
    `, [`%${university}%`]).then(({rows}) => {
        return rows;
    });
};

export const fetchStudentsBySociety = (society) => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            society,
            institution_name,
            education_level,
            created_at
        FROM jobseekers
        WHERE LOWER(society) LIKE LOWER($1)
        ORDER BY created_at DESC
    `, [`%${society}%`]).then(({rows}) => {
        return rows;
    });
};

export const fetchStudentsEligibleForFreeMeals = () => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            school_meal_eligible,
            institution_name,
            education_level,
            created_at
        FROM jobseekers
        WHERE school_meal_eligible = true
        ORDER BY created_at DESC
    `).then(({rows}) => {
        return rows;
    });
};

export const fetchFirstGenStudents = () => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            first_gen_to_go_uni,
            institution_name,
            education_level,
            created_at
        FROM jobseekers
        WHERE first_gen_to_go_uni = true
        ORDER BY created_at DESC
    `).then(({rows}) => {
        return rows;
    });
};

export const fetchStudentsByEducationStatus = (educationLevel) => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            education_level,
            institution_name,
            uni_year,
            degree_type,
            area_of_study,
            created_at
        FROM jobseekers
        WHERE education_level = $1
        ORDER BY created_at DESC
    `, [educationLevel]).then(({rows}) => {
        return rows;
    });
};

export const fetchUserByName = (searchName) => {
    return db.query(`
        SELECT 
            jobseeker_id,
            first_name,
            last_name,
            email,
            phone_number,
            institution_name,
            education_level,
            society,
            created_at
        FROM jobseekers
        WHERE LOWER(first_name) LIKE LOWER($1) 
           OR LOWER(last_name) LIKE LOWER($1)
           OR LOWER(CONCAT(first_name, ' ', last_name)) LIKE LOWER($1)
        ORDER BY created_at DESC
    `, [`%${searchName}%`]).then(({rows}) => {
        return rows;
    });
};

// Summary analytics
export const fetchAnalyticsSummary = () => {
    return db.query(`
        SELECT 
            (SELECT COUNT(*) FROM jobseekers) as total_students,
            (SELECT COUNT(*) FROM jobs) as total_jobs,
            (SELECT COUNT(*) FROM events) as total_events,
            (SELECT COUNT(*) FROM jobseekers_jobs_applied) as total_job_applications,
            (SELECT COUNT(*) FROM jobseekers_events_applied) as total_event_applications,
            (SELECT COUNT(*) FROM jobseekers WHERE school_meal_eligible = true) as free_meal_eligible_count,
            (SELECT COUNT(*) FROM jobseekers WHERE first_gen_to_go_uni = true) as first_gen_count
    `).then(({rows}) => {
        return rows[0];
    });
};
