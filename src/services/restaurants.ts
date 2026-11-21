import { RestaurantModel, IRestaurant } from '../models/restaurants';
import { HydratedDocument } from 'mongoose';
import { ReviewModel } from '../models/reviews';

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
 const deletedRestaurant = await RestaurantModel.findByIdAndDelete(id).lean();
 if(deletedRestaurant) {
    await ReviewModel.deleteMany({ restaurant: deletedRestaurant._id });
 }
 return deletedRestaurant;
 }

}