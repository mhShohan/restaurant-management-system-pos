import { type IRouter, Router } from 'express';
import authController from './auth.controllers';
import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { loginSchema, registerSchema, updateProfileSchema } from './auth.validators';

const authRoutes: IRouter = Router();

authRoutes.post('/register', validateRequest(registerSchema), authController.register);
authRoutes.post('/login', validateRequest(loginSchema), authController.login);
authRoutes.post('/logout', authController.logout);
authRoutes.post('/verify-token', verifyAuth, authController.verifyToken);
authRoutes.post('/refresh-token', authController.refreshToken);

authRoutes.get('/profile', verifyAuth, authController.getProfile);
authRoutes.put('/profile', verifyAuth, validateRequest(updateProfileSchema), authController.updateProfile);

export default authRoutes;
