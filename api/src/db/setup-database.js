import db from "./db.js";
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
    try {
        console.log('Checking if tables exist...');
        
        // Check if tables already exist
        const result = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'jobs'
        `);
        
        if (result.rows.length > 0) {
            console.log('✅ Tables already exist. Skipping setup.');
            return;
        }
        
        console.log('📦 Creating database tables...');
        
        // Create ENUM types
        await db.query(`
            DO $$ BEGIN
                CREATE TYPE education_level_enum AS ENUM (
                    'gcse', 'a_level', 'btec', 'undergraduate', 'postgraduate', 'phd', 'other'
                );
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        
        await db.query(`
            DO $$ BEGIN
                CREATE TYPE uni_year_enum AS ENUM (
                    'foundation', '1st', '2nd', '3rd', '4th', '5th', 'masters', 'phd_year_1', 'phd_year_2', 'phd_year_3', 'phd_year_4', 'graduated'
                );
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        
        await db.query(`
            DO $$ BEGIN
                CREATE TYPE gender_enum AS ENUM (
                    'male', 'female', 'non_binary', 'prefer_not_to_say', 'other'
                );
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        
        await db.query(`
            DO $$ BEGIN
                CREATE TYPE degree_type_enum AS ENUM (
                    'ba', 'bsc', 'beng', 'llb', 'bmed', 'ma', 'msc', 'meng', 'mba', 'llm', 'phd', 'other'
                );
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        
        console.log('✅ ENUM types created');
        
        // Import and run the seed function to create tables
        const { default: seed } = await import('./tables.js');
        await seed();
        
        console.log('✅ Database setup complete!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    } finally {
        await db.end();
    }
};

setupDatabase();
