import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'cashier' | 'waiter' | 'kitchen';
export type UserStatus = 'active' | 'inactive';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'cashier', 'waiter', 'kitchen'],
      default: 'waiter',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    r._id = (r._id as mongoose.Types.ObjectId).toString();
    delete r.password;
  },
});

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);
export default User;
