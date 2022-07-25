'use strict'

export const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	return res.redirect('/');
}

export const isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) return next();
	return res.redirect('/');
}
