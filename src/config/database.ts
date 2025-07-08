import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import fs from 'fs';

let dialectOptions = {};
if (process.env.NODE_ENV === 'production' && process.env.DB_CA_PATH) {
  try {
    const ca = fs.readFileSync(process.env.DB_CA_PATH).toString();
    dialectOptions = {
      ssl: {
        require: true,
        ca,
      },
    };
    console.log('Sequelize DB_CA_PATH:', process.env.DB_CA_PATH);
  } catch (e) {
    console.error('Sequelize failed to read CA file:', e);
  }
}

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User],
  logging: true,
  ...(Object.keys(dialectOptions).length > 0 ? { dialectOptions } : {}),
});

export default sequelize; 