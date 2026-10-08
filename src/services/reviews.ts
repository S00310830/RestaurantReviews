import { ReviewModel, IReview } from '../models/reviews'
import { HydratedDocument } from 'mongoose';

export class ReviewService {
  
 async getAllReviews(): Promise<IReview[]> {
 return await ReviewModel.find().lean(); 
 }

 async getReviewById(id: string): Promise<IReview | null> {
 return await ReviewModel.findById(id).lean();
 }

 async createReview(reviewData: IReview): Promise<HydratedDocument<IReview>> {
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