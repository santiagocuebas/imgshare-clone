
import { Router } from 'express';
import {
	check,
	validationResult,
	Result,
	ValidationError
} from 'express-validator';
import { extname, resolve } from 'path';
import fs from 'fs-extra';
import { isLoggedIn } from '../libs/logged.js';
import { encryptPassword } from '../auth/crypt.js';
import { random } from '../libs/random.js';
import { Comment, Image, User } from '../models/index.js';
import { getMessage } from '../libs/services.js';
import {
	isValidEmail,
	confirmPassword,
	isCorrectCurrentPassword,
	isCorrectEmail,
	isValidLinkTitle,
	isValidLinkURL
} from '../libs/customValidators.js';

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

				res.redirect('back');
			} else {
				await fs.unlink(tempPath);
				res.redirect('/');
			}
		};
		saveImage();
	} else res.redirect('back');
});

router.post('/description', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username } = req.user!;

		await User.update({ description: req.body.userDescription },
			{ where: { username } }
		);

		res.redirect('back');
	} else {
		res.redirect('back');
	}
});

router.post('/password', isLoggedIn,
	check('currentPassword')
		.custom(isCorrectCurrentPassword),
	check('newPassword', 'Enter a valid password')
		.exists({ checkFalsy: true }).bail()
		.matches(/\d/).withMessage('Password must contain a number').bail()
		.isLength({ min: 4, max: 255 }).withMessage('Password must contain at least 5 characters'),
	check('confirmPassword')
		.custom(confirmPassword),
	async (req, res) => {
		const errs: Result<ValidationError> = validationResult(req);
		
		if (!errs.isEmpty()) {
			res.render('settings.hbs', getMessage(errs.array()));
		}
		else {
			const { username } = req.user!;
			const actPassword = await encryptPassword(req.body.newPassword);
			
			await User.update({ password: actPassword },
				{ where: { username } }
			);

			res.redirect('back');
		}
	}
);

router.post('/email',
	isLoggedIn,
	check('currentEmail')
		.custom(isCorrectEmail),
	check('newEmail', 'Enter a valid e-mail')
		.exists({ checkFalsy: true }).bail()
		.isLength({ max: 255 }).bail()
		.isEmail().bail()
		.custom(isValidEmail),
	async (req, res) => {
		const errs = validationResult(req);

		if (!errs.isEmpty()) {
			const message = getMessage(errs.array());
			res.render('user/settings', message);
		} else {
			const { username } = req.user!;

			await User.update({ email: req.body.newEmail },
				{ where: { username } }
			);

			res.redirect('back');
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

		res.redirect('back');
	} else {
		res.redirect('back');
	}
});

router.post('/deletephone', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username } = req.user!;

		await User.update({ phoneNumber: '' }, {
			where: { username }
		});

		res.redirect('back');
	} else {
		res.redirect('back');
	}
});

router.post('/links',
	isLoggedIn,
	check('title', 'Insert a value')
		.exists({ checkFalsy: true }).bail()
		.custom(isValidLinkTitle),
	check('url', 'Insert a value')
		.exists({ checkFalsy: true }).bail()
		.isURL().withMessage('Not is a URL').bail()
		.custom(isValidLinkURL),
	async (req, res) => {
		const errs = validationResult(req);

		if (!errs.isEmpty()) {
			const message = getMessage(errs.array());
			res.render('user/settings', message);
		} else {
			const { title, url } = req.body;
			const { username } = req.user!;
			let { links } = req.user!;
			links += `${title}|${url}-`;

			await User.update({ links }, {
				where: { username }
			});

			res.redirect('back');
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

router.post('/:username', isLoggedIn, async (req, res, next) => {
	if (req.user !== undefined) {
		const { avatar } = req.user;
		const { username } = req.params;

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
			res.redirect('/');
		});
	} else {
		res.redirect('back');
	}
});

export default router;
