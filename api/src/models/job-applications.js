import db from "../db/db.js";

export const fetchJobApplications = (job_id) => {
    return db.query(
        `SELECT 
            jja.jobseeker_id,
            jja.job_id,
            jja.status,
            jja.applied_at,
            j.jobseeker_id,
            j.first_name,
            j.last_name,
            j.email,
            j.phone_number,
            j.institution_name,
            j.area_of_study,
            j.uni_year,
            j.education_level,
            j.degree_type,
            j.first_gen_to_go_uni,
            j.school_meal_eligible,
            j.subject_one
        FROM jobseekers_jobs_applied jja
        JOIN jobseekers j ON jja.jobseeker_id = j.jobseeker_id
        WHERE jja.job_id = $1
        ORDER BY jja.applied_at DESC`,
        [job_id]
    ).then(({ rows }) => {
        return rows.map(row => ({
            application_id: `${row.jobseeker_id}-${row.job_id}`,
            jobseeker_id: row.jobseeker_id,
            job_id: row.job_id,
            status: row.status,
            applied_at: row.applied_at,
            jobseeker: {
                jobseeker_id: row.jobseeker_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                phone_number: row.phone_number,
                institution_name: row.institution_name,
                area_of_study: row.area_of_study,
                uni_year: row.uni_year,
                education_level: row.education_level,
                degree_type: row.degree_type,
                first_gen_to_go_uni: row.first_gen_to_go_uni,
                school_meal_eligible: row.school_meal_eligible,
                subject_one: row.subject_one
            }
        }));
    });
};
