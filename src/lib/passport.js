'use strict'

import passport from 'passport';
import LocalStrategy from 'passport-local';

import pool from '../database.js';
import { encryptPassword, matchPassword } from './crypt.js';

passport.use('local.login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const data = await pool.query('SELECT * FROM users Where username = ? OR email = ?', [username, username]);
	const data2 = data[0];
	if (data2.length > 0) {
		const user = data2[0];
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
	const { email, phone_number } = req.body;
	const newUser = {
		email,
		password,
		username,
		phone_number
	};
	newUser.password = await encryptPassword(password);
	const res = await pool.query('INSERT INTO users Set ? ', [newUser]);
	return done(null, newUser);
}));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser( async (username, done) => {
	const data = await pool.query('SELECT * FROM users Where username = ?', [username]);
	done(null, data[0][0]);
});

export default passport;
