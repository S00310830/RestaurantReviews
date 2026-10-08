import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { validate } from '../../middleware/validate.middleware';
import { createReviewZSchema } from '../../models/reviews';

const app = express();
app.use(express.json());
app.post('/reviews', validate(createReviewZSchema), (_req, res) => {
    res.status(201).json({ message: 'Review accepted' });
});

describe('validate middleware', () => {
    it('passes valid review data to the route', async () => {
        const response = await request(app)
            .post('/reviews')
            .send({ user: '123456789012345678901234', reviewText: 'This is a great Restaurant!', date: new Date('2010-01-01') });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Review accepted' });
    });

    it('returns 400 with validation details for invalid review data', async () => {
        const response = await request(app)
            .post('/reviews')
            .send({ user: 'Renault', reviewText: '', date: '', year: 1949 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toEqual(expect.any(Array));
        expect(response.body.errors.length).toBeGreaterThan(0);
    });
});
