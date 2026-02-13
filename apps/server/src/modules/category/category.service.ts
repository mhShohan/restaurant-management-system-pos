import AppError from '@utils/errorHandler/AppError';

import Category, { type ICategory } from './category.model';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.validators';

export const categoryService = {
  async getAll(): Promise<ICategory[]> {
    return Category.find().sort({ name: 1 }).lean().exec() as Promise<
      ICategory[]
    >;
  },

  async getById(id: string): Promise<ICategory> {
    const category = await Category.findById(id);
    if (!category) throw new AppError(404, 'Category not found', 'NOT_FOUND');
    return category;
  },

  async create(data: CreateCategoryInput): Promise<ICategory> {
    const category = await Category.create(data);
    return category;
  },

  async update(id: string, data: UpdateCategoryInput): Promise<ICategory> {
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new AppError(404, 'Category not found', 'NOT_FOUND');
    return category;
  },

  async delete(id: string): Promise<void> {
    const result = await Category.findByIdAndDelete(id);
    if (!result) throw new AppError(404, 'Category not found', 'NOT_FOUND');
  },
};
