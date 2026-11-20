import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { UserModel } from '../../models/users';
import { RestaurantModel } from '../../models/restaurants';
import { ReviewModel } from '../../models/reviews';

describe('User routes', () => {
    const email = `integration-${new Types.ObjectId().toString()}@example.com`;

    afterEach(async () => {
        await UserModel.deleteOne({ email });
    });

    it('creates, retrieves, updates, and deletes a user', async () => {
        const created = await request(app)
            .post('/api/v1/users')
            .set('x-api-key', 'test-key')
            .send({ name: 'Integration Test User', email });

        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({
            name: 'Integration Test User',
            email,
        });
        expect(created.body._id).toEqual(expect.any(String));

        const id = created.body._id as string;
        const retrieved = await request(app)
            .get(`/api/v1/users/${id}`)
            .set('x-api-key', 'test-key');

        expect(retrieved.status).toBe(200);
        expect(retrieved.body._id).toBe(id);
        expect(retrieved.body).toMatchObject({
            name: 'Integration Test User',
            email,
        });

        const updated = await request(app)
            .put(`/api/v1/users/${id}`)
            .set('x-api-key', 'test-key')
            .send({ name: 'Updated Integration User', email });

        expect(updated.status).toBe(200);
        expect(updated.body).toMatchObject({
            name: 'Updated Integration User',
            email,
        });

        const deleted = await request(app)
            .delete(`/api/v1/users/${id}`)
            .set('x-api-key', 'test-key');

        expect(deleted.status).toBe(200);
        expect(deleted.body).toEqual({ message: 'User deleted successfully' });

        const afterDelete = await request(app)
            .get(`/api/v1/users/${id}`)
            .set('x-api-key', 'test-key');
        expect(afterDelete.status).toBe(404);
    });

    it('returns 404 for non-existent user', async () => {
        const nonExistentId = new Types.ObjectId().toString();
        const response = await request(app)
            .get(`/api/v1/users/${nonExistentId}`)
            .set('x-api-key', 'test-key');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    it('returns 400 for invalid user data', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .set('x-api-key', 'test-key')
            .send({ name: '', email: 'invalid-email' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Error creating user');
    });

    it('returns 400 for invalid user ID', async () => {
        const response = await request(app)
            .get('/api/v1/users/invalid-id')
            .set('x-api-key', 'test-key');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Error fetching user');
    });
    
    it('deletes all reviews when its user is deleted', async () => {

        const user = await UserModel.create({
            name: 'Cascade Delete Test User',
            email: `cascade-restaurant-${new Types.ObjectId()}@example.com`
        });

        const restaurant = await RestaurantModel.create({
            restaurantName: `Cascade Delete Restaurant ${new Types.ObjectId()}`,
            location: 'Cascade Test Location'
        });

        const review = await ReviewModel.create({
            user: user._id,
            restaurant: restaurant._id,
            reviewText: 'This review should be deleted with the restaurant'
        });

        const userId = user._id.toString();
        const deleted = await request(app)
            .delete(`/api/v1/users/${userId}`)
            .set('x-api-key', 'test-key');

        expect(deleted.status).toBe(200);
        expect(await ReviewModel.findById(review._id)).toBeNull();

        await UserModel.deleteOne({ _id: user._id });
    });
});
