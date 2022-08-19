'use strict'

import { Router } from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';

import { isLoggedIn, isNotLoggedIn } from '../lib/logged.js';
import User from '../models/user.js';

const router = Router();

router.get('/signup', isNotLoggedIn, (req, res) => res.render('auth/signup'));

router.post('/signup', isNotLoggedIn, [
		body('username', 'Enter a valid username')
			.exists({checkFalsy: true}).bail()
			.isLength({max: 255}).bail()
			.custom(value => {
				return User.findOne({where: {username: value}}).then(user => {
					if (user) return Promise.reject('Username already in use');
				});
			}),
		body('email', 'Enter a valid email')
			.exists({checkFalsy: true}).bail()
			.isLength({max: 255}).bail()
			.isEmail().bail()
			.custom(value => {
				return User.findOne({where: {email: value}}).then(user => {
					if (user) return Promise.reject('E-mail already in use');
				});
			}),
		body('password', 'Enter a valid password')
			.exists({checkFalsy: true}).bail()
			.matches(/\d/).withMessage('Password must contain a number').bail()
			.isLength({min: 4, max:255}).withMessage('Password must contain at least 5 characters'),
		body('confirm_password')
			.custom((value, {req}) => {
				if (value !== req.body.password) throw new Error('Password not match');
				return true;
			})
	], (req, res, next) => {
		const err = validationResult(req);
		if (!err.isEmpty()) {
			const message = {};
			const values = {
				username: req.body.username,
				email: req.body.email
			};
			for (const error of err.array()) {
				message[error.param] = error.msg;
			};
			res.render('auth/signup.hbs', { values, message });
		} else {
			passport.authenticate('signup', {
				successRedirect: '/',
				failureRedirect: '/signup',
				failureFlash: true
			})(req, res, next);
		};
});

router.get('/login', isNotLoggedIn, (req, res) => res.render('auth/login'));

router.post('/login', isNotLoggedIn, [
		body('username', 'Enter a valid username')
			.exists({checkFalsy: true}).bail()
			.isLength({max: 255}).bail(),
		body('password', 'Enter a valid password')
			.exists({checkFalsy: true}).bail()
			.isLength({min: 4, max: 255}).bail()
	], (req, res, next) => {
		const err = validationResult(req);
		if (!err.isEmpty()) {
			const message = {};
			const values = {
				username: req.body.username
			};
			for (const error of err.array()) {
				message[error.param] = error.msg;
			}
			res.render('auth/login.hbs', { message, values });
		} else {
			passport.authenticate('login', {
				successRedirect: '/',
				failureRedirect: '/login',
				failureFlash: true
			})(req, res, next);
		};
});

router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		res.redirect('/');
	});
});

export default router;
