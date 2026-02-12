import { type IRouter, Router } from 'express';

import authController from './auth.controllers';

const authRoutes: IRouter = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/logout', authController.logout);
authRoutes.post('/verify-token', authController.verifyToken);
authRoutes.post('/refresh-token', authController.refreshToken);

export default authRoutes;
