
import { Op } from 'sequelize';
import { ValidationError } from 'express-validator';
import { MessageData, ErrorMessage } from '../types.js';
import { User, Comment } from '../models/index.js';

export const getUser = (value: string): Promise<User | null> => {
	return User.findOne({
		where: {
			[Op.or]: [
				{ username: value },
				{ email: value }
			]
		}
	});
};

export const getErrorMessage = (
	values: MessageData,
	errors: ValidationError[]
): ErrorMessage => {
	const message: MessageData = {};
	for (const e of errors) {
		message[e.param] = e.msg;
	}
	return { message, values };
};

export const getCommentId = async (imageId: number): Promise<number> => {
	const comments = await Comment.find({
		image_dir: imageId
	});
	if (comments.length > 0) return (Math.max(...comments.map(c => c.id)) + 1);
	else return 1;
};

export const getMessage = (err: ValidationError[]) => {
	const message: MessageData = {};
	for (const e of err) {
		message[e.param] = e.msg;
	}
	return message;
};
