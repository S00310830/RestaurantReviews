import { Schema, model } from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 */

export const createUserZSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim()
});

export interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    }
},
    { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);
