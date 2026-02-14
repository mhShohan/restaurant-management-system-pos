import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import dashboardController from './dashboard.controllers';

const dashboardRoutes: IRouter = Router();

dashboardRoutes.use(verifyAuth);

dashboardRoutes.get('/stats', dashboardController.getStats);
dashboardRoutes.get('/sales-report', dashboardController.getSalesReport);
dashboardRoutes.get('/order-stats', dashboardController.getOrderStatsByStatus);
dashboardRoutes.get('/daily-summary', dashboardController.getDailySummary);

export default dashboardRoutes;
