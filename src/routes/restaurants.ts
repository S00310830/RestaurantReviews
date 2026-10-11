import { Router } from 'express';
import { RestaurantsController } from '../controllers/restaurants';
import { validate } from '../middleware/validate.middleware';
import { createRestaurantZSchema }  from '../models/restaurants';


const router = Router();
const restaurantsController = new RestaurantsController();

router.get('/', restaurantsController.getRestaurants);

router.get('/:id', restaurantsController.getRestaurantById);
router.post('/', validate(createRestaurantZSchema), restaurantsController.createRestaurant);
router.put('/:id', validate(createRestaurantZSchema), restaurantsController.updateRestaurant);
router.delete('/:id', restaurantsController.deleteRestaurant);

export default router;
