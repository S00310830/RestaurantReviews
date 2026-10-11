import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { RestaurantModel } from '../../models/restaurants';

describe('Restaurant routes', () => {
	const restaurantName = `Integration Test Restaurant ${new Types.ObjectId().toString()}`;

	afterEach(async () => {
		await RestaurantModel.deleteOne({ restaurantName });
	});

	it('creates, retrieves, updates, lists, and deletes a restaurant', async () => {
		const created = await request(app)
			.post('/api/v1/restaurants')
			.send({ restaurantName, location: '123 Test Street' });

		expect(created.status).toBe(201);
		expect(created.body).toMatchObject({
			restaurantName,
			location: '123 Test Street'
		});
		expect(created.body._id).toEqual(expect.any(String));

		const id = created.body._id as string;

		const retrieved = await request(app).get(`/api/v1/restaurants/${id}`);
		expect(retrieved.status).toBe(200);
		expect(retrieved.body._id).toBe(id);

		const updated = await request(app)
			.put(`/api/v1/restaurants/${id}`)
			.send({ restaurantName, location: '456 Updated Street' });

		expect(updated.status).toBe(200);
		expect(updated.body).toMatchObject({
			restaurantName,
			location: '456 Updated Street'
		});

		const listed = await request(app).get('/api/v1/restaurants');
		expect(listed.status).toBe(200);
		expect(listed.body).toEqual(expect.arrayContaining([
			expect.objectContaining({ _id: id })
		]));

		const deleted = await request(app).delete(`/api/v1/restaurants/${id}`);
		expect(deleted.status).toBe(200);
		expect(deleted.body).toEqual({ message: 'Restaurant deleted successfully' });

		const afterDelete = await request(app).get(`/api/v1/restaurants/${id}`);
		expect(afterDelete.status).toBe(404);
	});

    it('returns 404 for non-existent restaurant', async () => {
        const nonExistentId = new Types.ObjectId().toString();
        const response = await request(app).get(`/api/v1/restaurants/${nonExistentId}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Restaurant not found' });
    });

    it('returns 400 for invalid restaurant ID', async () => {
        const response = await request(app).get('/api/v1/restaurants/invalid-id');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid restaurant ID');
    });

    it('returns 400 for invalid restaurant data when creating', async () => {
        const response = await request(app)
            .post('/api/v1/restaurants')
            .send({ restaurantName: '', location: '' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
    });
});
