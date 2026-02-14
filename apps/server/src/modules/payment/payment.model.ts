import mongoose, { Document, Model, Schema } from 'mongoose';

export type PaymentMethod = 'cash' | 'card' | 'upi';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cash', 'card', 'upi'], required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: { type: String, trim: true },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

paymentSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
    const order = r.order as
      | { _id?: { toString(): string }; toString?(): string }
      | undefined;
    if (order?._id) r.order = order._id.toString();
    else if (order) r.order = (order as mongoose.Types.ObjectId).toString();
    const createdBy = r.createdBy as
      | { _id?: { toString(): string }; toString?(): string }
      | undefined;
    if (createdBy?._id) r.createdBy = createdBy._id.toString();
    else if (createdBy)
      r.createdBy = (createdBy as mongoose.Types.ObjectId).toString();
  },
});

const Payment: Model<IPayment> =
  mongoose.models.Payment ?? mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
