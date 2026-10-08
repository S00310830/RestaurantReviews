import { Router } from 'express';
import { UsersController } from '../controllers/users';
import {validate} from '../middleware/validate.middleware';
import {createUserZSchema}  from '../models/users';

const router = Router();
const usersController = new UsersController();

router.get('/', usersController.getUsers);

router.get('/:id', usersController.getUserById);
router.post('/', validate(createUserZSchema), usersController.createUser);
router.put('/:id', validate(createUserZSchema), usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router;