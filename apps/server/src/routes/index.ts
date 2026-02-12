import authRoutes from '@modules/auth/auth.routes';
import userRoutes from '@modules/user/user.routes';
import { type IRouter, Router } from 'express';

const rootRouter: IRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/users', userRoutes);

export default rootRouter;
