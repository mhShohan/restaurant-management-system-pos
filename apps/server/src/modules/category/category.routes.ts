import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import categoryController from './category.controllers';
import {
  createCategorySchema,
  updateCategorySchema,
} from './category.validators';

const categoryRoutes: IRouter = Router();

categoryRoutes.use(verifyAuth);

categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/:id', categoryController.getById);
categoryRoutes.post(
  '/',
  validateRequest(createCategorySchema),
  categoryController.create
);
categoryRoutes.put(
  '/:id',
  validateRequest(updateCategorySchema),
  categoryController.update
);
categoryRoutes.delete('/:id', categoryController.delete);

export default categoryRoutes;
