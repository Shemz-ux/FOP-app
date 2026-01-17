import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createJobseeker, removeJobseeker } from "../../models/jobseekers.js";
import { createJob, removeJob } from "../../models/jobs.js";
import { createEvent, removeEvent } from "../../models/events.js";
import db from "../../db/db.js";

export class AdminTestHelper {
    constructor() {
        this.testJobseekerIds = [];
        this.testJobIds = [];
        this.testEventIds = [];
        this.testPassword = "TestPassword123";
        this.hashedPassword = null;
        this.backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";
        this.adminJwtToken = null;
        this.userJwtToken = null;
    }

    async initialize() {
        this.hashedPassword = await bcrypt.hash(this.testPassword, 10);
        
        // Create admin JWT token
        const adminPayload = { sub: "admin123", role: "admin" };
        this.adminJwtToken = JWT.sign(adminPayload, process.env.JWT_SECRET || "test_secret");
        
        // Create user JWT token (for negative testing)
        const userPayload = { sub: "user123", role: "user" };
        this.userJwtToken = JWT.sign(userPayload, process.env.JWT_SECRET || "test_secret");
    }

    async createTestJobseekers(count = 3) {
        const jobseekers = [
            {
                first_name: "John",
                last_name: "Doe",
                email: `john.helper.test.${Date.now()}@example.com`,
                password_hash: this.hashedPassword,
                gender: "male",
                institution_name: "University College London",
                education_level: "undergraduate",
                society: "Tech Society",
                school_meal_eligible: true,
                first_gen_to_go_uni: true
            },
            {
                first_name: "Jane",
                last_name: "Smith",
                email: `jane.helper.test.${Date.now()}@example.com`,
                password_hash: this.hashedPassword,
                gender: "female",
                institution_name: "Imperial College London",
                education_level: "postgraduate",
                society: "Engineering Society",
                school_meal_eligible: false,
                first_gen_to_go_uni: false
            },
            {
                first_name: "Alex",
                last_name: "Johnson",
                email: `alex.helper.test.${Date.now()}@example.com`,
                password_hash: this.hashedPassword,
                gender: "non_binary",
                institution_name: "King's College London",
                education_level: "phd",
                society: "Research Society",
                school_meal_eligible: true,
                first_gen_to_go_uni: false
            }
        ];

        for (let i = 0; i < Math.min(count, jobseekers.length); i++) {
            const created = await createJobseeker(jobseekers[i]);
            this.testJobseekerIds.push(created.jobseeker_id);
        }

        return this.testJobseekerIds;
    }

    async createTestJobs(count = 2) {
        const timestamp = Date.now();
        const jobs = [
            {
                title: `Software Engineer Helper Test ${timestamp}`,
                company: "Tech Corp Helper",
                company_logo: "",
                company_color: "#3B82F6",
                company_description: "Innovative tech company",
                company_website: "https://techcorp.com",
                description: "Test job for helper functions",
                industry: "Technology",
                location: "London",
                experience_level: "Entry",
                role_type: "Full-time",
                work_type: "Remote",
                salary: "£30,000"
            },
            {
                title: `Data Scientist Helper Test ${timestamp}`,
                company: "Data Inc Helper",
                company_logo: "",
                company_color: "#10B981",
                company_description: "Data analytics leader",
                company_website: "https://datainc.com",
                description: "Another test job for helper functions",
                industry: "Technology",
                location: "Manchester",
                experience_level: "Mid",
                role_type: "Full-time",
                work_type: "Hybrid",
                salary: "£45,000"
            }
        ];

        for (let i = 0; i < Math.min(count, jobs.length); i++) {
            const created = await createJob(jobs[i]);
            this.testJobIds.push(created.job_id);
        }

        return this.testJobIds;
    }

    async createTestEvents(count = 2) {
        const timestamp = Date.now();
        const events = [
            {
                title: `Helper Career Fair ${timestamp}`,
                company: "Helper University Careers",
                description: "Helper test career fair",
                industry: "Education",
                location: "London",
                contact_email: "careers@helper-uni.ac.uk",
                event_date: "2024-12-15",
                event_time: "10:00:00"
            },
            {
                title: `Helper Tech Networking ${timestamp}`,
                company: "Helper Tech Network",
                description: "Helper networking event",
                industry: "Technology",
                location: "Birmingham",
                contact_email: "events@helper-technet.com",
                event_date: "2024-12-20",
                event_time: "18:00:00"
            }
        ];

        for (let i = 0; i < Math.min(count, events.length); i++) {
            const created = await createEvent(events[i]);
            this.testEventIds.push(created.event_id);
        }

        return this.testEventIds;
    }

    async createJobApplications() {
        if (this.testJobseekerIds.length === 0 || this.testJobIds.length === 0) {
            throw new Error("Must create jobseekers and jobs before creating applications");
        }

        // Create some job applications
        const applications = [
            [this.testJobseekerIds[0], this.testJobIds[0]],
            [this.testJobseekerIds[1], this.testJobIds[0]],
            [this.testJobseekerIds[2], this.testJobIds[1]]
        ];

        for (const [jobseekerId, jobId] of applications) {
            await db.query(
                "INSERT INTO jobseekers_jobs_applied (jobseeker_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [jobseekerId, jobId]
            );
        }
    }

    async createEventApplications() {
        if (this.testJobseekerIds.length === 0 || this.testEventIds.length === 0) {
            throw new Error("Must create jobseekers and events before creating applications");
        }

        // Create some event applications
        const applications = [
            [this.testJobseekerIds[0], this.testEventIds[0]],
            [this.testJobseekerIds[1], this.testEventIds[0]],
            [this.testJobseekerIds[2], this.testEventIds[1]]
        ];

        for (const [jobseekerId, eventId] of applications) {
            await db.query(
                "INSERT INTO jobseekers_events_applied (jobseeker_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [jobseekerId, eventId]
            );
        }
    }

    async setupFullTestEnvironment() {
        await this.initialize();
        await this.createTestJobseekers();
        await this.createTestJobs();
        await this.createTestEvents();
        await this.createJobApplications();
        await this.createEventApplications();
    }

    async cleanup() {
        try {
            // Remove applications first (due to foreign key constraints)
            if (this.testJobseekerIds.length > 0) {
                await db.query("DELETE FROM jobseekers_jobs_applied WHERE jobseeker_id = ANY($1)", [this.testJobseekerIds]);
                await db.query("DELETE FROM jobseekers_events_applied WHERE jobseeker_id = ANY($1)", [this.testJobseekerIds]);
            }
            
            // Remove test data
            for (const id of this.testJobseekerIds) {
                await removeJobseeker(id);
            }
            for (const id of this.testJobIds) {
                await removeJob(id);
            }
            for (const id of this.testEventIds) {
                await removeEvent(id);
            }

            // Reset arrays
            this.testJobseekerIds = [];
            this.testJobIds = [];
            this.testEventIds = [];
        } catch (error) {
            console.log("Cleanup error:", error.message);
        }
    }

    getAuthHeaders() {
        return {
            backdoor: { 'Authorization': `Bearer ${this.backdoorToken}` },
            adminJwt: { 'Authorization': `Bearer ${this.adminJwtToken}` },
            userJwt: { 'Authorization': `Bearer ${this.userJwtToken}` },
            invalid: { 'Authorization': 'Bearer invalid_token' },
            none: {}
        };
    }

    getTestData() {
        return {
            jobseekerIds: [...this.testJobseekerIds],
            jobIds: [...this.testJobIds],
            eventIds: [...this.testEventIds]
        };
    }
}

// Utility functions for common test assertions
export const assertStudentResponseFormat = (response) => {
    expect(response.body).toHaveProperty('students');
    expect(response.body).toHaveProperty('count');
    expect(Array.isArray(response.body.students)).toBe(true);
    expect(typeof response.body.count).toBe('number');
    expect(response.body.count).toBe(response.body.students.length);
};

export const assertUserResponseFormat = (response) => {
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('count');
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(typeof response.body.count).toBe('number');
    expect(response.body.count).toBe(response.body.users.length);
};

export const assertJobApplicationStatsFormat = (response) => {
    expect(response.body).toHaveProperty('job_application_stats');
    expect(Array.isArray(response.body.job_application_stats)).toBe(true);
    
    if (response.body.job_application_stats.length > 0) {
        const stat = response.body.job_application_stats[0];
        expect(stat).toHaveProperty('job_id');
        expect(stat).toHaveProperty('title');
        expect(stat).toHaveProperty('company');
        expect(stat).toHaveProperty('application_count');
    }
};

export const assertEventApplicationStatsFormat = (response) => {
    expect(response.body).toHaveProperty('event_application_stats');
    expect(Array.isArray(response.body.event_application_stats)).toBe(true);
    
    if (response.body.event_application_stats.length > 0) {
        const stat = response.body.event_application_stats[0];
        expect(stat).toHaveProperty('event_id');
        expect(stat).toHaveProperty('title');
        expect(stat).toHaveProperty('company');
        expect(stat).toHaveProperty('event_date');
        expect(stat).toHaveProperty('application_count');
    }
};

export const assertAnalyticsSummaryFormat = (response) => {
    expect(response.body).toHaveProperty('analytics_summary');
    const summary = response.body.analytics_summary;
    
    expect(summary).toHaveProperty('total_students');
    expect(summary).toHaveProperty('total_jobs');
    expect(summary).toHaveProperty('total_events');
    expect(summary).toHaveProperty('total_job_applications');
    expect(summary).toHaveProperty('total_event_applications');
    expect(summary).toHaveProperty('free_meal_eligible_count');
    expect(summary).toHaveProperty('first_gen_count');
    
    // All values should be strings (from database count)
    Object.values(summary).forEach(value => {
        expect(typeof value).toBe('string');
        expect(parseInt(value)).toBeGreaterThanOrEqual(0);
    });
};

// Common test data generators
export const generateTestJobseeker = (overrides = {}) => {
    const timestamp = Date.now();
    return {
        first_name: "Test",
        last_name: "User",
        email: `test.user.${timestamp}@example.com`,
        password_hash: "hashed_password",
        gender: "male",
        institution_name: "Test University",
        education_level: "undergraduate",
        society: "Test Society",
        school_meal_eligible: false,
        first_gen_to_go_uni: false,
        ...overrides
    };
};

export const generateTestJob = (overrides = {}) => {
    const timestamp = Date.now();
    return {
        title: `Test Job ${timestamp}`,
        company: "Test Company",
        description: "Test job description",
        industry: "Technology",
        location: "Test Location",
        job_level: "Entry",
        role_type: "Full-time",
        contact_email: "test@company.com",
        salary: "£25,000",
        ...overrides
    };
};

export const generateTestEvent = (overrides = {}) => {
    const timestamp = Date.now();
    return {
        title: `Test Event ${timestamp}`,
        company: "Test Event Company",
        description: "Test event description",
        industry: "Technology",
        location: "Test Location",
        contact_email: "events@company.com",
        event_date: "2024-12-31",
        event_time: "12:00:00",
        ...overrides
    };
};
