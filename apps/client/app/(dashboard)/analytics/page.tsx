'use client';

import {
  HourlyOrdersChart,
  OrderStatusChart,
  PaymentMethodChart,
  RevenueTrendChart,
  SalesByCategoryChart,
  TopSellingItemsChart,
  WeeklyComparisonCard,
} from '@/components/charts';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';

const Analytics = () => {
  return (
    <div className='space-y-6'>
      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='sales'>Sales</TabsTrigger>
          <TabsTrigger value='orders'>Orders</TabsTrigger>
          <TabsTrigger value='items'>Top Items</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <WeeklyComparisonCard />
          <div className='grid gap-6 lg:grid-cols-2'>
            <RevenueTrendChart days={7} title='Revenue Trend (7 Days)' />
            <SalesByCategoryChart />
          </div>
          <div className='grid gap-6 lg:grid-cols-2'>
            <PaymentMethodChart />
            <OrderStatusChart />
          </div>
        </TabsContent>

        <TabsContent value='sales' className='space-y-6'>
          <RevenueTrendChart days={30} title='Revenue Trend (30 Days)' />
          <div className='grid gap-6 lg:grid-cols-2'>
            <SalesByCategoryChart />
            <PaymentMethodChart />
          </div>
        </TabsContent>

        <TabsContent value='orders' className='space-y-6'>
          <div className='grid gap-6 lg:grid-cols-2'>
            <HourlyOrdersChart />
            <OrderStatusChart />
          </div>
        </TabsContent>

        <TabsContent value='items' className='space-y-6'>
          <TopSellingItemsChart limit={10} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
