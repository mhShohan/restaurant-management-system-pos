import BaseController from '@Base/BaseController';

import { dashboardService } from './dashboard.service';

class DashboardController extends BaseController {
  getStats = this.asyncHandler(async (_req, res) => {
    const stats = await dashboardService.getStats();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Dashboard stats fetched successfully',
      data: stats,
    });
  });

  getSalesReport = this.asyncHandler(async (req, res) => {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
      return this.ApiResponse.error(res, {
        statusCode: 400,
        message: 'startDate and endDate are required',
        errors: {},
      });
    }

    const report = await dashboardService.getSalesReport(startDate, endDate);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Sales report fetched successfully',
      data: report,
    });
  });

  getOrderStatsByStatus = this.asyncHandler(async (_req, res) => {
    const stats = await dashboardService.getOrderStatsByStatus();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Order stats fetched successfully',
      data: stats,
    });
  });

  getDailySummary = this.asyncHandler(async (req, res) => {
    const date = req.query.date as string | undefined;
    const summary = await dashboardService.getDailySummary(date);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Daily summary fetched successfully',
      data: summary,
    });
  });

  getRevenueTrend = this.asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days as string, 10) || 7;
    const trend = await dashboardService.getRevenueTrend(days);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Revenue trend fetched successfully',
      data: trend,
    });
  });

  getSalesByCategory = this.asyncHandler(async (_req, res) => {
    const data = await dashboardService.getSalesByCategory();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Sales by category fetched successfully',
      data,
    });
  });

  getRevenueByPaymentMethod = this.asyncHandler(async (_req, res) => {
    const data = await dashboardService.getRevenueByPaymentMethod();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Revenue by payment method fetched successfully',
      data,
    });
  });

  getHourlyOrders = this.asyncHandler(async (req, res) => {
    const date = req.query.date as string | undefined;
    const data = await dashboardService.getHourlyOrders(date);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Hourly orders fetched successfully',
      data,
    });
  });

  getTopSellingItems = this.asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const data = await dashboardService.getTopSellingItems(limit);

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Top selling items fetched successfully',
      data,
    });
  });

  getOrderTypeDistribution = this.asyncHandler(async (_req, res) => {
    const data = await dashboardService.getOrderTypeDistribution();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Order type distribution fetched successfully',
      data,
    });
  });

  getWeeklyComparison = this.asyncHandler(async (_req, res) => {
    const data = await dashboardService.getWeeklyComparison();

    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Weekly comparison fetched successfully',
      data,
    });
  });
}

const dashboardController = new DashboardController();
export default dashboardController;
