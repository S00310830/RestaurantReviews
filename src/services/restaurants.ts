import { RestaurantModel, IRestaurant } from '../models/restaurants';
import { HydratedDocument } from 'mongoose';

export class RestaurantService {
  
 async getAllRestaurants(): Promise<IRestaurant[]> {
 return await RestaurantModel.find().lean(); 
 }

 async getRestaurantById(id: string): Promise<IRestaurant | null> {
 return await RestaurantModel.findById(id).lean();
 }

 async createRestaurant(restaurantData: IRestaurant): Promise<HydratedDocument<IRestaurant>> {
 const restaurant = new RestaurantModel(restaurantData);
 return await restaurant.save();
 }

 async updateRestaurant(id: string, restaurantData: Partial<IRestaurant>): Promise<IRestaurant | null> {
 return await RestaurantModel.findByIdAndUpdate(id, restaurantData, { returnDocument: 'after' }).lean();
 }

 async deleteRestaurant(id: string): Promise<IRestaurant | null> {
 return await RestaurantModel.findByIdAndDelete(id).lean();
 }

}