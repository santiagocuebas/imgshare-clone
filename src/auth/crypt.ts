
import bcrypt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	const finalPass = await bcrypt.hash(password, salt);
	return finalPass;
};

export const matchPassword = (
	password: string,
	savedPassword: string
): Promise<boolean> => {
	return bcrypt.compare(password, savedPassword);
};
