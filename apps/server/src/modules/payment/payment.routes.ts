import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { type IRouter, Router } from 'express';

import paymentController from './payment.controllers';
import { createPaymentSchema, updatePaymentSchema } from './payment.validators';

const paymentRoutes: IRouter = Router();

paymentRoutes.use(verifyAuth);

paymentRoutes.get('/', paymentController.getAll);
paymentRoutes.get('/today', paymentController.getToday);
paymentRoutes.get('/summary/by-method', paymentController.getSummaryByMethod);
paymentRoutes.get('/order/:orderId', paymentController.getByOrder);
paymentRoutes.get('/:id', paymentController.getById);
paymentRoutes.post(
  '/',
  validateRequest(createPaymentSchema),
  paymentController.create
);
paymentRoutes.put(
  '/:id',
  validateRequest(updatePaymentSchema),
  paymentController.update
);

export default paymentRoutes;
