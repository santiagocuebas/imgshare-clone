'use strict'

import { Op } from 'sequelize';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import User from '../models/user.js';
import { encryptPassword, matchPassword } from './crypt.js';

passport.use('local.login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const user = await User.findAll({where: { 
			[Op.or]: [
				{ username: username },
				{ email: username }
			]
		}
	});
	if (user) {
		const match = await matchPassword(password, user.password);
		if (match) done(null, user);
		else done(null, false);
	} else return done(null, false);
}));

passport.use('local.signup', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const { email } = req.body;
	const newUser = {
		email,
		password,
		username
	};
	newUser.password = await encryptPassword(password);
	await User.create(newUser);
	return done(null, newUser);
}));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser( async (username, done) => {
	const user = await User.findAll({where: {username: {username: username}}})
	done(null, user);
});

export default passport;
