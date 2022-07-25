'use strict'

import { Router } from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';

import { isLoggedIn, isNotLoggedIn } from '../lib/logged.js';

const router = Router();

router.get('/signup', isNotLoggedIn, (req, res) => res.render('auth/signup'));

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
	successRedirect: '/',
	fairuleRedirect: '/signup'
}));

router.get('/login', isNotLoggedIn, (req, res) => res.render('auth/login'));

router.post('/login', isNotLoggedIn, passport.authenticate('local.login', {
	successRedirect: '/',
	fairuleRedirect: '/login'
}));

router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		res.redirect('/');
	});
});

export default router;
