import dotenv from 'dotenv';
import pkg from "pg";

// Load test environment first
dotenv.config({ path: '.env.test' });

const { Pool } = pkg;

// Create a direct connection to test database
const testDb = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

console.log('Connecting to test database:', process.env.DATABASE_URL);

// Seed functions using the test database connection
const createJobseekersTable = () => {
    return testDb.query(`
        -- Create ENUM types first
        DO $$ BEGIN
            CREATE TYPE education_level_enum AS ENUM (
                'a_level_or_btec', 'undergraduate', 'postgraduate', 'phd', 'other'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        DO $$ BEGIN
            CREATE TYPE uni_year_enum AS ENUM (
                'foundation', '1st', '2nd', '3rd', '4th', '5th', 'masters', 'phd_year_1', 'phd_year_2', 'phd_year_3', 'phd_year_4', 'graduated'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        DO $$ BEGIN
            CREATE TYPE gender_enum AS ENUM (
                'male', 'female', 'non_binary', 'prefer_not_to_say', 'other'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        DO $$ BEGIN
            CREATE TYPE degree_type_enum AS ENUM (
                'ba', 'bsc', 'beng', 'llb', 'bmed', 'ma', 'msc', 'meng', 'mba', 'llm', 'phd', 'other'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        -- Create the table with constraints
        CREATE TABLE jobseekers (
            jobseeker_id SERIAL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20),
            date_of_birth DATE CHECK (date_of_birth <= CURRENT_DATE),
            gender gender_enum,
            ethnicity VARCHAR(255),
            school_meal_eligible BOOLEAN,
            first_gen_to_go_uni BOOLEAN,
            education_level education_level_enum,
            institution_name VARCHAR(255),
            uni_year uni_year_enum,
            degree_type degree_type_enum,
            area_of_study VARCHAR(255),
            subject_one VARCHAR(255),
            subject_two VARCHAR(255),
            subject_three VARCHAR(255),
            subject_four VARCHAR(255),
            role_interest_option_one VARCHAR(255),
            role_interest_option_two VARCHAR(255),
            society VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            
            -- University details required for undergraduate/postgraduate/phd
            CONSTRAINT university_details_required CHECK (
                (education_level IN ('undergraduate', 'postgraduate', 'phd') AND 
                 institution_name IS NOT NULL AND 
                 uni_year IS NOT NULL AND 
                 degree_type IS NOT NULL AND 
                 area_of_study IS NOT NULL) OR 
                education_level NOT IN ('undergraduate', 'postgraduate', 'phd')
            ),
            
            -- Subjects are ONLY required for A-level/BTEC students (university students don't need them)
            CONSTRAINT subjects_check CHECK (
                (education_level = 'a_level_or_btec' AND subject_one IS NOT NULL) OR 
                education_level != 'a_level_or_btec'
            ),
            
            -- PhD students should have graduated uni_year or specific PhD years
            CONSTRAINT phd_year_check CHECK (
                (education_level = 'phd' AND uni_year IN ('phd_year_1', 'phd_year_2', 'phd_year_3', 'phd_year_4', 'graduated')) OR 
                education_level != 'phd'
            ),
            
            -- Undergraduate students should have appropriate years
            CONSTRAINT undergrad_year_check CHECK (
                (education_level = 'undergraduate' AND uni_year IN ('foundation', '1st', '2nd', '3rd', '4th', '5th', 'graduated')) OR 
                education_level != 'undergraduate'
            )
        )`).then(()=>{
            console.log("Jobseeker table created with constraints!✅")
        });
};

const createSocietiesTable = () => {
    return testDb.query(`CREATE TABLE societies (
        society_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        university VARCHAR(255) NOT NULL,
        description TEXT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Society table created!✅")
        });
};

const createJobsTable = () => {
    return testDb.query(`CREATE TABLE jobs (
        job_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT,
        industry VARCHAR(255),
        location VARCHAR(255),
        job_level VARCHAR(255),
        role_type VARCHAR(255),
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
        });
};

const createEventsTable = () => {
    return testDb.query(`CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        industry VARCHAR(255),
        location VARCHAR(255) NOT NULL,
        event_link VARCHAR(255),
        contact_email VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        event_time TIME,
        is_active BOOLEAN DEFAULT TRUE,
        applicant_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Event table created!✅")
        });
};

const createJobApplicationsTable = () => {
    return testDb.query(`CREATE TABLE job_applications (
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
        });
};

const createJobsSavedTable = () => {
    return testDb.query(`CREATE TABLE jobs_saved (
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
            console.log("Jobs saved table created!✅")
        });
};

const createEventApplicationsTable = () => {
    return testDb.query(`CREATE TABLE event_applications (
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
        });
};

const createEventsSavedTable = () => {
    return testDb.query(`CREATE TABLE events_saved (
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
            console.log("Events saved table created!✅")
        });
};

const runTestSeed = async () => {
    console.log('Seeding test database...');
    
    try {
        // Drop tables in reverse order of dependencies (child tables first)
        await testDb.query('DROP TABLE IF EXISTS job_applications CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobs_saved CASCADE');
        await testDb.query('DROP TABLE IF EXISTS event_applications CASCADE');
        await testDb.query('DROP TABLE IF EXISTS events_saved CASCADE');
        await testDb.query('DROP TABLE IF EXISTS events CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobs CASCADE');
        await testDb.query('DROP TABLE IF EXISTS societies CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobseekers CASCADE');
        
        await createJobseekersTable();
        await createSocietiesTable();
        await createJobsTable();
        await createEventsTable();
        await createJobApplicationsTable();
        await createJobsSavedTable();
        await createEventApplicationsTable();
        await createEventsSavedTable();
        
        console.log('✅ Test database seeded successfully!');
        await testDb.end();
    } catch (err) {
        console.error('❌ Test database seed failed:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    }
};

runTestSeed();
