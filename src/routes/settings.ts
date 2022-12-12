
import { Router } from 'express';
import { extname, resolve } from 'path';
import fs from 'fs-extra';
import { isLoggedIn } from '../libs/logged.js';
import { encryptPassword } from '../auth/crypt.js';
import { random } from '../libs/random.js';
import { Comment, Image, User } from '../models/index.js';
import { validateSettings } from '../libs/validations.js';
import {
	arrayPassword,
	arrayEmail,
	arrayLinks
} from '../libs/validationsArrays.js';
import { getResponse } from '../libs/services.js';

const router = Router();

router.post('/avatar', isLoggedIn, async (req, res) => {
	if (req.file && req.user !== undefined) {
		const { username, avatar } = req.user;
		const tempPath: string = req.file.path;
		const originalName: string = req.file.originalname;

		const saveImage = async () => {
			const avatarURL = random();
			const ext = extname(originalName).toLowerCase();

			if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
				const image = await User.findOne({ where: { avatar: avatarURL + ext } });

				if (image) saveImage();

				const oldPath: string = resolve(`src/public/uploads/avatars/${avatar}`);
				const targetPath: string = resolve(`src/public/uploads/avatars/${avatarURL}${ext}`);
				
				if (avatar !== 'default.png') await fs.unlink(oldPath);

				await fs.rename(tempPath, targetPath);

				await User.update({ avatar: avatarURL + ext }, {
					where: { username }
				});

				const imageAvatar = await Image.find({ author: username });

				for (const image of imageAvatar) {
					image.avatar = avatarURL + ext;
					await image.save();
				}

				const commentAvatar = await Comment.find({ sender: username });

				for (const comment of commentAvatar) {
					comment.avatar = avatarURL + ext;
					await comment.save();
				}

				const response = getResponse('success-settings', 'Your profile picture has been successfully updated');

				res.json(response);
			} else {
				await fs.unlink(tempPath);

				const response = getResponse('errors-settings', 'An error occurred while updating your image');

				res.json(response);
			}
		};
		saveImage();
	} else {
		const response = getResponse('errors-settings', 'An error occurred while updating your image');

		res.json(response);
	}
});

router.post('/description', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username } = req.user;

		await User.update({ description: req.body.userDescription },
			{ where: { username } }
		);

		const response = getResponse('success-settings', 'Your description has been successfully updated');

		res.json(response);
	} else {
		const response = getResponse('errors-settings', 'There was an error updating your description');

		res.json(response);
	}
});

router.post(
	'/password',
	isLoggedIn,
	validateSettings(arrayPassword),
	async (req, res) => {
		if (req.user !== undefined) {
			const { username } = req.user;
			const actPassword = await encryptPassword(req.body.newPassword);
			
			await User.update({ password: actPassword },
				{ where: { username } }
			);

			const response = getResponse('success-settings', 'Your password has been successfully updated');
	
			res.json(response);
		} else {
			const response = getResponse('errors-settings', 'There was an error updating your password');
	
			res.json(response);
		}
	}
);

router.post(
	'/email',
	isLoggedIn,
	validateSettings(arrayEmail),
	async (req, res) => {
		if (req.user !== undefined) {
			const { username } = req.user!;

			await User.update({ email: req.body.newEmail },
				{ where: { username } }
			);

			const response = getResponse('success-settings', 'Your email has been successfully updated');
	
			res.json(response);
		} else {
			const response = getResponse('errors-settings', 'There was an error updating your email');
	
			res.json(response);
		}
	}
);

router.post('/phone', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { phoneNumber } = req.body;
		const { username } = req.user;

		if (phoneNumber && !isNaN(Number(phoneNumber))) {
			await User.update({ phoneNumber }, {
				where: { username }
			});
		}

		const response = getResponse('success-settings', 'Your phone number has been successfully updated');

		res.json(response);
	} else {
		const response = getResponse('errors-settings', 'There was an error updating your phone number');

		res.json(response);
	}
});

router.post('/deletephone', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username } = req.user;

		await User.update({ phoneNumber: '' }, {
			where: { username }
		});

		res.redirect('back');
	} else {
		res.json('.');
	}
});

router.post(
	'/links',
	isLoggedIn,
	validateSettings(arrayLinks),
	async (req, res) => {
		if (req.user !== undefined) {
			const { title, url } = req.body;
			const { username } = req.user;
			let { links } = req.user;
			links += `${title}|${url}-`;

			await User.update({ links }, {
				where: { username }
			});

			const response = getResponse('success-settings', 'Your link has been successfully updated');
	
			res.json(response);
		} else {
			const response = getResponse('errors-settings', 'There was an error updating your link');
	
			res.json(response);
		}
	}
);

router.post('/deletelink', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { links, username } = req.user;
		const { title, url } = req.body;
		let newLink = '';

		for (const link of links.split(`${title}|${url}-`)) {
			newLink += link;
		}

		await User.update({ links: newLink }, {
			where: { username }
		});

		res.redirect('back');
	} else {
		res.redirect('back');
	}
});

router.post('/deleteuser', isLoggedIn, async (req, res, next) => {
	if (req.user !== undefined) {
		const { avatar, username } = req.user;

		if (avatar !== 'default.png') {
			await fs.unlink(`./src/public/uploads/avatars/${avatar}`);
		}

		const images = await Image.find();

		if (images.length > 0) {
			for (const image of images) {
				if (image.author === username) {
					await fs.unlink(`./src/public/uploads/${image.filename}`);
					await image.remove();
					continue;
				}
				if (image.like.includes(username)) {
					image.like = image.like.filter(opt => opt !== username);
					await image.save();
				}
				if (image.dislike.includes(username)) {
					image.dislike = image.dislike.filter(opt => opt !== username);
					await image.save();
				}
			}
		}

		await Comment.deleteMany({ sender: username });

		req.logout(async err => {
			if (err) return next(err);
			await User.destroy({ where: { username } });
			res.json('/');
		});
	} else {
		res.json('');
	}
});

export default router;
