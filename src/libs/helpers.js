'use strict';

import moment from 'moment';
import { Comment } from '../models/index.js';

export const timeago = createdAt => moment(createdAt).startOf('minute').fromNow();

export const getCreateYear = createdAt => {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return `${months[createdAt.getMonth()]} ${createdAt.getDate()} ${createdAt.getFullYear()}`;
};

export const isTrue = (username, name) => {
	if (username) {
		if (username === name) return true;
		else return false;
	} else return false;
};

export const allLinks = links => {
	const allLinks = [];
	for (const data of links.split('-')) {
		if (data) {
			const args = data.split('|');
			allLinks.push({ title: args[0], url: args[1] });
		}
	};
	return allLinks;
};

export const totalComments = async id => {
	const comments = await Comment.find({ image_id: id }).lean();
	return comments.length;
};
