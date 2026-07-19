import { query } from './src/config/db.js';
import bcrypt from 'bcrypt';

const setupDbAndSeedAdmin = async () => {
    try {
        console.log('Updating database schema...');
        
        // Update users table
        try {
            await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT "active"');
            await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
            
            // Drop old constraint and add new one to allow 'admin' role
            await query('ALTER TABLE users DROP CONSTRAINT chk_role');
            await query("ALTER TABLE users ADD CONSTRAINT chk_role CHECK (role IN ('admin', 'freelancer', 'employer'))");
        } catch (e) {
            console.log('User table schema updates already applied or warning:', e.message);
        }

        // Update jobs table
        try {
            await query('ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT "open"');
            await query('ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
        } catch (e) {
            console.log('Jobs table schema updates already applied or warning:', e.message);
        }

        const name = 'Super Admin';
        const email = 'admin@homeland.com'; // Change to your preferred admin email
        const phone = '254700000000';
        const rawPassword = 'SecureAdminPassword123!'; // Change to your secure password
        const role = 'admin';

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        console.log('Inserting admin into the database...');
        const sql = `
            INSERT INTO users (name, email, phone, password, role, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        `;
        
        await query(sql, [name, email, phone, hashedPassword, role]);
        
        console.log('✅ Admin account successfully created!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${rawPassword}`);
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('❌ Admin with this email or phone already exists.');
        } else {
            console.error('❌ Error seeding admin:', error.message);
        }
        process.exit(1);
    }
};

setupDbAndSeedAdmin();