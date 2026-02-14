'use client';

import { OrderDetails } from '@/components/common/order-details';
import { CompleteOrderForm } from '@/components/forms/complete-order-form';
import { CreateOrderForm } from '@/components/forms/create-order-form';
import {
  useCancelOrder,
  useCreateOrder,
  useCreatePayment,
  useOrders,
  usePaymentByOrder,
  useUpdateOrderStatus,
} from '@/hooks';
import { useSettings } from '@/hooks/use-settings';
import { OrderStatus } from '@/lib/types';
import type { CreateOrderInput, Order } from '@/lib/types';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';
import { useOrderStore } from '@/stores';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { toast } from '@workspace/ui/components/sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { CheckCircle, ChefHat, Eye, Package, Plus, X } from 'lucide-react';
import { useState } from 'react';

const statusActions: Record<
  string,
  { label: string; icon: React.ElementType; nextStatus: OrderStatus }[]
> = {
  pending: [
    {
      label: 'Start Preparing',
      icon: ChefHat,
      nextStatus: OrderStatus.PREPARING,
    },
  ],
  preparing: [
    { label: 'Mark Ready', icon: CheckCircle, nextStatus: OrderStatus.READY },
  ],
  ready: [
    { label: 'Mark Served', icon: Package, nextStatus: OrderStatus.SERVED },
  ],
  served: [
    { label: 'Complete', icon: CheckCircle, nextStatus: OrderStatus.COMPLETED },
  ],
};

export default function OrdersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [orderToComplete, setOrderToComplete] = useState<Order | null>(null);
  const { data: orders, isLoading } = useOrders();
  const { data: settings } = useSettings();
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const { data: paymentForCompleteOrder } = usePaymentByOrder(
    orderToComplete?._id ?? ''
  );

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status });
      toast.success(`Order status updated to ${status}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to update status');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderMutation.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to cancel order');
    }
  };

  const handleCreateOrder = async (data: Record<string, unknown>) => {
    try {
      await createOrderMutation.mutateAsync(
        data as unknown as CreateOrderInput
      );
      toast.success('Order created successfully');
      setIsCreateDialogOpen(false);
      clearOrder();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to create order');
    }
  };

  const handleCompleteWithPayment = async (paymentData: {
    orderId: string;
    amount: number;
    method: 'cash' | 'card' | 'upi';
    transactionId?: string;
    notes?: string;
  }) => {
    try {
      await createPaymentMutation.mutateAsync(paymentData);
      await updateStatusMutation.mutateAsync({
        id: paymentData.orderId,
        status: OrderStatus.COMPLETED,
      });
      toast.success('Payment recorded and order completed');
      setOrderToComplete(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to complete order');
    }
  };

  const filterOrders = (status?: OrderStatus) => {
    if (!orders) return [];
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold'>{order.orderNumber}</h3>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <p className='text-muted-foreground mt-1 text-sm'>
              {order.orderType === 'dine_in' ? 'Dine-in' : 'Takeaway'}
              {order.table &&
                ` • Table ${(order.table as { tableNumber: string }).tableNumber}`}
            </p>
            <p className='text-muted-foreground text-sm'>
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-lg font-bold'>
              {formatCurrency(order.totalAmount, settings?.currency)}
            </p>
            <p className='text-muted-foreground text-sm'>
              {order.items.length} items
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-center gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' size='sm'>
                <Eye className='mr-1 h-4 w-4' />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              <OrderDetails orderId={order._id} />
            </DialogContent>
          </Dialog>

          {statusActions[order.status]?.map((action) =>
            action.nextStatus === OrderStatus.COMPLETED ? (
              <Button
                key={action.nextStatus}
                size='sm'
                onClick={() => setOrderToComplete(order)}
                disabled={updateStatusMutation.isPending}
              >
                <action.icon className='mr-1 h-4 w-4' />
                {action.label}
              </Button>
            ) : (
              <Button
                key={action.nextStatus}
                size='sm'
                onClick={() => handleStatusUpdate(order._id, action.nextStatus)}
                disabled={updateStatusMutation.isPending}
              >
                <action.icon className='mr-1 h-4 w-4' />
                {action.label}
              </Button>
            )
          )}

          {order.status !== OrderStatus.COMPLETED &&
            order.status !== OrderStatus.CANCELLED && (
              <Button
                variant='destructive'
                size='sm'
                onClick={() => handleCancelOrder(order._id)}
                disabled={cancelOrderMutation.isPending}
              >
                <X className='mr-1 h-4 w-4' />
                Cancel
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-foreground text-2xl font-semibold tracking-tight'>
          Orders
        </h2>
        <p className='text-muted-foreground mt-1'>
          Manage and track all orders
        </p>
      </div>
      <Dialog
        open={!!orderToComplete}
        onOpenChange={(open) => !open && setOrderToComplete(null)}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {paymentForCompleteOrder
                ? 'Complete order'
                : 'Complete order & record payment'}
            </DialogTitle>
          </DialogHeader>
          {orderToComplete &&
            (paymentForCompleteOrder ? (
              <div className='space-y-4'>
                <p className='text-muted-foreground text-sm'>
                  Payment already recorded ({paymentForCompleteOrder.method},{' '}
                  {formatCurrency(
                    paymentForCompleteOrder.amount,
                    settings?.currency
                  )}
                  ). Mark order as completed?
                </p>
                <div className='flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setOrderToComplete(null)}
                    disabled={updateStatusMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(
                        orderToComplete._id,
                        OrderStatus.COMPLETED
                      ).then(() => setOrderToComplete(null))
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? 'Completing...'
                      : 'Complete order'}
                  </Button>
                </div>
              </div>
            ) : (
              <CompleteOrderForm
                order={orderToComplete}
                currency={settings?.currency}
                onSubmit={handleCompleteWithPayment}
                onCancel={() => setOrderToComplete(null)}
                isLoading={
                  createPaymentMutation.isPending ||
                  updateStatusMutation.isPending
                }
              />
            ))}
        </DialogContent>
      </Dialog>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-6xl'>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <CreateOrderForm
              onSubmit={handleCreateOrder}
              isLoading={createOrderMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue='all' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='all'>All Orders</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='preparing'>Preparing</TabsTrigger>
          <TabsTrigger value='ready'>Ready</TabsTrigger>
          <TabsTrigger value='served'>Served</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='space-y-4'>
          <ScrollArea className='h-[600px]'>
            {isLoading ? (
              <div className='space-y-4'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className='h-32' />
                ))}
              </div>
            ) : filterOrders().length > 0 ? (
              filterOrders().map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <div className='text-muted-foreground py-8 text-center'>
                No orders found
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {(
          ['pending', 'preparing', 'ready', 'served', 'completed'] as const
        ).map((status) => (
          <TabsContent key={status} value={status} className='space-y-4'>
            <ScrollArea className='h-[600px]'>
              {filterOrders(status).length > 0 ? (
                filterOrders(status).map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              ) : (
                <div className='text-muted-foreground py-8 text-center'>
                  No {status} orders
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
