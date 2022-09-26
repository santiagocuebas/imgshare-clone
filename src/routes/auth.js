'use strict';

import { Router } from 'express';
import passport from 'passport';
import { Op } from 'sequelize';
import { check, validationResult } from 'express-validator';
import { isLoggedIn, isNotLoggedIn } from '../lib/logged.js';
import { matchPassword } from '../lib/crypt.js';
import { User } from '../models/index.js';

const router = Router();

const getUser = value => {
	return User.findOne({
		where: {
			[Op.or]: [
				{ username: value },
				{ email: value }
			]
		}
	});
};

const getErrors = (value, errors) => {
	const message = {};
	const values = {
		username: value.username,
		email: value?.email
	};
	for (const e of errors) {
		message[e.param] = e.msg;
	};
	return { message, values };
};

router.get('/signup', isNotLoggedIn, (req, res) => res.render('auth/signup'));

router.post('/signup', isNotLoggedIn,
	check('username', 'Enter a valid username')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 255 }).bail()
		.custom(async value => {
			const user = await User.findOne({ where: { username: value } });
			if (user) throw new Error('Username already in use');
			return true;
		}),
	check('email', 'Enter a valid e-mail')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 255 }).bail()
		.isEmail().bail()
		.custom(async value => {
			const user = await User.findOne({ where: { email: value } });
			if (user) throw new Error('E-mail already in use');
			return true;
		}),
	check('password', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.matches(/\d/).withMessage('Password must contain a number').bail()
		.isLength({ min: 4, max: 255 }).withMessage('Password must contain at least 5 characters'),
	check('confirm_password')
		.custom((value, { req }) => {
			if (value !== req.body.password) throw new Error('Password not match');
			return true;
		}),
	(req, res, next) => {
		const err = validationResult(req);
		if (!err.isEmpty()) res.render('auth/signup', getErrors(req.body, err.array()));
		else passport.authenticate('signup', { successRedirect: '/' })(req, res, next);
	}
);

router.get('/login', isNotLoggedIn, (req, res) => res.render('auth/login'));

router.post('/login', isNotLoggedIn,
	check('username', 'Enter a valid username')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 255 }).bail()
		.custom(async value => {
			const user = await getUser(value);
			if (!user) throw new Error('The user no exists');
			return true;
		}),
	check('password', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.isLength({ min: 4, max: 255 }).bail()
		.custom(async (value, { req }) => {
			const user = await getUser(req.body.username);
			let match = false;
			if (user !== null) match = await matchPassword(value, user.dataValues.password);
			if (!match) throw new Error('Incorrect password');
			return true;
		}),
	(req, res, next) => {
		const err = validationResult(req);
		if (!err.isEmpty()) res.render('auth/login', getErrors(req.body, err.array()));
		else passport.authenticate('login', { successRedirect: '/' })(req, res, next);
	}
);

router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		res.redirect('/');
	});
});

export default router;
