import MenuItem from '@modules/menuItem/menuItem.model';
import { settingsService } from '@modules/settings/settings.service';
import Table from '@modules/table/table.model';
import AppError from '@utils/errorHandler/AppError';
import { endOfDay, startOfDay } from 'date-fns';

import Order, {
  type IOrder,
  type IOrderItem,
  type OrderStatus,
} from './order.model';
import type { CreateOrderInput, UpdateOrderInput } from './order.validators';

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${date}-${random}`;
}

export interface OrderFilters {
  status?: OrderStatus;
  orderType?: 'dine_in' | 'takeaway';
  tableId?: string;
  startDate?: string;
  endDate?: string;
}

export const orderService = {
  async getAll(filters?: OrderFilters): Promise<IOrder[]> {
    const query: Record<string, unknown> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.orderType) query.orderType = filters.orderType;
    if (filters?.tableId) query.table = filters.tableId;
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate)
        (query.createdAt as Record<string, Date>).$gte = startOfDay(
          new Date(filters.startDate)
        );
      if (filters.endDate)
        (query.createdAt as Record<string, Date>).$lte = endOfDay(
          new Date(filters.endDate)
        );
    }
    const orders = await Order.find(query)
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return orders as IOrder[];
  },

  async getById(id: string): Promise<IOrder> {
    const order = await Order.findById(id)
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem');
    if (!order) throw new AppError(404, 'Order not found', 'NOT_FOUND');
    return order;
  },

  async getActive(): Promise<IOrder[]> {
    const orders = await Order.find({
      status: { $in: ['pending', 'preparing', 'ready', 'served'] },
    })
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return orders as IOrder[];
  },

  async getToday(): Promise<IOrder[]> {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } })
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return orders as IOrder[];
  },

  async create(data: CreateOrderInput, userId: string): Promise<IOrder> {
    const settings = await settingsService.get();
    const menuIds = data.items.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuIds } });
    const priceMap = new Map(menuItems.map((m) => [m._id.toString(), m.price]));

    const orderItems: IOrderItem[] = [];
    let subtotal = 0;
    for (const item of data.items) {
      const price = priceMap.get(item.menuItemId);
      if (price === undefined)
        throw new AppError(
          400,
          `Menu item ${item.menuItemId} not found`,
          'Validation'
        );
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        menuItem:
          item.menuItemId as unknown as import('mongoose').Types.ObjectId,
        quantity: item.quantity,
        price,
        notes: item.notes,
      });
    }

    const discountAmount = data.discountAmount ?? 0;
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (afterDiscount * (settings.taxPercentage ?? 0)) / 100;
    const serviceCharge =
      (afterDiscount * (settings.serviceChargePercentage ?? 0)) / 100;
    const totalAmount = afterDiscount + taxAmount + serviceCharge;

    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      orderType: data.orderType,
      table: data.tableId || undefined,
      items: orderItems,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      notes: data.notes,
      createdBy: userId,
    });

    if (data.tableId && data.orderType === 'dine_in') {
      await Table.findByIdAndUpdate(data.tableId, { status: 'occupied' });
    }

    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem');
    return populated!;
  },

  async update(id: string, data: UpdateOrderInput): Promise<IOrder> {
    const order = await Order.findById(id);
    if (!order) throw new AppError(404, 'Order not found', 'NOT_FOUND');
    if (order.status === 'cancelled')
      throw new AppError(400, 'Cannot update cancelled order', 'Validation');

    if (data.status !== undefined) order.status = data.status;
    if (data.notes !== undefined) order.notes = data.notes;
    if (data.discountAmount !== undefined)
      order.discountAmount = data.discountAmount;

    if (data.items && data.items.length > 0) {
      const settings = await settingsService.get();
      const menuIds = data.items.map((i) => i.menuItemId);
      const menuItems = await MenuItem.find({ _id: { $in: menuIds } });
      const priceMap = new Map(
        menuItems.map((m) => [m._id.toString(), m.price])
      );
      const newItems: IOrderItem[] = [];
      let subtotal = 0;
      for (const item of data.items) {
        const price = priceMap.get(item.menuItemId);
        if (price === undefined)
          throw new AppError(
            400,
            `Menu item ${item.menuItemId} not found`,
            'Validation'
          );
        subtotal += price * item.quantity;
        newItems.push({
          menuItem:
            item.menuItemId as unknown as import('mongoose').Types.ObjectId,
          quantity: item.quantity,
          price,
          notes: item.notes,
        });
      }
      order.items = newItems;
      order.subtotal = subtotal;
      const afterDiscount = Math.max(0, subtotal - (order.discountAmount ?? 0));
      order.taxAmount = (afterDiscount * (settings.taxPercentage ?? 0)) / 100;
      const serviceCharge =
        (afterDiscount * (settings.serviceChargePercentage ?? 0)) / 100;
      order.totalAmount = afterDiscount + order.taxAmount + serviceCharge;
    } else if (data.discountAmount !== undefined) {
      const afterDiscount = Math.max(0, order.subtotal - data.discountAmount);
      const settings = await settingsService.get();
      order.taxAmount = (afterDiscount * (settings.taxPercentage ?? 0)) / 100;
      order.totalAmount =
        afterDiscount +
        order.taxAmount +
        (afterDiscount * (settings.serviceChargePercentage ?? 0)) / 100;
    }

    await order.save();
    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem');
    return populated!;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<IOrder> {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem');
    if (!order) throw new AppError(404, 'Order not found', 'NOT_FOUND');
    if (status === 'completed' && order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'available' });
    }
    return order;
  },

  async cancel(id: string): Promise<IOrder> {
    const order = await Order.findById(id);
    if (!order) throw new AppError(404, 'Order not found', 'NOT_FOUND');
    order.status = 'cancelled';
    await order.save();
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'available' });
    }
    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('createdBy', 'name email role')
      .populate('items.menuItem');
    return populated!;
  },
};
