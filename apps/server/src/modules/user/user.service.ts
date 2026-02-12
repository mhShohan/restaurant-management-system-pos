import User, { type IUser, type UserRole, type UserStatus } from './user.model';
import { PasswordUtil } from '@utils/PasswordUtil';
import AppError from '@utils/errorHandler/AppError';
import type { CreateUserInput, UpdateUserInput } from './user.validators';

export const userService = {
  async getAll(filters?: { role?: UserRole; status?: UserStatus; search?: string }): Promise<IUser[]> {
    const query: Record<string, unknown> = {};
    if (filters?.role) query.role = filters.role;
    if (filters?.status) query.status = filters.status;
    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { email: new RegExp(filters.search, 'i') },
      ];
    }
    return User.find(query).sort({ createdAt: -1 }).lean().exec() as Promise<IUser[]>;
  },

  async getById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new AppError(404, 'User not found', 'NOT_FOUND');
    return user;
  },

  async create(data: CreateUserInput): Promise<IUser> {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new AppError(400, 'Email already registered', 'Validation');
    const hashedPassword = await PasswordUtil.hash(data.password);
    const user = await User.create({
      ...data,
      password: hashedPassword,
      role: data.role ?? 'waiter',
    });
    return user;
  },

  async update(id: string, data: UpdateUserInput): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new AppError(404, 'User not found', 'NOT_FOUND');
    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ email: data.email });
      if (existing) throw new AppError(400, 'Email already in use', 'Validation');
    }
    Object.assign(user, data);
    await user.save();
    return user;
  },

  async delete(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError(404, 'User not found', 'NOT_FOUND');
  },

  async toggleStatus(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new AppError(404, 'User not found', 'NOT_FOUND');
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    return user;
  },

  async getByRole(role: UserRole): Promise<IUser[]> {
    return User.find({ role }).sort({ createdAt: -1 }).lean().exec() as Promise<IUser[]>;
  },
};
