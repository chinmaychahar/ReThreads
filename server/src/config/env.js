require('dotenv').config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 4000,
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || '',
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY || '',
  APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID || 'rethreads',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

const requiredInProduction = ['APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY'];

if (env.NODE_ENV === 'production') {
  for (const key of requiredInProduction) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

module.exports = { env };
