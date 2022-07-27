'use strict'

import { Router } from 'express';
import fs from 'fs-extra';
import { extname, resolve } from 'path';
import { random } from '../helpers/random.js';
import Image from '../models/image.js';
import Comment from '../models/comment.js';

const router = Router();

router.post('/', (req, res) => {
	const user = req.user;
	const saveImage = async () => {
		const imgURL = random();
		const images = await Image.find({filename: imgURL}).lean();
		if (images.length > 0) saveImage();
		const tempPath = req.file.path;
		const ext = extname(req.file.originalname).toLowerCase();
		const targetPath  = resolve(`src/public/uploads/${imgURL}${ext}`);
		if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
			await fs.rename(tempPath, targetPath);
			const newImg = new Image({
				title: req.body.title,
				description: req.body.description,
				filename: imgURL + ext
			});
			if (user) newImg.author = user.username;
			console.log(newImg);
			await newImg.save();
			res.redirect('/');
		} else {
			await fs.unlink(tempPath);
			res.status(500).json({error: 'Only images are allowed'});
		};
	};
	saveImage();
});

router.get('/:image_id', async (req, res, next) => {
	const viewModel = { image: {}, comments: {} };
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if (image) {
		const updatedImage = await Image.findOneAndUpdate(
			{ _id: image.id },
			{ $inc: { views: 1 } }
		).lean( {virtuals: true} );
		viewModel.image = updatedImage;
		const comments = await Comment.find({image_id: image._id}).lean();
		viewModel.comments = comments;
		res.render('image.hbs', viewModel);
	} else {
		res.redirect('/');
	}
});

router.post('/:image_id/like', async (req, res) => {
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if (image) {
		image.likes++;
		await image.save();
		res.json({likes: image.likes});
	};
});

router.post('/:image_id/comment', async (req, res) => {
	const user = req.user;
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if (image) {
		const newComment = new Comment(req.body);
		newComment.image_id = image._id;
		if (user) newComment.author = user.username;
		await newComment.save();
		res.redirect('/gallery/' + image.uniqueId);
	};
});

router.delete('/:image_id', async (req, res) => {
	const image = await Image.findOne({filename: {$regex: req.params.image_id}});
	if (image) {
		await fs.unlink(`./src/uploads/${image.filename}`);
		await Comment.deleteOne({image_id: image._id});
		await image.remove();
		res.json('http://localhost:3000/');
	};
});

export default router;
