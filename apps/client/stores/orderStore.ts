'use client';

import type { MenuItem, OrderItem, OrderType } from '@/lib/types';

import { create } from 'zustand';

interface OrderItemWithMenuItem extends OrderItem {
  menuItem: MenuItem;
}

interface OrderState {
  currentOrder: {
    orderType: OrderType;
    tableId?: string;
    items: OrderItemWithMenuItem[];
    discountAmount: number;
    notes: string;
  };
  setOrderType: (type: OrderType) => void;
  setTableId: (tableId: string | undefined) => void;
  addItem: (menuItem: MenuItem, quantity: number, notes?: string) => void;
  updateItemQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  setDiscountAmount: (amount: number) => void;
  setNotes: (notes: string) => void;
  clearOrder: () => void;
  getSubtotal: () => number;
  getTaxAmount: (taxPercentage: number) => number;
  getTotal: (taxPercentage: number) => number;
  getItemCount: () => number;
}

const initialOrder = {
  orderType: 'dine_in' as OrderType,
  tableId: undefined,
  items: [],
  discountAmount: 0,
  notes: '',
};

export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: { ...initialOrder },
  setOrderType: (type) =>
    set((s) => ({
      currentOrder: { ...s.currentOrder, orderType: type },
    })),
  setTableId: (tableId) =>
    set((s) => ({ currentOrder: { ...s.currentOrder, tableId } })),
  addItem: (menuItem, quantity, notes) =>
    set((s) => {
      const existing = s.currentOrder.items.find(
        (i) => (i.menuItem as MenuItem)._id === menuItem._id
      );
      if (existing) {
        return {
          currentOrder: {
            ...s.currentOrder,
            items: s.currentOrder.items.map((i) =>
              (i.menuItem as MenuItem)._id === menuItem._id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          },
        };
      }
      return {
        currentOrder: {
          ...s.currentOrder,
          items: [
            ...s.currentOrder.items,
            { menuItem, quantity, price: menuItem.price, notes },
          ],
        },
      };
    }),
  updateItemQuantity: (menuItemId, quantity) =>
    set((s) => ({
      currentOrder: {
        ...s.currentOrder,
        items:
          quantity <= 0
            ? s.currentOrder.items.filter(
                (i) => (i.menuItem as MenuItem)._id !== menuItemId
              )
            : s.currentOrder.items.map((i) =>
                (i.menuItem as MenuItem)._id === menuItemId
                  ? { ...i, quantity }
                  : i
              ),
      },
    })),
  removeItem: (menuItemId) =>
    set((s) => ({
      currentOrder: {
        ...s.currentOrder,
        items: s.currentOrder.items.filter(
          (i) => (i.menuItem as MenuItem)._id !== menuItemId
        ),
      },
    })),
  setDiscountAmount: (amount) =>
    set((s) => ({
      currentOrder: { ...s.currentOrder, discountAmount: amount },
    })),
  setNotes: (notes) =>
    set((s) => ({ currentOrder: { ...s.currentOrder, notes } })),
  clearOrder: () => set({ currentOrder: { ...initialOrder } }),
  getSubtotal: () =>
    get().currentOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getTaxAmount: (taxPercentage) => (get().getSubtotal() * taxPercentage) / 100,
  getTotal: (taxPercentage) => {
    const subtotal = get().getSubtotal();
    const taxAmount = get().getTaxAmount(taxPercentage);
    const { discountAmount } = get().currentOrder;
    return Math.max(0, subtotal + taxAmount - discountAmount);
  },
  getItemCount: () =>
    get().currentOrder.items.reduce((sum, i) => sum + i.quantity, 0),
}));
