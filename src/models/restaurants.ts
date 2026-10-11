import { Schema, model } from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateRestaurantInput:
 *       type: object
 *       required:
 *         - restaurantName
 *         - location
 *       properties:
 *         restaurantName:
 *           type: string
 *           example: The Great Eatery
 *         location:
 *           type: string
 *           example: 123 Main St, Anytown, USA
 */

export const createRestaurantZSchema = z.object({
  restaurantName: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(200)
});

export interface IRestaurant {
  restaurantName: string;
  location: string;
}

const restaurantSchema = new Schema<IRestaurant>(
    {
        restaurantName: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    }
);

export const RestaurantModel = model<IRestaurant>('Restaurant', restaurantSchema);
