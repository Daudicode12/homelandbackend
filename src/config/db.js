import mysql from 'mysql2/promise';
import { env } from './env.js';

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('Connected to the MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL database connection failed', err);
  });

export const query = (text, params) => pool.execute(text, params);
export { pool };
