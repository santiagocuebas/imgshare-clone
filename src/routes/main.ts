
import { Image } from '../models/index.js';
import { Router } from 'express';
const router = Router();

router.get('/', async (_req, res) => {
	const images = await Image
		.find()
		.sort({ createdAt: -1 })
		.lean({ virtuals: true });
		
	res.render('index', { images });
});

export default router;
