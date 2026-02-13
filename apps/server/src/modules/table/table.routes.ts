import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import tableController from './table.controllers';
import {
  createTableSchema,
  updateStatusSchema,
  updateTableSchema,
} from './table.validators';

const tableRoutes: IRouter = Router();

tableRoutes.use(verifyAuth);

tableRoutes.get('/', tableController.getAll);
tableRoutes.get('/available', tableController.getAvailable);
tableRoutes.get('/:id', tableController.getById);
tableRoutes.post(
  '/',
  validateRequest(createTableSchema),
  tableController.create
);
tableRoutes.put(
  '/:id',
  validateRequest(updateTableSchema),
  tableController.update
);
tableRoutes.delete('/:id', tableController.delete);
tableRoutes.patch(
  '/:id/status',
  validateRequest(updateStatusSchema),
  tableController.updateStatus
);

export default tableRoutes;
