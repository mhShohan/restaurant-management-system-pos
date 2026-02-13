import AppError from '@utils/errorHandler/AppError';

import MenuItem from './menuItem.model';
import type { IMenuItem } from './menuItem.model';
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from './menuItem.validators';

export interface MenuItemFilters {
  category?: string;
  isAvailable?: boolean;
  isVeg?: boolean;
  search?: string;
}

export const menuItemService = {
  async getAll(filters?: MenuItemFilters): Promise<IMenuItem[]> {
    const query: Record<string, unknown> = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.isAvailable !== undefined)
      query.isAvailable = filters.isAvailable;
    if (filters?.isVeg !== undefined) query.isVeg = filters.isVeg;
    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { description: new RegExp(filters.search, 'i') },
      ];
    }
    const items = await MenuItem.find(query)
      .populate('category')
      .sort({ name: 1 })
      .lean()
      .exec();
    return items as IMenuItem[];
  },

  async getById(id: string): Promise<IMenuItem> {
    const item = await MenuItem.findById(id).populate('category');
    if (!item) throw new AppError(404, 'Menu item not found', 'NOT_FOUND');
    return item;
  },

  async getByCategory(categoryId: string): Promise<IMenuItem[]> {
    const items = await MenuItem.find({ category: categoryId })
      .populate('category')
      .sort({ name: 1 })
      .lean()
      .exec();
    return items as IMenuItem[];
  },

  async create(data: CreateMenuItemInput): Promise<IMenuItem> {
    const item = await MenuItem.create({
      ...data,
      isAvailable: data.isAvailable ?? true,
      isVeg: data.isVeg ?? true,
    });
    await item.populate('category');
    return item;
  },

  async update(id: string, data: UpdateMenuItemInput): Promise<IMenuItem> {
    const item = await MenuItem.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('category');
    if (!item) throw new AppError(404, 'Menu item not found', 'NOT_FOUND');
    return item;
  },

  async delete(id: string): Promise<void> {
    const result = await MenuItem.findByIdAndDelete(id);
    if (!result) throw new AppError(404, 'Menu item not found', 'NOT_FOUND');
  },

  async toggleAvailability(id: string): Promise<IMenuItem> {
    const item = await MenuItem.findById(id);
    if (!item) throw new AppError(404, 'Menu item not found', 'NOT_FOUND');
    item.isAvailable = !item.isAvailable;
    await item.save();
    await item.populate('category');
    return item;
  },
};
