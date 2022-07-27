'use strict'

import { Router } from 'express';
const router = Router();

import Image from '../models/image.js';

router.get('/', async (req, res) => {
	const images = await Image.find().sort({timestamp: 1}).lean({ virtuals: true });
	res.render('index.hbs', { images });
});

export default router;
