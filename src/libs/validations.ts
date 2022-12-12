
import { Request, Response, NextFunction } from 'express';
import {
	validationResult,
	ValidationChain,
	Result,
	ValidationError
} from 'express-validator';
import { MessageData } from '../types.js';
import { getErrorMessage } from '../libs/services.js';

export const validateAuth = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errs: Result<ValidationError> = validationResult(req);

		if (errs.isEmpty()) {
			return next();
		}

		const errors: MessageData = getErrorMessage(errs.array());

		res.json(errors);
	};
};

export const validateSettings = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errs: Result<ValidationError> = validationResult(req);

		if (errs.isEmpty()) {
			return next();
		}

		const errors: MessageData = getErrorMessage(errs.array());

		const data = {
			class: 'errors-settings',
			message: errors
		};

		res.json(data);
	};
};
