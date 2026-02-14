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
}

const dashboardController = new DashboardController();
export default dashboardController;
