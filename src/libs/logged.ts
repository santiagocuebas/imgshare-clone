
import { Authenticate } from '../types.js';

export const isLoggedIn: Authenticate = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	return res.redirect('/');
};

export const isNotLoggedIn: Authenticate = (req, res, next) => {
	if (!req.isAuthenticated()) return next();
	return res.redirect('/');
};
