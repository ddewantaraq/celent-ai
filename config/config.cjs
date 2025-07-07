const fs = require('fs');

if (process.env.NODE_ENV === 'production') {
  console.log('DB_CA_PATH:', process.env.DB_CA_PATH);
}

module.exports = {
  development: {
    username: process.env.DB_USER || 'celent_ai_app',
    password: process.env.DB_PASSWORD || 'change_me',
    database: process.env.DB_NAME || 'celent_ai_app_db',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'celent_ai_app',
    password: process.env.DB_PASSWORD || 'change_me',
    database: process.env.DB_NAME || 'celent_ai_app_db',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: process.env.DB_CA_PATH ? {
      ssl: {
        require: true,
        ca: fs.readFileSync(process.env.DB_CA_PATH).toString(),
      }
    } : {},
  },
}; 