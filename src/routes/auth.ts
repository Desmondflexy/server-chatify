import express from 'express';
import * as auth from '../controllers/auth';

const router = express.Router();
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/google', auth.googleSignOn);
router.get('/logout', auth.logout);
export default router;