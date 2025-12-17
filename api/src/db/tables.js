import db from "./db.js"

const seed = () => {
    // Drop tables in reverse order of dependencies (child tables first)
    return db.query('DROP TABLE IF EXISTS job_applications CASCADE')
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS jobs_saved CASCADE')
    })
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS events_saved CASCADE')
    })
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS event_applications CASCADE')
    })
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS jobs CASCADE')
    })
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS events CASCADE')
    })
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS societies CASCADE')
    })
    .then(()=>{
        return db.query('DROP TABLE IF EXISTS jobseekers CASCADE')
    })
    .then(()=>{
        return users()
    }).then(()=>{
        return societies()
    }).then(()=>{
        return jobs()
    }).then(()=>{
        return events()
    }).then(()=>{
        return job_applications()
    }).then(()=>{
        return jobs_saved()
    }).then(()=>{
        return events_saved()
    }).then(()=>{
        return event_applications()
    })
}

const users = () => {
    return db.query(`CREATE TABLE jobseekers (
        jobseeker_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) NOT NULL unique,
        password_hash VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        date_of_birth DATE,
        gender VARCHAR(255),
        ethnicity VARCHAR(255),
        school_meal_eligible VARCHAR(255),
        first_gen_to_go_uni VARCHAR(255),
        education_level VARCHAR(255),
        area_of_study VARCHAR(255),
        role_of_interest VARCHAR(255),
        society VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Jobseeker table created!✅")
        })
}

const societies = () => {
    return db.query(`CREATE TABLE societies (
        society_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        university VARCHAR(255) NOT NULL,
        description TEXT,
        email VARCHAR(255) NOT NULL unique,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Society table created!✅")
        })
}

const jobs = () => {
    return db.query(`CREATE TABLE jobs (
        job_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT,
        industry VARCHAR(255),
        location VARCHAR(255),
        job_level VARCHAR(255),
        role_type VARCHAR(255),
        contact VARCHAR(255),
        contact_email VARCHAR(255),
        job_link VARCHAR(255),
        salary VARCHAR(255),
        deadline DATE,
        is_active BOOLEAN DEFAULT TRUE,
        applicant_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Job table created!✅")
        })
}

const events = () => {
    return db.query(`CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        industry VARCHAR(255),
        location VARCHAR(255) NOT NULL,
        event_link VARCHAR(255),
        contact_email VARCHAR(255) NOT NULL,
        deadline DATE,
        is_active BOOLEAN DEFAULT TRUE,
        applicant_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Event table created!✅")
        })
}

const job_applications = () => {
    return db.query(`CREATE TABLE job_applications (
    jobseeker_id INT NOT NULL,
    job_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jobseeker_id, job_id),
    FOREIGN KEY (jobseeker_id)
        REFERENCES jobseekers(jobseeker_id)
        ON DELETE CASCADE,
    FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE
    )`).then(()=>{
            console.log("Job application table created!✅")
        })
}

const jobs_saved = () => {
    return db.query(`CREATE TABLE jobs_saved (
    jobseeker_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jobseeker_id, job_id),
    FOREIGN KEY (jobseeker_id)
        REFERENCES jobseekers(jobseeker_id)
        ON DELETE CASCADE,
    FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE
    )`).then(()=>{
            console.log("Job saved table created!✅")
        })
}

const event_applications = () => {
    return db.query(`CREATE TABLE event_applications (
    jobseeker_id INT NOT NULL,
    event_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jobseeker_id, event_id),
    FOREIGN KEY (jobseeker_id)
        REFERENCES jobseekers(jobseeker_id)
        ON DELETE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON DELETE CASCADE
    )`).then(()=>{
            console.log("Event application table created!✅")
        })
}

const events_saved = () => {
    return db.query(`CREATE TABLE events_saved (
    jobseeker_id INT NOT NULL,
    event_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jobseeker_id, event_id),
    FOREIGN KEY (jobseeker_id)
        REFERENCES jobseekers(jobseeker_id)
        ON DELETE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES events(event_id)
        ON DELETE CASCADE
    )`).then(()=>{
            console.log("Event saved table created!✅")
        })
}



export default seed;