'use strict';

import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { extname, resolve } from 'path';
import fs from 'fs-extra';
import { isLoggedIn } from '../libs/logged.js';
import { encryptPassword, matchPassword } from '../auth/crypt.js';
import { random } from '../libs/random.js';
import { Comment, Image, User } from '../models/index.js';
import { getMessage } from '../libs/services.js';

const router = Router();

router.post('/avatar', isLoggedIn, async (req, res) => {
	if (req.file) {
		const { username, avatar } = req.user;
		const tempPath = req.file.path;
		const saveImage = async () => {
			const avatarURL = random();
			const ext = extname(req.file.originalname).toLowerCase();
			if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
				const image = await User.findOne({ where: { avatar: avatarURL + ext } });
				if (image) saveImage();
				const oldPath = resolve(`src/public/uploads/avatars/${avatar}`);
				const targetPath = resolve(`src/public/uploads/avatars/${avatarURL}${ext}`);
				if (avatar !== 'default.png') await fs.unlink(oldPath);
				await fs.rename(tempPath, targetPath);
				await User.update({ avatar: avatarURL + ext }, {
					where: { username }
				});
				const imageAvatar = await Image.find({ author: username });
				for (const user of imageAvatar) {
					user.avatar = avatarURL + ext;
					await user.save();
				};
				const commentAvatar = await Comment.find({ sender: username });
				for (const user of commentAvatar) {
					user.avatar = avatarURL + ext;
					await user.save();
				};
				res.redirect('back');
			} else {
				await fs.unlink(tempPath);
				res.redirect('/');
			};
		};
		saveImage();
	} else res.redirect('back');
});

router.post('/description', isLoggedIn, async (req, res) => {
	const { username } = req.user;
	await User.update({ description: req.body.userDescription },
		{ where: { username } }
	);
	res.redirect('back');
});

router.post('/password', isLoggedIn,
	check('currentPassword')
		.custom(async (value, { req }) => {
			const match = await matchPassword(value, req.user.password);
			if (!match) throw new Error('Incorrect password');
			return true;
		}),
	check('newPassword', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.matches(/\d/).withMessage('Password must contain a number').bail()
		.isLength({ min: 4, max: 255 }).withMessage('Password must contain at least 5 characters'),
	check('confirmPassword')
		.custom((value, { req }) => {
			if (value !== req.body.newPassword) throw new Error('Password not match');
			return true;
		}),
	async (req, res) => {
		const err = validationResult(req);
		if (!err.isEmpty()) res.render('settings.hbs', getMessage(err));
		else {
			const { username } = req.user;
			const actPassword = await encryptPassword(req.body.newPassword);
			await User.update({ password: actPassword },
				{ where: { username } }
			);
			res.redirect('back');
		};
	}
);

router.post('/email', isLoggedIn,
	check('currentEmail')
		.custom((value, { req }) => {
			if (value !== req.body.currentEmail) throw new Error('Incorrect e-mail');
			return true;
		}),
	check('newEmail', 'Enter a valid e-mail')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 255 }).bail()
		.isEmail().bail()
		.custom(async value => {
			const user = await User.findOne({ where: { email: value } });
			if (user) throw new Error('E-mail already in use');
			return true;
		}),
	async (req, res) => {
		const err = validationResult(req);
		if (!err.isEmpty()) {
			const message = getMessage(err);
			res.render('user/settings', message);
		} else {
			const { username } = req.user;
			await User.update({ email: req.body.newEmail },
				{ where: { username } }
			);
			res.redirect('back');
		};
	}
);

router.post('/phone', isLoggedIn, async (req, res) => {
	const { phoneNumber } = req.body;
	const { username } = req.user;
	if (phoneNumber && !isNaN(Number(phoneNumber))) {
		console.log(phoneNumber);
		await User.update({ phone_number: Number(phoneNumber) }, {
			where: { username }
		});
	}
	console.log(req.user);
	res.redirect('back');
});

router.post('/deletephone', isLoggedIn, async (req, res) => {
	const { username } = req.user;
	await User.update({ phone_number: null }, {
		where: { username }
	});
	res.redirect('back');
});

router.post('/links', isLoggedIn,
	check('title')
		.exists({ checkFalsy: true }).withMessage('Insert a value').bail()
		.custom((value, { req }) => {
			const { links } = req.user;
			if (links.includes(value)) throw new Error('This title already exists');
			return true;
		}),
	check('url')
		.exists({ checkFalsy: true }).withMessage('Insert a value').bail()
		.isURL().withMessage('Not is a URL').bail()
		.custom((value, { req }) => {
			const { links } = req.user;
			if (links.includes(value)) throw new Error('This URL already exists');
			return true;
		}),
	async (req, res) => {
		const err = validationResult(req);
		if (!err.isEmpty()) {
			const message = getMessage(err);
			res.render('user/settings', message);
		} else {
			const { title, url } = req.body;
			const { username } = req.user;
			let { links } = req.user;
			links += `${title}|${url}-`;
			await User.update({ links }, {
				where: { username }
			});
			res.redirect('back');
		}
	}
);

router.post('/deletelink', isLoggedIn, async (req, res) => {
	const { title, url } = req.body;
	const { links, username } = req.user;
	let newLink = '';
	for (const link of links.split(`${title}|${url}-`)) {
		newLink += link;
	}
	await User.update({ links: newLink }, {
		where: { username }
	});
	res.redirect('back');
});

router.post('/:username', isLoggedIn, async (req, res, next) => {
	const { username } = req.params;
	const { avatar } = req.user;
	if (avatar !== 'default.png') {
		await fs.unlink(`./src/public/uploads/avatars/${avatar}`);
	}
	const images = await Image.find({ author: username });
	if (images.length > 0) {
		for (const image of images) {
			await fs.unlink(`./src/public/uploads/${image.filename}`);
			await image.remove();
		}
	};
	await Comment.deleteMany({ sender: username });
	req.logout(async err => {
		if (err) return next(err);
		await User.destroy({ where: { username } });
		res.redirect('/');
	});
});

export default router;
