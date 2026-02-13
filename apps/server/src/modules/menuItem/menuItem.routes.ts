import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import menuItemController from './menuItem.controllers';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from './menuItem.validators';

const menuItemRoutes: IRouter = Router();

menuItemRoutes.use(verifyAuth);

menuItemRoutes.get('/', menuItemController.getAll);
menuItemRoutes.get('/category/:categoryId', menuItemController.getByCategory);
menuItemRoutes.get('/:id', menuItemController.getById);
menuItemRoutes.post(
  '/',
  validateRequest(createMenuItemSchema),
  menuItemController.create
);
menuItemRoutes.put(
  '/:id',
  validateRequest(updateMenuItemSchema),
  menuItemController.update
);
menuItemRoutes.delete('/:id', menuItemController.delete);
menuItemRoutes.patch(
  '/:id/toggle-availability',
  menuItemController.toggleAvailability
);

export default menuItemRoutes;
