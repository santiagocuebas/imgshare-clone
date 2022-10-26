
import { Router } from 'express';
import passport from 'passport';
import {
	body, 
	Result,
	ValidationError,
	validationResult
} from 'express-validator';
import { isLoggedIn, isNotLoggedIn } from '../libs/logged.js';
import {
	isValidUsername,
	isValidEmail,
	confirmPassword,
	isRegisterUser,
	isCorrectPassword
} from '../libs/customValidators.js';
import { validateLogin, validateSignup } from '../libs/validations.js';

const router = Router();

router.get('/signup', isNotLoggedIn, (_req, res) => res.render('auth/signup'));

router.post('/signup',
	isNotLoggedIn,
	validateSignup([
		body('username', 'Enter a valid username')
			.exists({ checkFalsy: true }).bail()
			.isLength({ max: 255 }).bail()
			.custom(isValidUsername),
		body('email', 'Enter a valid e-mail')
			.exists({ checkFalsy: true }).bail()
			.isLength({ max: 255 }).bail()
			.isEmail().bail()
			.custom(isValidEmail),
		body('password', 'Enter a valid password')
			.exists({ checkFalsy: true }).bail()
			.matches(/[0-9]/).withMessage('Password must contain a number').bail()
			.matches(/[a-z]/).withMessage('Password must contain a lowercase letter').bail()
			.matches(/[A-Z]/).withMessage('Password must contain a uppercase letter').bail()
			.matches(/[!@#$%^&*)(+=._-]/).withMessage('Password must contain a special character').bail()
			.isLength({ min: 8, max: 255 }).withMessage('Password must contain at least 5 characters'),
		body('confirm_password')
			.custom(confirmPassword)
	]),
	(req, res, next) => {
		const errs: Result<ValidationError> = validationResult(req);

		if (!errs.isEmpty()) {
			res.json({ errors: 'Ha ocurrido un error' });
		} else {
			passport.authenticate('signup', {
				successRedirect: '/'
			})(req, res, next);
		}
	}
);

router.get('/login', isNotLoggedIn, (_req, res) => res.render('auth/login'));

router.post('/login',
	isNotLoggedIn,
	validateLogin([
		body('username', 'Enter a valid username')
			.exists({ checkFalsy: true }).bail()
			.isLength({ max: 255 }).bail()
			.custom(isRegisterUser),
		body('password', 'Enter a valid password')
			.exists({ checkFalsy: true }).bail()
			.isLength({ min: 4, max: 255 }).bail()
			.custom(isCorrectPassword),
	]),
	(req, res, next) => {
		const errs: Result<ValidationError> = validationResult(req);

		if (!errs.isEmpty()) {
			res.json({ errors: 'Ha ocurrido un error' });
		} else {
			passport.authenticate('login', {
				successRedirect: '/'
			})(req, res, next);
		}
	}
);

router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logout(err => {
		if (err) return next(err);

		res.redirect('/');
	});
});

export default router;
