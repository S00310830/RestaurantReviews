import { createReviewZSchema } from "../../models/reviews";
import { describe, expect, it } from "vitest";

const validReview = {
    user: "507f1f77bcf86cd799439011",
    restaurant: "507f1f77bcf86cd799439012",
    reviewText: "This is a great restaurant!",
    date: "2023-01-01T12:00:00.000Z"
}

describe('Review validation', () => {
    it('accepts a MongoDB ObjectId and an ISO date string', () => {
    const parsed = createReviewZSchema.parse(validReview);
    expect(parsed.user).toBe(validReview.user);
    expect(parsed.date).toEqual(new Date(validReview.date));
    });

    it('accepts a review without an optional date', () => {
    expect(() => createReviewZSchema.parse({ ...validReview, date: undefined })).not.toThrow();
    });

    it('rejects a UUID because the user field must be a MongoDB ObjectId', () => {
    expect(() => createReviewZSchema.parse({
        ...validReview,
        user: '123e4567-e89b-12d3-a456-426614174000'
    })).toThrow();
    });

    it('rejects an invalid date string', () => {
    expect(() => createReviewZSchema.parse({ ...validReview, date: 'not-a-date' })).toThrow();
    });

    it('rejects missing review text', () => {
    expect(() => createReviewZSchema.parse({ ...validReview, reviewText: undefined })).toThrow();
    });

    it('rejects empty review text', () => {
    expect(() => createReviewZSchema.parse({ ...validReview, reviewText: '  ' })).toThrow();
    });

    it('rejects review text longer than 200 characters', () => {
    expect(() => createReviewZSchema.parse({ ...validReview, reviewText: 'x'.repeat(201) })).toThrow();
    });
});
