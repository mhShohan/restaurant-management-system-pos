import AppError from '@utils/errorHandler/AppError';

import Table, { type ITable, type TableStatus } from './table.model';
import type { CreateTableInput, UpdateTableInput } from './table.validators';

export const tableService = {
  async getAll(): Promise<ITable[]> {
    return Table.find().sort({ tableNumber: 1 }).lean().exec() as Promise<
      ITable[]
    >;
  },

  async getById(id: string): Promise<ITable> {
    const table = await Table.findById(id);
    if (!table) throw new AppError(404, 'Table not found', 'NOT_FOUND');
    return table;
  },

  async getAvailable(): Promise<ITable[]> {
    return Table.find({ status: 'available' })
      .sort({ tableNumber: 1 })
      .lean()
      .exec() as Promise<ITable[]>;
  },

  async create(data: CreateTableInput): Promise<ITable> {
    const existing = await Table.findOne({ tableNumber: data.tableNumber });
    if (existing)
      throw new AppError(400, 'Table number already exists', 'Validation');
    const table = await Table.create(data);
    return table;
  },

  async update(id: string, data: UpdateTableInput): Promise<ITable> {
    const table = await Table.findById(id);
    if (!table) throw new AppError(404, 'Table not found', 'NOT_FOUND');
    if (data.tableNumber && data.tableNumber !== table.tableNumber) {
      const existing = await Table.findOne({ tableNumber: data.tableNumber });
      if (existing)
        throw new AppError(400, 'Table number already exists', 'Validation');
    }
    Object.assign(table, data);
    await table.save();
    return table;
  },

  async delete(id: string): Promise<void> {
    const result = await Table.findByIdAndDelete(id);
    if (!result) throw new AppError(404, 'Table not found', 'NOT_FOUND');
  },

  async updateStatus(id: string, status: TableStatus): Promise<ITable> {
    const table = await Table.findByIdAndUpdate(id, { status }, { new: true });
    if (!table) throw new AppError(404, 'Table not found', 'NOT_FOUND');
    return table;
  },
};
