'use client';

import {
  useActiveOrders,
  useDashboardStats,
  useTodayOrders,
} from '@/hooks/use-dashboard';
import { OrderStatus } from '@/lib/types';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';

import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  CheckCircle,
  ChefHat,
  Clock,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  loading: boolean;
}) {
  return (
    <Card className='overflow-hidden transition-shadow hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
        <div className='bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg'>
          <Icon className='h-4 w-4' />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className='h-8 w-24' />
        ) : (
          <>
            <div className='text-2xl font-bold tracking-tight'>{value}</div>
            {description && (
              <p className='text-muted-foreground mt-0.5 text-xs'>
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: todayOrders, isLoading: ordersLoading } = useTodayOrders();
  const { data: activeOrders, isLoading: activeOrdersLoading } =
    useActiveOrders();

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className='h-4 w-4' />;
      case OrderStatus.PREPARING:
        return <ChefHat className='h-4 w-4' />;
      case OrderStatus.READY:
        return <CheckCircle className='h-4 w-4' />;
      default:
        return <ShoppingCart className='h-4 w-4' />;
    }
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-foreground text-2xl font-semibold tracking-tight'>
          Dashboard
        </h2>
        <p className='text-muted-foreground mt-1'>
          Overview of your restaurant today
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats?.todaySales ?? 0)}
          icon={DollarSign}
          description='Total revenue today'
          loading={statsLoading}
        />
        <StatCard
          title="Today's Orders"
          value={String(stats?.todayOrders ?? 0)}
          icon={ShoppingCart}
          description='Orders placed today'
          loading={statsLoading}
        />
        <StatCard
          title='Active Orders'
          value={String(stats?.activeOrders ?? 0)}
          icon={Clock}
          description='Orders in progress'
          loading={statsLoading}
        />
        <StatCard
          title='Total Revenue'
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={TrendingUp}
          description='All time revenue'
          loading={statsLoading}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-75'>
              <div className='space-y-4'>
                {ordersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-16 w-full' />
                  ))
                ) : todayOrders && todayOrders.length > 0 ? (
                  todayOrders.slice(0, 10).map((order) => (
                    <div
                      key={order._id}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div className='space-y-1'>
                        <p className='font-medium'>{order.orderNumber}</p>
                        <p className='text-muted-foreground text-sm'>
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <div className='flex items-center gap-4'>
                        <span className='font-medium'>
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground text-center'>
                    No orders today
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-75'>
              <div className='space-y-4'>
                {activeOrdersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-16 w-full' />
                  ))
                ) : activeOrders && activeOrders.length > 0 ? (
                  activeOrders.map((order) => (
                    <div
                      key={order._id}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div className='space-y-1'>
                        <p className='font-medium'>{order.orderNumber}</p>
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          {getStatusIcon(order.status)}
                          <span className='capitalize'>{order.status}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <span className='font-medium'>
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground text-center'>
                    No active orders
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {stats?.paymentSummary && stats.paymentSummary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {stats.paymentSummary.map((payment) => (
                <div
                  key={payment.method}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div>
                    <p className='text-muted-foreground text-sm capitalize'>
                      {payment.method}
                    </p>
                    <p className='text-xl font-bold'>
                      {formatCurrency(payment.total)}
                    </p>
                  </div>
                  <Badge variant='secondary'>{payment.count} payments</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
