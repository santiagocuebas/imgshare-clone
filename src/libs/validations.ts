
import { Request, Response, NextFunction } from 'express';
import {
	validationResult,
	ValidationChain,
	Result,
	ValidationError
} from 'express-validator';
import { ErrorMessage } from '../types.js';
import { getErrorMessage } from '../libs/services.js';

export const validateLogin = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errs: Result<ValidationError> = validationResult(req);

		if (errs.isEmpty()) {
			return next();
		}

		const errors: ErrorMessage = getErrorMessage(req.body, errs.array());
		console.log(errs.array());
		console.log(errors);

		res.json(errors);
	};
};

export const validateSignup = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errs: Result<ValidationError> = validationResult(req);

		if (errs.isEmpty()) {
			return next();
		}

		const errors: ErrorMessage = getErrorMessage(req.body, errs.array());
		console.log(errs.array());
		console.log(errors);

		res.json(errors);
	};
};
