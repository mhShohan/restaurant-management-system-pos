import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import orderController from './order.controllers';
import {
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
} from './order.validators';

const orderRoutes: IRouter = Router();

orderRoutes.use(verifyAuth);

orderRoutes.get('/', orderController.getAll);
orderRoutes.get('/active', orderController.getActive);
orderRoutes.get('/today', orderController.getToday);
orderRoutes.get('/:id', orderController.getById);
orderRoutes.post(
  '/',
  validateRequest(createOrderSchema),
  orderController.create
);
orderRoutes.put(
  '/:id',
  validateRequest(updateOrderSchema),
  orderController.update
);
orderRoutes.patch(
  '/:id/status',
  validateRequest(updateOrderStatusSchema),
  orderController.updateStatus
);
orderRoutes.patch('/:id/cancel', orderController.cancel);

export default orderRoutes;
