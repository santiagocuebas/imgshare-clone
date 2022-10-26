
import { CustomValidator } from 'express-validator';
import { User } from '../models/index.js';
import { matchPassword } from '../auth/crypt.js';
import { getUser } from '../libs/services.js';

export const isValidUsername: CustomValidator = async (username: string): Promise<boolean> => {
	const user: User | null = await User.findOne({ where: { username } });

	if (user) {
		throw new Error('Username already in use');
	}

	return true;
};

export const isValidEmail: CustomValidator = async (email: string): Promise<boolean> => {
	const user: User | null = await User.findOne({ where: { email } });

	if (user) {
		throw new Error('E-mail already in use');
	}

	return true;
};

export const confirmPassword: CustomValidator = (value: string, { req: { body } }): boolean => {
	if (value !== body.password) {
		throw new Error('Password not match');
	}

	return true;
};

export const isRegisterUser: CustomValidator = async (value: string): Promise<boolean> => {
	const user: User | null = await getUser(value);

	if (!user) {
		throw new Error('The user no exists');
	}

	return true;
};

export const isCorrectPassword: CustomValidator = async (value: string, { req: { body } }): Promise<boolean> => {
	const user: User | null = await getUser(body.username);
	let match = false;

	if (user !== null) {
		match = await matchPassword(value, user.password);
	}

	if (!match) {
		throw new Error('Incorrect password');
	}

	return true;
};

export const isCorrectCurrentPassword: CustomValidator = async (value: string, { req: { user } }): Promise<boolean> => {
	const match: boolean = await matchPassword(value, user.password);

	if (!match) {
		throw new Error('Incorrect password');
	}

	return true;
};

export const isCorrectEmail: CustomValidator = (value: string, { req: { user } }): boolean => {
	if (value !== user.email) {
		throw new Error('Incorrect e-mail');
	}

	return true;
};

export const isValidLinkTitle: CustomValidator = (value: string, { req: { user } }): boolean => {
	const { links } = user;

	if (links.includes(value)) {
		throw new Error('This title already exists');
	}

	return true;
};

export const isValidLinkURL: CustomValidator = (value: string, { req: { user } }): boolean => {
	const { links } = user;

	if (links.includes(value)) {
		throw new Error('This URL already exists');
	}

	return true;
};
