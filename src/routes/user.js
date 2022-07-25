'use strict'

import { Router } from 'express';
const router = Router();

import pool from '../database.js';

router.get('/:username', async (req, res)  => {
	const { username } = req.params;
	const match = await pool.query('SELECT * FROM users Where username = ?', [username]);
	const match2 = match[0];
	if (match2.length > 0) {
		const user = match2[0];
		console.log(`Success ${user.username}`);
		res.render('user.hbs', { user });
	} else {
		console.log(`ERROR 404: The user ${username} no exists`);
		res.render('/');
	};
});

router.get('/:username/upload', (req, res)  => res.render('upload.hbs'));

export default router;
