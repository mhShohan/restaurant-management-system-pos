import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRestaurantSettings extends Document {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxPercentage: number;
  serviceChargePercentage: number;
  currency: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<IRestaurantSettings>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'My Restaurant',
    },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    taxPercentage: { type: Number, default: 0, min: 0, max: 100 },
    serviceChargePercentage: { type: Number, default: 0, min: 0, max: 100 },
    currency: { type: String, default: 'USD', trim: true },
  },
  { timestamps: true }
);

settingsSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
  },
});

const RestaurantSettings: Model<IRestaurantSettings> =
  mongoose.models.RestaurantSettings ??
  mongoose.model<IRestaurantSettings>('RestaurantSettings', settingsSchema);
export default RestaurantSettings;
