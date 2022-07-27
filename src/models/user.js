'use strict'

import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize.js';

class User extends Model {};

User.init({
	username: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
	email: {type: DataTypes.STRING, allowNull: false, unique: true},
	password: {type: DataTypes.STRING, allowNull: false},
	phone_number: {type: DataTypes.STRING},
	description: {type: DataTypes.TEXT}
}, {
	sequelize,
	underscored: true,
	timestamps: true,
	modelName: 'User'
});

User.sync({ alter: true });
console.log('==> The table User model was (Re)created!');

export default User;
