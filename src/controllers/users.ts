import { Request, Response } from 'express';
import { UserModel } from '../models/users';

export class UsersController {
/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       400:
 *         description: Error fetching users
 */
    getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching users', error });
    }
    };

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       400:
 *         description: Error fetching user
 */
    getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching user', error });
    }
    };

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: Successfully created user
 *       400:
 *         description: Invalid user data or error creating user
 */
    createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
    };

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid user data or error updating user
 */
    updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
    };

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Error deleting user
 */
    deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting user', error });
    }
    };
}