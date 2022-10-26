
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize-typescript';
import {
	DB_DATABASE,
	DB_HOST,
	DB_PASS,
	DB_USER,
	DB_PORT,
	MONGO_URI
} from './config.js';
import { User } from './models/index.js';

export const mongod = await mongoose.connect(MONGO_URI);

export const sequelize = new Sequelize({
	database: DB_DATABASE,
	username: DB_USER,
	password: DB_PASS,
	port: DB_PORT,
	host: DB_HOST,
	dialect: 'mysql',
	models: [User],
	query: { raw: true }
});
