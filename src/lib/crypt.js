'use strict';

import bcrypt from 'bcrypt';

export const encryptPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	const finalPass = await bcrypt.hash(password, salt);
	return finalPass;
};

export const matchPassword = (password, savedPassword) => {
	return bcrypt.compare(password, savedPassword);
};
