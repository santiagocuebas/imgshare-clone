
import { Router } from 'express';
import { Image, Comment, User } from '../models/index.js';
import { isLoggedIn } from '../libs/logged.js';

const router = Router();

router.get('/:username', async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ where: { username } });
	
	if (user) {
		const { username, avatar } = user;
		const fUser = { username, avatar };
		const images = await Image
			.find({ author: fUser.username })
			.sort({ timestamp: 1 })
			.lean({ virtuals: true });

		res.render('user/user', { fUser, images });
	} else res.redirect('/');
});

router.get('/:username/post', async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ where: { username } });

	if (user) {
		const { username, avatar } = user;
		const fUser = { username, avatar };
		const images = await Image
			.find({ author: fUser.username })
			.sort({ timestamp: 1 })
			.lean({ virtuals: true });

		res.render('user/user', { fUser, images });
	} else res.redirect('/');
});

router.get('/:username/comments', async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ where: { username } });

	if (user) {
		const { username, avatar } = user;
		const fUser = { username, avatar };
		const comments = await Comment
			.find({ receiver: fUser.username })
			.sort({ timestamp: -1 })
			.lean();

		res.render('user/user', { fUser, comments });
	} else res.redirect('/');
});

router.get('/:username/about', async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ where: { username } });
	if (user) {
		const {
			username,
			avatar,
			description,
			creationDate,
			links,
			totalViews
		} = user;
		const fUser = {
			username,
			avatar,
			description,
			creationDate,
			links,
			totalViews
		};
		const about = true;

		res.render('user/user', { fUser, about });
	} else res.redirect('/');
});

router.get('/:username/upload', isLoggedIn, (req, res) => {
	const { username } = req.params;
	const user = req.user;
	if (user && user.username === username) res.render('user/upload');
	else res.redirect(`/user/${user?.username}/upload`);
});

router.get('/:username/settings', isLoggedIn, async (req, res) => {
	const { username } = req.params;
	const user = req.user;
	if (user && user.username === username) {
		const user = await User.findOne({ where: { username } });
		
		res.render('user/settings', { settings: user });
	} else res.redirect(`/user/${user!.username}/settings`);
});

export default router;
