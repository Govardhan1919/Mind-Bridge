require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(
    `INSERT INTO users (name, email, password_hash, role, is_approved)
   VALUES ('Admin', 'admin@mindbridge.com', 'admin123', 'ADMIN', TRUE)
   ON CONFLICT (email) DO NOTHING`
)
    .then(() => { console.log('✅ Admin user seeded: admin@mindbridge.com / admin123'); pool.end(); })
    .catch((e) => { console.error('❌', e.message); pool.end(); });
