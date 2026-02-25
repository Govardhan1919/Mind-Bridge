// Adds meeting_link column to the sessions table
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS meeting_link TEXT`)
    .then(() => { console.log('✅ meeting_link column added to sessions table'); pool.end(); })
    .catch((e) => { console.error('❌', e.message); pool.end(); });
