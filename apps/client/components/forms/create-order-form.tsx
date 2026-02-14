'use client';

import { useAvailableTables, useMenuItems } from '@/hooks';
import { useSettings } from '@/hooks/use-settings';
import type { MenuItem, OrderType } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useOrderStore } from '@/stores';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import { toast } from '@workspace/ui/components/sonner';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CreateOrderFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function CreateOrderForm({ onSubmit, isLoading }: CreateOrderFormProps) {
  const { data: menuItems } = useMenuItems({ isAvailable: true });
  const { data: tables } = useAvailableTables();
  const { data: settings } = useSettings();

  const {
    currentOrder,
    setOrderType,
    setTableId,
    addItem,
    updateItemQuantity,
    removeItem,
    setDiscountAmount,
    setNotes,
    getSubtotal,
    getTaxAmount,
    getTotal,
    getItemCount,
    clearOrder,
  } = useOrderStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = menuItems
    ? Array.from(
        new Set(
          menuItems.map((item) =>
            typeof item.category === 'object'
              ? item.category._id
              : item.category
          )
        )
      ).map((catId) => {
        const item = menuItems.find(
          (i) =>
            (typeof i.category === 'object' ? i.category._id : i.category) ===
            catId
        );
        return typeof item?.category === 'object'
          ? item.category
          : { _id: catId, name: 'Unknown' };
      })
    : [];

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems?.filter(
          (item) =>
            (typeof item.category === 'object'
              ? item.category._id
              : item.category) === selectedCategory
        );

  const handleSubmit = () => {
    if (currentOrder.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    onSubmit({
      orderType: currentOrder.orderType,
      tableId: currentOrder.tableId,
      items: currentOrder.items.map((item) => ({
        menuItemId: (item.menuItem as MenuItem)._id,
        quantity: item.quantity,
        notes: item.notes,
      })),
      discountAmount: currentOrder.discountAmount,
      notes: currentOrder.notes,
    });
  };

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <div className='space-y-4'>
        <Tabs
          value={currentOrder.orderType}
          onValueChange={(v) => setOrderType(v as OrderType)}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='dine_in'>Dine-in</TabsTrigger>
            <TabsTrigger value='takeaway'>Takeaway</TabsTrigger>
          </TabsList>
        </Tabs>

        {currentOrder.orderType === 'dine_in' && (
          <div>
            <Label>Select Table</Label>
            <select
              className='border-input mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm'
              value={currentOrder.tableId ?? ''}
              onChange={(e) => setTableId(e.target.value || undefined)}
            >
              <option value=''>Select a table</option>
              {tables?.map((table) => (
                <option key={table._id} value={table._id}>
                  Table {table.tableNumber} (Capacity: {table.capacity})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className='flex flex-wrap gap-2'>
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'secondary'}
            className='cursor-pointer'
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat._id}
              variant={selectedCategory === cat._id ? 'default' : 'secondary'}
              className='cursor-pointer'
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        <ScrollArea className='h-100'>
          <div className='grid grid-cols-2 gap-2'>
            {filteredItems?.map((item) => (
              <button
                key={item._id}
                type='button'
                onClick={() => addItem(item as MenuItem, 1)}
                className='hover:bg-accent rounded-lg border p-3 text-left transition-colors'
              >
                <p className='text-sm font-medium'>{item.name}</p>
                <p className='text-muted-foreground text-sm'>
                  {formatCurrency(item.price)}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='flex items-center gap-2 font-semibold'>
            <ShoppingCart className='h-5 w-5' />
            Order Summary ({getItemCount()} items)
          </h3>
          <Button variant='ghost' size='sm' onClick={clearOrder}>
            Clear
          </Button>
        </div>

        <ScrollArea className='h-75 rounded-lg border p-4'>
          {currentOrder.items.length === 0 ? (
            <p className='text-muted-foreground py-8 text-center'>
              No items added yet
            </p>
          ) : (
            <div className='space-y-3'>
              {currentOrder.items.map((item) => (
                <div
                  key={(item.menuItem as MenuItem)._id}
                  className='flex items-center justify-between'
                >
                  <div className='flex-1'>
                    <p className='font-medium'>
                      {(item.menuItem as MenuItem).name}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      type='button'
                      onClick={() =>
                        updateItemQuantity(
                          (item.menuItem as MenuItem)._id,
                          item.quantity - 1
                        )
                      }
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='w-8 text-center'>{item.quantity}</span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      type='button'
                      onClick={() =>
                        updateItemQuantity(
                          (item.menuItem as MenuItem)._id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive h-8 w-8'
                      type='button'
                      onClick={() =>
                        removeItem((item.menuItem as MenuItem)._id)
                      }
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Subtotal</span>
            <span>{formatCurrency(getSubtotal())}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Tax ({settings?.taxPercentage ?? 5}%)</span>
            <span>
              {formatCurrency(getTaxAmount(settings?.taxPercentage ?? 5))}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Discount</span>
            <Input
              type='number'
              min={0}
              max={getSubtotal()}
              value={currentOrder.discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className='w-24 text-right'
            />
          </div>
          <Separator />
          <div className='flex justify-between text-lg font-bold'>
            <span>Total</span>
            <span>
              {formatCurrency(getTotal(settings?.taxPercentage ?? 5))}
            </span>
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Input
            value={currentOrder.notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Add any special instructions...'
          />
        </div>

        <Button
          className='w-full'
          type='button'
          onClick={handleSubmit}
          disabled={isLoading || currentOrder.items.length === 0}
        >
          {isLoading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </div>
  );
}
