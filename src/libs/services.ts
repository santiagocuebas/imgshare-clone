
import { Op } from 'sequelize';
import { ValidationError } from 'express-validator';
import { MessageData } from '../types.js';
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

export const getErrorMessage = (errors: ValidationError[]): MessageData => {
	const message: MessageData = {};

	for (const e of errors) {
		message[e.param] = e.msg;
	}

	return message;
};

export const getCommentId = async (imageId: number): Promise<number> => {
	const comments = await Comment.find({
		image_dir: imageId
	});
	if (comments.length > 0) return (Math.max(...comments.map(c => c.id)) + 1);
	else return 1;
};

export const getResponse = (text: string, message: string): object => {
	return {
		class: text,
		message
	};
};
