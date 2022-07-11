
import { config } from 'dotenv';
config('../.env');

export const PORT = process.env.PORT || 5000;

export const mongoDB = {
	URI: process.env.DB_URI
};

export const sqlDB = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	connectionLimit: 1
};
