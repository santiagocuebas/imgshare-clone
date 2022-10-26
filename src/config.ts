
import * as dotenv from 'dotenv';
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 5000;

export const MONGO_URI: string = process.env.DB_URI || 'mongodb://127.0.0.1:27017/img_node';

export const DB_HOST: string = process.env.DB_HOST || '127.0.0.1';

export const DB_PORT: number = Number(process.env.DB_PORT) || 3306;

export const DB_USER: string = process.env.DB_USER || 'root';

export const DB_PASS: string = process.env.DB_PASSWORD || '123456789';

export const DB_DATABASE: string = process.env.DB_DATABASE || 'db_login';
