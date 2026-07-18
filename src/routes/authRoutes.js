import { Router } from 'express';
import { register, login, refresh, getMe } from '../controllers/authController.js';
import { registerValidator, loginValidator, refreshValidator } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/refresh', refreshValidator, validateRequest, refresh);
router.get('/me', authenticate, getMe);
router.get('/dashboard', authenticate, getDashboard)

export default router;
