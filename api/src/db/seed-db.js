import dotenv from 'dotenv';
import db from './db.js';
import bcrypt from 'bcrypt';
import { adminUsers } from './test-data/admins.js';
import { universityStudents, schoolStudents } from './test-data/jobseekers.js';
import { societies } from './test-data/societies.js';
import { jobs } from './test-data/jobs.js';
import { events } from './test-data/events.js';
import { resources } from './test-data/resources.js';
import {
  jobseekerJobsApplied,
  jobseekerJobsSaved,
  jobseekerEventsApplied,
  jobseekerEventsSaved,
  societyJobsSaved,
  societyEventsSaved
} from './test-data/relationships.js';

dotenv.config();

console.log('🌱 Starting comprehensive database seed...\n');

const insertAdminUsers = async () => {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  for (const admin of adminUsers) {
    await db.query(
      `INSERT INTO admin_users (first_name, last_name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [admin.first_name, admin.last_name, admin.email, hashedPassword, admin.role, admin.is_active]
    );
  }
  
  console.log(`✅ Admin users seeded (${adminUsers.length} admins)`);
};

const insertJobseekers = async () => {
  const hashedPassword = await bcrypt.hash('Student123!', 10);
  
  // Insert university students
  for (const student of universityStudents) {
    await db.query(
      `INSERT INTO jobseekers (
        first_name, last_name, email, password_hash, phone_number, date_of_birth,
        gender, ethnicity, school_meal_eligible, first_gen_to_go_uni,
        education_level, institution_name, uni_year, degree_type, area_of_study,
        role_interest_option_one, role_interest_option_two, society, linkedin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        student.first_name, student.last_name, student.email, hashedPassword,
        student.phone_number, student.date_of_birth, student.gender, student.ethnicity,
        student.school_meal_eligible, student.first_gen_to_go_uni, student.education_level,
        student.institution_name, student.uni_year, student.degree_type, student.area_of_study,
        student.role_interest_option_one, student.role_interest_option_two,
        student.society, student.linkedin
      ]
    );
  }
  
  // Insert school students
  for (const student of schoolStudents) {
    await db.query(
      `INSERT INTO jobseekers (
        first_name, last_name, email, password_hash, phone_number, date_of_birth,
        gender, ethnicity, school_meal_eligible, first_gen_to_go_uni,
        education_level, institution_name, subject_one, subject_two, subject_three, subject_four,
        role_interest_option_one, role_interest_option_two, society
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        student.first_name, student.last_name, student.email, hashedPassword,
        student.phone_number, student.date_of_birth, student.gender, student.ethnicity,
        student.school_meal_eligible, student.first_gen_to_go_uni, student.education_level,
        student.institution_name, student.subject_one, student.subject_two,
        student.subject_three, student.subject_four, student.role_interest_option_one,
        student.role_interest_option_two, student.society
      ]
    );
  }
  
  console.log(`✅ Jobseekers seeded (${universityStudents.length} university + ${schoolStudents.length} school students)`);
};

const insertSocieties = async () => {
  const hashedPassword = await bcrypt.hash('Society123!', 10);
  
  for (const society of societies) {
    await db.query(
      `INSERT INTO societies (name, email, password_hash, description, university, member_count)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [society.name, society.email, hashedPassword, society.description, society.university, society.member_count]
    );
  }
  
  console.log(`✅ Societies seeded (${societies.length} societies)`);
};

const insertJobs = async () => {
  for (const job of jobs) {
    await db.query(
      `INSERT INTO jobs (
        title, company, company_logo, company_color, company_description, company_website,
        description, industry, location, experience_level, role_type, work_type, job_link,
        deadline, is_active, applicant_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        job.title, job.company, job.company_logo, job.company_color,
        job.company_description, job.company_website, job.description,
        job.industry, job.location, job.experience_level, job.role_type,
        job.work_type, job.job_link, job.deadline, job.is_active, job.applicant_count
      ]
    );
  }
  
  console.log(`✅ Jobs seeded (${jobs.length} diverse opportunities)`);
};

const insertEvents = async () => {
  for (const event of events) {
    await db.query(
      `INSERT INTO events (
        title, organiser, organiser_logo, organiser_description, organiser_website,
        industry, event_type, location_type, location, address, capacity, event_link,
        description, event_image, event_date, event_start_time, event_end_time,
        is_active, applicant_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        event.title, event.organiser, event.organiser_logo, event.organiser_description,
        event.organiser_website, event.industry, event.event_type, event.location_type,
        event.location, event.address, event.capacity, event.event_link,
        event.description, event.event_image, event.event_date, event.event_start_time,
        event.event_end_time, event.is_active, event.applicant_count
      ]
    );
  }
  
  console.log(`✅ Events seeded (${events.length} diverse events)`);
};

const insertResources = async () => {
  for (const resource of resources) {
    await db.query(
      `INSERT INTO resources (
        title, description, detailed_description, whats_included, category,
        file_name, file_size, file_type, storage_key, storage_url,
        created_by, uploaded_by, is_active, download_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        resource.title, resource.description, resource.detailed_description,
        resource.whats_included, resource.category, resource.file_name,
        resource.file_size, resource.file_type, resource.storage_key,
        resource.storage_url, resource.created_by, 1, resource.is_active,
        resource.download_count
      ]
    );
  }
  
  console.log(`✅ Resources seeded (${resources.length} career resources)`);
};

const insertRelationships = async () => {
  // Jobseeker jobs applied
  for (const relation of jobseekerJobsApplied) {
    await db.query(
      `INSERT INTO jobseekers_jobs_applied (jobseeker_id, job_id, status)
       VALUES ($1, $2, 'applied')`,
      [relation.jobseeker_id, relation.job_id]
    );
  }
  
  // Jobseeker jobs saved
  for (const relation of jobseekerJobsSaved) {
    await db.query(
      `INSERT INTO jobseekers_jobs_saved (jobseeker_id, job_id)
       VALUES ($1, $2)`,
      [relation.jobseeker_id, relation.job_id]
    );
  }
  
  // Jobseeker events applied
  for (const relation of jobseekerEventsApplied) {
    await db.query(
      `INSERT INTO jobseekers_events_applied (jobseeker_id, event_id, status)
       VALUES ($1, $2, 'registered')`,
      [relation.jobseeker_id, relation.event_id]
    );
  }
  
  // Jobseeker events saved
  for (const relation of jobseekerEventsSaved) {
    await db.query(
      `INSERT INTO jobseekers_events_saved (jobseeker_id, event_id)
       VALUES ($1, $2)`,
      [relation.jobseeker_id, relation.event_id]
    );
  }
  
  // Society jobs saved
  for (const relation of societyJobsSaved) {
    await db.query(
      `INSERT INTO society_jobs_saved (society_id, job_id)
       VALUES ($1, $2)`,
      [relation.society_id, relation.job_id]
    );
  }
  
  // Society events saved
  for (const relation of societyEventsSaved) {
    await db.query(
      `INSERT INTO society_events_saved (society_id, event_id)
       VALUES ($1, $2)`,
      [relation.society_id, relation.event_id]
    );
  }
  
  console.log(`✅ Relationships seeded (saved/applied jobs and events)`);
};

const runSeed = async () => {
  try {
    console.log('🗑️  Clearing existing data...\n');
    
    await insertAdminUsers();
    await insertJobseekers();
    await insertSocieties();
    await insertJobs();
    await insertEvents();
    await insertResources();
    await insertRelationships();
    
    console.log('\n🎉 Database seeded successfully with comprehensive test data!');
    console.log('\n📋 Summary:');
    console.log(`   • ${adminUsers.length} admin users`);
    console.log(`   • ${universityStudents.length + schoolStudents.length} jobseekers (${universityStudents.length} university + ${schoolStudents.length} school)`);
    console.log(`   • ${societies.length} societies`);
    console.log(`   • ${jobs.length} jobs`);
    console.log(`   • ${events.length} events`);
    console.log(`   • ${resources.length} resources`);
    console.log(`   • ${jobseekerJobsApplied.length + jobseekerJobsSaved.length + jobseekerEventsApplied.length + jobseekerEventsSaved.length + societyJobsSaved.length + societyEventsSaved.length} relationship records\n`);
    console.log('📄 See TEST_CREDENTIALS.md for login details\n');
    
    await db.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seed failed:', err.message);
    console.error('Full error:', err);
    await db.end();
    process.exit(1);
  }
};

runSeed();
