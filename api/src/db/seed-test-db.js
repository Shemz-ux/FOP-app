import dotenv from 'dotenv';
import seed from './tables.js';

// Load test environment variables
dotenv.config({ path: '.env.test' });

console.log('Seeding test database...');

seed().then(() => {
    console.log('✅ Test database seeded successfully!');
    process.exit(0);
}).catch((err) => {
    console.error('❌ Test database seeding failed:', err);
    process.exit(1);
});
