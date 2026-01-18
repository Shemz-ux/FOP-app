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
                'Software Engineering Summer Intern', 'Google UK', 
                'https://logo.clearbit.com/google.com', '#4285F4', 
                'Google is a global technology leader focused on organizing the world''s information and making it universally accessible and useful.',
                'https://careers.google.com',
                'Join our team to work on cutting-edge technology projects. You will collaborate with experienced engineers to develop scalable solutions. Work on real products used by billions of users worldwide. 12-week summer program with mentorship and networking opportunities.',
                'Technology', 'London', 'Student', 'Summer Intern', 'Hybrid',
                'https://careers.google.com/jobs/results/123456789',
                '2025-03-31', true
            ),
            (
                'Data Analyst Graduate Programme', 'Deloitte', 
                'https://logo.clearbit.com/deloitte.com', '#86BC25', 
                'Deloitte is a leading global provider of audit and assurance, consulting, financial advisory, risk advisory, tax, and related services.',
                'https://www2.deloitte.com/uk/careers',
                'Analyze complex datasets to drive business insights. Work with clients across various industries including finance, healthcare, and technology. Comprehensive 2-year training program with rotations across different teams and professional qualifications support.',
                'Consulting', 'Manchester', 'Graduate', 'Grad Programme', 'On-site',
                'https://www2.deloitte.com/uk/careers/graduates',
                '2025-02-28', true
            ),
            (
                'Full Stack Developer', 'Stripe', 
                'https://logo.clearbit.com/stripe.com', '#635BFF', 
                'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their operations online.',
                'https://stripe.com/jobs',
                'Build payment infrastructure for the internet. Fully remote position with flexible hours. Work on systems processing billions of dollars in transactions. Competitive salary, equity package, and comprehensive benefits. Experience with React, Node.js, and PostgreSQL required.',
                'Technology', 'Remote', 'Mid Level', 'Full-time', 'Remote',
                'https://stripe.com/jobs/listing/software-engineer',
                '2025-04-15', true
            ),
            (
                'Marketing Spring Week', 'Unilever', 
                'https://logo.clearbit.com/unilever.com', '#0077B5', 
                'Unilever is one of the world''s leading suppliers of Food, Home Care, Personal Care and Refreshment products with sales in over 190 countries.',
                'https://www.unilever.com/careers',
                'Gain hands-on experience in brand marketing and consumer insights during our 1-week spring program. Work on real campaigns for iconic brands like Dove, Ben & Jerry''s, and Hellmann''s. Mentorship from senior marketers included. Potential fast-track to summer internship.',
                'Marketing', 'London', 'Penultimate Year', 'Spring Week', 'Hybrid',
                'https://www.unilever.com/careers/students-graduates',
                '2025-01-31', true
            ),
            (
                'Mechanical Engineering Graduate Scheme', 'Rolls-Royce', 
                'https://logo.clearbit.com/rolls-royce.com', '#5E2750', 
                'Rolls-Royce pioneers cutting-edge technologies that deliver the cleanest, safest and most competitive solutions to our planet''s vital power needs.',
                'https://careers.rolls-royce.com',
                'Design and develop next-generation aerospace systems. Work on engines that power aircraft and ships worldwide. Two-year graduate program with rotations across different engineering teams including design, testing, and manufacturing. Chartership support provided.',
                'Engineering', 'Derby', 'Graduate', 'Grad Scheme', 'On-site',
                'https://careers.rolls-royce.com/graduates',
                '2025-02-15', true
            ),
            (
                'Investment Banking Analyst', 'HSBC', 
                'https://logo.clearbit.com/hsbc.com', '#DB0011', 
                'HSBC is one of the world''s largest banking and financial services organizations, serving millions of customers through our global businesses.',
                'https://www.hsbc.com/careers',
                'Analyze financial data and support investment decisions. Work from anywhere in the UK with flexible remote working. Exposure to global markets, M&A deals, and investment strategies. Professional qualifications (CFA/ACA) support provided. Competitive salary and bonus structure.',
                'Finance', 'Remote', 'Associate', 'Full-time', 'Remote',
                'https://www.hsbc.com/careers/students-and-graduates',
                '2025-03-31', true
            ),
            (
                'UX Design Year Placement', 'Meta', 
                'https://logo.clearbit.com/meta.com', '#0084FF', 
                'Meta builds technologies that help people connect, find communities, and grow businesses. From Facebook and Instagram to WhatsApp and Messenger.',
                'https://www.metacareers.com',
                'Join our design team for a 12-month placement working on products used by billions. Collaborate with product managers, engineers, and researchers. Work on real features from concept to launch. Mentorship, training, and potential return offer for graduates.',
                'Design', 'London', 'Final Year', 'Year Placement', 'Hybrid',
                'https://www.metacareers.com/jobs',
                '2025-01-15', true
            ),
            (
                'Cybersecurity Apprentice', 'GCHQ', 
                'https://logo.clearbit.com/gchq.gov.uk', '#003366', 
                'GCHQ is the UK''s intelligence, security and cyber agency. We work to keep the UK safe and prosperous in an increasingly complex digital world.',
                'https://www.gchq-careers.co.uk',
                'Learn cybersecurity while earning. 4-year degree apprenticeship combining work at GCHQ with university study. Gain hands-on experience in threat detection, incident response, and security operations. Full salary, tuition fees paid, and security clearance provided.',
                'Cybersecurity', 'Cheltenham', 'No Experience', 'Degree Apprentice', 'On-site',
                'https://www.gchq-careers.co.uk/apprenticeships',
                '2025-02-28', true
            ),
            (
                'Product Manager Insight Day', 'Amazon', 
                'https://logo.clearbit.com/amazon.com', '#FF9900', 
                'Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.',
                'https://www.amazon.jobs',
                'One-day insight into product management at Amazon. Learn about the role, meet current PMs, participate in workshops, and work on a mini case study. Lunch and networking included. Open to all year groups. Potential fast-track to internship interviews.',
                'Technology', 'London', 'Student', 'Insight Day', 'On-site',
                'https://www.amazon.jobs/students',
                '2025-01-20', true
            ),
            (
                'Data Science Contract', 'BBC', 
                'https://logo.clearbit.com/bbc.co.uk', '#BB1919', 
                'The BBC is the world''s leading public service broadcaster. We''re impartial, independent and working for the benefit of all.',
                'https://careers.bbc.co.uk',
                'Work on data analytics projects for BBC iPlayer and BBC Sounds. 6-month contract with possibility of extension. Analyze user behavior, build recommendation systems, and create data visualizations. Experience with Python, SQL, and machine learning required.',
                'Data Science', 'Manchester', 'Mid Level', 'Contract', 'Hybrid',
                'https://careers.bbc.co.uk/jobs',
                '2025-02-15', true
            ),
            (
                'Legal Vacation Scheme', 'Clifford Chance', 
                'https://logo.clearbit.com/cliffordchance.com', '#C41E3A', 
                'Clifford Chance is one of the world''s leading law firms, helping clients achieve their goals by combining the highest global standards with local expertise.',
                'https://www.cliffordchance.com/careers',
                'Two-week vacation scheme experiencing life as a trainee solicitor. Work in two practice areas, attend workshops, and receive mentorship. Assessed for training contract. Accommodation and travel expenses provided for non-London students.',
                'Law', 'London', 'Penultimate Year', 'Vac Scheme', 'On-site',
                'https://www.cliffordchance.com/careers/students-graduates',
                '2025-01-31', true
            ),
            (
                'Part-Time Research Assistant', 'Imperial College London', 
                'https://logo.clearbit.com/imperial.ac.uk', '#003E74', 
                'Imperial College London is a world-leading university in science, engineering, medicine and business, with a reputation for excellence in teaching and research.',
                'https://www.imperial.ac.uk/jobs',
                'Support research in AI and machine learning. Flexible hours (15-20 hours/week) to fit around studies. Assist with literature reviews, data collection, and experiment design. Great for PhD applications. Requires strong Python skills and interest in research.',
                'Research & Development', 'London', 'Student', 'Part-time', 'Hybrid',
                'https://www.imperial.ac.uk/jobs/research',
                '2025-03-01', true
            )
    `);
    
    console.log('✅ Jobs seeded (12 diverse roles with proper categories)');
};

const insertEvents = async () => {
    await testDb.query(`
        INSERT INTO events (
            title, organiser, organiser_logo, organiser_description, organiser_website,
            industry, event_type, location_type, location, address, capacity, event_link,
            description, event_image, event_date, event_start_time, event_end_time, is_active
        ) VALUES 
            (
                'Tech Career Fair 2025', 'King''s College London',
                'https://logo.clearbit.com/kcl.ac.uk',
                'Leading university in London connecting students with top employers',
                'https://kcl.ac.uk',
                'Technology', 'career_fair', 'in_person',
                'London', 'Strand Campus, King''s College London, WC2R 2LS', 500,
                NULL,
                'Meet with recruiters from Google, Meta, Amazon, Microsoft, and 50+ tech companies. Bring multiple copies of your CV and dress in business casual attire. Free professional headshots available. Register early as spaces are limited.',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
                '2025-02-15', '10:00:00', '16:00:00', true
            ),
            (
                'Finance & Consulting Networking Evening', 'Business Society',
                'https://logo.clearbit.com/icbusiness.com',
                'Imperial College Business Society - Connecting students with top finance firms',
                'https://icbusiness.com',
                'Finance', 'networking', 'online',
                'Virtual Event', 'Online via Zoom', 200,
                'https://zoom.us/j/123456789',
                'Connect with finance and consulting professionals from Goldman Sachs, JP Morgan, McKinsey, and Bain. Speed networking sessions, career insights panel, and Q&A. Zoom link sent 24 hours before event. Business attire recommended.',
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
                '2025-02-08', '18:00:00', '20:30:00', true
            ),
            (
                'AI & Machine Learning Workshop', 'Data Science Society',
                'https://logo.clearbit.com/datasciencesoc.com',
                'University Data Science Society - Advancing AI education',
                'https://datasciencesoc.com',
                'AI & Machine Learning', 'workshop', 'hybrid',
                'London', 'Computer Science Building, Room 3.02', 80,
                NULL,
                'Hands-on workshop on building ML models with TensorFlow and PyTorch. Covers neural networks, CNNs, and practical applications. Bring your laptop. Suitable for intermediate Python users. In-person and online options available.',
                'https://images.unsplash.com/photo-1677442136019-21780ecad995',
                '2025-02-12', '14:00:00', '17:00:00', true
            ),
            (
                'Breaking into Investment Banking Panel', 'Finance Society',
                'https://logo.clearbit.com/financesoc.com',
                'University Finance Society',
                'https://financesoc.com',
                'Investment Banking', 'panel_discussion', 'online',
                'Virtual Event', 'Online via Microsoft Teams', 300,
                'https://teams.microsoft.com/l/meetup-join/19',
                'Hear from analysts and associates at top investment banks about their career journeys. Learn about spring weeks, summer internships, and graduate schemes. Cover interview tips, technical questions, and day-to-day life in IB. Live Q&A session.',
                'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
                '2025-01-25', '19:00:00', '20:30:00', true
            ),
            (
                'Cybersecurity Conference 2025', 'GCHQ & NCA',
                'https://logo.clearbit.com/gchq.gov.uk',
                'GCHQ and National Crime Agency',
                'https://www.gchq-careers.co.uk',
                'Cybersecurity', 'conference', 'in_person',
                'Cheltenham', 'GCHQ Headquarters, Hubble Road, GL51 0EX', 250,
                NULL,
                'Full-day conference on careers in cybersecurity. Keynote speakers from GCHQ, NCA, and leading cybersecurity firms. Workshops on ethical hacking, threat intelligence, and incident response. Lunch and refreshments provided. Security clearance not required.',
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
                '2025-03-05', '09:00:00', '17:00:00', true
            ),
            (
                'UX Design Webinar: Portfolio Building', 'Design Collective',
                'https://logo.clearbit.com/designcollective.com',
                'Design Collective - Empowering creative professionals',
                'https://designcollective.com',
                'Design', 'webinar', 'online',
                'Virtual Event', 'Online', 500,
                'https://meet.google.com/abc-defg-hij',
                'Learn how to build a standout UX design portfolio from senior designers at Figma, Adobe, and Airbnb. Cover case study structure, showcasing process, and presenting your work. Includes portfolio review session. Recording available to all registrants.',
                'https://images.unsplash.com/photo-1561070791-2526d30994b5',
                '2025-02-20', '18:00:00', '19:30:00', true
            ),
            (
                'Law Careers Seminar', 'Law Society',
                'https://logo.clearbit.com/lawsoc.com',
                'University Law Society',
                'https://lawsoc.com',
                'Law', 'seminar', 'in_person',
                'London', 'Law Faculty Building, Lecture Theatre 1', 120,
                NULL,
                'Explore different career paths in law including commercial law, criminal law, human rights, and in-house roles. Hear from solicitors, barristers, and legal executives. Learn about vacation schemes, training contracts, and pupillages. Networking reception afterwards.',
                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
                '2025-02-18', '17:00:00', '19:00:00', true
            ),
            (
                'Startup & Entrepreneurship Meetup', 'Entrepreneurs Society',
                'https://logo.clearbit.com/entrepreneursoc.com',
                'Student Entrepreneurs Society',
                'https://entrepreneursoc.com',
                'Management', 'meetup', 'hybrid',
                'Manchester', 'Innovation Hub, Oxford Road', 60,
                NULL,
                'Monthly meetup for aspiring entrepreneurs and startup enthusiasts. Pitch your ideas, find co-founders, and learn from successful founders. This month: guest speaker from a Series A fintech startup. Pizza and drinks provided.',
                'https://images.unsplash.com/photo-1556761175-b413da4baf72',
                '2025-02-22', '18:30:00', '21:00:00', true
            ),
            (
                'Healthcare Careers Virtual Fair', 'Medical Society',
                'https://logo.clearbit.com/medsoc.com',
                'University Medical Society',
                'https://medsoc.com',
                'Healthcare', 'career_fair', 'online',
                'Virtual Event', 'Online Platform', 1000,
                'https://virtualfair.medsoc.com',
                'Virtual career fair featuring NHS trusts, pharmaceutical companies, medical device firms, and healthcare consultancies. Virtual booths, live chat with recruiters, and webinar sessions on different healthcare careers. Open to all students.',
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
                '2025-03-10', '10:00:00', '16:00:00', true
            ),
            (
                'Marketing & PR Industry Panel', 'Marketing Society',
                'https://logo.clearbit.com/marketingsoc.com',
                'Student Marketing Society',
                'https://marketingsoc.com',
                'Marketing', 'panel_discussion', 'in_person',
                'London', 'Business School, Room 2.15', 100,
                NULL,
                'Panel discussion with marketing directors and PR managers from Unilever, Ogilvy, and Edelman. Topics include digital marketing, brand strategy, influencer marketing, and breaking into the industry. Networking session with free refreshments.',
                'https://images.unsplash.com/photo-1557804506-669a67965ba0',
                '2025-02-28', '18:00:00', '20:00:00', true
            )
    `);
    
    console.log('✅ Events seeded (10 diverse events with proper categories)');
};

const insertResources = async () => {
    await testDb.query(`
        INSERT INTO resources (
            title, description, detailed_description, whats_included, category,
            file_name, file_size, file_type, storage_key, storage_url,
            uploaded_by, is_active
        ) VALUES 
            (
                'CV Writing Guide 2025', 
                'Comprehensive guide to writing an effective CV for graduate applications',
                'This detailed guide covers everything you need to know about creating a standout CV. Learn about formatting, content structure, ATS optimization, and what recruiters look for in 2025.',
                '• 25-page PDF guide\n• 5 CV templates (Word & PDF)\n• Industry-specific examples\n• ATS-friendly formatting tips\n• Common mistakes to avoid',
                'CV',
                'cv-writing-guide-2025.pdf', '2.5 MB', 'application/pdf',
                'resources/cv-writing-guide-2025.pdf',
                'https://storage.fop.com/resources/cv-writing-guide-2025.pdf',
                'FOP Team', true
            ),
            (
                'Cover Letter Templates & Examples', 
                'Professional cover letter templates for different industries',
                'Stand out with compelling cover letters. Includes templates for tech, finance, consulting, law, and creative industries. Learn how to tailor your letter to each application.',
                '• 15 customizable templates\n• Industry-specific examples\n• Opening and closing lines\n• Do''s and don''ts checklist',
                'Cover Letters',
                'cover-letter-templates.pdf', '1.8 MB', 'application/pdf',
                'resources/cover-letter-templates.pdf',
                'https://storage.fop.com/resources/cover-letter-templates.pdf',
                'FOP Team', true
            ),
            (
                'Technical Interview Mastery', 
                'Master coding interviews with practice problems and solutions',
                'Prepare for technical interviews at FAANG and top tech companies. Comprehensive guide covering data structures, algorithms, system design, and behavioral questions.',
                '• 200+ coding problems with solutions\n• Video walkthroughs\n• Time & space complexity analysis\n• System design templates\n• Mock interview tips',
                'Interviews',
                'technical-interview-mastery.pdf', '6.2 MB', 'application/pdf',
                'resources/technical-interview-mastery.pdf',
                'https://storage.fop.com/resources/technical-interview-mastery.pdf',
                'FOP Team', true
            ),
            (
                'Assessment Centre Success Guide', 
                'Navigate assessment centres with confidence',
                'Complete guide to excelling at assessment centres. Learn what to expect and how to perform well in group exercises, presentations, case studies, and psychometric tests.',
                '• Assessment centre overview\n• Group exercise strategies\n• Presentation frameworks\n• Case study examples\n• Psychometric test practice',
                'Assessment Centres',
                'assessment-centre-guide.pdf', '3.4 MB', 'application/pdf',
                'resources/assessment-centre-guide.pdf',
                'https://storage.fop.com/resources/assessment-centre-guide.pdf',
                'FOP Team', true
            ),
            (
                'LinkedIn Profile Optimization', 
                'Build a professional LinkedIn presence that attracts recruiters',
                'Optimize your LinkedIn profile to stand out to recruiters and build your professional network. Includes profile examples, headline formulas, and networking strategies.',
                '• Profile optimization checklist\n• 50+ headline examples\n• Summary templates\n• Networking message templates\n• Content posting guide',
                'LinkedIn Optimization',
                'linkedin-optimization-2025.pdf', '2.1 MB', 'application/pdf',
                'resources/linkedin-optimization-2025.pdf',
                'https://storage.fop.com/resources/linkedin-optimization-2025.pdf',
                'FOP Team', true
            ),
            (
                'Graduate Scheme Application Guide', 
                'Everything you need to know about applying to graduate schemes',
                'Comprehensive guide to graduate scheme applications covering timelines, application forms, online tests, video interviews, and assessment centres.',
                '• Application timeline planner\n• Top graduate schemes list\n• Application form tips\n• Video interview guide\n• Competency framework',
                'Graduate Schemes',
                'graduate-scheme-guide.pdf', '4.1 MB', 'application/pdf',
                'resources/graduate-scheme-guide.pdf',
                'https://storage.fop.com/resources/graduate-scheme-guide.pdf',
                'FOP Team', true
            ),
            (
                'Networking for Students', 
                'Build meaningful professional connections',
                'Learn how to network effectively as a student. Covers networking events, informational interviews, LinkedIn networking, and maintaining professional relationships.',
                '• Networking event preparation\n• Conversation starters\n• Email templates\n• Follow-up strategies\n• Building long-term relationships',
                'Networking',
                'networking-for-students.pdf', '2.3 MB', 'application/pdf',
                'resources/networking-for-students.pdf',
                'https://storage.fop.com/resources/networking-for-students.pdf',
                'FOP Team', true
            ),
            (
                'Career Planning Workbook', 
                'Map out your career journey with structured exercises',
                'Interactive workbook to help you explore career options, set goals, and create an action plan. Includes self-assessment tools and decision-making frameworks.',
                '• Self-assessment exercises\n• Career exploration tools\n• Goal-setting templates\n• Action plan worksheets\n• Progress tracking sheets',
                'Career Planning',
                'career-planning-workbook.pdf', '3.7 MB', 'application/pdf',
                'resources/career-planning-workbook.pdf',
                'https://storage.fop.com/resources/career-planning-workbook.pdf',
                'FOP Team', true
            ),
            (
                'Finance Industry Insights 2025', 
                'Understand the finance industry and career paths',
                'Comprehensive overview of the finance industry including investment banking, asset management, private equity, and fintech. Includes salary guides and career progression paths.',
                '• Industry overview\n• Role descriptions\n• Salary benchmarks\n• Career progression maps\n• Top firms list',
                'Industry Insights',
                'finance-industry-insights.pdf', '3.9 MB', 'application/pdf',
                'resources/finance-industry-insights.pdf',
                'https://storage.fop.com/resources/finance-industry-insights.pdf',
                'FOP Team', true
            ),
            (
                'Internship Application Checklist', 
                'Step-by-step guide to securing your dream internship',
                'Complete checklist for internship applications from research to offer acceptance. Includes timeline, application tips, and interview preparation.',
                '• Application timeline\n• Research checklist\n• Application tracking sheet\n• Interview prep guide\n• Offer evaluation framework',
                'Internship Guides',
                'internship-application-checklist.pdf', '1.9 MB', 'application/pdf',
                'resources/internship-application-checklist.pdf',
                'https://storage.fop.com/resources/internship-application-checklist.pdf',
                'FOP Team', true
            ),
            (
                'Personal Branding for Graduates', 
                'Build your professional brand and stand out',
                'Learn how to develop and communicate your personal brand across all touchpoints. Covers online presence, elevator pitches, and professional storytelling.',
                '• Brand discovery exercises\n• Elevator pitch templates\n• Online presence audit\n• Professional bio examples\n• Content creation guide',
                'Personal Branding',
                'personal-branding-guide.pdf', '2.6 MB', 'application/pdf',
                'resources/personal-branding-guide.pdf',
                'https://storage.fop.com/resources/personal-branding-guide.pdf',
                'FOP Team', true
            ),
            (
                'Salary Negotiation Guide', 
                'Negotiate your worth with confidence',
                'Master the art of salary negotiation. Learn how to research market rates, prepare your case, and negotiate effectively for graduate roles and internships.',
                '• Market research guide\n• Negotiation scripts\n• Counter-offer strategies\n• Benefits evaluation\n• Email templates',
                'Salary & Benefits',
                'salary-negotiation-guide.pdf', '2.2 MB', 'application/pdf',
                'resources/salary-negotiation-guide.pdf',
                'https://storage.fop.com/resources/salary-negotiation-guide.pdf',
                'FOP Team', true
            ),
            (
                'Skills Development Roadmap', 
                'Identify and develop in-demand skills',
                'Comprehensive guide to developing technical and soft skills that employers value. Includes learning resources, project ideas, and skill assessment tools.',
                '• Skills gap analysis\n• Learning resource directory\n• Project-based learning ideas\n• Skill certification guide\n• Portfolio building tips',
                'Skills Development',
                'skills-development-roadmap.pdf', '3.5 MB', 'application/pdf',
                'resources/skills-development-roadmap.pdf',
                'https://storage.fop.com/resources/skills-development-roadmap.pdf',
                'FOP Team', true
            ),
            (
                'First Job Survival Guide', 
                'Thrive in your first professional role',
                'Navigate your first job successfully. Covers workplace etiquette, building relationships, managing expectations, and making a strong impression in your first 90 days.',
                '• First 90 days checklist\n• Workplace etiquette guide\n• Relationship building tips\n• Performance expectations\n• Common pitfalls to avoid',
                'First Job',
                'first-job-survival-guide.pdf', '2.4 MB', 'application/pdf',
                'resources/first-job-survival-guide.pdf',
                'https://storage.fop.com/resources/first-job-survival-guide.pdf',
                'FOP Team', true
            ),
            (
                'Remote Work Best Practices', 
                'Excel in remote and hybrid work environments',
                'Master remote work with tips on productivity, communication, work-life balance, and building relationships virtually. Essential for modern work environments.',
                '• Home office setup guide\n• Productivity tools & techniques\n• Virtual communication tips\n• Time management strategies\n• Work-life balance framework',
                'Remote Work',
                'remote-work-best-practices.pdf', '2.8 MB', 'application/pdf',
                'resources/remote-work-best-practices.pdf',
                'https://storage.fop.com/resources/remote-work-best-practices.pdf',
                'FOP Team', true
            )
    `);
    
    console.log('✅ Resources seeded (15 diverse resources with proper categories)');
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
