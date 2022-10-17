
import { Op } from 'sequelize';
import { User, Comment } from '../models/index.js';

export const getUser = value => {
	return User.findOne({
		where: {
			[Op.or]: [
				{ username: value },
				{ email: value }
			]
		}
	});
};

export const getErrors = (value, errors) => {
	const message = {};
	const values = {
		username: value.username,
		email: value?.email
	};
	for (const e of errors) {
		message[e.param] = e.msg;
	};
	return { message, values };
};

export const getCommentId = async imageId => {
	const comments = await Comment.find({
		image_dir: imageId
	});
	if (comments.length > 0) return (Math.max(...comments.map(c => c.id)) + 1);
	else return 1;
};

export const getMessage = err => {
	const message = {};
	for (const e of err.array()) {
		message[e.param] = e.msg;
	}
	return message;
};
