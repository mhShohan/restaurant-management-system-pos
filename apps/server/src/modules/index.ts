import authRoutes from '@modules/auth/auth.routes';
import categoryRoutes from '@modules/category/category.routes';
import dashboardRoutes from '@modules/dashboard/dashboard.routes';
import menuItemRoutes from '@modules/menuItem/menuItem.routes';
import orderRoutes from '@modules/order/order.routes';
import paymentRoutes from '@modules/payment/payment.routes';
import settingsRoutes from '@modules/settings/settings.routes';
import tableRoutes from '@modules/table/table.routes';
import userRoutes from '@modules/user/user.routes';
import { type IRouter, Router } from 'express';

const rootRouter: IRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/categories', categoryRoutes);
rootRouter.use('/menu-items', menuItemRoutes);
rootRouter.use('/tables', tableRoutes);
rootRouter.use('/orders', orderRoutes);
rootRouter.use('/payments', paymentRoutes);
rootRouter.use('/settings', settingsRoutes);
rootRouter.use('/dashboard', dashboardRoutes);

export default rootRouter;
