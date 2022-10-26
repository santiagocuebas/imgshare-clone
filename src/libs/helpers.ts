
import moment from 'moment';
import { Comment } from '../models/index.js';

export const timeago = (createdAt: string): string => {
	return moment(createdAt).startOf('minute').fromNow();
};

export const getCreateYear = (createdAt: Date): string => {
	const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const month: number = createdAt.getMonth();
	const day: number = createdAt.getDate();
	const year: number = createdAt.getFullYear();

	return `${months[month]} ${day} ${year}`;
};

export const isTrue = (username: string, name: string): boolean => {
	if (username) {
		if (username === name) return true;
		else return false;
	} else return false;
};

export const allLinks = (links: string): object[] => {
	const allLinks: object[] = [];
	for (const data of links.split('-')) {
		if (data) {
			const args: string[] = data.split('|');
			allLinks.push({ title: args[0], url: args[1] });
		}
	}
	return allLinks;
};

export const totalComments = async (id: string): Promise<number> => {
	const comments = await Comment.find({ image_id: id }).lean();
	return comments.length;
};
