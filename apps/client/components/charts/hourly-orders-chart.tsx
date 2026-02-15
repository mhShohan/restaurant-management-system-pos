'use client';

import { useHourlyOrders } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { CHART_COLORS } from './chart-config';
import './chart-config';

interface HourlyOrdersChartProps {
  date?: string;
}

export function HourlyOrdersChart({ date }: HourlyOrdersChartProps) {
  const { data, isLoading } = useHourlyOrders(date);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hourly Order Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels:
      data?.map((d) => {
        const hour = d.hour;
        return hour === 0
          ? '12 AM'
          : hour < 12
            ? `${hour} AM`
            : hour === 12
              ? '12 PM'
              : `${hour - 12} PM`;
      }) ?? [],
    datasets: [
      {
        label: 'Orders',
        data: data?.map((d) => d.orders) ?? [],
        backgroundColor: CHART_COLORS.primaryLight,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Revenue',
        data: data?.map((d) => d.revenue) ?? [],
        backgroundColor: CHART_COLORS.secondaryLight,
        borderColor: CHART_COLORS.secondary,
        borderWidth: 1,
        yAxisID: 'y1',
        hidden: true,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Orders',
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue',
        },
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(Number(value));
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Order Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-75'>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
