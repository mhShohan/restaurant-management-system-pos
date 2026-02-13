import Order from '@modules/order/order.model';
import Payment from '@modules/payment/payment.model';
import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
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
};
