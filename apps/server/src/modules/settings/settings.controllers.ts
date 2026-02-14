import BaseController from '@Base/BaseController';

import { settingsService } from './settings.service';
import type { UpdateSettingsInput } from './settings.validators';

class SettingsController extends BaseController {
  get = this.asyncHandler(async (_req, res) => {
    const settings = await settingsService.get();
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Settings fetched successfully',
      data: settings,
    });
  });

  update = this.asyncHandler(async (req, res) => {
    const settings = await settingsService.update(
      req.body as UpdateSettingsInput
    );
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.OK,
      message: 'Settings updated successfully',
      data: settings,
    });
  });

  initialize = this.asyncHandler(async (_req, res) => {
    const settings = await settingsService.initialize();
    this.ApiResponse.success(res, {
      statusCode: this.httpStatus.CREATED,
      message: 'Settings initialized successfully',
      data: settings,
    });
  });
}

const settingsController = new SettingsController();
export default settingsController;
