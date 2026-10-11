import { createRestaurantZSchema } from "../../models/restaurants";
import { describe, expect, it } from "vitest";

const validRestaurant = {
    restaurantName: "The Great Eatery",
    location: "123 Main St, Anytown, USA"
};

describe('Restaurant validation', () => {
    it('accepts a restaurant with a name and location', () => {
        const parsed = createRestaurantZSchema.parse(validRestaurant);
        expect(parsed).toEqual(validRestaurant);
    });

    it('trims whitespace from the name and location', () => {
        const parsed = createRestaurantZSchema.parse({
            restaurantName: '  The Great Eatery  ',
            location: '  123 Main St, Anytown, USA  '
        });

        expect(parsed).toEqual(validRestaurant);
    });

    it('rejects a missing restaurant name', () => {
        expect(() => createRestaurantZSchema.parse({
            ...validRestaurant,
            restaurantName: undefined
        })).toThrow();
    });

    it('rejects a missing location', () => {
        expect(() => createRestaurantZSchema.parse({
            ...validRestaurant,
            location: undefined
        })).toThrow();
    });

    it('rejects non-string name and location values', () => {
        expect(() => createRestaurantZSchema.parse({
            restaurantName: 123,
            location: true
        })).toThrow();
    });
});
