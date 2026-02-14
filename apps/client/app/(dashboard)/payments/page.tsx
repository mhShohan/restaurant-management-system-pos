'use client';

import {
  usePaymentSummaryByMethod,
  usePayments,
  useTodayPayments,
} from '@/hooks';
import { useSettings } from '@/hooks/use-settings';
import { formatCurrency, formatDateTime } from '@/lib/utils';

import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Banknote, Calendar, CreditCard, Smartphone } from 'lucide-react';

const getPaymentIcon = (method: string) => {
  switch (method) {
    case 'cash':
      return Banknote;
    case 'card':
      return CreditCard;
    case 'upi':
      return Smartphone;
    default:
      return CreditCard;
  }
};

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };
  return (
    colors[status] ??
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  );
};

function PaymentList({
  items,
}: {
  items: {
    _id: string;
    method: string;
    amount: number;
    status: string;
    createdAt: string;
    transactionId?: string;
  }[];
}) {
  const { data: settings } = useSettings();
  return (
    <ScrollArea className='h-[500px]'>
      <div className='space-y-3'>
        {items.map((payment) => {
          const Icon = getPaymentIcon(payment.method);
          return (
            <Card key={payment._id}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                      <Icon className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-medium capitalize'>{payment.method}</p>
                      <p className='text-muted-foreground text-sm'>
                        {formatDateTime(payment.createdAt)}
                      </p>
                      {payment.transactionId && (
                        <p className='text-muted-foreground text-xs'>
                          TXN: {payment.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold'>
                      {formatCurrency(payment.amount, settings?.currency)}
                    </p>
                    <Badge className={getStatusBadge(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function PaymentsPage() {
  const { data: payments, isLoading } = usePayments();
  const { data: todayPayments } = useTodayPayments();
  const { data: paymentSummary } = usePaymentSummaryByMethod();
  const { data: settings } = useSettings();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Payments</h2>
      </div>

      {paymentSummary && paymentSummary.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {(
            paymentSummary as {
              method: string;
              totalAmount: number;
              count: number;
            }[]
          ).map((item) => {
            const Icon = getPaymentIcon(item.method);
            return (
              <Card key={item.method}>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-muted-foreground text-sm capitalize'>
                        {item.method}
                      </p>
                      <p className='text-2xl font-bold'>
                        {formatCurrency(item.totalAmount, settings?.currency)}
                      </p>
                    </div>
                    <Icon className='text-muted-foreground h-8 w-8' />
                  </div>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    {item.count} transactions
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Tabs defaultValue='today'>
        <TabsList>
          <TabsTrigger value='today'>Today&apos;s Payments</TabsTrigger>
          <TabsTrigger value='all'>All Payments</TabsTrigger>
        </TabsList>

        <TabsContent value='today'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Today&apos;s Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayPayments && todayPayments.length > 0 ? (
                <PaymentList items={todayPayments} />
              ) : (
                <div className='text-muted-foreground py-8 text-center'>
                  No payments today
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='all'>
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='space-y-3'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className='h-20' />
                  ))}
                </div>
              ) : payments && payments.length > 0 ? (
                <PaymentList items={payments} />
              ) : (
                <div className='text-muted-foreground py-8 text-center'>
                  No payments found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
