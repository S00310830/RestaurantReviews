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
 *         - reviewText
 *       properties:
 *         user:
 *           type: string
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         reviewText:
 *           type: string
 *           example: This restaurant is amazing! The food was delicious and the service was excellent.
 *         date:
 *           type: string
 *           format: date
 *           example: 2023-01-01
 *           example: 2010
 */



export const createReviewZSchema = z.object({
  user: z.string().uuid(),
  reviewText: z.string().max(200).optional(),
  date: z.date().optional()
});


export interface IReview {
  user : Schema.Types.ObjectId;
  reviewText?: string;
  date?: Date;
}

const reviewSchema = new Schema<IReview>(
 {
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
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