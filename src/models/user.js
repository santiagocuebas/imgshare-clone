'use strict';

import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const User = sequelize.define('User', {
	username: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false },
	phone_number: { type: DataTypes.STRING },
	description: { type: DataTypes.TEXT },
	avatar: { type: DataTypes.TEXT, defaultValue: 'default.png' },
	links: { type: DataTypes.TEXT, defaultValue: '' },
	totalViews: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
	tableName: 'User',
	timestamps: true,
	underscored: true
});

export default User;
