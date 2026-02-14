'use client';

import type { Order, PaymentMethod } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface CompleteOrderFormProps {
  order: Order;
  currency?: string;
  onSubmit: (data: {
    orderId: string;
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'upi', label: 'UPI', icon: Smartphone },
];

export function CompleteOrderForm({
  order,
  currency = 'USD',
  onSubmit,
  onCancel,
  isLoading = false,
}: CompleteOrderFormProps) {
  const [amount, setAmount] = useState<string>(String(order.totalAmount));
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    await onSubmit({
      orderId: order._id,
      amount: numAmount,
      method,
      transactionId: transactionId.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='bg-muted/50 rounded-lg border p-4'>
        <p className='text-muted-foreground text-sm'>Order</p>
        <p className='font-semibold'>{order.orderNumber}</p>
        <p className='mt-1 text-lg font-bold'>
          {formatCurrency(order.totalAmount, currency)}
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='amount'>Amount paid</Label>
        <Input
          id='amount'
          type='number'
          step='0.01'
          min='0'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label>Payment method</Label>
        <div className='flex gap-2'>
          {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              type='button'
              variant={method === value ? 'default' : 'outline'}
              size='sm'
              className='flex-1'
              onClick={() => setMethod(value)}
            >
              <Icon className='mr-1 h-4 w-4' />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='transactionId'>Transaction ID (optional)</Label>
        <Input
          id='transactionId'
          type='text'
          placeholder='e.g. UPI ref, card last 4 digits'
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='notes'>Notes (optional)</Label>
        <Input
          id='notes'
          type='text'
          placeholder='Any notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className='flex justify-end gap-2 pt-2'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Completing...' : 'Complete order & record payment'}
        </Button>
      </div>
    </form>
  );
}
