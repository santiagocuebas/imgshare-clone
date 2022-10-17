'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;

export const MONGO_URI = process.env.DB_URI;

export const DB_HOST = process.env.DB_HOST;

export const DB_PORT = process.env.DB_PORT;

export const DB_USER = process.env.DB_USER;

export const DB_PASS = process.env.DB_PASSWORD;

export const DB_DATABASE = process.env.DB_DATABASE;
