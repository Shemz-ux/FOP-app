import bcrypt from 'bcrypt';
import db from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async (firstName, lastName, email, password, role = 'admin') => {
  try {
    console.log('Creating admin user...');
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Role: ${role}`);
    
    // Validate role
    if (role !== 'admin' && role !== 'super_admin') {
      throw new Error('Role must be either "admin" or "super_admin"');
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert admin user
    const result = await db.query(
      `INSERT INTO admin_users (first_name, last_name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING admin_id, first_name, last_name, email, role, is_active, created_at`,
      [firstName, lastName, email, passwordHash, role, true]
    );
    
    console.log('\n✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Admin ID:', result.rows[0].admin_id);
    console.log('Name:', `${result.rows[0].first_name} ${result.rows[0].last_name}`);
    console.log('Email:', result.rows[0].email);
    console.log('Role:', result.rows[0].role);
    console.log('Active:', result.rows[0].is_active);
    console.log('Created:', result.rows[0].created_at);
    console.log('-----------------------------------');
    console.log('\n🔑 Login Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠️  Please save these credentials securely and change the password after first login!');
    
  } catch (error) {
    if (error.code === '23505') {
      console.error('\n❌ Error: An admin user with this email already exists');
    } else if (error.message.includes('Role must be')) {
      console.error(`\n❌ Error: ${error.message}`);
    } else {
      console.error('\n❌ Error creating admin user:', error.message);
    }
    process.exit(1);
  } finally {
    await db.end();
  }
};

// Get credentials from command line arguments
const args = process.argv.slice(2);
const [firstName, lastName, email, password, role] = args;

if (!firstName || !lastName || !email || !password) {
  console.error('❌ Missing required arguments\n');
  console.error('Usage: node src/db/create-admin.js <firstName> <lastName> <email> <password> [role]');
  console.error('\nArguments:');
  console.error('  firstName  - Admin first name');
  console.error('  lastName   - Admin last name');
  console.error('  email      - Admin email address');
  console.error('  password   - Admin password');
  console.error('  role       - Optional: "admin" (default) or "super_admin"');
  console.error('\nExamples:');
  console.error('  node src/db/create-admin.js John Doe admin@example.com SecurePass123');
  console.error('  node src/db/create-admin.js Jane Smith super@example.com SecurePass123 super_admin');
  console.error('\nFor production (Render):');
  console.error('  DATABASE_URL="postgresql://..." NODE_ENV=production node src/db/create-admin.js John Doe admin@example.com SecurePass123');
  process.exit(1);
}

createAdmin(firstName, lastName, email, password, role);
