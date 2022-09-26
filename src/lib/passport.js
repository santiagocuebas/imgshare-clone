'use strict';

import { Op } from 'sequelize';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import { User, Image } from '../models/index.js';
import { encryptPassword } from './crypt.js';
import '../database.js';

passport.use('login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, async (username, password, done) => {
	const data = await User.findOne({
		where: {
			[Op.or]: [
				{ username },
				{ email: username }
			]
		}
	});
	const user = data.dataValues;
	let totalViews = 0;
	const images = await Image.find({ author: username });
	for (const image of images) {
		totalViews += image.views;
	}
	await User.update({ totalViews }, {
		where: { username }
	});
	return done(null, user);
}));

passport.use('signup', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const { email } = req.body;
	const newPassword = await encryptPassword(password);
	const user = await User.create({
		username,
		email,
		password: newPassword
	});
	const newUser = user.toJSON();
	return done(null, newUser);
}));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser(async (username, done) => {
	const data = await User.findOne({ where: { username } });
	done(null, data.dataValues);
});

export default passport;
