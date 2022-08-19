'use strict'

import { Op } from 'sequelize';
import { Router } from 'express';
const router = Router();

import Image from '../models/image.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';
import { isLoggedIn } from '../lib/logged.js';

router.get('/:username', async (req, res) => {
	const { username } = req.params;
	const data = await User.findOne({where: {username: username}});
	if (data) {
		const foreignUser = data.dataValues;
		const images = await Image.find({author: foreignUser.username}).sort({timestamp: 1}).lean({virtuals: true});
		console.log(`Success ${foreignUser.username}`);
		res.render('user.hbs', { foreignUser, images });
	} else {
		console.log(`ERROR 404: The user ${username} no exists`);
		res.redirect('/');
	};
});

router.get('/:username/post', async (req, res) => {
	const { username } = req.params;
	const data = await User.findOne({where: {username: username}});
	if (data) {
		const user = data.dataValues;
		const images = await Image.find({author: user.username}).sort({timestamp: 1}).lean({virtuals: true});
		console.log(`Success ${user.username}`);
		res.render('user.hbs', { user, images });
	} else {
		console.log(`ERROR 404: The user ${username} no exists`);
		res.redirect('/');
	};
});

router.get('/:username/comments', async (req, res) => {
	const { username } = req.params;
	const data = await User.findOne({where: {username: username}});
	if (data) {
		const user = data.dataValues;
		const comments = await Comment.find({receiver: user.username}).sort({timestamp: 1}).lean();
		console.log(`Success ${user.username}`);
		res.render('user.hbs', { user, comments });
	} else {
		console.log(`ERROR 404: The user ${username} no exists`);
		res.redirect('/');
	};
});

router.get('/:username/upload', isLoggedIn, (req, res) => {
	const { username } = req.params;
	const user = req.user;
	if (user.username === username) res.render('upload.hbs');
	else res.redirect(`/user/${user.username}/upload`);
});

// router.get('/:username/about', isLoggedIn, (req, res) => {
// 	const { username } = req.params;
// 	const user = req.user;
// 	if (user.username === username) res.render('upload.hbs');
// 	else res.redirect(`/user/${user.username}/upload`);
// });

export default router;
