import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import dashboardController from './dashboard.controllers';

const dashboardRoutes: IRouter = Router();

dashboardRoutes.use(verifyAuth);

dashboardRoutes.get('/stats', dashboardController.getStats);
dashboardRoutes.get('/sales-report', dashboardController.getSalesReport);
dashboardRoutes.get('/order-stats', dashboardController.getOrderStatsByStatus);
dashboardRoutes.get('/daily-summary', dashboardController.getDailySummary);

// Analytics endpoints for charts
dashboardRoutes.get(
  '/analytics/revenue-trend',
  dashboardController.getRevenueTrend
);
dashboardRoutes.get(
  '/analytics/sales-by-category',
  dashboardController.getSalesByCategory
);
dashboardRoutes.get(
  '/analytics/revenue-by-payment',
  dashboardController.getRevenueByPaymentMethod
);
dashboardRoutes.get(
  '/analytics/hourly-orders',
  dashboardController.getHourlyOrders
);
dashboardRoutes.get(
  '/analytics/top-items',
  dashboardController.getTopSellingItems
);
dashboardRoutes.get(
  '/analytics/order-type',
  dashboardController.getOrderTypeDistribution
);
dashboardRoutes.get(
  '/analytics/weekly-comparison',
  dashboardController.getWeeklyComparison
);

export default dashboardRoutes;
