
import { Router } from 'express';
import fs from 'fs-extra';
import { HydratedDocument } from 'mongoose';
import { extname, resolve } from 'path';
import { IImage } from '../types.js';
import { Image, Comment } from '../models/index.js';
import { random } from '../libs/random.js';
import { recentUploads } from '../libs/sidebar.js';
import { isLoggedIn } from '../libs/logged.js';
import { getCommentId } from '../libs/services.js';

const router = Router();

router.get('/', async (_req, res) => {
	const images = await Image
		.find()
		.sort({ createdAt: -1 })
		.lean({ virtuals: true });

	res.render('index', { images });
});

router.post('/', isLoggedIn, async (req, res) => {
	if (req.file) {
		const tempPath: string = req.file.path;
		const ext: string = extname(req.file.originalname).toLowerCase();
		const { username, avatar } = req.user!;

		const saveImage = async () => {
			const imgURL = random();
			const images = await Image
				.find({ filename: imgURL })
				.lean();

			if (images.length > 0) saveImage();

			if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
				const targetPath: string = resolve(`src/public/uploads/${imgURL}${ext}`);
				await fs.rename(tempPath, targetPath);
				const newImg: HydratedDocument<IImage> = new Image({
					title: req.body.title,
					description: req.body.description,
					filename: imgURL + ext,
					author: username,
					avatar
				});

				await newImg.save();
				
				res.redirect('/');
			} else {
				await fs.unlink(tempPath);
				res.redirect('/');
			}
		};
		saveImage();
	} else res.redirect('/');
});

router.get('/:imageId', async (req, res) => {
	const oldImage = await Image
		.findOne({
			filename: { $regex: req.params.imageId }
		})
		.lean({ virtuals: true });
	if (oldImage) {
		const image: HydratedDocument<IImage> = await Image
			.findOneAndUpdate(
				{ _id: oldImage._id },
				{ $inc: { views: 1 } }
			)
			.lean({ virtuals: true });

		const comments = await Comment
			.find({ image_dir: image.uniqueId })
			.sort({ createdAt: -1 })
			.lean({ virtuals: true });

		const rImages = await recentUploads();

		res.render('image', { image, comments, rImages });
	} else {
		res.redirect('/');
	}
});

router.post('/:imageId/comment', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username, avatar } = req.user;
		const { imageId } = req.params;

		const image = await Image.findOne({
			filename: { $regex: imageId }
		});

		if (image) {
			const newComment = new Comment({
				id: await getCommentId(+imageId),
				image_dir: image.uniqueId,
				receiver: image.author,
				sender: username,
				comment: req.body.comment,
				avatar
			});
			await newComment.save();
			return res.redirect('/gallery/' + image.uniqueId);
		}
	} else {
		res.redirect('/');
	}
});

router.post('/:imageId/comment/:id', isLoggedIn, async (req, res) => {
	const { imageId, id } = req.params;
	const comments = await Comment.find({ image_dir: imageId });
	
	for (const comment of comments) {
		if (comment.id === Number(id)) {
			await comment.remove();
			break;
		}
	}
	res.json(`http://localhost:3000/gallery/${imageId}`);
});

router.post('/:imageId/:like', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username } = req.user;
		const { imageId, like } = req.params;

		const image = await Image.findOne({
			filename: { $regex: imageId }
		});

		if (image) {
			if (like === 'like') {
				if (!image.like.includes(username)) {
					image.like.push(username);
					image.dislike = image.dislike.filter(opt => opt !== username);
				} else image.like = image.like.filter(opt => opt !== username);
			} else if (like === 'dislike') {
				if (!image.dislike.includes(username)) {
					image.dislike.push(username);
					image.like = image.like.filter(opt => opt !== username);
				} else image.dislike = image.dislike.filter(opt => opt !== username);
			}

			const images = await image.save();

			res.json(images);
		}
	}
});

router.get('/alter/:galleryId', async (req, res) => {
	const { galleryId } = req.params;

	if (galleryId === 'newest' || galleryId === 'oldest' || galleryId === 'best') {
		let mySort = {};

		if (galleryId === 'newest') mySort = { createdAt: -1 };
		else if (galleryId === 'oldest') mySort = { createdAt: 1 };
		else if (galleryId === 'best') mySort = { like: -1 };

		const image = await Image
			.find()
			.sort(mySort)
			.lean({ virtuals: true });

		res.json(image);
	} else {
		res.json('<h2>Algo ha salido mal</h2>');
	}
});

router.delete('/:imageId', isLoggedIn, async (req, res) => {
	if (req.user !== undefined) {
		const { username } = req.user;
		const image = await Image.findOne({
			filename: { $regex: req.params.imageId }
		});

		if (image && image.author === username) {
			await fs.unlink(`./src/public/uploads/${image.filename}`);
			await Comment.deleteOne({ image_dir: image.uniqueId });
			await image.remove();
		
			res.json('http://localhost:3000/');
		} else {
			res.json('http://localhost:3000/');
		}
	} else {
		res.redirect('/');
	}
});

export default router;
