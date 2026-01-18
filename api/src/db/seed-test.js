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
            linkedin VARCHAR(500),
            cv_file_name VARCHAR(255),
            cv_file_size VARCHAR(50),
            cv_storage_key VARCHAR(500),
            cv_storage_url VARCHAR(1000),
            cv_uploaded_at TIMESTAMP,
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
        company_logo TEXT,
        company_color VARCHAR(50),
        company_description TEXT,
        company_website VARCHAR(500),
        description TEXT,
        industry VARCHAR(255),
        location VARCHAR(255),
        experience_level VARCHAR(255),
        role_type VARCHAR(255),
        work_type VARCHAR(255),
        job_link VARCHAR(255),
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
        organiser VARCHAR(255) NOT NULL,
        organiser_logo TEXT,
        organiser_description TEXT,
        organiser_website VARCHAR(500),
        industry VARCHAR(255),
        event_type VARCHAR(255),
        location_type VARCHAR(50),
        location VARCHAR(255),
        address TEXT,
        capacity INT,
        event_link VARCHAR(255),
        description TEXT,
        event_image TEXT,
        event_date DATE NOT NULL,
        event_start_time TIME,
        event_end_time TIME,
        is_active BOOLEAN DEFAULT TRUE,
        applicant_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`).then(()=>{
            console.log("Event table created!✅")
        });
};

const createJobseekerJobApplicationsTable = () => {
    return testDb.query(`CREATE TABLE jobseekers_jobs_applied (
        jobseeker_id INT NOT NULL,
        job_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'applied',
        applied_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (jobseeker_id, job_id),
        FOREIGN KEY (jobseeker_id)
            REFERENCES jobseekers(jobseeker_id)
            ON DELETE CASCADE,
        FOREIGN KEY (job_id)
            REFERENCES jobs(job_id)
            ON DELETE CASCADE
        )`).then(()=>{
            console.log("Jobseekers jobs applied table created!✅")
        });
};

const createJobseekerJobsSavedTable = () => {
    return testDb.query(`CREATE TABLE jobseekers_jobs_saved (
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
            console.log("Jobseekers jobs saved table created!✅")
        });
};

const createJobseekerEventApplicationsTable = () => {
    return testDb.query(`CREATE TABLE jobseekers_events_applied (
        jobseeker_id INT NOT NULL,
        event_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'registered',
        applied_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (jobseeker_id, event_id),
        FOREIGN KEY (jobseeker_id)
            REFERENCES jobseekers(jobseeker_id)
            ON DELETE CASCADE,
        FOREIGN KEY (event_id)
            REFERENCES events(event_id)
            ON DELETE CASCADE
        )`).then(()=>{
            console.log("Jobseekers events applied table created!✅")
        });
};

const createJobseekerEventsSavedTable = () => {
    return testDb.query(`CREATE TABLE jobseekers_events_saved (
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
            console.log("Jobseekers events saved table created!✅")
        });
};

const createSocietyJobsSavedTable = () => {
    return testDb.query(`CREATE TABLE society_jobs_saved (
        society_id INT NOT NULL,
        job_id INT NOT NULL,
        saved_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (society_id, job_id),
        FOREIGN KEY (society_id)
            REFERENCES societies(society_id)
            ON DELETE CASCADE,
        FOREIGN KEY (job_id)
            REFERENCES jobs(job_id)
            ON DELETE CASCADE
        )`).then(()=>{
            console.log("Society jobs saved table created!✅")
        });
};

const createSocietyEventsSavedTable = () => {
    return testDb.query(`CREATE TABLE society_events_saved (
        society_id INT NOT NULL,
        event_id INT NOT NULL,
        saved_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (society_id, event_id),
        FOREIGN KEY (society_id)
            REFERENCES societies(society_id)
            ON DELETE CASCADE,
        FOREIGN KEY (event_id)
            REFERENCES events(event_id)
            ON DELETE CASCADE
        )`).then(()=>{
            console.log("Society events saved table created!✅")
        });
};

const createAdminUsersTable = () => {
    return testDb.query(`CREATE TABLE admin_users (
        admin_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_by INT REFERENCES admin_users(admin_id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
    )`).then(()=>{
        console.log("Admin users table created!✅")
    });
};

const createResourcesTable = () => {
    return testDb.query(`CREATE TABLE IF NOT EXISTS resources (
        resource_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        detailed_description TEXT,
        whats_included TEXT,
        category VARCHAR(100) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size VARCHAR(50),
        file_type VARCHAR(50) NOT NULL,
        storage_key VARCHAR(500) NOT NULL UNIQUE,
        storage_url VARCHAR(1000),
        download_count INT DEFAULT 0,
        uploaded_by VARCHAR(255),
        created_by INT REFERENCES admin_users(admin_id),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )`).then(()=>{
        console.log("Resources table created!✅")
    });
};

// Seed data insertion functions
const insertAdminUsers = async () => {
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.default.hash('Admin123!', 10);
    
    await testDb.query(`
        INSERT INTO admin_users (first_name, last_name, email, password_hash, role, is_active)
        VALUES 
            ('Sarah', 'Johnson', 'admin@fop.com', $1, 'super_admin', true),
            ('John', 'Smith', 'john.admin@fop.com', $1, 'admin', true),
            ('Emma', 'Williams', 'emma.admin@fop.com', $1, 'admin', true)
    `, [hashedPassword]);
    console.log('✅ Admin users seeded');
};

const insertJobseekers = async () => {
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.default.hash('Student123!', 10);
    
    // University students
    await testDb.query(`
        INSERT INTO jobseekers (
            first_name, last_name, email, password_hash, phone_number, date_of_birth,
            gender, ethnicity, school_meal_eligible, first_gen_to_go_uni,
            education_level, institution_name, uni_year, degree_type, area_of_study,
            role_interest_option_one, role_interest_option_two, society, linkedin
        ) VALUES 
            (
                'Alex', 'Chen', 'alex.chen@student.com', $1, '+447700900001', '2003-05-15',
                'male', 'Chinese', false, false,
                'undergraduate', 'King''s College London', '2nd', 'bsc', 'Computer Science',
                'Software Developer', 'Data Scientist', 'Tech Society', 'https://linkedin.com/in/alexchen'
            ),
            (
                'Maya', 'Patel', 'maya.patel@student.com', $1, '+447700900002', '2002-08-22',
                'female', 'Indian', false, true,
                'undergraduate', 'Imperial College London', '3rd', 'beng', 'Mechanical Engineering',
                'Mechanical Engineer', 'Project Manager', 'Engineering Society', 'https://linkedin.com/in/mayapatel'
            ),
            (
                'James', 'Wilson', 'james.wilson@student.com', $1, '+447700900003', '2004-11-30',
                'male', 'White British', true, false,
                'undergraduate', 'University of Manchester', '1st', 'ba', 'Economics',
                'Financial Analyst', 'Economist', 'Business Society', 'https://linkedin.com/in/jameswilson'
            )
    `, [hashedPassword]);
    
    // A-Level students
    await testDb.query(`
        INSERT INTO jobseekers (
            first_name, last_name, email, password_hash, phone_number, date_of_birth,
            gender, ethnicity, school_meal_eligible, first_gen_to_go_uni,
            education_level, institution_name, subject_one, subject_two, subject_three, subject_four,
            role_interest_option_one, role_interest_option_two
        ) VALUES 
            (
                'Sophie', 'Brown', 'sophie.brown@student.com', $1, '+447700900004', '2006-03-10',
                'female', 'White British', false, false,
                'a_level_or_btec', 'Harris Academy Barking', 'Mathematics', 'Physics', 'Chemistry', 'Further Mathematics',
                'Software Developer', 'Data Analyst'
            ),
            (
                'Oliver', 'Davis', 'oliver.davis@student.com', $1, '+447700900005', '2006-07-18',
                'male', 'Black British', true, true,
                'a_level_or_btec', 'Newham Sixth Form College', 'English Literature', 'History', 'Politics', 'Economics',
                'Policy Analyst', 'Journalist'
            )
    `, [hashedPassword]);
    
    console.log('✅ Jobseekers seeded (3 university + 2 A-level students)');
};

const insertSocieties = async () => {
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.default.hash('Society123!', 10);
    
    await testDb.query(`
        INSERT INTO societies (name, email, password_hash, description, university)
        VALUES 
            (
                'Tech Society', 'tech@society.com', $1,
                'Connecting students with opportunities in technology and software development',
                'King''s College London'
            ),
            (
                'Business Society', 'business@society.com', $1,
                'Empowering future business leaders through networking and career opportunities',
                'Imperial College London'
            ),
            (
                'Engineering Society', 'engineering@society.com', $1,
                'Supporting engineering students in their career journey',
                'University of Manchester'
            )
    `, [hashedPassword]);
    
    console.log('✅ Societies seeded');
};

const insertJobs = async () => {
    await testDb.query(`
        INSERT INTO jobs (
            title, company, company_logo, company_color, company_description, company_website,
            description, industry, location, experience_level, role_type, work_type, job_link,
            deadline, is_active
        ) VALUES 
            (
                'Software Engineering Intern', 'Google UK', 
                'https://logo.clearbit.com/google.com', '#4285F4', 
                'Google is a global technology leader focused on organizing the world''s information and making it universally accessible and useful.',
                'https://careers.google.com',
                'Join our team to work on cutting-edge technology projects. You will collaborate with experienced engineers to develop scalable solutions. Work on real products used by billions of users worldwide.',
                'Technology', 'London', 'Entry level', 'Internship', 'Hybrid',
                'https://careers.google.com/jobs/results/123456789',
                '2024-12-31', true
            ),
            (
                'Data Analyst Graduate', 'Deloitte', 
                'https://logo.clearbit.com/deloitte.com', '#86BC25', 
                'Deloitte is a leading global provider of audit and assurance, consulting, financial advisory, risk advisory, tax, and related services.',
                'https://www2.deloitte.com/uk/careers',
                'Analyze complex datasets to drive business insights. Work with clients across various industries including finance, healthcare, and technology. Comprehensive training program included.',
                'Consulting', 'Manchester', 'Entry level', 'Graduate Scheme', 'On-site',
                'https://www2.deloitte.com/uk/careers/graduates',
                '2024-11-30', true
            ),
            (
                'Remote Software Developer', 'Stripe', 
                'https://logo.clearbit.com/stripe.com', '#635BFF', 
                'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their operations online.',
                'https://stripe.com/jobs',
                'Build payment infrastructure for the internet. Fully remote position with flexible hours. Work on systems processing billions of dollars in transactions. Competitive salary and equity package.',
                'Technology', 'Remote', 'Mid level', 'Full-time', 'Remote',
                'https://stripe.com/jobs/listing/software-engineer',
                '2025-01-15', true
            ),
            (
                'Marketing Intern', 'Unilever', 
                'https://logo.clearbit.com/unilever.com', '#0077B5', 
                'Unilever is one of the world''s leading suppliers of Food, Home Care, Personal Care and Refreshment products with sales in over 190 countries.',
                'https://www.unilever.com/careers',
                'Gain hands-on experience in brand marketing and consumer insights. Work on real campaigns for iconic brands like Dove, Ben & Jerry''s, and Hellmann''s. Mentorship from senior marketers included.',
                'Marketing', 'London', 'Entry level', 'Internship', 'Hybrid',
                'https://www.unilever.com/careers/students-graduates',
                '2024-12-20', true
            ),
            (
                'Mechanical Engineering Graduate', 'Rolls-Royce', 
                'https://logo.clearbit.com/rolls-royce.com', '#5E2750', 
                'Rolls-Royce pioneers cutting-edge technologies that deliver the cleanest, safest and most competitive solutions to our planet''s vital power needs.',
                'https://careers.rolls-royce.com',
                'Design and develop next-generation aerospace systems. Work on engines that power aircraft and ships worldwide. Two-year graduate program with rotations across different engineering teams.',
                'Engineering', 'Derby', 'Entry level', 'Graduate Scheme', 'On-site',
                'https://careers.rolls-royce.com/graduates',
                '2024-12-15', true
            ),
            (
                'Finance Analyst', 'HSBC', 
                'https://logo.clearbit.com/hsbc.com', '#DB0011', 
                'HSBC is one of the world''s largest banking and financial services organizations, serving millions of customers through our global businesses.',
                'https://www.hsbc.com/careers',
                'Analyze financial data and support investment decisions. Work from anywhere in the UK with flexible remote working. Exposure to global markets and investment strategies. Professional qualifications support provided.',
                'Finance', 'Remote', 'Mid level', 'Full-time', 'Remote',
                'https://www.hsbc.com/careers/students-and-graduates',
                '2025-01-31', true
            )
    `);
    
    console.log('✅ Jobs seeded (3 in-person/hybrid + 3 remote/virtual)');
};

const insertEvents = async () => {
    await testDb.query(`
        INSERT INTO events (
            title, organiser, organiser_logo, organiser_description, organiser_website,
            industry, event_type, location_type, location, address, capacity, event_link,
            description, event_image, event_date, event_start_time, event_end_time, is_active
        ) VALUES 
            (
                'Tech Career Fair 2024', 'King''s College London',
                'https://logo.clearbit.com/kcl.ac.uk',
                'Leading university in London connecting students with top employers',
                'https://kcl.ac.uk',
                'Technology', 'career_fair', 'in_person',
                'London', 'Strand Campus, King''s College London, WC2R 2LS', 500,
                NULL,
                'Meet with recruiters from Google, Meta, Amazon, and more. Bring your CV and dress professionally.',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
                '2024-11-25', '10:00:00', '16:00:00', true
            ),
            (
                'Virtual Networking Night: Finance Careers', 'Business Society',
                'https://logo.clearbit.com/icbusiness.com',
                'Imperial College Business Society - Connecting students with top finance firms',
                'https://icbusiness.com',
                'Finance', 'networking', 'online',
                'Virtual Event', 'Online', 200,
                'https://zoom.us/j/123456789',
                'Connect with finance professionals from Goldman Sachs, JP Morgan, and Barclays. Join us online via Zoom for an evening of networking and career insights. Meeting link will be sent 24 hours before the event.',
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
                '2024-11-20', '18:00:00', '20:00:00', true
            ),
            (
                'Engineering Workshop: CAD Fundamentals', 'Engineering Society',
                'https://logo.clearbit.com/manchestereng.com',
                'University of Manchester Engineering Society',
                'https://manchestereng.com',
                'Engineering', 'workshop', 'in_person',
                'Manchester', 'Engineering Building A, University of Manchester, M13 9PL', 50,
                NULL,
                'Hands-on workshop learning AutoCAD and SolidWorks. Laptops will be provided.',
                'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
                '2024-11-22', '14:00:00', '17:00:00', true
            ),
            (
                'Online Panel: Breaking into Tech', 'Tech Society',
                'https://logo.clearbit.com/kcltech.com',
                'King''s College London Tech Society - Empowering the next generation of tech leaders',
                'https://kcltech.com',
                'Technology', 'panel_discussion', 'online',
                'Virtual Event', 'Online', 300,
                'https://teams.microsoft.com/l/meetup-join/19',
                'Hear from software engineers at Spotify, Monzo, and Revolut about their career journeys. Learn about breaking into tech, interview tips, and what it''s really like working at top tech companies. Q&A session included.',
                'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
                '2024-11-18', '19:00:00', '20:30:00', true
            ),
            (
                'CV Review Drop-in Session', 'Careers Service',
                'https://logo.clearbit.com/kcl.ac.uk',
                'King''s College London Careers Service',
                'https://kcl.ac.uk/careers',
                'General', 'workshop', 'in_person',
                'London', 'Careers Centre, King''s College London, WC2R 2LS', 30,
                NULL,
                'Get your CV reviewed by careers advisors. No booking required, drop in anytime.',
                'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
                '2024-11-21', '12:00:00', '15:00:00', true
            ),
            (
                'Virtual Coding Bootcamp', 'Google',
                'https://logo.clearbit.com/google.com',
                'Google UK - Building the future of technology together',
                'https://careers.google.com',
                'Technology', 'workshop', 'online',
                'Virtual Event', 'Online', 1000,
                'https://meet.google.com/abc-defg-hij',
                'Free 3-hour coding workshop covering Python basics and data structures. All levels welcome. Learn from Google engineers and get hands-on practice with real coding challenges. Certificate of completion provided.',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
                '2024-11-28', '10:00:00', '13:00:00', true
            )
    `);
    
    console.log('✅ Events seeded (3 in-person + 3 online)');
};

const insertResources = async () => {
    await testDb.query(`
        INSERT INTO resources (
            title, description, detailed_description, whats_included, category,
            file_name, file_size, file_type, storage_key, storage_url,
            uploaded_by, is_active
        ) VALUES 
            (
                'CV Writing Guide 2024', 
                'Comprehensive guide to writing an effective CV for graduate applications',
                'This detailed guide covers everything you need to know about creating a standout CV. Learn about formatting, content structure, and what recruiters look for.',
                '• 20-page PDF guide\n• CV templates\n• Industry-specific examples\n• Common mistakes to avoid',
                'CV & Cover Letters',
                'cv-writing-guide-2024.pdf', '2.5 MB', 'application/pdf',
                'resources/cv-writing-guide-2024.pdf',
                'https://storage.fop.com/resources/cv-writing-guide-2024.pdf',
                'FOP Team', true
            ),
            (
                'Technical Interview Preparation', 
                'Master coding interviews with practice problems and solutions',
                'Prepare for technical interviews at top tech companies. Includes data structures, algorithms, and system design questions.',
                '• 150+ coding problems\n• Video solutions\n• Time complexity analysis\n• Mock interview tips',
                'Interview Prep',
                'technical-interview-prep.pdf', '5.8 MB', 'application/pdf',
                'resources/technical-interview-prep.pdf',
                'https://storage.fop.com/resources/technical-interview-prep.pdf',
                'FOP Team', true
            ),
            (
                'Finance Career Pathways', 
                'Explore different career paths in finance and banking',
                'Understand the various roles available in finance, from investment banking to asset management.',
                '• Career path diagrams\n• Role descriptions\n• Salary expectations\n• Required qualifications',
                'Career Guides',
                'finance-career-pathways.pdf', '3.2 MB', 'application/pdf',
                'resources/finance-career-pathways.pdf',
                'https://storage.fop.com/resources/finance-career-pathways.pdf',
                'FOP Team', true
            ),
            (
                'LinkedIn Optimization Checklist', 
                'Step-by-step guide to creating a professional LinkedIn profile',
                'Optimize your LinkedIn profile to attract recruiters and build your professional network.',
                '• Profile checklist\n• Headline examples\n• Summary templates\n• Networking strategies',
                'Professional Development',
                'linkedin-optimization.pdf', '1.8 MB', 'application/pdf',
                'resources/linkedin-optimization.pdf',
                'https://storage.fop.com/resources/linkedin-optimization.pdf',
                'FOP Team', true
            ),
            (
                'Assessment Centre Success Guide', 
                'Navigate assessment centres with confidence',
                'Learn what to expect at assessment centres and how to excel in group exercises, presentations, and case studies.',
                '• Assessment centre overview\n• Group exercise tips\n• Presentation frameworks\n• Case study examples',
                'Interview Prep',
                'assessment-centre-guide.pdf', '4.1 MB', 'application/pdf',
                'resources/assessment-centre-guide.pdf',
                'https://storage.fop.com/resources/assessment-centre-guide.pdf',
                'FOP Team', true
            )
    `);
    
    console.log('✅ Resources seeded');
};

const runTestSeed = async () => {
    console.log('Seeding test database...');
    
    try {
        // Drop tables in reverse order of dependencies (child tables first)
        await testDb.query('DROP TABLE IF EXISTS resources CASCADE');
        await testDb.query('DROP TABLE IF EXISTS admin_users CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobseekers_jobs_applied CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobseekers_jobs_saved CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobseekers_events_applied CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobseekers_events_saved CASCADE');
        await testDb.query('DROP TABLE IF EXISTS society_jobs_saved CASCADE');
        await testDb.query('DROP TABLE IF EXISTS society_events_saved CASCADE');
        await testDb.query('DROP TABLE IF EXISTS events CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobs CASCADE');
        await testDb.query('DROP TABLE IF EXISTS societies CASCADE');
        await testDb.query('DROP TABLE IF EXISTS jobseekers CASCADE');
        
        await createJobseekersTable();
        await createSocietiesTable();
        await createJobsTable();
        await createEventsTable();
        await createJobseekerJobApplicationsTable();
        await createJobseekerJobsSavedTable();
        await createJobseekerEventApplicationsTable();
        await createJobseekerEventsSavedTable();
        await createSocietyJobsSavedTable();
        await createSocietyEventsSavedTable();
        await createAdminUsersTable();
        await createResourcesTable();
        
        // Insert seed data
        await insertAdminUsers();
        await insertJobseekers();
        await insertSocieties();
        await insertJobs();
        await insertEvents();
        await insertResources();
        
        console.log('✅ Test database seeded successfully with data!');
        await testDb.end();
    } catch (err) {
        console.error('❌ Test database seed failed:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    }
};

runTestSeed();
