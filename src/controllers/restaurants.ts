import { Request, Response } from 'express';
import { RestaurantService } from '../services/restaurants';
import { Types } from 'mongoose';

const restaurantService = new RestaurantService();

export class RestaurantsController {
	/**
	 * @openapi
	 * /restaurants:
	 *   get:
	 *     summary: Retrieve all restaurants
	 *     tags:
	 *       - Restaurants
	 *     parameters:
	 *       - in: header
	 *         name: x-api-key
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved restaurants
	 *       404:
	 *         description: Restaurants not found
	 *       500:
	 *         description: Internal server error
	 */
	getRestaurants = async (_req: Request, res: Response): Promise<void> => {
		try {
			const restaurants = await restaurantService.getAllRestaurants();
			res.status(200).json(restaurants);
		} catch (error) {
			res.status(500).json({ message: 'Error fetching restaurants', error });
		}
	};

	/**
	 * @openapi
	 * /restaurants/{id}:
	 *   get:
	 *     summary: Get a restaurant by ID
	 *     tags:
	 *       - Restaurants
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - in: header
	 *         name: x-api-key
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Restaurant found
	 *       400:
	 *         description: Invalid restaurant ID
	 *       404:
	 *         description: Restaurant not found
	 *       500:
	 *         description: Internal server error
	 */
	getRestaurantById = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
			
			if (!Types.ObjectId.isValid(id)) {
				res.status(400).json({ message: 'Invalid restaurant ID' });
				return;
			}

			const restaurant = await restaurantService.getRestaurantById(id);

			if (!restaurant) {
				res.status(404).json({ message: 'Restaurant not found' });
				return;
			}

			res.status(200).json(restaurant);
		} catch (error) {
			res.status(500).json({ message: 'Error fetching restaurant', error });
		}
	};

	/**
	 * @openapi
	 * /restaurants:
	 *   post:
	 *     summary: Create a new restaurant
	 *     tags:
	 *       - Restaurants
	 *     parameters:
	 *       - in: header
	 *         name: x-api-key
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateRestaurantInput'
	 *     responses:
	 *       201:
	 *         description: Successfully created restaurant
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	createRestaurant = async (req: Request, res: Response): Promise<void> => {
		try {
			const newRestaurant = await restaurantService.createRestaurant(req.body);
			res.status(201).json(newRestaurant);
		} catch (error) {
			res.status(500).json({ message: 'Error inserting into MongoDB', error });
		}
	};

	/**
	 * @openapi
	 * /restaurants/{id}:
	 *   put:
	 *     summary: Update a restaurant by ID
	 *     tags:
	 *       - Restaurants
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - in: header
	 *         name: x-api-key
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateRestaurantInput'
	 *     responses:
	 *       200:
	 *         description: Restaurant updated successfully
	 *       404:
	 *         description: Restaurant not found
	 *       500:
	 *         description: Internal server error
	 */
	updateRestaurant = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
			const updatedRestaurant = await restaurantService.updateRestaurant(id, req.body);

			if (!updatedRestaurant) {
				res.status(404).json({ message: 'Restaurant not found' });
				return;
			}

			res.status(200).json(updatedRestaurant);
		} catch (error) {
			res.status(500).json({ message: 'Error updating restaurant', error });
		}
	};

	/**
	 * @openapi
	 * /restaurants/{id}:
	 *   delete:
	 *     summary: Delete a restaurant by ID
	 *     tags:
	 *       - Restaurants
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - in: header
	 *         name: x-api-key
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Restaurant deleted successfully
	 *       404:
	 *         description: Restaurant not found
	 *       500:
	 *         description: Internal server error
	 */
	deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
			const restaurant = await restaurantService.getRestaurantById(id);

			if (!restaurant) {
				res.status(404).json({ message: 'Restaurant not found' });
				return;
			}

			await restaurantService.deleteRestaurant(id);
			res.status(200).json({ message: 'Restaurant deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error fetching restaurant', error });
		}
	};
}
