
// import {
// 	DataTypes,
// 	Model,
// 	InferAttributes,
// 	InferCreationAttributes
// } from 'sequelize';
// import { sequelize } from '../database.js';

// class Session extends Model<
// InferAttributes<Session>,
// InferCreationAttributes<Session>
// > {
// 	declare sid: string;
// 	declare userId: string;
// 	declare expires: Date;
// 	declare data: string;
// }

// Session.init({
// 	sid: {
// 		type: DataTypes.STRING,
// 		primaryKey: true,
// 	},
// 	userId: DataTypes.STRING,
// 	expires: DataTypes.DATE,
// 	data: DataTypes.TEXT,
// }, {
// 	sequelize,
// 	tableName: 'Session'
// });
