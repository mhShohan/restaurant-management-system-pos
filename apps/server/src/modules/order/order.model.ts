import mongoose, { Document, Model, Schema } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';
export type OrderType = 'dine_in' | 'takeaway';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  notes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  orderType: OrderType;
  table?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { _id: true }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    orderType: { type: String, enum: ['dine_in', 'takeaway'], required: true },
    table: { type: Schema.Types.ObjectId, ref: 'Table' },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: [
        'pending',
        'preparing',
        'ready',
        'served',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

orderSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
    const table = r.table as
      | { _id?: { toString(): string }; toString?(): string }
      | undefined;
    if (table?._id) r.table = table._id.toString();
    else if (table) r.table = (table as mongoose.Types.ObjectId).toString();
    const createdBy = r.createdBy as
      | { _id?: { toString(): string }; toString?(): string }
      | undefined;
    if (createdBy?._id) r.createdBy = createdBy._id.toString();
    else if (createdBy)
      r.createdBy = (createdBy as mongoose.Types.ObjectId).toString();
    if (Array.isArray(r.items)) {
      r.items = (r.items as Record<string, unknown>[]).map((item) => {
        const menuItem = item.menuItem as
          | { _id?: { toString(): string } }
          | mongoose.Types.ObjectId;
        const menuItemId =
          menuItem && typeof menuItem === 'object' && '_id' in menuItem
            ? (menuItem as { _id: { toString(): string } })._id.toString()
            : (menuItem as mongoose.Types.ObjectId).toString();
        return {
          menuItem: menuItemId,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        };
      });
    }
  },
});

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', orderSchema);
export default Order;
