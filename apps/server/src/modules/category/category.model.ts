import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

categorySchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
  },
});

const Category: Model<ICategory> =
  mongoose.models.Category ??
  mongoose.model<ICategory>('Category', categorySchema);
export default Category;
