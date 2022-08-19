'use strict'

import mongoose from 'mongoose';

import { mongoDB } from './keys.js';
import sequelize from './sequelize.js';

const mongod = await mongoose.connect(mongoDB.URI);

if (mongod) console.log('MongoDB Database is Connected');
else console.error('Ha ocurrido un error con ', mongod);

try {
	await sequelize.sync({ force: false });
	console.log('SQL Database is Connected');
} catch (e) {
	console.error(e);
}
