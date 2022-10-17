'use strict';

import { Router } from 'express';
import passport from 'passport';
import { check, validationResult } from 'express-validator';
import { isLoggedIn, isNotLoggedIn } from '../libs/logged.js';
import { matchPassword } from '../auth/crypt.js';
import { User } from '../models/index.js';
import { getUser, getErrors } from '../libs/services.js';

const router = Router();

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
		if (!err.isEmpty()) {
			const errors = getErrors(req.body, err.array());
			res.render('auth/signup', errors);
		} else {
			passport.authenticate('signup', {
				successRedirect: '/'
			})(req, res, next);
		};
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
		if (!err.isEmpty()) {
			const errors = getErrors(req.body, err.array());
			res.render('auth/login', errors);
		} else {
			passport.authenticate('login', {
				successRedirect: '/'
			})(req, res, next);
		};
	}
);

router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		res.redirect('/');
	});
});

export default router;
