
import { Router } from 'express';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from '../libs/logged.js';
import { validateAuth } from '../libs/validations.js';
import { arrayLogin, arraySignup } from '../libs/validationsArrays.js';

const router = Router();

router.get('/signup', isNotLoggedIn, (_req, res) => res.render('auth/signup'));

router.post(
	'/signup',
	isNotLoggedIn,
	validateAuth(arraySignup),
	passport.authenticate('signup'),
	(req, res) => res.json(`/user/${req.body.username}`)
);

router.get('/login', isNotLoggedIn, (_req, res) => res.render('auth/login'));

router.post(
	'/login',
	isNotLoggedIn,
	validateAuth(arrayLogin),
	passport.authenticate('login'),
	(req, res) => res.json(`/user/${req.body.username}`)
);

router.post('/logout', isLoggedIn, (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);
		return res.json('/');
	});
});

export default router;
