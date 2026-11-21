import { ReviewModel, IReview, IReviewDetails } from '../models/reviews'
import { HydratedDocument } from 'mongoose';
import { UserModel } from '../models/users';
import { RestaurantModel } from '../models/restaurants';

export class ReviewService {
  
 async getAllReviews(): Promise<IReview[]> {
    return await ReviewModel.find()
      .populate('user', 'name')
      .populate('restaurant', 'restaurantName')
      .lean(); 
 }

 async getReviewById(id: string): Promise<IReviewDetails | null> {
    const review = await ReviewModel.findById(id).lean();
    if (!review) return null;

    const [user, restaurant] = await Promise.all([
      UserModel.findById(review.user).select('name').lean(),
      RestaurantModel.findById(review.restaurant).select('restaurantName').lean()
    ]);

    return {
      ...review,
      user: user ? { _id: user._id, name: user.name } : null,
      restaurant: restaurant ? { _id: restaurant._id, restaurantName: restaurant.restaurantName } : null,
      userId: review.user?.toString() ?? null,
      restaurantId: review.restaurant?.toString() ?? null
    };
 }

 async createReview(reviewData: IReview): Promise<HydratedDocument<IReview>> {
    const [userExists, restaurantExists] = await Promise.all([
        UserModel.exists({ _id: reviewData.user }),
        RestaurantModel.exists({ _id: reviewData.restaurant })
    ]);
    
    if (!userExists || !restaurantExists) {
        throw new Error('User or restaurant does not exist');
    }

    const review = new ReviewModel(reviewData);
    return await review.save();
 }

 async updateReview(id: string, reviewData: Partial<IReview>): Promise<IReview | null> {
    return await ReviewModel.findByIdAndUpdate(id, reviewData, { returnDocument: 'after' }).lean();
 }

 async deleteReview(id: string): Promise<IReview | null> {
    return await ReviewModel.findByIdAndDelete(id).lean();
 }

}