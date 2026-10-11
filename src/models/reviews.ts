import { Schema, model } from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateReviewInput:
 *       type: object
 *       required:
 *         - user
 *         - restaurant
 *         - reviewText
 *       properties:
 *         user:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         restaurant:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         reviewText:
 *           type: string
 *           example: This restaurant is amazing! The food was delicious and the service was excellent.
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00.000Z
 */



export const createReviewZSchema = z.object({
  user: z.string().regex(/^[a-fA-F0-9]{24}$/, 'User must be a valid MongoDB ObjectId'),
  restaurant: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Restaurant must be a valid MongoDB ObjectId'),
  reviewText: z.string().trim().min(1).max(200),
  date: z.coerce.date().optional()
});


export interface IReview {
  user : Schema.Types.ObjectId;
  restaurant: Schema.Types.ObjectId;
  reviewText: string;
  date?: Date;
}

const reviewSchema = new Schema<IReview>(
 {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    reviewText: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
 },
    { timestamps: true }
);



export const ReviewModel = model<IReview>('Review', reviewSchema);