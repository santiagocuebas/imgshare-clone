'use strict'

import { Op } from 'sequelize';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import User from '../models/user.js';
import { encryptPassword, matchPassword } from './crypt.js';
import '../database.js';

passport.use('login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	console.log(req.flash());
	const data = await User.findOne({where: { 
			[Op.or]: [
				{ username: username },
				{ email: username }
			]
		}
	});
	if (data) {
		const user = data.dataValues;
		const match = await matchPassword(password, user.password);
		if (match) done(null, user);
		else return done(null, false, req.flash('message.password', 'Incorrect password'));
	} else return done(null, false, req.flash('message.username', 'The username no exists'));
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

passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser( async (username, done) => {
	const data = await User.findOne({where: {username: username}});
	const user = data.dataValues;
	done(null, user);
});

export default passport;
