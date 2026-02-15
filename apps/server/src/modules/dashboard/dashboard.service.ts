import MenuItem from '@modules/menuItem/menuItem.model';
import Order from '@modules/order/order.model';
import Payment from '@modules/payment/payment.model';
import {
  eachDayOfInterval,
  endOfDay,
  format,
  getHours,
  startOfDay,
  startOfHour,
  subDays,
  subHours,
} from 'date-fns';

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  activeOrders: number;
  totalRevenue: number;
  recentOrders: unknown[];
  paymentSummary: { method: string; total: number; count: number }[];
}

export interface SalesReportItem {
  date: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [
      todayPayments,
      todayOrdersCount,
      activeOrdersCount,
      totalPayments,
      recentOrders,
      summaryByMethod,
    ] = await Promise.all([
      Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart, $lte: todayEnd },
            status: 'completed',
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Order.countDocuments({
        status: { $in: ['pending', 'preparing', 'ready', 'served'] },
      }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Order.find()
        .populate('table')
        .populate('createdBy', 'name email role')
        .populate('items.menuItem')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
        .exec(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$method',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $project: { method: '$_id', total: 1, count: 1, _id: 0 } },
      ]),
    ]);

    const todaySales = todayPayments[0]?.total ?? 0;
    const totalRevenue = totalPayments[0]?.total ?? 0;

    return {
      todaySales,
      todayOrders: todayOrdersCount,
      activeOrders: activeOrdersCount,
      totalRevenue,
      recentOrders: recentOrders as unknown[],
      paymentSummary: summaryByMethod,
    };
  },

  async getSalesReport(
    startDate: string,
    endDate: string
  ): Promise<SalesReportItem[]> {
    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));
    const days = eachDayOfInterval({ start, end });

    const ordersByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const map = new Map(ordersByDay.map((d) => [d._id, d]));
    return days.map((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const row = map.get(key);
      const totalSales = row?.totalSales ?? 0;
      const orderCount = row?.orderCount ?? 0;
      return {
        date: key,
        totalSales,
        orderCount,
        averageOrderValue: orderCount > 0 ? totalSales / orderCount : 0,
      };
    });
  },

  async getOrderStatsByStatus(): Promise<{ status: string; count: number }[]> {
    const result = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]);
    return result;
  },

  async getDailySummary(date?: string): Promise<unknown> {
    const targetDate = date ? new Date(date) : new Date();
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    const [orders, payments, orderStats] = await Promise.all([
      Order.find({ createdAt: { $gte: start, $lte: end } })
        .populate('table')
        .populate('createdBy', 'name email role')
        .populate('items.menuItem')
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      Payment.find({
        createdAt: { $gte: start, $lte: end },
        status: 'completed',
      })
        .populate('order')
        .lean()
        .exec(),
      Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalSales = (payments as { amount: number }[]).reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return {
      date: format(start, 'yyyy-MM-dd'),
      totalSales,
      orderCount: orders.length,
      orders,
      payments,
      orderStatsByStatus: orderStats.reduce(
        (acc: Record<string, number>, s: { _id: string; count: number }) => {
          acc[s._id] = s.count;
          return acc;
        },
        {}
      ),
    };
  },

  /**
   * Revenue trend over last N days (line/bar chart)
   */
  async getRevenueTrend(
    days: number = 7
  ): Promise<{ date: string; revenue: number; orders: number }[]> {
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(new Date(), days - 1));
    const interval = eachDayOfInterval({ start, end });

    const revenueByDay = await Payment.aggregate([
      {
        $match: { createdAt: { $gte: start, $lte: end }, status: 'completed' },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
        },
      },
    ]);

    const ordersByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
        },
      },
    ]);

    const revenueMap = new Map(revenueByDay.map((d) => [d._id, d.revenue]));
    const ordersMap = new Map(ordersByDay.map((d) => [d._id, d.orders]));

    return interval.map((day) => {
      const key = format(day, 'yyyy-MM-dd');
      return {
        date: key,
        revenue: revenueMap.get(key) ?? 0,
        orders: ordersMap.get(key) ?? 0,
      };
    });
  },

  /**
   * Sales by category (pie/doughnut chart)
   */
  async getSalesByCategory(): Promise<
    {
      category: string;
      categoryId: string;
      totalSales: number;
      orderCount: number;
    }[]
  > {
    const result = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemData',
        },
      },
      { $unwind: '$menuItemData' },
      {
        $lookup: {
          from: 'categories',
          localField: 'menuItemData.category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: '$categoryData' },
      {
        $group: {
          _id: '$categoryData._id',
          category: { $first: '$categoryData.name' },
          totalSales: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
          orderCount: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSales: -1 } },
      {
        $project: {
          categoryId: { $toString: '$_id' },
          category: 1,
          totalSales: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);
    return result;
  },

  /**
   * Revenue by payment method (doughnut chart)
   */
  async getRevenueByPaymentMethod(): Promise<
    { method: string; revenue: number; count: number }[]
  > {
    const result = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$method',
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $project: { method: '$_id', revenue: 1, count: 1, _id: 0 } },
      { $sort: { revenue: -1 } },
    ]);
    return result;
  },

  /**
   * Hourly order distribution (bar chart) - last 24 hours or specific date
   */
  async getHourlyOrders(
    date?: string
  ): Promise<{ hour: number; orders: number; revenue: number }[]> {
    const targetDate = date ? new Date(date) : new Date();
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing hours with zeros
    const hourMap = new Map(result.map((r) => [r._id, r]));
    const hourlyData = [];
    for (let h = 0; h < 24; h++) {
      const row = hourMap.get(h);
      hourlyData.push({
        hour: h,
        orders: row?.orders ?? 0,
        revenue: row?.revenue ?? 0,
      });
    }
    return hourlyData;
  },

  /**
   * Top selling items (horizontal bar chart)
   */
  async getTopSellingItems(limit: number = 10): Promise<
    {
      itemId: string;
      itemName: string;
      category: string;
      quantitySold: number;
      revenue: number;
    }[]
  > {
    const result = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem',
        },
      },
      { $unwind: '$menuItem' },
      {
        $lookup: {
          from: 'categories',
          localField: 'menuItem.category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          itemId: { $toString: '$_id' },
          itemName: '$menuItem.name',
          category: { $ifNull: ['$categoryData.name', 'Unknown'] },
          quantitySold: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);
    return result;
  },

  /**
   * Order type distribution (dine-in vs takeaway)
   */
  async getOrderTypeDistribution(): Promise<
    { orderType: string; count: number; revenue: number }[]
  > {
    const result = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$orderType',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $project: { orderType: '$_id', count: 1, revenue: 1, _id: 0 } },
    ]);
    return result;
  },

  /**
   * Weekly comparison (this week vs last week)
   */
  async getWeeklyComparison(): Promise<{
    thisWeek: { revenue: number; orders: number };
    lastWeek: { revenue: number; orders: number };
    growth: number;
  }> {
    const now = new Date();
    const thisWeekStart = startOfDay(subDays(now, 6));
    const thisWeekEnd = endOfDay(now);
    const lastWeekStart = startOfDay(subDays(now, 13));
    const lastWeekEnd = endOfDay(subDays(now, 7));

    const [thisWeekData, lastWeekData] = await Promise.all([
      Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: thisWeekStart, $lte: thisWeekEnd },
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd },
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const [thisWeekOrders, lastWeekOrders] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: thisWeekStart, $lte: thisWeekEnd },
        status: { $ne: 'cancelled' },
      }),
      Order.countDocuments({
        createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd },
        status: { $ne: 'cancelled' },
      }),
    ]);

    const thisWeekRevenue = thisWeekData[0]?.revenue ?? 0;
    const lastWeekRevenue = lastWeekData[0]?.revenue ?? 0;
    const growth =
      lastWeekRevenue > 0
        ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
        : 0;

    return {
      thisWeek: { revenue: thisWeekRevenue, orders: thisWeekOrders },
      lastWeek: { revenue: lastWeekRevenue, orders: lastWeekOrders },
      growth: Math.round(growth * 100) / 100,
    };
  },
};
