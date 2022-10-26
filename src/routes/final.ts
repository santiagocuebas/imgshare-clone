
import { Router } from 'express';

const router = Router();

router.get('*', (_req, res) => res.redirect('/'));

export default router;
