import request from "supertest";
import { app } from "../../app";
import { ReviewModel } from "../../models/reviews";
import { Types } from "mongoose";
import { afterEach, describe, expect, it } from "vitest";

describe('GET /reviews', () => {
    it('returns all reviews', async () => {
        const response = await request(app)
            .get('/api/v1/reviews');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    });
});

describe('Review routes', () => {
    let testUsers: string[] = [];

    afterEach(async () => {
        if (testUsers.length > 0) {
            const objectIds = testUsers.map((id) => new Types.ObjectId(id));
            await ReviewModel.deleteMany({ user: { $in: objectIds as any } } as any);
            testUsers = [];
        }
    });

    it('creates, retrieves, updates, and deletes a review', async () => {
        const user = new Types.ObjectId().toString();
        const updatedUser = new Types.ObjectId().toString();
        testUsers = [user, updatedUser];

        const created = await request(app)
            .post('/api/v1/reviews')
            .send({ user, reviewText: 'Integration Test Review', date: new Date() });

        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({
            user,
            reviewText: 'Integration Test Review',
            date: expect.any(String),
        });
        expect(created.body._id).toEqual(expect.any(String));

        const id = created.body._id as string;
        const retrieved = await request(app).get(`/api/v1/reviews/${id}`);

        expect(retrieved.status).toBe(200);
        expect(retrieved.body._id).toBe(id);

        const updated = await request(app)
            .put(`/api/v1/reviews/${id}`)
            .send({ user: updatedUser, reviewText: 'Updated Test Review', date: new Date() });

        expect(updated.status).toBe(200);
        expect(updated.body).toMatchObject({
            user: updatedUser,
            reviewText: 'Updated Test Review',
            date: expect.any(String),
        });

        const deleted = await request(app).delete(`/api/v1/reviews/${id}`);

        expect(deleted.status).toBe(200);
        expect(deleted.body).toEqual({ message: 'Review deleted successfully' });

        const afterDelete = await request(app).get(`/api/v1/reviews/${id}`);
        expect(afterDelete.status).toBe(404);
    });

    it('returns 400 for an invalid review when creating', async () => {
        const response = await request(app)
            .post('/api/v1/reviews')
            .send({ user: 'Invalid Test User', reviewText: '', date: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
    });

    it('returns 404 when a review ID does not exist', async () => {
        const missingId = new Types.ObjectId().toString();

        const getResponse = await request(app).get(`/api/v1/reviews/${missingId}`);
        const updateResponse = await request(app)
            .put(`/api/v1/reviews/${missingId}`)
            .send({ user: 'Missing User', reviewText: 'Missing Review', date: new Date() });
        const deleteResponse = await request(app).delete(`/api/v1/reviews/${missingId}`);

        expect(getResponse.status).toBe(404);
        expect(updateResponse.status).toBe(404);
        expect(deleteResponse.status).toBe(404);
    });
});
