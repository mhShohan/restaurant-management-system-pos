'use client';

import { useCreatePayment, useOrder, usePaymentByOrder } from '@/hooks';
import { useSettings } from '@/hooks/use-settings';
import { OrderStatus, PaymentMethod } from '@/lib/types';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { toast } from '@workspace/ui/components/sonner';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: order, isLoading: orderLoading } = useOrder(orderId);
  const { data: payment } = usePaymentByOrder(orderId);
  const { data: settings } = useSettings();
  const createPaymentMutation = useCreatePayment();

  const handlePayment = async (method: PaymentMethod) => {
    if (!order) return;
    try {
      await createPaymentMutation.mutateAsync({
        orderId: order._id,
        amount: order.totalAmount,
        method,
        notes: '',
      });
      toast.success('Payment processed successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Payment failed');
    }
  };

  if (orderLoading) {
    return <div className='py-8 text-center'>Loading...</div>;
  }

  if (!order) {
    return <div className='py-8 text-center'>Order not found</div>;
  }

  const isCompleted = order.status === OrderStatus.COMPLETED;
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const canPay = !isCompleted && !isCancelled && !payment;

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-2xl font-bold'>{order.orderNumber}</h3>
          <p className='text-muted-foreground'>
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='text-muted-foreground text-sm'>Order Type</p>
          <p className='font-medium capitalize'>
            {order.orderType.replace('_', '-')}
          </p>
        </div>
        {order.table && (
          <div>
            <p className='text-muted-foreground text-sm'>Table</p>
            <p className='font-medium'>
              Table {(order.table as { tableNumber: string }).tableNumber}
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {order.items.map((item, index) => (
              <div key={index} className='flex items-start justify-between'>
                <div>
                  <p className='font-medium'>
                    {(item.menuItem as { name: string }).name}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                  {item.notes && (
                    <p className='text-muted-foreground text-sm'>
                      Note: {item.notes}
                    </p>
                  )}
                </div>
                <p className='font-medium'>
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator className='my-4' />

          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Tax</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className='flex justify-between text-sm text-green-600'>
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <Separator />
            <div className='flex justify-between text-lg font-bold'>
              <span>Total</span>
              <span>
                {formatCurrency(order.totalAmount, settings?.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {payment ? (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm'>Method</p>
                <p className='font-medium capitalize'>{payment.method}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Status</p>
                <p className='font-medium capitalize'>{payment.status}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Amount</p>
                <p className='font-medium'>
                  {formatCurrency(payment.amount, settings?.currency)}
                </p>
              </div>
              {payment.transactionId && (
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Transaction ID
                  </p>
                  <p className='font-medium'>{payment.transactionId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : canPay ? (
        <Card>
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <Button
                onClick={() => handlePayment(PaymentMethod.CASH)}
                disabled={createPaymentMutation.isPending}
                className='flex h-auto flex-col items-center gap-2 py-4'
              >
                <Banknote className='h-6 w-6' />
                <span>Cash</span>
              </Button>
              <Button
                onClick={() => handlePayment(PaymentMethod.CARD)}
                disabled={createPaymentMutation.isPending}
                className='flex h-auto flex-col items-center gap-2 py-4'
              >
                <CreditCard className='h-6 w-6' />
                <span>Card</span>
              </Button>
              <Button
                onClick={() => handlePayment(PaymentMethod.UPI)}
                disabled={createPaymentMutation.isPending}
                className='flex h-auto flex-col items-center gap-2 py-4'
              >
                <Smartphone className='h-6 w-6' />
                <span>UPI</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {order.notes && (
        <div>
          <p className='text-muted-foreground text-sm'>Notes</p>
          <p className='bg-muted mt-1 rounded-lg p-3'>{order.notes}</p>
        </div>
      )}
    </div>
  );
}
