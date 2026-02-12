import { type IRouter, Router } from 'express';
import userController from './user.controllers';
import validateRequest from '@middleware/validateRequest';
import verifyAuth from '@middleware/verifyAuth';
import { createUserSchema, updateUserSchema } from './user.validators';

const userRoutes: IRouter = Router();

userRoutes.use(verifyAuth);

userRoutes.get('/', userController.getAll);
userRoutes.get('/role/:role', userController.getByRole);
userRoutes.get('/:id', userController.getById);
userRoutes.post('/', validateRequest(createUserSchema), userController.create);
userRoutes.put('/:id', validateRequest(updateUserSchema), userController.update);
userRoutes.delete('/:id', userController.delete);
userRoutes.patch('/:id/toggle-status', userController.toggleStatus);

export default userRoutes;
