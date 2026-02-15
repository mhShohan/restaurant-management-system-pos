export type UserRole = 'admin' | 'cashier' | 'waiter' | 'kitchen';

export const UserRole = {
  ADMIN: 'admin' as const,
  CASHIER: 'cashier' as const,
  WAITER: 'waiter' as const,
  KITCHEN: 'kitchen' as const,
};

export type UserStatus = 'active' | 'inactive';

export const UserStatus = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
};

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: Category | string;
  isAvailable: boolean;
  isVeg: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved';

export const TableStatus = {
  AVAILABLE: 'available' as const,
  OCCUPIED: 'occupied' as const,
  RESERVED: 'reserved' as const,
};

export interface Table {
  _id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export const OrderStatus = {
  PENDING: 'pending' as const,
  PREPARING: 'preparing' as const,
  READY: 'ready' as const,
  SERVED: 'served' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
};

export type OrderType = 'dine_in' | 'takeaway';

export const OrderType = {
  DINE_IN: 'dine_in' as const,
  TAKEAWAY: 'takeaway' as const,
};

export interface OrderItem {
  _id?: string;
  menuItem: MenuItem | string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  orderType: OrderType;
  table?: Table | string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'cash' | 'card' | 'upi';

export const PaymentMethod = {
  CASH: 'cash' as const,
  CARD: 'card' as const,
  UPI: 'upi' as const,
};

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export const PaymentStatus = {
  PENDING: 'pending' as const,
  COMPLETED: 'completed' as const,
  FAILED: 'failed' as const,
  REFUNDED: 'refunded' as const,
};

export interface Payment {
  _id: string;
  order: Order | string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSettings {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxPercentage: number;
  serviceChargePercentage: number;
  currency: string;
  updatedAt: string;
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  activeOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  paymentSummary: PaymentSummary[];
}

export interface PaymentSummary {
  method: PaymentMethod;
  total: number;
  count: number;
}

export interface SalesReport {
  date: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateOrderItemInput {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderInput {
  orderType: OrderType;
  tableId?: string;
  items: CreateOrderItemInput[];
  discountAmount?: number;
  notes?: string;
}

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

// Analytics types
export interface RevenueTrendItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesByCategoryItem {
  categoryId: string;
  category: string;
  totalSales: number;
  orderCount: number;
}

export interface RevenueByPaymentItem {
  method: PaymentMethod;
  revenue: number;
  count: number;
}

export interface HourlyOrdersItem {
  hour: number;
  orders: number;
  revenue: number;
}

export interface TopSellingItem {
  itemId: string;
  itemName: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface OrderTypeDistributionItem {
  orderType: OrderType;
  count: number;
  revenue: number;
}

export interface WeeklyComparison {
  thisWeek: { revenue: number; orders: number };
  lastWeek: { revenue: number; orders: number };
  growth: number;
}
