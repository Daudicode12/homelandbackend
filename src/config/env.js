import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 8080,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'homelandjobs',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret',
    expiresIn: '1h',
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
    expiresIn: '7d',
  }
};
