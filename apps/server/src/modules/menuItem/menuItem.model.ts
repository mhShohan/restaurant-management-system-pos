import type { ICategory } from '@modules/category/category.model';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  price: number;
  category: ICategory | mongoose.Types.ObjectId;
  isAvailable: boolean;
  isVeg: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isAvailable: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

menuItemSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
    const cat = r.category as
      | { _id?: { toString(): string }; toString?(): string }
      | undefined;
    if (cat?._id) r.category = cat._id.toString();
    else if (cat) r.category = (cat as mongoose.Types.ObjectId).toString();
  },
});

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ??
  mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
export default MenuItem;
