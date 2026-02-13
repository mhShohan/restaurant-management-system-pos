import mongoose, { Document, Model, Schema } from 'mongoose';

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface ITable extends Document {
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tableSchema = new Schema<ITable>(
  {
    tableNumber: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
  },
  { timestamps: true }
);

tableSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
  },
});

const Table: Model<ITable> =
  mongoose.models.Table ?? mongoose.model<ITable>('Table', tableSchema);
export default Table;
