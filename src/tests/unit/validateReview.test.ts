import { createReviewZSchema } from "../../models/reviews";
import { describe, expect, it } from "vitest";

const validReview = {
    "user": "123456789012345678901234",
    "reviewText": "This is a great car!",
    "date": new Date()
}

describe('Test Car Validation', () => {
    it('should pass for the following valid data', () => {

        expect(() => createReviewZSchema.parse(
            validReview)).not.toThrow();
    });

  it('should pass for the following valid data - no date', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "date": undefined })).not.toThrow();
    });

        it('should fail for the too early year ', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "date": new Date('1949-01-01') })).toThrow();
    });

    it('should fail for the unparsaable year ', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "date": 'wrong date' })).toThrow();
    });

    it('should fail for the missing make ', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "user": undefined })).toThrow();
    });

    it('should fail for the missing model', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "reviewText": undefined })).toThrow();
    });

    it('should fail for the missing make ', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "user": '' })).toThrow();
    });

    it('should accept the earliest supported year', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "date": new Date('1950-01-01') })).not.toThrow();
    });

    it('should reject a year provided as a string', () => {

        expect(() => createReviewZSchema.parse(
            { ...validReview, "date": '1950-01-01' })).toThrow();
    });
});
