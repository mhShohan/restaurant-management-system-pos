import User from '@modules/user/user.model';
import { AuthToken } from '@utils/AuthToken';
import { PasswordUtil } from '@utils/PasswordUtil';
import AppError from '@utils/errorHandler/AppError';
import type { LoginInput, RegisterInput, UpdateProfileInput } from './auth.validators';
import type { IUser } from '@modules/user/user.model';

export interface AuthResponse {
  user: IUser;
  token: string;
}

const toUserObject = (doc: IUser) => {
  const obj = doc.toJSON ? doc.toJSON() : doc;
  return { ...obj, _id: (doc as IUser)._id.toString() };
};

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw new AppError(401, 'Invalid email or password', 'WrongCredentials');
    }
    const isMatch = await PasswordUtil.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password', 'WrongCredentials');
    }
    const token = (await AuthToken.generate({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    })) as string;
    const userObj = toUserObject(user);
    return { user: userObj as unknown as IUser, token };
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new AppError(400, 'Email already registered', 'Validation');
    }
    const hashedPassword = await PasswordUtil.hash(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? 'waiter',
    });
    const token = (await AuthToken.generate({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    })) as string;
    const userObj = toUserObject(user);
    return { user: userObj as unknown as IUser, token };
  },

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found', 'NOT_FOUND');
    }
    return user;
  },

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found', 'NOT_FOUND');
    }
    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        throw new AppError(400, 'Email already in use', 'Validation');
      }
    }
    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    await user.save();
    return user;
  },
};
