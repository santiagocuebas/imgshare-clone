'use strict'

import mongoose from 'mongoose';

import { mongoDB } from './keys.js';
import sequelize from './sequelize.js';
import User from './models/user.js';

const mongod = await mongoose.connect(mongoDB.URI);

if (mongod) console.log('MongoDB Database is Connected');
else console.error('Ha ocurrido un error con ', mongod);

try {
	await sequelize.authenticate();
	console.log('SQL Database is Connected');
	const created = sequelize.sync({ force: true });
	if (created) console.log('==>Table done!');
} catch (e) {
	console.error(e);
}
