const { Pool } = require('pg');

const pool = new Pool({
  user: 'blog_user',
  password: process.env.DATABASE_PASSWORD,
  host: 'localhost',
  database: 'blogdb',
  port: 5432,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
