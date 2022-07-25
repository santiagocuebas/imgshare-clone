'use strict'

import mongoose from 'mongoose';
import { createPool } from 'mysql2/promise';

import { mongoDB, sqlDB } from './keys.js';

const pool = await createPool(sqlDB);

mongoose.connect(mongoDB.URI)
	.then(() => console.log('MongoDB Database is Connected'))
	.catch(err => console.error(err));

pool.getConnection()
  .then(conn => {
    conn.release();
	console.log('SQL Database is Connected');
    return;
  }).catch(err => console.log(err));

export default pool;
