
import { body, ValidationChain } from 'express-validator';
import {
	isValidLinkTitle,
	isValidLinkURL
} from '../libs/customValidators.js';
import {
	isValidUsername,
	isValidEmail,
	confirmPassword,
	isRegisterUser,
	isCorrectCurrentPassword,
	isCorrectEmail,
	isCorrectPassword
} from '../libs/customValidators.js';

export const arraySignup: ValidationChain[] = [
	body('username', 'Enter a valid username')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 60 }).bail()
		.custom(isValidUsername),
	body('email', 'Enter a valid e-mail')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 60 }).bail()
		.isEmail().bail()
		.custom(isValidEmail),
	body('password', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.matches(/[0-9]/).withMessage('Password must contain a number').bail()
		.matches(/[a-z]/).withMessage('Password must contain a lowercase letter').bail()
		.matches(/[A-Z]/).withMessage('Password must contain a uppercase letter').bail()
		.matches(/[!@#$%^&*)(+=._-]/).withMessage('Password must contain a special character').bail()
		.isLength({ min: 8, max: 40 }).withMessage('Password must contain at least 5 characters'),
	body('confirm_password')
		.custom(confirmPassword)
];

export const arrayLogin: ValidationChain[] = [
	body('username', 'Enter a valid username')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 60 }).bail()
		.custom(isRegisterUser),
	body('password', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.isLength({ min: 4, max: 40 }).bail()
		.custom(isCorrectPassword),
];

export const arrayPassword: ValidationChain[] = [
	body('currentPassword')
		.custom(isCorrectCurrentPassword),
	body('newPassword', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.matches(/\d/).withMessage('Password must contain a number').bail()
		.isLength({ min: 4, max: 255 }).withMessage('Password must contain at least 5 characters'),
	body('confirmPassword')
		.custom(confirmPassword)
];

export const arrayEmail: ValidationChain[] = [
	body('currentEmail')
		.custom(isCorrectEmail),
	body('newEmail', 'Enter a valid e-mail')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 255 }).bail()
		.isEmail().bail()
		.custom(isValidEmail)
];

export const arrayLinks: ValidationChain[] = [
	body('title', 'Insert a value')
		.exists({ checkFalsy: true }).bail()
		.custom(isValidLinkTitle),
	body('url', 'Insert a value')
		.exists({ checkFalsy: true }).bail()
		.isURL().withMessage('Not is a URL').bail()
		.custom(isValidLinkURL)
];
