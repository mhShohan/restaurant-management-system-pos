import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import settingsController from './settings.controllers';
import { updateSettingsSchema } from './settings.validators';

const settingsRoutes: IRouter = Router();

settingsRoutes.use(verifyAuth);

settingsRoutes.get('/', settingsController.get);
settingsRoutes.put(
  '/',
  validateRequest(updateSettingsSchema),
  settingsController.update
);
settingsRoutes.post('/initialize', settingsController.initialize);

export default settingsRoutes;
