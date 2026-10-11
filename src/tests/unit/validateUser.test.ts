import { createUserZSchema } from "../../models/users";
import { describe, expect, it } from "vitest";

const validUser = {
    name: "Jane Doe",
    email: "jane.doe@example.com"
};

describe('User validation', () => {
    it('accepts a user with a name and email', () => {
        const parsed = createUserZSchema.parse(validUser);
        expect(parsed).toEqual(validUser);
    });

    it('trims whitespace from the name and email', () => {
        const parsed = createUserZSchema.parse({
            name: '  Jane Doe  ',
            email: '  jane.doe@example.com  '
        });

        expect(parsed).toEqual(validUser);
    });

    it('rejects a missing name', () => {
        expect(() => createUserZSchema.parse({
            ...validUser,
            name: undefined
        })).toThrow();
    });

    it('rejects a missing email', () => {
        expect(() => createUserZSchema.parse({
            ...validUser,
            email: undefined
        })).toThrow();
    });

    it('rejects non-string name and email values', () => {
        expect(() => createUserZSchema.parse({
            name: 123,
            email: true
        })).toThrow();
    });
});
