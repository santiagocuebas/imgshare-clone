
import { Router } from 'express';

const router = Router();

router.all('*', (_req, res) => res.redirect('/'));

export default router;
