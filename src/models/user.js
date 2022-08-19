'use strict'

import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const User = sequelize.define('User', {
	username: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
	email: {type: DataTypes.STRING, allowNull: false, unique: true},
	password: {type: DataTypes.STRING, allowNull: false},
	phone_number: {type: DataTypes.STRING, defaultValue: ''},
	description: {type: DataTypes.TEXT, defaultValue: ''},
	avatar: {type: DataTypes.STRING, defaultValue: 'default.png'}
}, {
	tableName: 'User',
	timestamps: true,
	underscored: true
});

export default User;
