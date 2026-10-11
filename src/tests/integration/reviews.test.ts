import request from "supertest";
import { app } from "../../app";
import { ReviewModel } from "../../models/reviews";
import { Types } from "mongoose";
import { afterEach, describe, expect, it } from "vitest";
import { UserModel } from "../../models/users";
import { RestaurantModel } from "../../models/restaurants";

describe('GET /reviews', () => {
    it('returns all reviews', async () => {
        const response = await request(app)
            .get('/api/v1/reviews')
            .set('x-api-key', 'test-key');

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
        const userRecord = await UserModel.create({
            name: 'Integration Test User',
            email: `review-test-${new Types.ObjectId()}@example.com`
        });
        const updatedUserRecord = await UserModel.create({
            name: 'Updated Integration Test User',
            email: `review-test-${new Types.ObjectId()}@example.com`
        });
        const restaurantRecord = await RestaurantModel.create({
            restaurantName: `Review Test Restaurant ${new Types.ObjectId()}`,
            location: '123 Test Street'
        });

        const user = userRecord._id.toString();
        const updatedUser = updatedUserRecord._id.toString();
        const restaurant = restaurantRecord._id.toString();
        testUsers = [user, updatedUser];

        const created = await request(app)
            .post('/api/v1/reviews')
            .set('x-api-key', 'test-key')
            .send({ user, restaurant, reviewText: 'Integration Test Review', date: new Date() });

        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({
            user,
            restaurant,
            reviewText: 'Integration Test Review',
            date: expect.any(String),
        });
        expect(created.body._id).toEqual(expect.any(String));

        const id = created.body._id as string;
        const retrieved = await request(app)
            .get(`/api/v1/reviews/${id}`)
            .set('x-api-key', 'test-key');

        expect(retrieved.status).toBe(200);
        expect(retrieved.body._id).toBe(id);

        const updated = await request(app)
            .put(`/api/v1/reviews/${id}`)
            .set('x-api-key', 'test-key')
            .send({ user: updatedUser, restaurant, reviewText: 'Updated Test Review', date: new Date() });

        expect(updated.status).toBe(200);
        expect(updated.body).toMatchObject({
            user: updatedUser,
            restaurant,
            reviewText: 'Updated Test Review',
            date: expect.any(String),
        });

        const deleted = await request(app)
            .delete(`/api/v1/reviews/${id}`)
            .set('x-api-key', 'test-key');

        expect(deleted.status).toBe(200);
        expect(deleted.body).toEqual({ message: 'Review deleted successfully' });

        const afterDelete = await request(app)
            .get(`/api/v1/reviews/${id}`)
            .set('x-api-key', 'test-key');
        expect(afterDelete.status).toBe(404);
    });

    it('returns 400 for an invalid review when creating', async () => {
        const response = await request(app)
            .post('/api/v1/reviews')
            .set('x-api-key', 'test-key')
            .send({ user: 'Invalid Test User', reviewText: '', date: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
    });

    it('returns 400 for an invalid review when updating', async () => {
        const user = new Types.ObjectId().toString();
        const restaurant = new Types.ObjectId().toString();

        const response = await request(app)
            .put(`/api/v1/reviews/${user}`)
            .set('x-api-key', 'test-key')
            .send({ user: 'Invalid Test User', restaurant, reviewText: '', date: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
    });

    it('returns 404 when a review ID does not exist', async () => {
        const missingId = new Types.ObjectId().toString();

        const getResponse = await request(app)
            .get(`/api/v1/reviews/${missingId}`)
            .set('x-api-key', 'test-key');
        const updateResponse = await request(app)
            .put(`/api/v1/reviews/${missingId}`)
            .set('x-api-key', 'test-key')
            .send({
                user: new Types.ObjectId().toString(),
                restaurant: new Types.ObjectId().toString(),
                reviewText: 'Missing Review',
                date: new Date()
            });
        const deleteResponse = await request(app)
            .delete(`/api/v1/reviews/${missingId}`)
            .set('x-api-key', 'test-key');

        expect(getResponse.status).toBe(404);
        expect(updateResponse.status).toBe(404);
        expect(deleteResponse.status).toBe(404);
    });
});
