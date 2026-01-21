import db from "./db.js";
import dotenv from 'dotenv';

dotenv.config();

const resetDatabase = async () => {
    try {
        console.log('Resetting database...');
        
        // Drop all tables first
        await db.query('DROP TABLE IF EXISTS jobseekers_jobs_applied CASCADE');
        await db.query('DROP TABLE IF EXISTS jobseekers_jobs_saved CASCADE');
        await db.query('DROP TABLE IF EXISTS jobseekers_events_saved CASCADE');
        await db.query('DROP TABLE IF EXISTS jobseekers_events_applied CASCADE');
        await db.query('DROP TABLE IF EXISTS society_jobs_saved CASCADE');
        await db.query('DROP TABLE IF EXISTS society_events_saved CASCADE');
        await db.query('DROP TABLE IF EXISTS jobs CASCADE');
        await db.query('DROP TABLE IF EXISTS events CASCADE');
        await db.query('DROP TABLE IF EXISTS societies CASCADE');
        await db.query('DROP TABLE IF EXISTS jobseekers CASCADE');
        await db.query('DROP TABLE IF EXISTS admin_users CASCADE');
        await db.query('DROP TABLE IF EXISTS resources CASCADE');
        
        console.log('✅ All tables dropped');
        
        // Drop all enum types
        await db.query('DROP TYPE IF EXISTS education_level_enum CASCADE');
        await db.query('DROP TYPE IF EXISTS uni_year_enum CASCADE');
        await db.query('DROP TYPE IF EXISTS gender_enum CASCADE');
        await db.query('DROP TYPE IF EXISTS degree_type_enum CASCADE');
        
        console.log('✅ All enum types dropped');
        console.log('✅ Database reset complete!');
        console.log('\nNow run: npm run seed');
        
    } catch (error) {
        console.error('❌ Database reset failed:', error);
    } finally {
        await db.end();
    }
};

resetDatabase();
