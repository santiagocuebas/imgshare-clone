'use strict';

import { Router } from 'express';
import { Image, Comment, User } from '../models/index.js';
import { isLoggedIn } from '../lib/logged.js';

const router = Router();

const getUser = username => {
	return User.findOne({ where: { username } });
};

router.get('/:username', async (req, res) => {
	const data = await getUser(req.params.username);
	if (data) {
		const { username, avatar } = data.dataValues;
		const fUser = { username, avatar };
		const images = await Image
			.find({ author: fUser.username })
			.sort({ timestamp: 1 })
			.lean({ virtuals: true });
		res.render('user/user', { fUser, images });
	} else res.redirect('/');
});

router.get('/:username/post', async (req, res) => {
	const data = await getUser(req.params.username);
	if (data) {
		const { username, avatar } = data.dataValues;
		const fUser = { username, avatar };
		const images = await Image
			.find({ author: fUser.username })
			.sort({ timestamp: 1 })
			.lean({ virtuals: true });
		res.render('user/user', { fUser, images });
	} else res.redirect('/');
});

router.get('/:username/comments', async (req, res) => {
	const data = await getUser(req.params.username);
	if (data) {
		const { username, avatar } = data.dataValues;
		const fUser = { username, avatar };
		const comments = await Comment
			.find({ receiver: fUser.username })
			.sort({ timestamp: -1 })
			.lean();
		res.render('user/user', { fUser, comments });
	} else res.redirect('/');
});

router.get('/:username/about', async (req, res) => {
	const data = await getUser(req.params.username);
	if (data) {
		const { username, avatar, description, createdAt, links, totalViews } = data.dataValues;
		const fUser = { username, avatar, description, createdAt, links, totalViews };
		const about = true;
		res.render('user/user', { fUser, about });
	} else res.redirect('/');
});

router.get('/:username/upload', isLoggedIn, (req, res) => {
	const { username } = req.params;
	const user = req.user;
	if (user.username === username) res.render('user/upload');
	else res.redirect(`/user/${user.username}/upload`);
});

router.get('/:username/settings', isLoggedIn, async (req, res) => {
	const { username } = req.params;
	const user = req.user;
	if (user.username === username) {
		const data = await getUser(req.params.username);
		const settings = data.dataValues;
		res.render('user/settings', { settings });
	} else res.redirect(`/user/${user.username}/settings`);
});

export default router;
