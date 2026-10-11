import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { validate } from '../../middleware/validate.middleware';
import { createReviewZSchema } from '../../models/reviews';
import { createRestaurantZSchema } from '../../models/restaurants';
import {createUserZSchema} from '../../models/users';

const app = express();
app.use(express.json());
app.post('/reviews', validate(createReviewZSchema), (_req, res) => {
    res.status(201).json({ message: 'Review accepted' });
});
app.post('/restaurants', validate(createRestaurantZSchema), (_req, res) => {
    res.status(200).json({ message: 'Restaurant accepted' });
});
app.post('/users', validate(createUserZSchema), (_req, res) => {
    res.status(200).json({ message: 'User accepted' });
});

describe('validate middleware', () => {
    it('passes valid review data to the route', async () => {
        const response = await request(app)
            .post('/reviews')
            .send({
                user: '507f1f77bcf86cd799439011',
                restaurant: '507f1f77bcf86cd799439012',
                reviewText: 'This is a great restaurant!',
                date: '2023-01-01T12:00:00.000Z'
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Review accepted' });
    });

    it('passes valid restaurant data to the route', async () => {
        const response = await request(app)
            .post('/restaurants')
            .send({
                user: '507f1f77bcf86cd799439011',
                restaurantName: 'Test Restaurant',
                location: '123 Test Street'
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Restaurant accepted' });
    });

    it('passes valid user data to the route', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'testuser',
                email: 'testuser@example.com'
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User accepted' });
    });

    it('returns 400 with validation details for invalid review data', async () => {
        const response = await request(app)
            .post('/reviews')
            .send({ user: 'not-an-object-id', reviewText: '', date: 'not-a-date' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toEqual(expect.any(Array));
        expect(response.body.errors.length).toBeGreaterThan(0);
    });
    
});

