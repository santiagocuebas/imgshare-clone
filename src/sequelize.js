
import { Sequelize } from 'sequelize';
import { sqlDB } from './keys.js';

const sequelize = new Sequelize(sqlDB.database, sqlDB.username, sqlDB.password, {
	port: sqlDB.port,
	host: sqlDB.host,
	dialect: sqlDB.dialect
});

export default sequelize;
