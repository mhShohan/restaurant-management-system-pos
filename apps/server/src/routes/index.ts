import authRoutes from '@modules/auth/auth.routes';
import categoryRoutes from '@modules/category/category.routes';
import menuItemRoutes from '@modules/menuItem/menuItem.routes';
import tableRoutes from '@modules/table/table.routes';
import userRoutes from '@modules/user/user.routes';
import { type IRouter, Router } from 'express';

const rootRouter: IRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/menu-items', menuItemRoutes);
rootRouter.use('/tables', tableRoutes);

export default rootRouter;
