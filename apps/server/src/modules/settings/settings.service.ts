import AppError from '@utils/errorHandler/AppError';

import RestaurantSettings, { type IRestaurantSettings } from './settings.model';
import type { UpdateSettingsInput } from './settings.validators';

const DEFAULT_SETTINGS = {
  name: 'My Restaurant',
  address: '',
  phone: '',
  email: '',
  taxPercentage: 0,
  serviceChargePercentage: 0,
  currency: 'USD',
};

export const settingsService = {
  async get(): Promise<IRestaurantSettings> {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create(DEFAULT_SETTINGS);
    }
    return settings;
  },

  async update(data: UpdateSettingsInput): Promise<IRestaurantSettings> {
    const settings = await RestaurantSettings.findOne();
    if (!settings)
      throw new AppError(
        404,
        'Settings not found. Call initialize first.',
        'NOT_FOUND'
      );
    Object.assign(settings, data);
    await settings.save();
    return settings;
  },

  async initialize(): Promise<IRestaurantSettings> {
    let settings = await RestaurantSettings.findOne();
    if (settings) return settings;
    settings = await RestaurantSettings.create(DEFAULT_SETTINGS);
    return settings;
  },
};
