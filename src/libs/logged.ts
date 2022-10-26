
import { Request, Response, NextFunction } from 'express';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) return next();
	return res.redirect('/');
};

export const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) return next();
	return res.redirect('/');
};
